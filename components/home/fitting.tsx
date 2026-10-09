import { Bootprint } from "@/components/brand/bootprint";
import { button, container } from "@/components/ui";
import { WhatsAppIcon } from "@/components/whatsapp-icon";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionaries/en";
import { generalEnquiryUrl, quoteEnquiryUrl } from "@/lib/whatsapp";

/**
 * "Setiap langkah": the fitting process told as three steps, each marked by a
 * pair of footprints that stamp in as the visitor scrolls (static when motion
 * is reduced or scroll timelines are unsupported).
 */
export function Fitting({ dict, locale }: { dict: Dictionary; locale: Locale }) {
  return (
    <section aria-labelledby="fitting-title" className="bg-paper">
      <div className={`${container} py-16 sm:py-20 lg:py-28`}>
        <div data-reveal className="grid gap-6 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)] lg:items-end lg:gap-16">
          <h2
            id="fitting-title"
            className="font-display max-w-[14ch] text-[2.2rem] leading-[0.95] uppercase sm:text-[3.2rem] lg:text-[4rem]"
          >
            {dict.fitting.title}
          </h2>
          <p className="max-w-[40ch] text-[1.08rem] leading-relaxed text-muted lg:pb-2">{dict.fitting.intro}</p>
        </div>

        <ol className="mt-14 grid gap-12 sm:mt-16 lg:grid-cols-3 lg:gap-10">
          {dict.fitting.steps.map((step, i) => (
            <li key={step.title} data-reveal className="relative">
              {/* Left foot on the upper track, right foot half a stride ahead below it: walking right. */}
              <div aria-hidden className="relative h-24 w-48 text-ink">
                <Bootprint left className="footstep absolute -top-7 left-[34px] h-[6.5rem] w-auto rotate-90" />
                <Bootprint
                  className="footstep absolute top-[22px] left-[106px] h-[6.5rem] w-auto rotate-90 [animation-range:entry_25%_entry_85%]"
                />
              </div>
              <h3 className="mt-6 text-xl font-semibold sm:text-[1.35rem]">{step.title}</h3>
              <p className="mt-3 max-w-[34ch] leading-relaxed text-muted">{step.body}</p>
              {i < dict.fitting.steps.length - 1 && (
                <span aria-hidden className="absolute top-10 right-0 left-56 hidden h-px bg-line lg:block" />
              )}
            </li>
          ))}
        </ol>

        <div className="mt-16 grid gap-4 lg:mt-24 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
          <div data-reveal className="on-orange flex flex-col justify-between gap-8 bg-orange p-6 text-ink sm:p-10">
            <div>
              <h3 className="font-display text-[1.6rem] leading-tight uppercase sm:text-[2.1rem]">
                {dict.fitting.bulkTitle}
              </h3>
              <p className="mt-4 max-w-[48ch] leading-relaxed text-ink/80">{dict.fitting.bulkBody}</p>
            </div>
            <a href={quoteEnquiryUrl(locale)} target="_blank" rel="noopener" className={`${button.ink} self-start`}>
              <WhatsAppIcon className="size-5 text-whatsapp" />
              {dict.whatsapp.quote}
            </a>
          </div>
          <div data-reveal className="flex flex-col justify-between gap-8 bg-ink p-6 text-paper sm:p-10">
            <div>
              <h3 className="text-[1.35rem] leading-snug font-semibold sm:text-2xl">{dict.fitting.consultTitle}</h3>
              <p className="mt-4 max-w-[40ch] leading-relaxed text-paper/70">{dict.fitting.consultBody}</p>
            </div>
            <a
              href={generalEnquiryUrl(locale)}
              target="_blank"
              rel="noopener"
              className={`${button.outlineOnInk} self-start`}
            >
              <WhatsAppIcon className="size-[1.1rem] text-whatsapp" />
              {dict.whatsapp.cta}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
