import type { Metadata } from "next";
import { Suspense } from "react";
import { Catalogue, type CatalogueItem } from "@/components/catalogue";
import { ProductTile } from "@/components/product-tile";
import { SiteHeader } from "@/components/site-header";
import { container } from "@/components/ui";
import { alternatesFor } from "@/lib/i18n/alternates";
import { openGraphFor } from "@/lib/i18n/open-graph";
import { getDictionary, getLocale } from "@/lib/i18n/server";
import { brands, categories, products, productsByBrand } from "@/lib/products";
import { pick } from "@/lib/site";
import { generalEnquiryUrl } from "@/lib/whatsapp";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const dict = await getDictionary(locale);
  return {
    title: dict.meta.productsTitle,
    description: dict.meta.productsDescription,
    alternates: alternatesFor(locale, "/products"),
    openGraph: openGraphFor(locale, `${dict.meta.productsTitle} | Kainos Dagang`, dict.meta.productsDescription),
  };
}

export default async function ProductsPage() {
  const locale = await getLocale();
  const dict = await getDictionary(locale);

  const tiles = Object.fromEntries(
    products.map((p, i) => [p.slug, <ProductTile key={p.slug} product={p} locale={locale} dict={dict} priority={i < 4} headingLevel="h2" />]),
  );
  const items: CatalogueItem[] = products.map((p) => ({
    slug: p.slug,
    category: p.category,
    brand: p.brand,
    haystack: [p.name.en, p.name.ms, p.name.zh, p.code, p.code.replace(/[^a-z0-9]/gi, ""), p.brand ?? ""]
      .join(" ")
      .toLowerCase()
      .normalize("NFKD"),
  }));
  const productBrands = brands.filter((b) => productsByBrand(b.name).length > 0).map((b) => b.name);

  return (
    <>
      <SiteHeader dict={dict} locale={locale} />
      <main id="main" className="bg-paper">
        <div className={`${container} pt-10 pb-6 sm:pt-14 lg:pt-16`}>
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between lg:gap-12">
            <h1 className="font-display text-[2.4rem] leading-[0.95] uppercase sm:text-[3.4rem] lg:text-[4.2rem]">
              {dict.catalogue.title}
            </h1>
            <p className="max-w-xl leading-relaxed text-muted">{dict.catalogue.intro}</p>
          </div>
        </div>
        <div className={`${container} pb-20 lg:pb-28`}>
          <Suspense
            fallback={
              <ul className="grid gap-4 pt-[4.5rem] sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {products.map((p) => (
                  <li key={p.slug} className="flex">
                    {tiles[p.slug]}
                  </li>
                ))}
              </ul>
            }
          >
            <Catalogue
              items={items}
              tiles={tiles}
              categories={categories.map((c) => ({ id: c.id, name: pick(c.name, locale) }))}
              brands={productBrands}
              locale={locale}
              whatsappHref={generalEnquiryUrl(locale)}
              labels={{
                search: dict.catalogue.search,
                all: dict.catalogue.all,
                brand: dict.catalogue.brand,
                anyBrand: dict.catalogue.anyBrand,
                category: dict.catalogue.category,
                clear: dict.catalogue.clear,
                emptyTitle: dict.catalogue.emptyTitle,
                emptyBody: dict.catalogue.emptyBody,
                whatsapp: dict.whatsapp.cta,
                results: dict.catalogue.results,
              }}
            />
          </Suspense>
        </div>
      </main>
    </>
  );
}
