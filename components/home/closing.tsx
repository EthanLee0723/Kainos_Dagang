import { button, container } from "@/components/ui";
import { WhatsAppIcon } from "@/components/whatsapp-icon";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionaries/en";
import { generalEnquiryUrl } from "@/lib/whatsapp";

/** The brand's own closing line, from the guideline, in the visitor's language. */
export function Closing({ dict, locale }: { dict: Dictionary; locale: Locale }) {
  return (
    <section aria-labelledby="closing-title" className="bg-paper">
      <div className={`${container} py-20 sm:py-24 lg:py-32`}>
        <h2
          data-reveal
          id="closing-title"
          className="font-display max-w-[18ch] text-[2.3rem] leading-[0.98] uppercase sm:text-[3.6rem] lg:text-[5.25rem]"
        >
          {dict.closing.headline} <span className="text-orange">{dict.closing.headlineAccent}</span>
        </h2>
        <a href={generalEnquiryUrl(locale)} target="_blank" rel="noopener" data-reveal className={`${button.whatsapp} mt-10`}>
          <WhatsAppIcon className="size-5" />
          {dict.closing.cta}
        </a>
      </div>
    </section>
  );
}
