import type { MetadataRoute } from "next";
import { absoluteUrl, indexable } from "@/lib/seo";

/** /robots.txt: open to every crawler on the live domain, closed everywhere else. */
export default function robots(): MetadataRoute.Robots {
  if (!indexable) {
    return { rules: { userAgent: "*", disallow: "/" } };
  }
  // Only the admin is disallowed: Google must fetch /_next/ (scripts, styles,
  // optimised product photos) to render pages and index the images.
  return {
    rules: { userAgent: "*", allow: "/", disallow: "/admin" },
    sitemap: absoluteUrl("/sitemap.xml"),
  };
}
