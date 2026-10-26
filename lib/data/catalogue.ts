import "server-only";
import { asc, eq } from "drizzle-orm";
import { cache } from "react";
import { db, schema } from "@/lib/db";
import type { Catalogue, Label, Product } from "@/lib/products";
import type { Localized } from "@/lib/site";

/** Group link rows by product, keeping their position order. */
function byProduct<T extends { productId: string; position: number }>(rows: T[]) {
  const map = new Map<string, T[]>();
  for (const row of [...rows].sort((a, b) => a.position - b.position)) {
    map.set(row.productId, [...(map.get(row.productId) ?? []), row]);
  }
  return map;
}

/**
 * Everything the public site shows, loaded once per render (React cache).
 * Pages are statically rendered from it and regenerated after an admin save.
 */
export const getCatalogue = cache(async (): Promise<Catalogue> => {
  const s = schema;
  const [
    categoryRows,
    brandRows,
    colourRows,
    chartRows,
    suitableRows,
    tagRows,
    productRows,
    featureRows,
    photoRows,
    colourLinks,
    suitableLinks,
    tagLinks,
  ] = await Promise.all([
    db.select().from(s.categories).orderBy(asc(s.categories.position)),
    db.select().from(s.brands).orderBy(asc(s.brands.position)),
    db.select().from(s.colours),
    db.select().from(s.sizeCharts),
    db.select().from(s.suitableFor),
    db.select().from(s.tags).orderBy(asc(s.tags.position)),
    db.select().from(s.products).where(eq(s.products.visible, true)).orderBy(asc(s.products.position)),
    db.select().from(s.productFeatures),
    db.select().from(s.productPhotos),
    db.select().from(s.productColours),
    db.select().from(s.productSuitableFor),
    db.select().from(s.productTags),
  ]);

  const brandName = new Map(brandRows.map((b) => [b.id, b.name]));
  const colourName = new Map(colourRows.map((c) => [c.id, c.name]));
  const charts = new Map(chartRows.map((c) => [c.id, c]));
  const suitable = new Map<string, Label>(suitableRows.map((r) => [r.id, { id: r.id, name: r.name }]));
  const tagById = new Map<string, Label>(tagRows.map((r) => [r.id, { id: r.id, name: r.name }]));
  const features = byProduct(featureRows);
  const photos = byProduct(photoRows);
  const colourOf = byProduct(colourLinks);
  const suitableOf = byProduct(suitableLinks);
  const tagsOf = byProduct(tagLinks);

  const products = productRows.map((row): Product => {
    const urls = (photos.get(row.id) ?? []).map((p) => p.url);
    const chart = row.sizeChartId ? charts.get(row.sizeChartId) : undefined;
    // Keep the chart's own order, whatever order the sizes were ticked in.
    const sizes = chart?.values.filter((v) => row.sizes.includes(v)) ?? [];
    const colours = (colourOf.get(row.id) ?? [])
      .map((link) => colourName.get(link.colourId))
      .filter((name): name is Localized => !!name);
    return {
      slug: row.slug,
      code: row.code,
      brand: row.brandId ? brandName.get(row.brandId) : undefined,
      category: row.categoryId,
      pictogram: row.pictogram,
      image: urls[0],
      gallery: urls.slice(1),
      imageFit: row.imageFit,
      name: row.name,
      summary: row.summary,
      description: row.description,
      features: (features.get(row.id) ?? []).map((f) => f.text),
      sizes: chart && sizes.length ? { label: chart.label, values: sizes } : undefined,
      colours: colours.length ? colours : undefined,
      pack: row.pack ?? undefined,
      suitableFor: (suitableOf.get(row.id) ?? []).flatMap((link) => suitable.get(link.suitableForId) ?? []),
      tags: (tagsOf.get(row.id) ?? []).flatMap((link) => tagById.get(link.tagId) ?? []),
      featured: row.featured,
    };
  });

  return {
    products,
    categories: categoryRows.map(({ id, name, blurb, pictogram }) => ({ id, name, blurb, pictogram })),
    brands: brandRows.map(({ name, note, comingSoon }) => ({ name, note, comingSoon })),
    tags: tagRows.map(({ id, name }) => ({ id, name })),
  };
});
