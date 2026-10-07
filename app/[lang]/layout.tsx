import type { Metadata, Viewport } from "next";
import { Noto_Sans_SC, Poppins } from "next/font/google";
import localFont from "next/font/local";
import { SiteFooter } from "@/components/site-footer";
import { WhatsAppFloat } from "@/components/whatsapp-float";
import { htmlLang, locales } from "@/lib/i18n/config";
import { openGraphFor } from "@/lib/i18n/open-graph";
import { getDictionary, getLocale } from "@/lib/i18n/server";
import { siteUrl } from "@/lib/site";
import "../globals.css";

// Primary display face from the brand guideline (licensed for web use, per the client).
const moderniz = localFont({
  src: "../fonts/Moderniz.otf",
  variable: "--font-moderniz",
  weight: "400",
  display: "swap",
});

// Secondary face from the guideline: body copy and interface.
const poppins = Poppins({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
  display: "swap",
});

// Chinese glyphs. Split by unicode-range, so slices only download where Chinese text appears.
const notoSansSC = Noto_Sans_SC({
  subsets: ["latin"],
  variable: "--font-cjk",
  display: "swap",
  preload: false,
});

export const dynamicParams = false;

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export const viewport: Viewport = {
  themeColor: "#000000",
};

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const dict = await getDictionary(locale);
  return {
    metadataBase: new URL(siteUrl),
    title: { default: dict.meta.title, template: `%s | Kainos Dagang` },
    description: dict.meta.description,
    openGraph: openGraphFor(locale, dict.meta.title, dict.meta.description),
  };
}

export default async function RootLayout({ children }: LayoutProps<"/[lang]">) {
  const locale = await getLocale();
  const dict = await getDictionary(locale);

  return (
    <html
      lang={htmlLang[locale]}
      className={`${moderniz.variable} ${poppins.variable} ${notoSansSC.variable}`}
    >
      <body className="min-h-dvh">
        <a
          href="#main"
          className="sr-only z-[60] bg-orange px-4 py-3 font-semibold text-ink focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
        >
          {dict.nav.skip}
        </a>
        {children}
        <SiteFooter dict={dict} locale={locale} />
        <WhatsAppFloat locale={locale} label={dict.whatsapp.float} />
      </body>
    </html>
  );
}
