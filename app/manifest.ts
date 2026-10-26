import type { MetadataRoute } from "next";
import { getSite } from "@/lib/data/site";

/** /manifest.webmanifest: name, colours and icons for "Add to Home Screen" and Android's browser chrome. */
export default async function manifest(): Promise<MetadataRoute.Manifest> {
  const { company } = await getSite();
  return {
    name: company.legalName,
    short_name: company.name,
    description: "Safety shoes and safety gear, fitted in store. Three shops in the Klang Valley.",
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: "#000000",
    theme_color: "#000000",
    lang: "en",
    categories: ["shopping", "business"],
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icons/icon-maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
