import { asc } from "drizzle-orm";
import { Plus } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/admin/page-header";
import { ProductTable } from "@/components/admin/product-table";
import { adminButton } from "@/components/admin/ui";
import { getAdminDict } from "@/lib/admin/i18n";
import { db, schema } from "@/lib/db";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getAdminDict();
  return { title: t.products.title };
}

export default async function ProductsAdminPage() {
  const { lang, t } = await getAdminDict();
  const s = schema;
  const [products, categories, brands, photos] = await Promise.all([
    db.select().from(s.products).orderBy(asc(s.products.position)),
    db.select().from(s.categories).orderBy(asc(s.categories.position)),
    db.select().from(s.brands).orderBy(asc(s.brands.position)),
    db.select({ productId: s.productPhotos.productId, url: s.productPhotos.url, position: s.productPhotos.position }).from(s.productPhotos),
  ]);
  const ui = (v: { en: string; zh: string }) => (lang === "zh" ? v.zh : v.en);
  const brandName = new Map(brands.map((b) => [b.id, b.name]));
  const categoryName = new Map(categories.map((c) => [c.id, ui(c.name)]));
  const mainPhoto = new Map<string, { url: string; position: number }>();
  for (const photo of photos) {
    const current = mainPhoto.get(photo.productId);
    if (!current || photo.position < current.position) mainPhoto.set(photo.productId, photo);
  }

  return (
    <>
      <PageHeader
        title={t.products.title}
        intro={t.products.intro}
        actions={
          <Link href="/admin/products/new" className={adminButton.primary}>
            <Plus className="size-4" aria-hidden />
            {t.products.add}
          </Link>
        }
      />
      <ProductTable
        t={t}
        categories={categories.map((c) => ({ id: c.id, name: ui(c.name) }))}
        brands={brands.map((b) => b.name)}
        rows={products.map((p) => ({
          id: p.id,
          code: p.code,
          name: ui(p.name),
          haystack: [p.name.en, p.name.ms, p.name.zh, p.code, p.code.replace(/[^a-z0-9]/gi, "")].join(" ").toLowerCase(),
          brand: p.brandId ? brandName.get(p.brandId) ?? null : null,
          categoryId: p.categoryId,
          category: categoryName.get(p.categoryId) ?? p.categoryId,
          photo: mainPhoto.get(p.id)?.url ?? null,
          pictogram: p.pictogram,
          featured: p.featured,
          visible: p.visible,
        }))}
      />
    </>
  );
}
