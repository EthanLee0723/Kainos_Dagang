import type { Locale } from "./i18n/config";
import type { Localized } from "./site";
import { footwear } from "./catalogue/footwear";
import { gear } from "./catalogue/gear";
import photos from "./catalogue/photos.json";

/*
 * THE CATALOGUE.
 * Product data lives in lib/catalogue/ (transcribed from the brands' own
 * catalogues and product sheets); photos are in /public/products, listed in
 * lib/catalogue/photos.json. Prices are intentionally absent: all pricing
 * goes through WhatsApp.
 */

export type CategoryId = "safety-shoes" | "safety-boots" | "hospitality" | "helmets" | "hi-vis";

export type Pictogram =
  | "shoe"
  | "boot-mid"
  | "boot-high"
  | "gumboot"
  | "helmet"
  | "glove"
  | "goggles"
  | "glasses"
  | "earmuff"
  | "vest"
  | "sock"
  | "cone"
  | "net"
  | "tape"
  | "baton";

export type UseCase =
  | "construction"
  | "factory"
  | "warehouse"
  | "logistics"
  | "workshop"
  | "oil-gas"
  | "food"
  | "plantation"
  | "roadworks"
  | "hospitality";

export type Category = {
  id: CategoryId;
  name: Localized;
  blurb: Localized;
  pictogram: Pictogram;
};

export type Product = {
  slug: string;
  code: string;
  brand?: string;
  category: CategoryId;
  pictogram: Pictogram;
  /** Main photo in /public/products. Without one, the pictogram stands in. */
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
  uses: UseCase[];
  featured?: boolean;
};

export const categories: Category[] = [
  {
    id: "safety-shoes",
    pictogram: "shoe",
    name: { en: "Safety Shoes", ms: "Kasut Keselamatan", zh: "安全鞋" },
    blurb: {
      en: "Low-cut lace-ups, slip-ons and sporty safety trainers.",
      ms: "Kasut bertali potongan rendah, tanpa tali dan kasut sukan keselamatan.",
      zh: "低帮系带、一脚蹬和运动款安全鞋。",
    },
  },
  {
    id: "safety-boots",
    pictogram: "boot-high",
    name: { en: "Safety Boots", ms: "But Keselamatan", zh: "安全靴" },
    blurb: {
      en: "Mid and high-cut boots, laced, zipped or pull-on, plus waterproof rain boots.",
      ms: "But potongan sederhana dan tinggi, bertali, berzip atau sarung, serta but hujan kalis air.",
      zh: "中帮、高帮安全靴，系带、拉链或套穿，以及防水雨靴。",
    },
  },
  {
    id: "hospitality",
    pictogram: "shoe",
    name: { en: "Kitchen & Hospitality", ms: "Dapur & Hospitaliti", zh: "厨房与餐饮鞋" },
    blurb: {
      en: "Slip-resistant clogs and kitchen shoes for wet, greasy floors.",
      ms: "Klog dan kasut dapur kalis gelincir untuk lantai basah dan berminyak.",
      zh: "防滑洞洞鞋和厨房鞋，适合湿滑油腻的地面。",
    },
  },
  {
    id: "helmets",
    pictogram: "helmet",
    name: { en: "Safety Helmets", ms: "Topi Keselamatan", zh: "安全帽" },
    blurb: {
      en: "Hard hats in site colours, with ratchet adjustment.",
      ms: "Topi keledar pelbagai warna tapak, dengan pelaras ratchet.",
      zh: "多种工地颜色，旋钮调节。",
    },
  },
  {
    id: "hi-vis",
    pictogram: "vest",
    name: { en: "Safety Vests", ms: "Vest Keselamatan", zh: "反光背心" },
    blurb: {
      en: "Reflective vests so you are seen on site and on the road.",
      ms: "Vest pemantul cahaya supaya anda kelihatan di tapak dan jalan raya.",
      zh: "反光背心，让你在工地和道路上更醒目。",
    },
  },
];

const photoIndex = photos as Record<string, { count: number; fit: "contain" | "cover" }>;

export const products: Product[] = [...footwear(), ...gear].map((p) => {
  const photo = photoIndex[p.slug];
  if (!photo) return p;
  const paths = Array.from({ length: photo.count }, (_, i) => `/products/${p.slug}${i ? `-${i + 1}` : ""}.webp`);
  return { ...p, image: paths[0], gallery: paths.slice(1), imageFit: photo.fit };
});

export type Brand = {
  name: string;
  /** What the brand covers on our shelves. */
  note: Localized;
  /** Listed, but no products online yet. */
  comingSoon?: boolean;
};

/** Brands stocked. Shown as brands stocked, never as "authorised". */
export const brands: Brand[] = [
  { name: "Black Hammer", note: { en: "Safety shoes, boots, rain boots and kitchen clogs", ms: "Kasut, but, but hujan dan klog dapur keselamatan", zh: "安全鞋、安全靴、雨靴和厨房洞洞鞋" } },
  { name: "Kickers", note: { en: "Leather safety boots and safety trainers", ms: "But keselamatan kulit dan kasut sukan keselamatan", zh: "真皮安全靴和安全运动鞋" } },
  { name: "Tanker Tec", note: { en: "Metal-free ESD safety footwear", ms: "Kasut keselamatan ESD bebas logam", zh: "无金属 ESD 安全鞋" } },
  { name: "Hammerland", note: { en: "Value safety shoes and boots", ms: "Kasut dan but keselamatan berpatutan", zh: "高性价比安全鞋和安全靴" } },
  { name: "Toelect", note: { en: "Safety shoes and sporty safety trainers", ms: "Kasut keselamatan dan kasut sukan keselamatan", zh: "安全鞋和运动款安全鞋" } },
  { name: "Safex", note: { en: "Kitchen and hospitality footwear", ms: "Kasut dapur dan hospitaliti", zh: "厨房与餐饮鞋" } },
  { name: "MSA", note: { en: "Safety helmets", ms: "Topi keselamatan", zh: "安全帽" } },
  { name: "Proguard", note: { en: "Safety helmets", ms: "Topi keselamatan", zh: "安全帽" } },
  { name: "Big Truck", note: { en: "Safety boots", ms: "But keselamatan", zh: "安全靴" }, comingSoon: true },
];

export function productsByBrand(name: string) {
  return products.filter((p) => p.brand === name);
}

export function getProduct(slug: string) {
  return products.find((p) => p.slug === slug);
}

export function getCategory(id: CategoryId) {
  return categories.find((c) => c.id === id)!;
}

export function isCategoryId(value: string | null | undefined): value is CategoryId {
  return !!value && categories.some((c) => c.id === value);
}

export function productsInCategory(id: CategoryId) {
  return products.filter((p) => p.category === id);
}

export const featuredProducts = products.filter((p) => p.featured);

/** Two neighbours from the same brand and section, then featured gear from other sections. */
export function relatedProducts(product: Product, limit = 4) {
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
