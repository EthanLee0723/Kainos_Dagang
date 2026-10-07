import type { Locale } from "./i18n/config";

export type Localized = Record<Locale, string>;

export function pick(value: Localized, locale: Locale) {
  return value[locale];
}

/** Company facts, from the letterhead and business card (brand guideline, Aug 2026). */
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
};

export type Branch = {
  id: string;
  name: string;
  area: Localized;
  phoneDisplay: string;
  phoneE164: string;
  addressLines: string[];
};

export const branches: Branch[] = [
  {
    id: "taman-equine",
    name: "Taman Equine",
    area: { en: "Seri Kembangan, Selangor", ms: "Seri Kembangan, Selangor", zh: "雪兰莪 · 沙登" },
    phoneDisplay: "017-665 8919",
    phoneE164: "+60176658919",
    addressLines: ["No. 6-1, Jalan Equine 10D,", "Taman Equine,", "43300 Seri Kembangan, Selangor"],
  },
  {
    id: "kota-damansara",
    name: "Kota Damansara",
    area: { en: "Petaling Jaya, Selangor", ms: "Petaling Jaya, Selangor", zh: "雪兰莪 · 哥打白沙罗" },
    phoneDisplay: "017-891 9550",
    phoneE164: "+60178919550",
    addressLines: ["No. 49-1, Jalan Cecawi 6/19A,", "47810 Kota Damansara,", "Selangor"],
  },
  {
    id: "klang",
    name: "Klang",
    area: { en: "Klang, Selangor", ms: "Klang, Selangor", zh: "雪兰莪 · 巴生" },
    phoneDisplay: "017-363 8919",
    phoneE164: "+60173638919",
    addressLines: ["No. 16A, Jalan Kampar 1/KU 1,", "Bukit Kuda Heights,", "41300 Klang, Selangor"],
  },
];

export function branchAddress(branch: Branch) {
  return branch.addressLines.join(" ").replace(/,\s*$/, "");
}

export function googleMapsUrl(branch: Branch) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    `Kainos Dagang, ${branchAddress(branch)}`,
  )}`;
}

export function wazeUrl(branch: Branch) {
  return `https://waze.com/ul?q=${encodeURIComponent(branchAddress(branch))}&navigate=yes`;
}

/** Absolute site origin for metadata. Set NEXT_PUBLIC_SITE_URL once the domain is live. */
export const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(
  /\/$/,
  "",
);
