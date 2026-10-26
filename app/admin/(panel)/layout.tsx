import { ExternalLink, LogOut } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";
import { LogoMark } from "@/components/brand/logo";
import { AdminNav } from "@/components/admin/admin-nav";
import { AdminLangSwitch } from "@/components/admin/lang-switch";
import { logout } from "@/lib/admin/actions/auth";
import { getAdminDict } from "@/lib/admin/i18n";
import { requireAdmin } from "@/lib/admin/session";

export default async function AdminPanelLayout({ children }: { children: ReactNode }) {
  await requireAdmin();
  const { lang, t } = await getAdminDict();
  const n = t.nav;
  const items = [
    { href: "/admin", label: n.dashboard },
    { href: "/admin/products", label: n.products },
    { href: "/admin/categories", label: n.categories },
    { href: "/admin/brands", label: n.brands },
    { href: "/admin/colours", label: n.colours },
    { href: "/admin/sizes", label: n.sizes },
    { href: "/admin/suitable-for", label: n.suitableFor },
    { href: "/admin/tags", label: n.tags },
    { href: "/admin/branches", label: n.branches },
    { href: "/admin/contact", label: n.contact },
  ];

  return (
    <div className="min-h-dvh">
      <header className="bg-ink text-paper">
        <div className="mx-auto flex h-16 max-w-7xl items-center gap-3 px-4 sm:px-6">
          <Link href="/admin" className="flex items-center gap-2.5">
            <LogoMark label={null} className="h-8 w-auto text-orange" />
            <span className="hidden font-display text-[0.95rem] uppercase sm:inline">{t.meta.title}</span>
            <span className="sr-only sm:hidden">{t.meta.title}</span>
          </Link>
          <div className="ml-auto flex items-center gap-1">
            <AdminLangSwitch lang={lang} t={t} />
            <a
              href="/en"
              target="_blank"
              rel="noopener"
              className="hidden h-11 items-center gap-1.5 px-2.5 text-sm font-medium text-paper/75 transition-colors hover:text-paper sm:inline-flex"
            >
              {n.viewSite}
              <ExternalLink className="size-4" aria-hidden />
            </a>
            <form action={logout}>
              <button
                type="submit"
                className="inline-flex h-11 items-center gap-1.5 px-2.5 text-sm font-medium text-paper/75 transition-colors hover:text-paper"
              >
                <LogOut className="size-4" aria-hidden />
                <span className="hidden sm:inline">{n.logout}</span>
                <span className="sr-only sm:hidden">{n.logout}</span>
              </button>
            </form>
          </div>
        </div>
        <AdminNav label={n.label} items={items} />
      </header>
      <main className="mx-auto max-w-7xl px-4 pt-8 pb-24 sm:px-6">{children}</main>
    </div>
  );
}
