import { eq } from "drizzle-orm";
import { ChevronLeft } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BranchForm } from "@/components/admin/branch-form";
import { PageHeader } from "@/components/admin/page-header";
import type { BranchInput } from "@/lib/admin/actions/branches";
import { getAdminDict } from "@/lib/admin/i18n";
import { uuid } from "@/lib/admin/validation";
import { db, schema } from "@/lib/db";
import { hoursToDays } from "@/lib/hours";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { t } = await getAdminDict();
  return { title: (await params).id === "new" ? t.branches.newTitle : t.branches.editTitle };
}

const blank: BranchInput = {
  name: "",
  area: { en: "", ms: "", zh: "" },
  phone: "",
  addressLines: [],
  street: "",
  locality: "",
  postalCode: "",
  mapsUrl: "",
  days: hoursToDays([
    { days: [1, 2, 3, 4, 5, 6], opens: "10:00", closes: "19:00" },
    { days: [0], opens: "10:00", closes: "17:00" },
  ]),
};

export default async function BranchPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ saved?: string }>;
}) {
  const { id } = await params;
  const { saved } = await searchParams;
  const { t } = await getAdminDict();

  let initial = blank;
  if (id !== "new") {
    if (!uuid.safeParse(id).success) notFound();
    const [b] = await db.select().from(schema.branches).where(eq(schema.branches.id, id));
    if (!b) notFound();
    initial = {
      id: b.id,
      name: b.name,
      area: b.area,
      phone: b.phone,
      addressLines: b.addressLines,
      street: b.street,
      locality: b.locality,
      postalCode: b.postalCode,
      mapsUrl: b.mapsUrl ?? "",
      days: hoursToDays(b.hours),
    };
  }

  return (
    <>
      <Link href="/admin/branches" className="mb-4 -ml-2 inline-flex h-11 items-center gap-1 px-2 text-sm font-medium text-muted hover:text-ink">
        <ChevronLeft className="size-4" aria-hidden />
        {t.branches.title}
      </Link>
      <PageHeader title={id === "new" ? t.branches.newTitle : initial.name} />
      <BranchForm key={id} initial={initial} t={t} justCreated={saved === "1"} />
    </>
  );
}
