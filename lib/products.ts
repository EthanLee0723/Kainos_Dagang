import type { Locale } from "./i18n/config";
import type { Localized } from "./site";

/*
 * THE CATALOGUE: shapes and helpers.
 * The data lives in the database and is edited in /admin. Server components
 * load it with getCatalogue() (lib/data/catalogue.ts) and pass it to the
 * helpers below. Prices are intentionally absent: all pricing goes through WhatsApp.
 */

export const pictograms = [
  "shoe",
  "boot-mid",
  "boot-high",
  "gumboot",
  "helmet",
  "glove",
  "goggles",
  "glasses",
  "earmuff",
  "vest",
  "sock",
  "cone",
  "net",
  "tape",
  "baton",
] as const;

export type Pictogram = (typeof pictograms)[number];

export type Category = {
  /** Also the catalogue's ?category= value. */
  id: string;
  name: Localized;
  blurb: Localized;
  pictogram: Pictogram;
};

/** A "Suitable for" chip or a badge tag. */
export type Label = { id: string; name: Localized };

export type Brand = {
  name: string;
  /** What the brand covers on our shelves. */
  note: Localized;
  /** Listed, but no products online yet. */
  comingSoon: boolean;
};

export type Product = {
  slug: string;
  code: string;
  brand?: string;
  category: string;
  pictogram: Pictogram;
  /** Main photo. Without one, the pictogram stands in. */
  image?: string;
  /** Further photos: other angles and colourways. */
  gallery?: string[];
  /** "contain" for cut-outs on white, "cover" for photos with their own background. */
  imageFit?: "contain" | "cover";
  name: Localized;
  summary: Localized;
  description: Localized;
  features: Localized[];
  sizes?: { label: Localized; values: string[] };
  colours?: Localized[];
  pack?: Localized;
  suitableFor: Label[];
  tags: Label[];
  featured?: boolean;
};

export type Catalogue = {
  /** Products shown on the site, in catalogue order. */
  products: Product[];
  categories: Category[];
  /** Brands stocked. Shown as brands stocked, never as "authorised". */
  brands: Brand[];
  tags: Label[];
};

export function productsByBrand(catalogue: Catalogue, name: string) {
  return catalogue.products.filter((p) => p.brand === name);
}

export function getProduct(catalogue: Catalogue, slug: string) {
  return catalogue.products.find((p) => p.slug === slug);
}

export function getCategory(catalogue: Catalogue, id: string) {
  return catalogue.categories.find((c) => c.id === id);
}

export function productsInCategory(catalogue: Catalogue, id: string) {
  return catalogue.products.filter((p) => p.category === id);
}

export function featuredProducts(catalogue: Catalogue) {
  return catalogue.products.filter((p) => p.featured);
}

/** Two neighbours from the same brand and section, then featured gear from other sections. */
export function relatedProducts(catalogue: Catalogue, product: Product, limit = 4) {
  const { products } = catalogue;
  const siblings = products.filter((p) => p.category === product.category && p.brand === product.brand);
  const at = siblings.findIndex((p) => p.slug === product.slug);
  const near = [...siblings.slice(at + 1), ...siblings.slice(0, at)].slice(0, 2);
  return near.concat(products.filter((p) => p.category !== product.category && p.featured)).slice(0, limit);
}

/** "UK 5–12", "S–XL", "45 cm · 70 cm · 90 cm": a one-line size summary for tiles. */
export function sizeSummary(product: Product, locale: Locale) {
  if (!product.sizes) return product.pack?.[locale];
  const { values, label } = product.sizes;
  if (values.length > 3) {
    const prefix = label.en.startsWith("UK")
      ? locale === "zh" ? "英码 " : "UK "
      : label.en.startsWith("EU") ? locale === "zh" ? "欧码 " : "EU " : "";
    return `${prefix}${values[0]}–${values[values.length - 1]}`;
  }
  return values.join(" · ");
}

/** Photo URLs are site paths (/products/…) or absolute (uploaded to Blob storage). */
export function absolutePhotoUrl(src: string, origin: string) {
  return /^https?:\/\//.test(src) ? src : `${origin}${src}`;
}
