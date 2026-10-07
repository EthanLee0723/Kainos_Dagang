import { MapPin, Navigation, Phone } from "lucide-react";
import { LogoMark } from "@/components/brand/logo";
import { OpeningHoursPlate } from "@/components/opening-hours";
import { button, container } from "@/components/ui";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionaries/en";
import { hoursRows } from "@/lib/hours";
import { branches, googleMapsUrl, pick, wazeUrl } from "@/lib/site";

/** Three shopfronts, each headed by its own small signboard. */
export function Branches({ dict, locale }: { dict: Dictionary; locale: Locale }) {
  return (
    <section id="branches" aria-labelledby="branches-title" className="scroll-mt-4 bg-floor">
      <div className={`${container} py-16 sm:py-20 lg:py-24`}>
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between lg:gap-12">
          <h2 id="branches-title" className="font-display text-[2.2rem] leading-[0.95] uppercase sm:text-[3rem]">
            {dict.branchesSection.title}
          </h2>
          <p className="max-w-md leading-relaxed text-muted">{dict.branchesSection.intro}</p>
        </div>

        <ul className="mt-10 grid gap-5 lg:mt-14 lg:grid-cols-3">
          {branches.map((branch) => (
            <li key={branch.id} className="flex flex-col border border-line bg-paper">
              <div className="flex items-center gap-3 bg-ink px-5 py-5 text-paper sm:px-6">
                <LogoMark label={null} className="h-8 w-auto shrink-0 text-orange" />
                <h3 className="font-display text-[1.2rem] leading-none uppercase sm:text-[1.35rem]">{branch.name}</h3>
              </div>
              <div aria-hidden className="hazard h-2 bg-orange [--hazard-h:16px]" />
              <div className="flex flex-1 flex-col p-5 sm:p-6">
                <p className="text-sm font-medium text-muted">{pick(branch.area, locale)}</p>
                <address className="mt-3 flex gap-3 leading-relaxed not-italic">
                  <MapPin className="mt-1 size-[1.1rem] shrink-0 text-muted" aria-hidden />
                  <span>
                    {branch.addressLines.map((line) => (
                      <span key={line} className="block">
                        {line}
                      </span>
                    ))}
                  </span>
                </address>
                <a
                  href={`tel:${branch.phoneE164}`}
                  className="tabular mt-4 inline-flex items-center gap-3 self-start py-1 text-lg font-semibold transition-colors hover:underline"
                >
                  <Phone className="size-[1.1rem] text-muted" aria-hidden />
                  {branch.phoneDisplay}
                </a>
                <div className="mt-auto flex flex-wrap gap-2 pt-6">
                  <a href={googleMapsUrl(branch)} target="_blank" rel="noopener" className={button.outline}>
                    <MapPin className="size-4" aria-hidden />
                    {dict.branchesSection.directions}
                  </a>
                  <a href={wazeUrl(branch)} target="_blank" rel="noopener" className={button.outline}>
                    <Navigation className="size-4" aria-hidden />
                    {dict.branchesSection.waze}
                  </a>
                  <a href={`tel:${branch.phoneE164}`} className={button.outline}>
                    <Phone className="size-4" aria-hidden />
                    {dict.branchesSection.call}
                  </a>
                </div>
              </div>
            </li>
          ))}
        </ul>
        <OpeningHoursPlate
          rows={hoursRows(locale, dict.hours)}
          title={dict.hours.title}
          scope={dict.hours.scope}
          todayLabel={dict.hours.today}
        />
      </div>
    </section>
  );
}
