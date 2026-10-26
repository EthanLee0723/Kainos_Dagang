/*
 * Fill an empty database with the catalogue and site details that used to be
 * hard-coded (scripts/seed/catalogue/). Run once per new database:
 *
 *   npm run db:seed            refuses if the database already has products
 *   npm run db:seed -- --force wipes every table first (the client's edits too!)
 *
 * Photos stay where they are in public/products; the seed only records their paths.
 */
import { loadEnvConfig } from "@next/env";
import { count, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "../lib/db/schema";
import { footwear } from "./seed/catalogue/footwear";
import { gear } from "./seed/catalogue/gear";
import {
  brands as legacyBrands,
  branches as legacyBranches,
  categories as legacyCategories,
  company,
  uses,
} from "./seed/catalogue/legacy";
import photos from "./seed/catalogue/photos.json";
import { colour } from "./seed/catalogue/vocab";

/** Look a name up in a map built from inserted rows, failing loudly on a typo. */
function lookup<K, V>(map: Map<K, V>, key: K, what: string): V {
  const value = map.get(key);
  if (value === undefined) throw new Error(`Unknown ${what}: ${String(key)}`);
  return value;
}

async function main() {
  loadEnvConfig(process.cwd());
  if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL is not set");

  const client = postgres(process.env.DATABASE_URL, { prepare: false, max: 1 });
  const db = drizzle({ client, schema, casing: "snake_case" });

  const photoIndex = photos as Record<string, { count: number; fit: "contain" | "cover" }>;
  const force = process.argv.includes("--force");

  const [{ n }] = await db.select({ n: count() }).from(schema.products);
  if (n > 0 && !force) {
    console.error(`The database already has ${n} products. Re-run with --force to wipe it and seed again.`);
    await client.end();
    process.exit(1);
  }

  const catalogue = [...footwear(), ...gear];

  await db.transaction(async (tx) => {
    await tx.execute(sql`truncate
      settings, branches, categories, brands, colours, size_charts, suitable_for, tags, products,
      product_features, product_photos, product_colours, product_suitable_for, product_tags
      restart identity cascade`);

    await tx.insert(schema.settings).values({
      id: 1,
      legalName: company.legalName,
      registration: company.registration,
      email: company.email,
      phone: company.phoneDisplay,
      sameAs: company.sameAs,
    });

    await tx.insert(schema.branches).values(
      legacyBranches.map((b, i) => ({
        slug: b.id,
        name: b.name,
        area: b.area,
        phone: b.phoneDisplay,
        addressLines: b.addressLines,
        street: b.postal.street,
        locality: b.postal.locality,
        postalCode: b.postal.postalCode,
        mapsUrl: b.mapsUrl ?? null,
        hours: b.hours,
        position: i,
      })),
    );

    await tx.insert(schema.categories).values(
      legacyCategories.map((c, i) => ({ id: c.id, name: c.name, blurb: c.blurb, pictogram: c.pictogram, position: i })),
    );

    const brandIds = new Map(
      (
        await tx
          .insert(schema.brands)
          .values(legacyBrands.map((b, i) => ({ name: b.name, note: b.note, comingSoon: !!b.comingSoon, position: i })))
          .returning()
      ).map((row) => [row.name, row.id]),
    );

    const colourIds = new Map(
      (
        await tx
          .insert(schema.colours)
          .values(Object.values(colour).map((name, i) => ({ name, position: i })))
          .returning()
      ).map((row) => [row.name.en, row.id]),
    );

    // One chart per size system in use (UK, EU), covering every size any product comes in.
    const charts = new Map<string, { label: (typeof catalogue)[number]["name"]; values: Set<string> }>();
    for (const p of catalogue) {
      if (!p.sizes) continue;
      const chart = charts.get(p.sizes.label.en) ?? { label: p.sizes.label, values: new Set<string>() };
      p.sizes.values.forEach((v) => chart.values.add(v));
      charts.set(p.sizes.label.en, chart);
    }
    const chartIds = new Map(
      (
        await tx
          .insert(schema.sizeCharts)
          .values(
            [...charts.values()].map((c, i) => ({
              label: c.label,
              values: [...c.values].sort((a, b) => Number(a) - Number(b)),
              position: i,
            })),
          )
          .returning()
      ).map((row) => [row.label.en, row.id]),
    );

    const useKeyByName = new Map(Object.entries(uses).map(([key, name]) => [name.en, key]));
    const useIds = new Map(
      (
        await tx
          .insert(schema.suitableFor)
          .values(Object.values(uses).map((name, i) => ({ name, position: i })))
          .returning()
      ).map((row) => [lookup(useKeyByName, row.name.en, "suitable-for chip"), row.id]),
    );

    for (const [i, p] of catalogue.entries()) {
      const photo = photoIndex[p.slug];
      const [row] = await tx
        .insert(schema.products)
        .values({
          slug: p.slug,
          code: p.code,
          brandId: p.brand ? lookup(brandIds, p.brand, "brand") : null,
          categoryId: p.category,
          name: p.name,
          summary: p.summary,
          description: p.description,
          pack: p.pack ?? null,
          pictogram: p.pictogram,
          sizeChartId: p.sizes ? lookup(chartIds, p.sizes.label.en, "size chart") : null,
          sizes: p.sizes?.values ?? [],
          featured: !!p.featured,
          imageFit: photo?.fit ?? "contain",
          position: i,
        })
        .returning({ id: schema.products.id });

      if (p.features.length) {
        await tx
          .insert(schema.productFeatures)
          .values(p.features.map((text, position) => ({ productId: row.id, text, position })));
      }
      if (photo) {
        await tx.insert(schema.productPhotos).values(
          Array.from({ length: photo.count }, (_, k) => ({
            productId: row.id,
            url: `/products/${p.slug}${k ? `-${k + 1}` : ""}.webp`,
            position: k,
          })),
        );
      }
      if (p.colours?.length) {
        await tx.insert(schema.productColours).values(
          p.colours.map((c, position) => ({ productId: row.id, colourId: lookup(colourIds, c.en, "colour"), position })),
        );
      }
      if (p.uses.length) {
        await tx.insert(schema.productSuitableFor).values(
          p.uses.map((use, position) => ({
            productId: row.id,
            suitableForId: lookup(useIds, use, "suitable-for chip"),
            position,
          })),
        );
      }
    }
  });

  const totals = await Promise.all(
    (["branches", "categories", "brands", "colours", "sizeCharts", "suitableFor", "products", "productPhotos"] as const).map(
      async (table) => `${table} ${(await db.select({ n: count() }).from(schema[table]))[0].n}`,
    ),
  );
  console.log(`Seeded: ${totals.join(", ")}`);
  await client.end();
}

main();
