import type { Metadata } from "next";
import type { Locale } from "./config";

/** Locale codes link-preview crawlers (Facebook, WhatsApp) recognise. */
const ogLocale: Record<Locale, string> = { en: "en_GB", ms: "ms_MY", zh: "zh_CN" };

/** Open Graph block for link previews (WhatsApp, Facebook): a page's own title, never the site default. */
export function openGraphFor(locale: Locale, title: string, description: string): Metadata["openGraph"] {
  return {
    type: "website",
    siteName: "Kainos Dagang",
    locale: ogLocale[locale],
    title,
    description,
  };
}
