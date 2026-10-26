import { asc } from "drizzle-orm";
import { Plus } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { BranchList } from "@/components/admin/branch-list";
import { PageHeader } from "@/components/admin/page-header";
import { adminButton } from "@/components/admin/ui";
import { getAdminDict } from "@/lib/admin/i18n";
import { db, schema } from "@/lib/db";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getAdminDict();
  return { title: t.branches.title };
}

export default async function BranchesPage() {
  const { lang, t } = await getAdminDict();
  const rows = await db.select().from(schema.branches).orderBy(asc(schema.branches.position));

  return (
    <>
      <PageHeader
        title={t.branches.title}
        intro={t.branches.intro}
        actions={
          <Link href="/admin/branches/new" className={adminButton.primary}>
            <Plus className="size-4" aria-hidden />
            {t.branches.add}
          </Link>
        }
      />
      <BranchList t={t} initial={rows.map((b) => ({ id: b.id, name: b.name, area: b.area[lang === "zh" ? "zh" : "en"], phone: b.phone }))} />
    </>
  );
}
