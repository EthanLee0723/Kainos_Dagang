import type { Metadata } from "next";
import type { ReactNode } from "react";
import { getAdminDict } from "@/lib/admin/i18n";
import { fontVariables } from "../fonts";
import "../globals.css";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getAdminDict();
  return {
    title: { default: t.meta.title, template: `%s · ${t.meta.title}` },
    robots: { index: false, follow: false },
  };
}

/** The admin's own root layout: no site header, footer or WhatsApp button. */
export default async function AdminRootLayout({ children }: { children: ReactNode }) {
  const { lang } = await getAdminDict();
  return (
    <html lang={lang === "zh" ? "zh-Hans" : "en"} data-scroll-behavior="smooth" className={fontVariables}>
      <body className="min-h-dvh bg-floor text-ink">{children}</body>
    </html>
  );
}
