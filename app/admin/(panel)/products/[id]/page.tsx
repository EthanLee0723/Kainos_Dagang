import { asc, eq } from "drizzle-orm";
import { ChevronLeft } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/admin/page-header";
import { ProductForm, type ProductFormValues, type ProductOptions } from "@/components/admin/product-form";
import { getAdminDict } from "@/lib/admin/i18n";
import { uuid } from "@/lib/admin/validation";
import { db, schema } from "@/lib/db";
import type { Localized } from "@/lib/site";

type Props = { params: Promise<{ id: string }>; searchParams: Promise<{ saved?: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { t } = await getAdminDict();
  return { title: (await params).id === "new" ? t.products.newTitle : t.products.editTitle };
}

const empty = (): Localized => ({ en: "", ms: "", zh: "" });

export default async function ProductEditPage({ params, searchParams }: Props) {
  const [{ id }, { saved }] = await Promise.all([params, searchParams]);
  if (id !== "new" && !uuid.safeParse(id).success) notFound();
  const { lang, t } = await getAdminDict();
  const s = schema;
  const ui = (v: Localized) => (lang === "zh" ? v.zh : v.en);

  const [categories, brands, charts, colours, suitable, tags, features] = await Promise.all([
    db.select().from(s.categories).orderBy(asc(s.categories.position)),
    db.select().from(s.brands).orderBy(asc(s.brands.position)),
    db.select().from(s.sizeCharts).orderBy(asc(s.sizeCharts.position)),
    db.select().from(s.colours).orderBy(asc(s.colours.position)),
    db.select().from(s.suitableFor).orderBy(asc(s.suitableFor.position)),
    db.select().from(s.tags).orderBy(asc(s.tags.position)),
    db.select({ text: s.productFeatures.text }).from(s.productFeatures),
  ]);

  const featureSuggestions = [...new Map(features.map((f) => [f.text.en, f.text])).values()].sort((a, b) => a.en.localeCompare(b.en));
  const options: ProductOptions = {
    categories: categories.map((c) => ({ id: c.id, name: ui(c.name), pictogram: c.pictogram })),
    brands: brands.map((b) => ({ id: b.id, name: b.name })),
    sizeCharts: charts.map((c) => ({ id: c.id, name: `${ui(c.label)} (${c.values[0]}–${c.values[c.values.length - 1]})`, values: c.values })),
    colours: colours.map((c) => ({ id: c.id, label: ui(c.name) })),
    suitableFor: suitable.map((c) => ({ id: c.id, label: ui(c.name) })),
    tags: tags.map((c) => ({ id: c.id, label: ui(c.name) })),
    featureSuggestions,
  };

  let initial: ProductFormValues = {
    slug: "",
    code: "",
    brandId: "",
    categoryId: categories[0]?.id ?? "",
    pictogram: categories[0]?.pictogram ?? "shoe",
    name: empty(),
    summary: empty(),
    description: empty(),
    pack: empty(),
    sizeChartId: "",
    sizes: [],
    colourIds: [],
    suitableForIds: [],
    tagIds: [],
    features: [],
    photos: [],
    imageFit: "contain",
    featured: false,
    visible: true,
  };

  if (id !== "new") {
    const [product] = await db.select().from(s.products).where(eq(s.products.id, id));
    if (!product) notFound();
    const byPosition = <T extends { position: number }>(rows: T[]) => rows.sort((a, b) => a.position - b.position);
    const [productFeatures, photos, colourLinks, suitableLinks, tagLinks] = await Promise.all([
      db.select().from(s.productFeatures).where(eq(s.productFeatures.productId, id)).then(byPosition),
      db.select().from(s.productPhotos).where(eq(s.productPhotos.productId, id)).then(byPosition),
      db.select().from(s.productColours).where(eq(s.productColours.productId, id)).then(byPosition),
      db.select().from(s.productSuitableFor).where(eq(s.productSuitableFor.productId, id)).then(byPosition),
      db.select().from(s.productTags).where(eq(s.productTags.productId, id)).then(byPosition),
    ]);
    initial = {
      id: product.id,
      slug: product.slug,
      code: product.code,
      brandId: product.brandId ?? "",
      categoryId: product.categoryId,
      pictogram: product.pictogram,
      name: product.name,
      summary: product.summary,
      description: product.description,
      pack: product.pack ?? empty(),
      sizeChartId: product.sizeChartId ?? "",
      sizes: product.sizes,
      colourIds: colourLinks.map((l) => l.colourId),
      suitableForIds: suitableLinks.map((l) => l.suitableForId),
      tagIds: tagLinks.map((l) => l.tagId),
      features: productFeatures.map((f) => ({ key: f.id, text: f.text })),
      photos: photos.map((ph) => ({ key: ph.id, url: ph.url })),
      imageFit: product.imageFit,
      featured: product.featured,
      visible: product.visible,
    };
  }

  return (
    <>
      <Link href="/admin/products" className="mb-4 -ml-2 inline-flex h-11 items-center gap-1 px-2 text-sm font-medium text-muted hover:text-ink">
        <ChevronLeft className="size-4" aria-hidden />
        {t.products.title}
      </Link>
      <PageHeader title={id === "new" ? t.products.newTitle : `${initial.code} · ${ui(initial.name)}`} />
      <ProductForm key={id} initial={initial} options={options} t={t} justCreated={saved === "1"} />
    </>
  );
}
