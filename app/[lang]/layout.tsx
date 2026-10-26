import type { Metadata, Viewport } from "next";
import { JsonLd } from "@/components/json-ld";
import { ScrollReveal } from "@/components/scroll-reveal";
import { SiteFooter } from "@/components/site-footer";
import { WhatsAppFloat } from "@/components/whatsapp-float";
import { htmlLang, locales } from "@/lib/i18n/config";
import { openGraphFor } from "@/lib/i18n/open-graph";
import { getDictionary, getLocale } from "@/lib/i18n/server";
import { graph, keywords, organizationSchema, robotsMeta, siteVerification, websiteSchema } from "@/lib/seo";
import { getSite } from "@/lib/data/site";
import { siteUrl } from "@/lib/site";
import { fontVariables } from "../fonts";
import "../globals.css";

// No `dynamicParams = false` here: it would apply to every page below, so products added
// in the admin (and pages regenerated after an admin save) would 404. Unknown languages
// never get this far: proxy.ts redirects them, and getLocale() 404s on anything else.
export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export const viewport: Viewport = {
  themeColor: "#000000",
};

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const [dict, { company }] = await Promise.all([getDictionary(locale), getSite()]);
  return {
    metadataBase: new URL(siteUrl),
    title: { default: dict.meta.title, template: `%s | Kainos Dagang` },
    description: dict.meta.description,
    applicationName: company.name,
    authors: [{ name: company.legalName, url: `${siteUrl}/${locale}` }],
    creator: company.legalName,
    publisher: company.legalName,
    keywords: keywords[locale],
    category: "shopping",
    robots: robotsMeta(),
    verification: siteVerification(),
    openGraph: openGraphFor(locale, dict.meta.title, dict.meta.description),
    // X/Twitter falls back to the og: title, description and image for the rest.
    twitter: { card: "summary_large_image" },
    other: {
      // Local search hints read by Bing and some regional engines.
      "geo.region": "MY-10",
      "geo.placename": "Selangor",
    },
  };
}

export default async function RootLayout({ children }: LayoutProps<"/[lang]">) {
  const locale = await getLocale();
  const [dict, site] = await Promise.all([getDictionary(locale), getSite()]);

  return (
    <html
      lang={htmlLang[locale]}
      data-scroll-behavior="smooth"
      className={fontVariables}
    >
      <body className="min-h-dvh">
        <a
          href="#main"
          className="sr-only z-[60] bg-orange px-4 py-3 font-semibold text-ink focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
        >
          {dict.nav.skip}
        </a>
        {children}
        <SiteFooter dict={dict} locale={locale} />
        <WhatsAppFloat locale={locale} label={dict.whatsapp.float} />
        <ScrollReveal />
        <JsonLd data={graph(organizationSchema(site, locale, dict.tagline), websiteSchema(site.company, dict.meta.description))} />
      </body>
    </html>
  );
}
