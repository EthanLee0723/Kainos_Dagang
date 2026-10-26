import { TaglineBand } from "@/components/brand/tagline-band";
import { Branches } from "@/components/home/branches";
import { Brands } from "@/components/home/brands";
import { Closing } from "@/components/home/closing";
import { Directory } from "@/components/home/directory";
import { Fitting } from "@/components/home/fitting";
import { ShopWindow } from "@/components/home/shop-window";
import { SignboardHero } from "@/components/home/signboard-hero";
import type { Metadata } from "next";
import { JsonLd } from "@/components/json-ld";
import { alternatesFor } from "@/lib/i18n/alternates";
import { openGraphFor } from "@/lib/i18n/open-graph";
import { getDictionary, getLocale } from "@/lib/i18n/server";
import { absoluteUrl, graph, schemaId, storeSchema } from "@/lib/seo";
import { branches } from "@/lib/site";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const dict = await getDictionary(locale);
  return {
    alternates: alternatesFor(locale),
    openGraph: openGraphFor(locale, dict.meta.title, dict.meta.description),
  };
}

export default async function HomePage() {
  const locale = await getLocale();
  const dict = await getDictionary(locale);

  // The Organization and WebSite nodes come from the layout; the home page adds the shops.
  const jsonLd = graph(
    {
      "@type": "WebPage",
      "@id": absoluteUrl(`/${locale}`),
      url: absoluteUrl(`/${locale}`),
      name: dict.meta.title,
      description: dict.meta.description,
      isPartOf: { "@id": schemaId.website },
      about: { "@id": schemaId.organization },
    },
    ...branches.map((b) => storeSchema(b, locale)),
  );

  return (
    <>
      <SignboardHero dict={dict} locale={locale} />
      <TaglineBand dict={dict} />
      <main id="main">
        <ShopWindow dict={dict} locale={locale} />
        <Directory dict={dict} locale={locale} />
        <Brands dict={dict} locale={locale} />
        <Fitting dict={dict} locale={locale} />
        <Branches dict={dict} locale={locale} />
        <Closing dict={dict} locale={locale} />
      </main>
      <JsonLd data={jsonLd} />
    </>
  );
}
