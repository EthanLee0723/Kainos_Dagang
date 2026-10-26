import type { WeeklyHours } from "./hours";
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
  /**
   * Official profiles (Google Business Profile, Facebook, Instagram, TikTok...).
   * Each URL added here is linked from the Organization structured data, which
   * helps Google tie those profiles to this site. Add only profiles the client owns.
   */
  sameAs: [] as string[],
};

export type Branch = {
  id: string;
  name: string;
  area: Localized;
  phoneDisplay: string;
  phoneE164: string;
  addressLines: string[];
  /** The same address split into schema.org PostalAddress parts, for structured data. */
  postal: { street: string; locality: string; postalCode: string };
  /** The branch's own Google Maps listing. Without one, Maps searches for the address. */
  mapsUrl?: string;
  hours: WeeklyHours;
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

export function branchAddress(branch: Branch) {
  return branch.addressLines.join(" ").replace(/,\s*$/, "");
}

export function googleMapsUrl(branch: Branch) {
  if (branch.mapsUrl) return branch.mapsUrl;
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
