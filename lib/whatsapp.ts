import type { Locale } from "./i18n/config";
import { company } from "./site";

export function whatsappUrl(message: string) {
  return `https://wa.me/${company.whatsappNumber}?text=${encodeURIComponent(message)}`;
}

const generalMessage: Record<Locale, string> = {
  en: "Hi Kainos Dagang, I'd like to ask about your safety products.",
  ms: "Hai Kainos Dagang, saya ingin bertanya tentang produk keselamatan anda.",
  zh: "您好 Kainos Dagang，我想咨询你们的安全用品。",
};

const quoteMessage: Record<Locale, string> = {
  en: "Hi Kainos Dagang, I'd like a quotation for a bulk order of safety gear for my company.",
  ms: "Hai Kainos Dagang, saya ingin mendapatkan sebut harga untuk tempahan pukal peralatan keselamatan bagi syarikat saya.",
  zh: "您好 Kainos Dagang，我想为公司批量采购安全用品，请提供报价。",
};

export function generalEnquiryUrl(locale: Locale) {
  return whatsappUrl(generalMessage[locale]);
}

export function quoteEnquiryUrl(locale: Locale) {
  return whatsappUrl(quoteMessage[locale]);
}

const productCopy: Record<
  Locale,
  { intro: string; code: string; size: string; colour: string; qty: string; ask: string }
> = {
  en: {
    intro: "Hi Kainos Dagang, I'm interested in this product:",
    code: "Code",
    size: "Size",
    colour: "Colour",
    qty: "Quantity",
    ask: "Is it available?",
  },
  ms: {
    intro: "Hai Kainos Dagang, saya berminat dengan produk ini:",
    code: "Kod",
    size: "Saiz",
    colour: "Warna",
    qty: "Kuantiti",
    ask: "Adakah stok tersedia?",
  },
  zh: {
    intro: "您好 Kainos Dagang，我对这款产品感兴趣：",
    code: "编号",
    size: "尺码",
    colour: "颜色",
    qty: "数量",
    ask: "请问有现货吗？",
  },
};

export type ProductEnquiry = {
  name: string;
  code: string;
  /** Absolute product page URL, so the shop can see exactly what was asked about. */
  url?: string;
  size?: string;
  colour?: string;
  quantity?: number;
};

export function productMessage(locale: Locale, enquiry: ProductEnquiry) {
  const t = productCopy[locale];
  const sep = locale === "zh" ? "：" : ": ";
  const lines = [t.intro, "", `*${enquiry.name}*`, `${t.code}${sep}${enquiry.code}`];
  if (enquiry.size) lines.push(`${t.size}${sep}${enquiry.size}`);
  if (enquiry.colour) lines.push(`${t.colour}${sep}${enquiry.colour}`);
  if (enquiry.quantity && enquiry.quantity > 1) lines.push(`${t.qty}${sep}${enquiry.quantity}`);
  if (enquiry.url) lines.push("", enquiry.url);
  lines.push("", t.ask);
  return lines.join("\n");
}

export function productEnquiryUrl(locale: Locale, enquiry: ProductEnquiry) {
  return whatsappUrl(productMessage(locale, enquiry));
}
