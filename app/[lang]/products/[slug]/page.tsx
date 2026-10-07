import { Check, ChevronRight } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ProductEnquiry } from "@/components/product-enquiry";
import { ProductArt, ProductTile } from "@/components/product-tile";
import { SiteHeader } from "@/components/site-header";
import { container } from "@/components/ui";
import { alternatesFor } from "@/lib/i18n/alternates";
import { openGraphFor } from "@/lib/i18n/open-graph";
import { getDictionary, getLocale } from "@/lib/i18n/server";
import { getCategory, getProduct, products, relatedProducts } from "@/lib/products";
import { branches, pick, siteUrl } from "@/lib/site";

export const dynamicParams = false;

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/[lang]/products/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) return {};
  const locale = await getLocale();
  const title = `${pick(product.name, locale)} (${product.code})`;
  const description = pick(product.summary, locale);
  return {
    title,
    description,
    alternates: alternatesFor(locale, `/products/${slug}`),
    openGraph: openGraphFor(locale, `${title} | Kainos Dagang`, description),
  };
}

export default async function ProductPage({ params }: PageProps<"/[lang]/products/[slug]">) {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) notFound();

  const locale = await getLocale();
  const dict = await getDictionary(locale);
  const name = pick(product.name, locale);
  const category = getCategory(product.category);
  const sizes = product.sizes && {
    label: pick(product.sizes.label, locale),
    values: product.sizes.values,
    prefix: product.sizes.label.en.startsWith("UK") ? "UK " : "",
  };

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name,
    sku: product.code,
    description: pick(product.description, locale),
    category: pick(category.name, locale),
    url: `${siteUrl}/${locale}/products/${product.slug}`,
    ...(product.brand ? { brand: { "@type": "Brand", name: product.brand } } : {}),
  };

  return (
    <>
      <SiteHeader dict={dict} locale={locale} />
      <main id="main" className="bg-paper">
        <div className={container}>
          <nav aria-label={dict.nav.breadcrumb} className="py-5">
            <ol className="flex flex-wrap items-center gap-1 text-sm text-muted">
              <li>
                <Link href={`/${locale}/products`} className="inline-flex h-11 items-center hover:text-ink">
                  {dict.product.backToProducts}
                </Link>
              </li>
              <li aria-hidden>
                <ChevronRight className="size-4" />
              </li>
              <li>
                <Link
                  href={`/${locale}/products?category=${category.id}`}
                  className="inline-flex h-11 items-center hover:text-ink"
                >
                  {pick(category.name, locale)}
                </Link>
              </li>
            </ol>
          </nav>

          <div className="grid gap-10 pb-16 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)] lg:gap-16 lg:pb-24">
            <div className="lg:sticky lg:top-6 lg:self-start">
              <div className="relative">
                <ProductArt
                  product={product}
                  priority
                  sizes="(min-width: 1024px) 50vw, 100vw"
                  className="aspect-square border border-line"
                />
                <span className="font-display tabular absolute top-4 left-4 text-sm text-ink/70">{product.code}</span>
                {product.sample && (
                  <span className="absolute top-3.5 right-3.5 rounded-sm bg-ink px-2.5 py-1 text-[0.78rem] font-semibold tracking-wider text-paper uppercase">
                    {dict.product.sample}
                  </span>
                )}
              </div>
              {product.sample && <p className="mt-3 text-sm text-muted">{dict.product.sampleNote}</p>}
            </div>

            <div>
              <h1 className="text-[1.9rem] leading-[1.12] font-semibold tracking-[-0.015em] sm:text-[2.4rem]">
                {name}
              </h1>
              <p className="tabular mt-3 text-sm text-muted">
                {[product.brand, `${dict.product.code} ${product.code}`].filter(Boolean).join(" · ")}
              </p>
              <p className="mt-4 max-w-[52ch] text-[1.08rem] leading-relaxed text-muted">
                {pick(product.summary, locale)}
              </p>
              {product.pack && (
                <p className="mt-4 text-sm">
                  <span className="font-semibold">{dict.product.pack}:</span> {pick(product.pack, locale)}
                </p>
              )}

              <div className="mt-8 border-t border-line pt-8">
                <ProductEnquiry
                  locale={locale}
                  name={name}
                  code={product.code}
                  slug={product.slug}
                  sizes={sizes}
                  colours={product.colours?.map((c) => pick(c, locale))}
                  labels={{
                    chooseSize: dict.product.chooseSize,
                    colours: dict.product.colours,
                    quantity: dict.product.quantity,
                    decrease: dict.product.decrease,
                    increase: dict.product.increase,
                    enquire: dict.product.enquire,
                    enquireNote: dict.product.enquireNote,
                    call: dict.product.call,
                  }}
                />
              </div>

              <div className="mt-10 border-t border-line pt-8">
                <h2 className="text-sm font-semibold">{dict.product.tryInStore}</h2>
                <ul className="mt-3 flex flex-wrap gap-x-5 gap-y-1">
                  {branches.map((b) => (
                    <li key={b.id}>
                      <Link
                        href={`/${locale}#branches`}
                        className="inline-flex h-11 items-center text-[0.95rem] underline decoration-line decoration-2 underline-offset-[6px] transition-colors hover:decoration-ink"
                      >
                        {b.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-10 grid gap-10 border-t border-line pt-8 sm:grid-cols-2">
                <div>
                  <h2 className="text-sm font-semibold">{dict.product.details}</h2>
                  <p className="mt-3 leading-relaxed">{pick(product.description, locale)}</p>
                </div>
                <div>
                  <h2 className="text-sm font-semibold">{dict.product.features}</h2>
                  <ul className="mt-3 space-y-2.5">
                    {product.features.map((f) => (
                      <li key={f.en} className="flex gap-3 leading-snug">
                        <Check className="mt-0.5 size-[1.1rem] shrink-0 text-ink" strokeWidth={2.5} aria-hidden />
                        {pick(f, locale)}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="mt-10 border-t border-line pt-8">
                <h2 className="text-sm font-semibold">{dict.product.suitableFor}</h2>
                <ul className="mt-3 flex flex-wrap gap-2">
                  {product.uses.map((use) => (
                    <li key={use} className="rounded-full bg-floor px-3.5 py-1.5 text-sm">
                      {dict.uses[use]}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        <section aria-labelledby="related-title" className="border-t border-line bg-floor">
          <div className={`${container} py-14 lg:py-20`}>
            <h2 id="related-title" className="font-display text-[1.6rem] uppercase sm:text-[2rem]">
              {dict.product.related}
            </h2>
            <ul className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {relatedProducts(product).map((p) => (
                <li key={p.slug} className="flex">
                  <ProductTile product={p} locale={locale} dict={dict} />
                </li>
              ))}
            </ul>
          </div>
        </section>
      </main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
    </>
  );
}
