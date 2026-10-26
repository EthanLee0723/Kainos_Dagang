import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ListEditor } from "@/components/admin/list-editor";
import { PageHeader } from "@/components/admin/page-header";
import { loadList } from "@/lib/admin/data";
import { getAdminDict } from "@/lib/admin/i18n";
import { type ListKind, listKinds } from "@/lib/admin/lists";

/* Categories, brands, colours, sizes, "Suitable for" and tags: one editor, one page. */

const isListKind = (value: string): value is ListKind => (listKinds as readonly string[]).includes(value);
const dictKey = (kind: ListKind) => (kind === "suitable-for" ? "suitableFor" : kind);

export async function generateMetadata({ params }: { params: Promise<{ list: string }> }): Promise<Metadata> {
  const { list } = await params;
  if (!isListKind(list)) return {};
  const { t } = await getAdminDict();
  return { title: t.lists[dictKey(list)].title };
}

export default async function ListPage({ params }: { params: Promise<{ list: string }> }) {
  const { list } = await params;
  if (!isListKind(list)) notFound();
  const [{ t }, items] = await Promise.all([getAdminDict(), loadList(list)]);
  const copy = t.lists[dictKey(list)];

  return (
    <>
      <PageHeader title={copy.title} intro={copy.intro} />
      <ListEditor kind={list} items={items} t={t} />
    </>
  );
}
