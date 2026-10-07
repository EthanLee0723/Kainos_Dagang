import { TaglineBand } from "@/components/brand/tagline-band";
import { Branches } from "@/components/home/branches";
import { Brands } from "@/components/home/brands";
import { Closing } from "@/components/home/closing";
import { Directory } from "@/components/home/directory";
import { Fitting } from "@/components/home/fitting";
import { ShopWindow } from "@/components/home/shop-window";
import { SignboardHero } from "@/components/home/signboard-hero";
import type { Metadata } from "next";
import { openingHoursSchema } from "@/lib/hours";
import { alternatesFor } from "@/lib/i18n/alternates";
import { getDictionary, getLocale } from "@/lib/i18n/server";
import { branchAddress, branches, company, siteUrl } from "@/lib/site";

export async function generateMetadata(): Promise<Metadata> {
  return { alternates: alternatesFor(await getLocale()) };
}

export default async function HomePage() {
  const locale = await getLocale();
  const dict = await getDictionary(locale);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: company.legalName,
    alternateName: company.name,
    url: `${siteUrl}/${locale}`,
    email: company.email,
    telephone: company.phoneE164,
    slogan: dict.tagline,
    department: branches.map((b) => ({
      "@type": "Store",
      name: `${company.name} ${b.name}`,
      telephone: b.phoneE164,
      address: { "@type": "PostalAddress", streetAddress: branchAddress(b), addressCountry: "MY" },
      openingHoursSpecification: openingHoursSchema(),
    })),
  };

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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
    </>
  );
}
