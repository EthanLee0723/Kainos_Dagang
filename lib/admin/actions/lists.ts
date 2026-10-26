"use server";

import { count, eq } from "drizzle-orm";
import { z } from "zod";
import { db, schema } from "@/lib/db";
import { pictograms } from "@/lib/products";
import type { ActionResult } from "../format";
import { type ListKind, listKinds } from "../lists";
import { revalidateSite } from "../revalidate";
import { requireAdmin } from "../session";
import { slugify, uniqueSlug } from "../slug";
import { fieldErrors, key, localized, required, uuid } from "../validation";

/*
 * The simple catalogue lists: categories, brands, colours, size systems,
 * "Suitable for" chips and badge tags. One set of actions, one rule per list.
 */

const sizeValues = z
  .string()
  .transform((v) => [...new Set(v.split(",").map((s) => s.trim()).filter(Boolean))])
  .pipe(z.array(z.string()).min(1, "lists.sizes.valuesRequired"));

const rules = {
  categories: z.object({
    id: z.union([z.literal(""), key]).optional(),
    name: localized,
    blurb: localized,
    pictogram: z.enum(pictograms),
  }),
  brands: z.object({ name: required, note: localized, comingSoon: z.boolean() }),
  colours: z.object({ name: localized }),
  sizes: z.object({ label: localized, values: sizeValues }),
  "suitable-for": z.object({ name: localized }),
  tags: z.object({ name: localized }),
} satisfies Record<ListKind, z.ZodType>;

const listKind = z.enum(listKinds);

const tables = {
  categories: schema.categories,
  brands: schema.brands,
  colours: schema.colours,
  sizes: schema.sizeCharts,
  "suitable-for": schema.suitableFor,
  tags: schema.tags,
};

async function nextPosition(kind: ListKind) {
  const [{ n }] = await db.select({ n: count() }).from(tables[kind]);
  return n;
}

/** Create (no `existingId`) or update one item. */
export async function saveListItem(
  kind: ListKind,
  existingId: string | null,
  input: Record<string, unknown>,
): Promise<ActionResult> {
  await requireAdmin();
  listKind.parse(kind);
  const parsed = rules[kind].safeParse(input);
  if (!parsed.success) return { ok: false, errors: fieldErrors(parsed.error) };
  const data = parsed.data;

  switch (kind) {
    case "categories": {
      const { id, ...fields } = data as z.infer<(typeof rules)["categories"]>;
      if (existingId) {
        await db.update(schema.categories).set(fields).where(eq(schema.categories.id, existingId));
      } else {
        const taken = new Set((await db.select({ id: schema.categories.id }).from(schema.categories)).map((c) => c.id));
        if (id && taken.has(id)) return { ok: false, errors: { id: { key: "lists.categories.idTaken" } } };
        const newId = id || uniqueSlug(slugify(fields.name.en), taken);
        await db.insert(schema.categories).values({ ...fields, id: newId, position: await nextPosition(kind) });
      }
      break;
    }
    case "brands": {
      const fields = data as z.infer<(typeof rules)["brands"]>;
      const [clash] = await db.select({ id: schema.brands.id }).from(schema.brands).where(eq(schema.brands.name, fields.name));
      if (clash && clash.id !== existingId) return { ok: false, errors: { name: { key: "lists.brands.nameTaken" } } };
      if (existingId) await db.update(schema.brands).set(fields).where(eq(schema.brands.id, uuid.parse(existingId)));
      else await db.insert(schema.brands).values({ ...fields, position: await nextPosition(kind) });
      break;
    }
    case "sizes": {
      const fields = data as z.infer<(typeof rules)["sizes"]>;
      if (existingId) await db.update(schema.sizeCharts).set(fields).where(eq(schema.sizeCharts.id, uuid.parse(existingId)));
      else await db.insert(schema.sizeCharts).values({ ...fields, position: await nextPosition(kind) });
      break;
    }
    case "colours":
    case "suitable-for":
    case "tags": {
      const fields = data as { name: z.infer<typeof localized> };
      const table = tables[kind] as typeof schema.colours;
      if (existingId) await db.update(table).set(fields).where(eq(table.id, uuid.parse(existingId)));
      else await db.insert(table).values({ ...fields, position: await nextPosition(kind) });
      break;
    }
  }
  revalidateSite();
  return { ok: true };
}

/** Delete one item. Categories and brands still holding products are refused. */
export async function deleteListItem(kind: ListKind, id: string): Promise<ActionResult> {
  await requireAdmin();
  listKind.parse(kind);
  switch (kind) {
    case "categories": {
      const [{ n }] = await db.select({ n: count() }).from(schema.products).where(eq(schema.products.categoryId, id));
      if (n > 0) return { ok: false, message: { key: "lists.categories.inUse", params: { count: n } } };
      await db.delete(schema.categories).where(eq(schema.categories.id, id));
      break;
    }
    case "brands": {
      const brandId = uuid.parse(id);
      const [{ n }] = await db.select({ n: count() }).from(schema.products).where(eq(schema.products.brandId, brandId));
      if (n > 0) return { ok: false, message: { key: "lists.brands.inUse", params: { count: n } } };
      await db.delete(schema.brands).where(eq(schema.brands.id, brandId));
      break;
    }
    case "sizes": {
      const chartId = uuid.parse(id);
      await db.transaction(async (tx) => {
        // Products on this system lose their sizes along with it.
        await tx.update(schema.products).set({ sizeChartId: null, sizes: [] }).where(eq(schema.products.sizeChartId, chartId));
        await tx.delete(schema.sizeCharts).where(eq(schema.sizeCharts.id, chartId));
      });
      break;
    }
    case "colours":
    case "suitable-for":
    case "tags": {
      // Links to products go with it (on delete cascade).
      const table = tables[kind] as typeof schema.colours;
      await db.delete(table).where(eq(table.id, uuid.parse(id)));
      break;
    }
  }
  revalidateSite();
  return { ok: true };
}

export async function reorderList(kind: ListKind, ids: string[]): Promise<ActionResult> {
  await requireAdmin();
  listKind.parse(kind);
  const order = z.array(z.string().min(1)).parse(ids);
  const table = tables[kind] as typeof schema.colours;
  await db.transaction(async (tx) => {
    for (const [position, id] of order.entries()) {
      await tx.update(table).set({ position }).where(eq(table.id, id));
    }
  });
  revalidateSite();
  return { ok: true };
}
