import type { Metadata } from "next";
import { locales, type Locale } from "./config";

/** Locale codes link-preview crawlers (Facebook, WhatsApp) recognise. */
const ogLocale: Record<Locale, string> = { en: "en_GB", ms: "ms_MY", zh: "zh_CN" };

/**
 * Open Graph block for link previews (WhatsApp, Facebook): a page's own title, never the site default.
 * `path` is the page's path after the locale ("" for home), giving og:url.
 */
export function openGraphFor(locale: Locale, title: string, description: string, path = ""): Metadata["openGraph"] {
  return {
    type: "website",
    siteName: "Kainos Dagang",
    locale: ogLocale[locale],
    alternateLocale: locales.filter((l) => l !== locale).map((l) => ogLocale[l]),
    url: `/${locale}${path}`,
    title,
    description,
  };
}
