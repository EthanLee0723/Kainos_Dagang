"use client";

import type { ReactNode } from "react";
import type { Locale } from "@/lib/i18n/config";
import { productEnquiryUrl } from "@/lib/whatsapp";
import { useOrigin } from "./use-origin";

type Props = {
  locale: Locale;
  name: string;
  code: string;
  slug: string;
  size?: string;
  colour?: string;
  quantity?: number;
  className?: string;
  label?: string;
  children: ReactNode;
};

/** A WhatsApp link pre-filled with the product name, code, link, size, colour and quantity. */
export function ProductWhatsAppLink({
  locale,
  name,
  code,
  slug,
  size,
  colour,
  quantity,
  className,
  label,
  children,
}: Props) {
  const origin = useOrigin();
  const href = productEnquiryUrl(locale, {
    name,
    code,
    size,
    colour,
    quantity,
    url: origin ? `${origin}/${locale}/products/${slug}` : undefined,
  });
  return (
    <a href={href} target="_blank" rel="noopener" aria-label={label} className={className}>
      {children}
    </a>
  );
}
