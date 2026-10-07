import { button, container } from "@/components/ui";
import { WhatsAppIcon } from "@/components/whatsapp-icon";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionaries/en";
import { brands } from "@/lib/products";
import { generalEnquiryUrl } from "@/lib/whatsapp";

/** Brands stocked, set like the brand plate on the shop's metal signboard. Never "authorised". */
export function Brands({ dict, locale }: { dict: Dictionary; locale: Locale }) {
  const notes: Record<string, string> = { "Black Hammer": dict.brands.blackHammer };
  return (
    <section id="brands" aria-labelledby="brands-title" className="scroll-mt-4 bg-floor">
      <div className={`${container} grid gap-10 py-16 sm:py-20 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.6fr)] lg:gap-16 lg:py-24`}>
        <div>
          <h2 id="brands-title" className="font-display text-[2rem] leading-[0.95] uppercase sm:text-[2.6rem]">
            {dict.brands.title}
          </h2>
          <p className="mt-5 max-w-[36ch] leading-relaxed text-muted">{dict.brands.body}</p>
        </div>

        <ul className="border-t border-ink">
          {brands.map((name) => (
            <li
              key={name}
              className="flex flex-col gap-2 border-b border-ink/15 py-6 sm:flex-row sm:items-baseline sm:justify-between sm:gap-8 lg:py-8"
            >
              <p className="font-display text-[1.9rem] leading-none uppercase sm:text-[2.6rem] lg:text-[3rem]">{name}</p>
              {notes[name] && <p className="text-muted sm:text-right">{notes[name]}</p>}
            </li>
          ))}
          <li className="flex flex-col gap-4 py-6 sm:flex-row sm:items-center sm:justify-between sm:gap-8 lg:py-8">
            <div>
              <p className="text-[1.05rem] font-semibold">{dict.brands.more}</p>
              <p className="mt-1 max-w-[42ch] text-sm leading-relaxed text-muted">{dict.brands.moreBody}</p>
            </div>
            <a
              href={generalEnquiryUrl(locale)}
              target="_blank"
              rel="noopener"
              className={`${button.outline} shrink-0 self-start sm:self-auto`}
            >
              <WhatsAppIcon className="size-4 text-[#128c4b]" />
              {dict.whatsapp.cta}
            </a>
          </li>
        </ul>
      </div>
    </section>
  );
}
