import Link from "next/link";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionaries/en";
import { LogoLockup } from "./brand/logo";
import { NavRow } from "./site-nav";

/** Inner pages: a slim strip of the signboard, with the hazard seam beneath it. */
export function SiteHeader({ dict, locale }: { dict: Dictionary; locale: Locale }) {
  return (
    <header className="bg-ink text-paper">
      <div className="mx-auto max-w-[90rem] px-4 sm:px-6 lg:px-10">
        <NavRow
          dict={dict}
          locale={locale}
          brand={
            <Link href={`/${locale}`} className="-my-2 shrink-0 py-2" aria-label={`Kainos Dagang, ${dict.nav.home}`}>
              <LogoLockup label={null} className="h-8 w-auto sm:h-10" />
            </Link>
          }
        />
      </div>
      <div className="hazard h-2 bg-orange [--hazard-h:16px]" aria-hidden />
    </header>
  );
}
