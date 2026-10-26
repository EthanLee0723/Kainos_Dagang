/*
 * The catalogue and site data as they were hard-coded before the admin existed
 * (lib/products.ts, lib/site.ts and the dictionaries' "uses" labels). Only the
 * seed reads this: the live site and the admin use the database.
 */
import type { WeeklyHours } from "../../../lib/hours";
import type { Locale } from "../../../lib/i18n/config";

export type Localized = Record<Locale, string>;

export type CategoryId = "safety-shoes" | "safety-boots" | "hospitality" | "helmets" | "hi-vis";

export type Pictogram =
  | "shoe" | "boot-mid" | "boot-high" | "gumboot" | "helmet" | "glove" | "goggles" | "glasses"
  | "earmuff" | "vest" | "sock" | "cone" | "net" | "tape" | "baton";

export type UseCase =
  | "construction" | "factory" | "warehouse" | "logistics" | "workshop"
  | "oil-gas" | "food" | "plantation" | "roadworks" | "hospitality";

export type Category = { id: CategoryId; name: Localized; blurb: Localized; pictogram: Pictogram };

export type Product = {
  slug: string;
  code: string;
  brand?: string;
  category: CategoryId;
  pictogram: Pictogram;
  image?: string;
  gallery?: string[];
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

export type Brand = { name: string; note: Localized; comingSoon?: boolean };

export type Branch = {
  id: string;
  name: string;
  area: Localized;
  phoneDisplay: string;
  phoneE164: string;
  addressLines: string[];
  postal: { street: string; locality: string; postalCode: string };
  mapsUrl?: string;
  hours: WeeklyHours;
};

export const categories: Category[] = [
  {
    id: "safety-shoes",
    pictogram: "shoe",
    name: { en: "Safety Shoes", ms: "Kasut Keselamatan", zh: "安全鞋" },
    blurb: {
      en: "Low-cut lace-ups, slip-ons and sporty safety trainers.",
      ms: "Kasut potongan rendah, sama ada bertali, tanpa tali atau gaya sukan.",
      zh: "低帮系带、一脚蹬和运动款安全鞋。",
    },
  },
  {
    id: "safety-boots",
    pictogram: "boot-high",
    name: { en: "Safety Boots", ms: "But Keselamatan", zh: "安全靴" },
    blurb: {
      en: "Mid and high-cut boots, laced, zipped or pull-on, plus waterproof rain boots.",
      ms: "But potongan sederhana dan tinggi, sama ada bertali, berzip atau jenis sarung, termasuk but hujan kalis air.",
      zh: "中帮、高帮安全靴，系带、拉链或套穿，以及防水雨靴。",
    },
  },
  {
    id: "hospitality",
    pictogram: "shoe",
    name: { en: "Kitchen & Hospitality", ms: "Dapur & Hospitaliti", zh: "厨房与餐饮鞋" },
    blurb: {
      en: "Slip-resistant clogs and kitchen shoes for wet, greasy floors.",
      ms: "Klog dan kasut dapur yang tidak licin di lantai basah dan berminyak.",
      zh: "防滑洞洞鞋和厨房鞋，适合湿滑油腻的地面。",
    },
  },
  {
    id: "helmets",
    pictogram: "helmet",
    name: { en: "Safety Helmets", ms: "Topi Keselamatan", zh: "安全帽" },
    blurb: {
      en: "Hard hats in site colours, with ratchet adjustment.",
      ms: "Topi keselamatan dalam pelbagai warna, dengan pelaras ratchet.",
      zh: "多种颜色可选，旋钮调节松紧。",
    },
  },
  {
    id: "hi-vis",
    pictogram: "vest",
    name: { en: "Safety Vests", ms: "Vest Keselamatan", zh: "反光背心" },
    blurb: {
      en: "Reflective vests so you are seen on site and on the road.",
      ms: "Vest reflektif supaya anda mudah dilihat di tapak kerja dan di jalan raya.",
      zh: "反光背心，在工地和路边作业时更醒目、更安全。",
    },
  },
];

export const brands: Brand[] = [
  { name: "Black Hammer", note: { en: "Safety shoes, boots, rain boots and kitchen clogs", ms: "Kasut, but, but hujan dan klog dapur keselamatan", zh: "安全鞋、安全靴、雨靴和厨房洞洞鞋" } },
  { name: "Kickers Safety", note: { en: "Leather safety boots and safety trainers", ms: "But keselamatan kulit dan kasut sukan keselamatan", zh: "真皮安全靴和安全运动鞋" } },
  { name: "Tanker Tec", note: { en: "Metal-free ESD safety footwear", ms: "Kasut keselamatan ESD bebas logam", zh: "无金属 ESD 安全鞋" } },
  { name: "Hammerland", note: { en: "Value safety shoes and boots", ms: "Kasut dan but keselamatan berpatutan", zh: "高性价比安全鞋和安全靴" } },
  { name: "To Tect", note: { en: "Safety shoes and sporty safety trainers", ms: "Kasut keselamatan dan kasut sukan keselamatan", zh: "安全鞋和运动款安全鞋" } },
  { name: "Safex", note: { en: "Kitchen and hospitality footwear", ms: "Kasut dapur dan hospitaliti", zh: "厨房与餐饮鞋" } },
  { name: "MSA", note: { en: "Safety helmets", ms: "Topi keselamatan", zh: "安全帽" } },
  { name: "Proguard", note: { en: "Safety helmets", ms: "Topi keselamatan", zh: "安全帽" } },
  { name: "Big Truck", note: { en: "Safety boots", ms: "But keselamatan", zh: "安全靴" }, comingSoon: true },
];

export const company = {
  name: "Kainos Dagang",
  legalName: "Kainos Dagang Sdn. Bhd.",
  registration: "202301009526 (1503447-K)",
  email: "samhong8919@gmail.com",
  /** Main line: every WhatsApp button on the site goes here. */
  phoneDisplay: "019-662 8919",
  phoneE164: "+60196628919",
  whatsappNumber: "60196628919",
  tagline: "Melindungi Setiap Langkah",
  /**
   * Official profiles (Google Business Profile, Facebook, Instagram, TikTok...).
   * Each URL added here is linked from the Organization structured data, which
   * helps Google tie those profiles to this site. Add only profiles the client owns.
   */
  sameAs: [] as string[],
};

/** Per-branch hours, from the client (2026-10-20). */
const tamanEquineHours: WeeklyHours = [
  { days: [1], opens: "09:00", closes: "18:00" },
  { days: [2, 3, 4, 5, 6], opens: "10:00", closes: "18:00" },
  { days: [0], opens: "11:00", closes: "17:00" },
];

const kotaDamansaraKlangHours: WeeklyHours = [
  { days: [1, 2, 3, 4, 5, 6], opens: "10:00", closes: "19:00" },
  { days: [0], opens: "10:00", closes: "17:00" },
];

export const branches: Branch[] = [
  {
    id: "taman-equine",
    name: "Taman Equine",
    area: { en: "Seri Kembangan, Selangor", ms: "Seri Kembangan, Selangor", zh: "雪兰莪 · 沙登" },
    phoneDisplay: "017-665 8919",
    phoneE164: "+60176658919",
    addressLines: ["No. 6-1, Jalan Equine 10D,", "Taman Equine,", "43300 Seri Kembangan, Selangor"],
    postal: { street: "No. 6-1, Jalan Equine 10D, Taman Equine", locality: "Seri Kembangan", postalCode: "43300" },
    hours: tamanEquineHours,
  },
  {
    id: "kota-damansara",
    name: "Kota Damansara",
    area: { en: "Petaling Jaya, Selangor", ms: "Petaling Jaya, Selangor", zh: "雪兰莪 · 哥打白沙罗" },
    phoneDisplay: "017-891 9550",
    phoneE164: "+60178919550",
    addressLines: ["49-1, Jalan Cecawi 6/19a,", "Kota Damansara,", "47810 Petaling Jaya, Selangor"],
    postal: { street: "49-1, Jalan Cecawi 6/19a, Kota Damansara", locality: "Petaling Jaya", postalCode: "47810" },
    hours: kotaDamansaraKlangHours,
  },
  {
    id: "klang",
    name: "Klang",
    area: { en: "Klang, Selangor", ms: "Klang, Selangor", zh: "雪兰莪 · 巴生" },
    phoneDisplay: "017-363 8919",
    phoneE164: "+60173638919",
    addressLines: ["No. 16A, Jalan Kampar 1/KU 1,", "Bukit Kuda Heights,", "41300 Klang, Selangor"],
    postal: { street: "No. 16A, Jalan Kampar 1/KU 1, Bukit Kuda Heights", locality: "Klang", postalCode: "41300" },
    mapsUrl: "https://maps.app.goo.gl/xHyNGSc4afB6z6TD9",
    hours: kotaDamansaraKlangHours,
  },
];

/** The "Suitable for" chip labels, from the dictionaries. */
export const uses: Record<UseCase, Localized> = {
  "construction": { en: "Construction", ms: "Pembinaan", zh: "建筑工地" },
  "factory": { en: "Factory", ms: "Kilang", zh: "工厂" },
  "warehouse": { en: "Warehouse", ms: "Gudang", zh: "仓库" },
  "logistics": { en: "Logistics", ms: "Logistik", zh: "物流" },
  "workshop": { en: "Workshop", ms: "Bengkel", zh: "车间" },
  "oil-gas": { en: "Oil & gas", ms: "Minyak & gas", zh: "石油与天然气" },
  "food": { en: "Food processing", ms: "Pemprosesan makanan", zh: "食品加工" },
  "plantation": { en: "Plantation", ms: "Ladang", zh: "园丘" },
  "roadworks": { en: "Roadworks", ms: "Kerja jalan raya", zh: "道路工程" },
  "hospitality": { en: "Kitchens & hospitality", ms: "Dapur & hospitaliti", zh: "厨房与餐饮业" },
};
