import type { Metadata } from "next";
import { openingHoursSchema } from "./hours";
import type { Locale } from "./i18n/config";
import { absolutePhotoUrl, type Category, type Product } from "./products";
import {
  type Branch,
  branchAddress,
  COMPANY_NAME,
  type Company,
  googleMapsUrl,
  pick,
  type Site,
  siteUrl,
} from "./site";

/*
 * SEARCH ENGINE SETUP.
 * Site-wide crawl rules, Search Console verification and the schema.org
 * structured data every page emits. Setup steps for Google Search Console
 * and Bing Webmaster Tools are in docs/SEO.md.
 */

/**
 * Whether search engines may index this deployment. Off until the real domain
 * is set (a localhost canonical would be worse than no listing), on Vercel
 * preview deployments, and whenever NEXT_PUBLIC_NOINDEX=1 (e.g. a staging server).
 */
export const indexable =
  !!process.env.NEXT_PUBLIC_SITE_URL &&
  process.env.VERCEL_ENV !== "preview" &&
  process.env.NEXT_PUBLIC_NOINDEX !== "1";

export function absoluteUrl(path = "") {
  return `${siteUrl}${path}`;
}

/** Comma-separated env values, so a second owner's token can be added without code changes. */
function tokens(value: string | undefined) {
  const list = value?.split(",").map((t) => t.trim()).filter(Boolean) ?? [];
  return list.length ? list : undefined;
}

/**
 * Ownership tokens for the search consoles, rendered as <meta> tags on every page.
 * Copy only the `content` value from the tag each console gives you.
 */
export function siteVerification(): Metadata["verification"] {
  const bing = tokens(process.env.BING_SITE_VERIFICATION);
  return {
    google: tokens(process.env.GOOGLE_SITE_VERIFICATION),
    yandex: tokens(process.env.YANDEX_SITE_VERIFICATION),
    ...(bing ? { other: { "msvalidate.01": bing } } : {}),
  };
}

export function robotsMeta(): Metadata["robots"] {
  if (!indexable) return { index: false, follow: false };
  return {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      // Let Google show large product photos and full-length snippets in results.
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  };
}

/** Search terms per language. Google ignores the keywords tag; Bing and smaller engines still read it. */
export const keywords: Record<Locale, string[]> = {
  en: [
    "safety shoes",
    "safety boots",
    "safety shoes Malaysia",
    "safety shoes Klang Valley",
    "safety shoes shop Selangor",
    "Black Hammer safety shoes",
    "Kickers Safety boots",
    "rain boots",
    "kitchen safety clogs",
    "safety helmet",
    "reflective safety vest",
    "PPE supplier Malaysia",
    "safety gear Seri Kembangan",
    "safety shoes Kota Damansara",
    "safety shoes Klang",
  ],
  ms: [
    "kasut keselamatan",
    "but keselamatan",
    "kedai kasut keselamatan",
    "kasut safety",
    "kasut Black Hammer",
    "but hujan",
    "topi keselamatan",
    "vest keselamatan",
    "peralatan keselamatan",
    "PPE Malaysia",
    "kasut keselamatan Seri Kembangan",
    "kasut keselamatan Kota Damansara",
    "kasut keselamatan Klang",
  ],
  zh: [
    "安全鞋",
    "安全靴",
    "马来西亚安全鞋",
    "雪兰莪安全鞋",
    "Black Hammer 安全鞋",
    "雨靴",
    "厨房防滑鞋",
    "安全帽",
    "反光背心",
    "劳保用品",
    "沙登安全鞋",
    "巴生安全鞋",
  ],
};

/* ---------- Structured data (JSON-LD) ---------- */

/** Stable @id values, so entities on different pages are recognised as the same thing. */
export const schemaId = {
  organization: absoluteUrl("/#organization"),
  website: absoluteUrl("/#website"),
  logo: absoluteUrl("/#logo"),
  store: (branch: Branch) => absoluteUrl(`/#store-${branch.id}`),
};

const inLanguage: Record<Locale, string> = { en: "en-MY", ms: "ms-MY", zh: "zh-Hans-MY" };

const logo = {
  "@type": "ImageObject",
  "@id": schemaId.logo,
  url: absoluteUrl("/logo.png"),
  contentUrl: absoluteUrl("/logo.png"),
  width: 512,
  height: 512,
  caption: COMPANY_NAME,
};

function postalAddress(branch: Branch) {
  return {
    "@type": "PostalAddress",
    streetAddress: branch.postal.street,
    addressLocality: branch.postal.locality,
    addressRegion: "Selangor",
    postalCode: branch.postal.postalCode,
    addressCountry: "MY",
  };
}

/** The company, with the HQ address from the letterhead (the first branch, Taman Equine). */
export function organizationSchema({ company, branches }: Site, locale: Locale, slogan: string) {
  const hq = branches[0];
  return {
    "@type": "Organization",
    "@id": schemaId.organization,
    name: company.name,
    legalName: company.legalName,
    url: absoluteUrl(`/${locale}`),
    logo,
    image: { "@id": schemaId.logo },
    slogan,
    email: company.email,
    telephone: company.phoneE164,
    ...(hq ? { address: postalAddress(hq) } : {}),
    identifier: { "@type": "PropertyValue", propertyID: "SSM", value: company.registration },
    areaServed: { "@type": "Country", name: "Malaysia" },
    contactPoint: [
      {
        "@type": "ContactPoint",
        contactType: "customer service",
        telephone: company.phoneE164,
        email: company.email,
        areaServed: "MY",
        availableLanguage: ["English", "Malay", "Chinese"],
      },
      {
        "@type": "ContactPoint",
        contactType: "sales",
        telephone: company.phoneE164,
        url: `https://wa.me/${company.whatsappNumber}`,
        areaServed: "MY",
        availableLanguage: ["English", "Malay", "Chinese"],
      },
    ],
    subOrganization: branches.map((b) => ({ "@id": schemaId.store(b) })),
    ...(company.sameAs.length ? { sameAs: company.sameAs } : {}),
  };
}

export function websiteSchema(company: Company, description: string) {
  return {
    "@type": "WebSite",
    "@id": schemaId.website,
    url: absoluteUrl(),
    name: company.name,
    alternateName: company.legalName,
    description,
    inLanguage: Object.values(inLanguage),
    publisher: { "@id": schemaId.organization },
  };
}

/** One physical shop: a local business listing Google can match to the branch's map pin. */
export function storeSchema(company: Company, branch: Branch, locale: Locale) {
  return {
    "@type": "ShoeStore",
    "@id": schemaId.store(branch),
    name: `${company.name} ${branch.name}`,
    url: absoluteUrl(`/${locale}#branches`),
    telephone: branch.phoneE164,
    email: company.email,
    image: absoluteUrl("/logo.png"),
    logo: { "@id": schemaId.logo },
    address: postalAddress(branch),
    hasMap: googleMapsUrl(branch),
    description: `${company.name}, ${branchAddress(branch)}`,
    openingHoursSpecification: openingHoursSchema(branch.hours),
    currenciesAccepted: "MYR",
    areaServed: { "@type": "State", name: "Selangor" },
    parentOrganization: { "@id": schemaId.organization },
  };
}

export function breadcrumbSchema(items: { name: string; path: string }[]) {
  return {
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

function productImages(product: Product) {
  return [product.image, ...(product.gallery ?? [])]
    .filter((src): src is string => !!src)
    .map((src) => absolutePhotoUrl(src, siteUrl));
}

/**
 * A catalogue item. Prices are never published, so there is no `offers` block:
 * Google reads the product facts, but the page won't get price/stock rich results.
 */
export function productSchema(product: Product, category: Category | undefined, locale: Locale) {
  const images = productImages(product);
  const url = absoluteUrl(`/${locale}/products/${product.slug}`);
  return {
    "@type": "Product",
    "@id": `${url}#product`,
    name: pick(product.name, locale),
    sku: product.code,
    mpn: product.code,
    description: pick(product.description, locale),
    ...(category ? { category: pick(category.name, locale) } : {}),
    url,
    inLanguage: inLanguage[locale],
    ...(images.length ? { image: images } : {}),
    ...(product.brand ? { brand: { "@type": "Brand", name: product.brand } } : {}),
    ...(product.colours?.length ? { color: product.colours.map((c) => pick(c, locale)).join(", ") } : {}),
    ...(product.sizes ? { size: product.sizes.values.join(", ") } : {}),
  };
}

/** The catalogue page: a list of every product, in display order. */
export function productListSchema(products: Product[], locale: Locale, name: string, description: string) {
  const url = absoluteUrl(`/${locale}/products`);
  return {
    "@type": "CollectionPage",
    "@id": url,
    url,
    name,
    description,
    inLanguage: inLanguage[locale],
    isPartOf: { "@id": schemaId.website },
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: products.length,
      itemListElement: products.map((p, i) => ({
        "@type": "ListItem",
        position: i + 1,
        url: absoluteUrl(`/${locale}/products/${p.slug}`),
        name: pick(p.name, locale),
      })),
    },
  };
}

/** Wrap entities in one @graph document, ready for <JsonLd>. */
export function graph(...nodes: object[]) {
  return { "@context": "https://schema.org", "@graph": nodes };
}
