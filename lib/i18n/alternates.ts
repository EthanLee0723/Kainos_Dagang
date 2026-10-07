import type { Metadata } from "next";
import type { Locale } from "./config";

/** Canonical + hreflang links for a page that exists at the same path in every locale. */
export function alternatesFor(locale: Locale, path = ""): Metadata["alternates"] {
  return {
    canonical: `/${locale}${path}`,
    languages: {
      en: `/en${path}`,
      ms: `/ms${path}`,
      "zh-Hans": `/zh${path}`,
      "x-default": `/en${path}`,
    },
  };
}
