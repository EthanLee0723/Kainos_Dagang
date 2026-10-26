"use server";

import { eq, inArray, max } from "drizzle-orm";
import { z } from "zod";
import { db, schema } from "@/lib/db";
import { pictograms } from "@/lib/products";
import type { ActionResult } from "../format";
import { revalidateSite } from "../revalidate";
import { requireAdmin } from "../session";
import { slugify, uniqueSlug } from "../slug";
import { removePhoto } from "../storage";
import { fieldErrors, key, localized, optionalLocalized, required, text, uuid } from "../validation";

const s = schema;

/** Photos either ship with the site (/products/…), were uploaded here (/media/…) or live in Blob storage. */
const photoUrl = z
  .string()
  .refine((u) => /^\/(products|media)\/[\w.-]+$/.test(u) || /^https:\/\/[^/]+\.blob\.vercel-storage\.com\//.test(u), "common.error");

/** A feature line: all three languages, or none (an empty row is dropped). */
const featureLine = z
  .object({ en: text, ms: text, zh: text })
  .refine((f) => [f.en, f.ms, f.zh].every(Boolean) || ![f.en, f.ms, f.zh].some(Boolean), "common.required");

const productSchema = z.object({
  id: uuid.optional(),
  slug: z.union([z.literal(""), key]).optional(),
  code: required,
  brandId: uuid.nullable(),
  categoryId: required,
  pictogram: z.enum(pictograms),
  name: localized,
  summary: localized,
  description: localized,
  pack: optionalLocalized,
  sizeChartId: uuid.nullable(),
  sizes: z.array(text),
  colourIds: z.array(uuid),
  suitableForIds: z.array(uuid),
  tagIds: z.array(uuid),
  features: z.array(featureLine),
  photos: z.array(photoUrl),
  imageFit: z.enum(["contain", "cover"]),
  featured: z.boolean(),
  visible: z.boolean(),
});

export type ProductInput = z.input<typeof productSchema>;

const isUploaded = (url: string) => !url.startsWith("/products/");

export async function saveProduct(input: ProductInput): Promise<ActionResult<{ id: string; slug: string }>> {
  await requireAdmin();
  const parsed = productSchema.safeParse(input);
  if (!parsed.success) return { ok: false, errors: fieldErrors(parsed.error) };
  const p = parsed.data;

  // References must still exist (another tab may have deleted them).
  const [category] = await db.select({ id: s.categories.id }).from(s.categories).where(eq(s.categories.id, p.categoryId));
  if (!category) return { ok: false, errors: { categoryId: { key: "common.required" } } };
  if (p.brandId) {
    const [brand] = await db.select({ id: s.brands.id }).from(s.brands).where(eq(s.brands.id, p.brandId));
    if (!brand) return { ok: false, errors: { brandId: { key: "common.required" } } };
  }
  const chart = p.sizeChartId
    ? (await db.select().from(s.sizeCharts).where(eq(s.sizeCharts.id, p.sizeChartId)))[0]
    : undefined;
  const sizes = chart ? chart.values.filter((v) => p.sizes.includes(v)) : [];

  const existing = p.id ? (await db.select().from(s.products).where(eq(s.products.id, p.id)))[0] : undefined;
  if (p.id && !existing) return { ok: false, message: { key: "common.error" } };

  // The page address is set once, from the code unless typed in.
  let slug = existing?.slug ?? (p.slug || slugify(p.code) || "product");
  if (!existing) {
    const taken = new Set((await db.select({ slug: s.products.slug }).from(s.products)).map((r) => r.slug));
    if (taken.has(slug)) {
      if (p.slug) return { ok: false, errors: { slug: { key: "products.slugTaken" } } };
      slug = uniqueSlug(slug, taken);
    }
  }

  const photos = [...new Set(p.photos)];
  const features = p.features.filter((f) => f.en);
  const values = {
    code: p.code,
    brandId: p.brandId,
    categoryId: p.categoryId,
    pictogram: p.pictogram,
    name: p.name,
    summary: p.summary,
    description: p.description,
    pack: p.pack,
    sizeChartId: chart ? chart.id : null,
    sizes,
    featured: p.featured,
    visible: p.visible,
    imageFit: p.imageFit,
    updatedAt: new Date(),
  };

  let removed: string[] = [];
  const id = await db.transaction(async (tx) => {
    let productId: string;
    if (existing) {
      productId = existing.id;
      await tx.update(s.products).set(values).where(eq(s.products.id, productId));
      const before = await tx.select({ url: s.productPhotos.url }).from(s.productPhotos).where(eq(s.productPhotos.productId, productId));
      removed = before.map((r) => r.url).filter((u) => !photos.includes(u));
      await Promise.all([
        tx.delete(s.productFeatures).where(eq(s.productFeatures.productId, productId)),
        tx.delete(s.productPhotos).where(eq(s.productPhotos.productId, productId)),
        tx.delete(s.productColours).where(eq(s.productColours.productId, productId)),
        tx.delete(s.productSuitableFor).where(eq(s.productSuitableFor.productId, productId)),
        tx.delete(s.productTags).where(eq(s.productTags.productId, productId)),
      ]);
    } else {
      const [{ last }] = await tx.select({ last: max(s.products.position) }).from(s.products);
      const [row] = await tx
        .insert(s.products)
        .values({ ...values, slug, position: (last ?? -1) + 1 })
        .returning({ id: s.products.id });
      productId = row.id;
    }

    if (features.length) await tx.insert(s.productFeatures).values(features.map((text, position) => ({ productId, text, position })));
    if (photos.length) await tx.insert(s.productPhotos).values(photos.map((url, position) => ({ productId, url, position })));
    if (p.colourIds.length)
      await tx.insert(s.productColours).values(p.colourIds.map((colourId, position) => ({ productId, colourId, position })));
    if (p.suitableForIds.length)
      await tx
        .insert(s.productSuitableFor)
        .values(p.suitableForIds.map((suitableForId, position) => ({ productId, suitableForId, position })));
    if (p.tagIds.length) await tx.insert(s.productTags).values(p.tagIds.map((tagId, position) => ({ productId, tagId, position })));
    return productId;
  });

  // Files this product no longer shows (uploaded ones only; /products/ ships with the site).
  await Promise.all(removed.filter(isUploaded).map(removePhoto));
  revalidateSite();
  return { ok: true, data: { id, slug } };
}

export async function deleteProduct(id: string): Promise<ActionResult> {
  await requireAdmin();
  const productId = uuid.parse(id);
  const photos = await db.select({ url: s.productPhotos.url }).from(s.productPhotos).where(eq(s.productPhotos.productId, productId));
  await db.delete(s.products).where(eq(s.products.id, productId));
  await Promise.all(photos.map((p) => p.url).filter(isUploaded).map(removePhoto));
  revalidateSite();
  return { ok: true };
}

/** Uploads removed from the form before the product was saved: delete them unless a product uses them. */
export async function discardPhotos(urls: string[]): Promise<ActionResult> {
  await requireAdmin();
  const list = z.array(photoUrl).parse(urls).filter(isUploaded);
  if (!list.length) return { ok: true };
  const used = new Set(
    (await db.select({ url: s.productPhotos.url }).from(s.productPhotos).where(inArray(s.productPhotos.url, list))).map((r) => r.url),
  );
  await Promise.all(list.filter((u) => !used.has(u)).map(removePhoto));
  return { ok: true };
}
