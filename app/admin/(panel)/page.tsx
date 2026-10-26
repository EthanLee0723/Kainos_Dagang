import { count, eq } from "drizzle-orm";
import type { PgTable } from "drizzle-orm/pg-core";
import { ArrowRight } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/admin/page-header";
import { fill } from "@/lib/admin/format";
import { getAdminDict } from "@/lib/admin/i18n";
import { db, schema } from "@/lib/db";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getAdminDict();
  return { title: t.dashboard.title };
}

export default async function DashboardPage() {
  const { t } = await getAdminDict();
  const s = schema;
  const total = async (table: PgTable) => (await db.select({ n: count() }).from(table))[0].n;
  const [products, hidden, categories, brands, colours, sizes, suitable, tags, branches] = await Promise.all([
    total(s.products),
    db.select({ n: count() }).from(s.products).where(eq(s.products.visible, false)).then((r) => r[0].n),
    total(s.categories),
    total(s.brands),
    total(s.colours),
    total(s.sizeCharts),
    total(s.suitableFor),
    total(s.tags),
    total(s.branches),
  ]);

  const cards = [
    {
      href: "/admin/products",
      label: t.nav.products,
      value: products,
      note: [fill(t.dashboard.onSite, { count: products - hidden }), hidden ? fill(t.dashboard.hidden, { count: hidden }) : ""]
        .filter(Boolean)
        .join(" · "),
    },
    { href: "/admin/categories", label: t.nav.categories, value: categories },
    { href: "/admin/brands", label: t.nav.brands, value: brands },
    { href: "/admin/colours", label: t.nav.colours, value: colours },
    { href: "/admin/sizes", label: t.nav.sizes, value: sizes },
    { href: "/admin/suitable-for", label: t.nav.suitableFor, value: suitable },
    { href: "/admin/tags", label: t.nav.tags, value: tags },
    { href: "/admin/branches", label: t.nav.branches, value: branches },
    { href: "/admin/contact", label: t.nav.contact },
  ];

  return (
    <>
      <PageHeader title={t.dashboard.title} intro={t.dashboard.intro} />
      <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((card) => (
          <li key={card.href}>
            <Link
              href={card.href}
              className="group flex h-full items-center justify-between gap-4 rounded-lg border border-line bg-paper p-5 transition-colors hover:border-ink"
            >
              <span>
                <span className="block text-[0.95rem] font-semibold">{card.label}</span>
                {card.note && <span className="mt-1 block text-sm text-muted">{card.note}</span>}
              </span>
              <span className="flex items-center gap-3">
                {card.value !== undefined && <span className="tabular font-display text-[1.6rem]">{card.value}</span>}
                <ArrowRight className="size-5 text-muted transition-transform duration-200 group-hover:translate-x-1 group-hover:text-ink" aria-hidden />
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
}
