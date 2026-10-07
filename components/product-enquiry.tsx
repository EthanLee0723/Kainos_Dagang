"use client";

import { Minus, Phone, Plus } from "lucide-react";
import { useId, useState } from "react";
import type { Locale } from "@/lib/i18n/config";
import { format } from "@/lib/i18n/format";
import { company } from "@/lib/site";
import { ProductWhatsAppLink } from "./product-whatsapp-link";
import { button } from "./ui";
import { WhatsAppIcon } from "./whatsapp-icon";

type Labels = {
  chooseSize: string;
  colours: string;
  quantity: string;
  decrease: string;
  increase: string;
  enquire: string;
  enquireNote: string;
  call: string;
};

type Props = {
  locale: Locale;
  name: string;
  code: string;
  slug: string;
  sizes?: { label: string; values: string[]; prefix: string };
  colours?: string[];
  labels: Labels;
};

/** Optional size, colour and quantity, all carried into the pre-filled WhatsApp message. */
export function ProductEnquiry({ locale, name, code, slug, sizes, colours, labels }: Props) {
  const [size, setSize] = useState<string>();
  const [colour, setColour] = useState<string>();
  const [quantity, setQuantity] = useState(1);
  const qtyId = useId();

  const chip = (active: boolean) =>
    `inline-flex h-11 min-w-12 items-center justify-center rounded-full border px-4 text-sm font-semibold tabular transition-[background-color,border-color,color] duration-150 ${
      active ? "border-ink bg-ink text-paper" : "border-line bg-paper text-ink hover:border-ink"
    }`;

  return (
    <div className="space-y-7">
      {sizes && (
        <fieldset>
          <legend className="text-sm font-semibold">
            {labels.chooseSize}
            <span className="font-normal text-muted"> · {sizes.label}</span>
          </legend>
          <div className="mt-3 flex flex-wrap gap-2">
            {sizes.values.map((value) => (
              <button
                key={value}
                type="button"
                aria-pressed={size === value}
                onClick={() => setSize(size === value ? undefined : value)}
                className={chip(size === value)}
              >
                {value}
              </button>
            ))}
          </div>
        </fieldset>
      )}

      {colours && colours.length > 0 && (
        <fieldset>
          <legend className="text-sm font-semibold">{labels.colours}</legend>
          <div className="mt-3 flex flex-wrap gap-2">
            {colours.map((value) => (
              <button
                key={value}
                type="button"
                aria-pressed={colour === value}
                onClick={() => setColour(colour === value ? undefined : value)}
                className={chip(colour === value)}
              >
                {value}
              </button>
            ))}
          </div>
        </fieldset>
      )}

      <div>
        <label htmlFor={qtyId} className="block text-sm font-semibold">
          {labels.quantity}
        </label>
        <div className="mt-3 inline-flex items-center rounded-full border border-line bg-paper p-1">
          <button
            type="button"
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            disabled={quantity <= 1}
            className="inline-flex size-11 items-center justify-center rounded-full transition-colors hover:bg-floor disabled:text-ink/30 disabled:hover:bg-transparent"
          >
            <Minus className="size-4" aria-hidden />
            <span className="sr-only">{labels.decrease}</span>
          </button>
          <input
            id={qtyId}
            type="number"
            inputMode="numeric"
            min={1}
            max={9999}
            value={quantity}
            onChange={(e) => {
              const next = Number.parseInt(e.target.value, 10);
              setQuantity(Number.isFinite(next) ? Math.min(9999, Math.max(1, next)) : 1);
            }}
            className="tabular h-11 w-16 [appearance:textfield] bg-transparent text-center text-base font-semibold focus-visible:outline-offset-0 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
          />
          <button
            type="button"
            onClick={() => setQuantity((q) => Math.min(9999, q + 1))}
            className="inline-flex size-11 items-center justify-center rounded-full transition-colors hover:bg-floor"
          >
            <Plus className="size-4" aria-hidden />
            <span className="sr-only">{labels.increase}</span>
          </button>
        </div>
      </div>

      <div>
        <ProductWhatsAppLink
          locale={locale}
          name={name}
          code={code}
          slug={slug}
          size={size ? `${sizes?.prefix ?? ""}${size}` : undefined}
          colour={colour}
          quantity={quantity}
          className={`${button.whatsapp} h-14 w-full text-base sm:w-auto sm:px-8`}
        >
          <WhatsAppIcon className="size-6" />
          {labels.enquire}
        </ProductWhatsAppLink>
        <p className="mt-3 text-sm text-muted">{labels.enquireNote}</p>
        <a
          href={`tel:${company.phoneE164}`}
          className="mt-4 inline-flex h-11 items-center gap-2 text-sm font-semibold underline decoration-line decoration-2 underline-offset-[6px] transition-colors hover:decoration-ink"
        >
          <Phone className="size-4" aria-hidden />
          <span className="tabular">{format(labels.call, { phone: company.phoneDisplay })}</span>
        </a>
      </div>
    </div>
  );
}
