import Link from "next/link";
import { Bootprint } from "@/components/brand/bootprint";
import { SiteHeader } from "@/components/site-header";
import { button, container } from "@/components/ui";
import { getDictionary, getLocale } from "@/lib/i18n/server";

export default async function NotFound() {
  const locale = await getLocale();
  const dict = await getDictionary(locale);
  return (
    <>
      <SiteHeader dict={dict} locale={locale} />
      <main id="main" className="relative overflow-hidden bg-paper">
        <div className={`${container} flex min-h-[60vh] flex-col items-start justify-center gap-6 py-20`}>
          <p className="font-display tabular text-[5rem] leading-none text-orange sm:text-[6rem]">404</p>
          <h1 className="font-display text-[2rem] leading-tight uppercase sm:text-[2.8rem]">{dict.notFound.title}</h1>
          <p className="max-w-[44ch] leading-relaxed text-muted">{dict.notFound.body}</p>
          <Link href={`/${locale}`} className={button.ink}>
            {dict.notFound.cta}
          </Link>
        </div>
        <Bootprint className="pointer-events-none absolute right-[8%] bottom-[-3rem] hidden h-72 w-auto rotate-[18deg] text-floor-2 md:block" />
      </main>
    </>
  );
}
