import type { MetadataRoute } from "next";
import { locales, type Locale } from "@/lib/i18n/config";
import { products } from "@/lib/products";
import { absoluteUrl } from "@/lib/seo";

/** hreflang codes, matching lib/i18n/alternates.ts. */
const hreflang: Record<Locale, string> = { en: "en", ms: "ms", zh: "zh-Hans" };

/**
 * /sitemap.xml: every page in every language, each listing its translations
 * (hreflang) and, for products, its photos (image sitemap).
 *
 * No <lastmod>: the catalogue has no per-page edit dates, and Google ignores
 * lastmod once it notices the value isn't accurate. <changefreq> and <priority>
 * are omitted too; Google ignores both.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const pages: { path: string; images?: string[] }[] = [
    { path: "" },
    { path: "/products" },
    ...products.map((p) => ({
      path: `/products/${p.slug}`,
      images: [p.image, ...(p.gallery ?? [])].filter((src): src is string => !!src).map((src) => absoluteUrl(src)),
    })),
  ];

  return pages.flatMap(({ path, images }) => {
    const languages = {
      ...Object.fromEntries(locales.map((l) => [hreflang[l], absoluteUrl(`/${l}${path}`)])),
      "x-default": absoluteUrl(`/en${path}`),
    };
    return locales.map((locale) => ({
      url: absoluteUrl(`/${locale}${path}`),
      alternates: { languages },
      ...(images?.length ? { images } : {}),
    }));
  });
}
