import type { WeeklyHours } from "./hours";
import type { Locale } from "./i18n/config";

export type Localized = Record<Locale, string>;

/** Text in the visitor's language, falling back to English if a translation is ever blank. */
export function pick(value: Localized, locale: Locale) {
  return value[locale] || value.en;
}

/** Fixed brand facts; everything else about the company is edited in /admin. */
export const COMPANY_NAME = "Kainos Dagang";
export const TAGLINE = "Melindungi Setiap Langkah";

export type Company = {
  name: string;
  legalName: string;
  registration: string;
  email: string;
  /** Main line: every WhatsApp button on the site goes here. */
  phoneDisplay: string;
  phoneE164: string;
  whatsappNumber: string;
  tagline: string;
  /**
   * Official profiles (Google Business Profile, Facebook, Instagram, TikTok...).
   * Each URL is linked from the Organization structured data, which helps
   * Google tie those profiles to this site. Only profiles the client owns.
   */
  sameAs: string[];
};

export type Branch = {
  /** Stable key for structured data ids ("taman-equine"). */
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

export type Site = { company: Company; branches: Branch[] };

/**
 * A Malaysian phone number as written on the site ("019-662 8919") in
 * international form ("+60196628919"). Numbers already starting with 60 or +
 * are kept as they are.
 */
export function phoneE164(display: string) {
  const digits = display.replace(/[^\d]/g, "");
  if (display.trim().startsWith("+")) return `+${digits}`;
  return `+${digits.startsWith("0") ? `6${digits}` : digits}`;
}

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
