"use client";

import { Pencil, Plus } from "lucide-react";
import { useState, useTransition } from "react";
import { Pictogram } from "@/components/pictogram";
import { deleteListItem, reorderList, saveListItem } from "@/lib/admin/actions/lists";
import type { AdminDictionary } from "@/lib/admin/dictionaries/en";
import { type FieldErrors, fill, plural, tr } from "@/lib/admin/format";
import type { ListKind } from "@/lib/admin/lists";
import type { Pictogram as PictogramKey } from "@/lib/products";
import type { Localized } from "@/lib/site";
import { ConfirmDelete, PictogramPicker, SaveStatus } from "./controls";
import { emptyLocalized, errorFor, Field, fieldMessage, LocalizedField } from "./fields";
import { SortableList } from "./sortable";
import { adminButton, card, input } from "./ui";

/** One row's editable values; which keys exist depends on the list. */
export type ListValues = {
  id?: string;
  name?: Localized | string;
  blurb?: Localized;
  note?: Localized;
  label?: Localized;
  values?: string;
  pictogram?: PictogramKey;
  comingSoon?: boolean;
};

export type ListItem = { id: string; values: ListValues; usage: number };

type Status = { tone: "ok" | "error"; text: string } | undefined;

function blank(kind: ListKind): ListValues {
  switch (kind) {
    case "categories":
      return { id: "", name: emptyLocalized(), blurb: emptyLocalized(), pictogram: "shoe" };
    case "brands":
      return { name: "", note: emptyLocalized(), comingSoon: false };
    case "sizes":
      return { label: emptyLocalized(), values: "" };
    default:
      return { name: emptyLocalized() };
  }
}

const localizedLine = (v: Localized) => [v.en, v.ms, v.zh].filter(Boolean).join(" · ");

/** The row summary: the item's name plus whatever helps tell it apart. */
function summary(kind: ListKind, v: ListValues) {
  switch (kind) {
    case "categories":
      return { title: (v.name as Localized).en, detail: `${localizedLine(v.name as Localized)} · ?category=${v.id}` };
    case "brands":
      return { title: v.name as string, detail: localizedLine(v.note!) };
    case "sizes":
      return { title: v.label!.en, detail: v.values ?? "" };
    default:
      return { title: (v.name as Localized).en, detail: localizedLine(v.name as Localized) };
  }
}

/**
 * Edit one of the simple catalogue lists: add, edit inline, delete (with the
 * number of products affected) and drag into order.
 */
export function ListEditor({ kind, items: initial, t }: { kind: ListKind; items: ListItem[]; t: AdminDictionary }) {
  const [items, setItems] = useState(initial);
  const [editing, setEditing] = useState<string | null>(null); // item id, "new", or null
  const [status, setStatus] = useState<Status>();
  const [, startTransition] = useTransition();
  const l = t.lists[kind === "suitable-for" ? "suitableFor" : kind];

  // Fresh rows arrive from the server after every save: take them over.
  const [serverItems, setServerItems] = useState(initial);
  if (serverItems !== initial) {
    setServerItems(initial);
    setItems(initial);
  }

  const reorder = (next: ListItem[]) => {
    setItems(next);
    startTransition(async () => {
      const result = await reorderList(kind, next.map((i) => i.id));
      setStatus(result.ok ? { tone: "ok", text: t.common.orderSaved } : { tone: "error", text: t.common.error });
    });
  };

  const onSaved = () => {
    setEditing(null);
    setStatus({ tone: "ok", text: t.common.saved });
  };

  return (
    <div className="max-w-3xl">
      <div className="mb-4 flex flex-wrap items-center gap-4">
        {editing !== "new" && (
          <button
            type="button"
            onClick={() => {
              setEditing("new");
              setStatus(undefined);
            }}
            className={adminButton.primary}
          >
            <Plus className="size-4" aria-hidden />
            {l.add}
          </button>
        )}
        <SaveStatus status={status} />
      </div>

      {editing === "new" && (
        <div className={`${card} mb-4 p-5 sm:p-6`}>
          <ItemForm kind={kind} initial={blank(kind)} t={t} onDone={onSaved} onCancel={() => setEditing(null)} />
        </div>
      )}

      {items.length === 0 ? (
        <p className="text-muted">{t.common.noItems}</p>
      ) : (
        <SortableList
          items={items}
          onReorder={reorder}
          labels={t.common}
          className={`${card} divide-y divide-line`}
          renderItem={(item, _, { handle, arrows }) => {
            const s = summary(kind, item.values);
            const open = editing === item.id;
            return (
              <div className="bg-paper">
                <div className="flex items-center gap-1 p-2 pr-3">
                  {handle}
                  {kind === "categories" && item.values.pictogram && (
                    <span className="mr-1 hidden w-10 shrink-0 [--pict-bg:var(--color-paper)] sm:block">
                      <Pictogram name={item.values.pictogram} className="h-auto w-10 text-ink" />
                    </span>
                  )}
                  <div className="min-w-0 flex-1 px-1">
                    <p className="font-semibold">{s.title}</p>
                    <p className="truncate text-sm text-muted">{s.detail}</p>
                  </div>
                  <span className="tabular hidden shrink-0 text-sm text-muted sm:block">{plural(t.common.usedOn, item.usage)}</span>
                  <button
                    type="button"
                    aria-expanded={open}
                    onClick={() => {
                      setEditing(open ? null : item.id);
                      setStatus(undefined);
                    }}
                    className={adminButton.quiet}
                  >
                    <Pencil className="size-4" aria-hidden />
                    <span className="sr-only sm:not-sr-only">{t.common.edit}</span>
                  </button>
                  {arrows}
                </div>
                {open && (
                  <div className="border-t border-line bg-floor/40 p-5 sm:p-6">
                    <ItemForm
                      kind={kind}
                      initial={item.values}
                      existing={item}
                      t={t}
                      onDone={onSaved}
                      onCancel={() => setEditing(null)}
                    />
                  </div>
                )}
              </div>
            );
          }}
        />
      )}
    </div>
  );
}

function ItemForm({
  kind,
  initial,
  existing,
  t,
  onDone,
  onCancel,
}: {
  kind: ListKind;
  initial: ListValues;
  existing?: ListItem;
  t: AdminDictionary;
  onDone: () => void;
  onCancel: () => void;
}) {
  const [v, setV] = useState(initial);
  const [errors, setErrors] = useState<FieldErrors>();
  const [message, setMessage] = useState<string>();
  const [pending, startTransition] = useTransition();
  const [deleting, startDelete] = useTransition();
  const set = (patch: Partial<ListValues>) => setV({ ...v, ...patch });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    startTransition(async () => {
      const result = await saveListItem(kind, existing?.id ?? null, v);
      if (result.ok) onDone();
      else {
        setErrors(result.errors);
        setMessage(result.message ? tr(t, result.message) : t.common.fixErrors);
      }
    });
  };

  const remove = () =>
    startDelete(async () => {
      const result = await deleteListItem(kind, existing!.id);
      if (result.ok) onDone();
      else setMessage(result.message ? tr(t, result.message) : t.common.error);
    });

  const name = existing ? summary(kind, existing.values).title : "";
  const question = existing?.usage
    ? fill(t.common.confirmDeleteUsed, { name, count: existing.usage })
    : fill(t.common.confirmDelete, { name });

  return (
    <form onSubmit={submit} noValidate className="space-y-5">
      {kind === "categories" && (
        <>
          {!existing && (
            <Field label={t.lists.categories.id} hint={t.lists.categories.idHint} optional={t.common.optional} error={fieldMessage(t, errors, "id")}>
              {(p) => (
                <input
                  id={p.id}
                  aria-describedby={p.describedBy}
                  aria-invalid={p.invalid}
                  value={v.id ?? ""}
                  onChange={(e) => set({ id: e.target.value.toLowerCase() })}
                  placeholder="safety-gloves"
                  className={`${input} max-w-xs font-mono text-sm`}
                />
              )}
            </Field>
          )}
          <LocalizedField label={t.lists.categories.name} value={v.name as Localized} onChange={(name) => set({ name })} invalid={!!errorFor(errors, "name")} t={t} />
          <LocalizedField label={t.lists.categories.blurb} value={v.blurb!} onChange={(blurb) => set({ blurb })} invalid={!!errorFor(errors, "blurb")} multiline rows={2} t={t} />
          <PictogramPicker label={t.lists.categories.pictogram} value={v.pictogram!} onChange={(pictogram) => set({ pictogram })} />
        </>
      )}

      {kind === "brands" && (
        <>
          <Field label={t.lists.brands.name} error={fieldMessage(t, errors, "name")}>
            {(p) => (
              <input id={p.id} aria-describedby={p.describedBy} aria-invalid={p.invalid} value={v.name as string} onChange={(e) => set({ name: e.target.value })} className={`${input} max-w-sm`} />
            )}
          </Field>
          <LocalizedField label={t.lists.brands.note} value={v.note!} onChange={(note) => set({ note })} invalid={!!errorFor(errors, "note")} t={t} />
          <label className="flex min-h-11 items-center gap-3 text-sm font-medium">
            <input type="checkbox" checked={!!v.comingSoon} onChange={(e) => set({ comingSoon: e.target.checked })} className="size-5 accent-ink" />
            {t.lists.brands.comingSoon}
          </label>
        </>
      )}

      {kind === "sizes" && (
        <>
          <LocalizedField label={t.lists.sizes.label} hint={t.lists.sizes.labelHint} value={v.label!} onChange={(label) => set({ label })} invalid={!!errorFor(errors, "label")} t={t} />
          <Field label={t.lists.sizes.values} hint={t.lists.sizes.valuesHint} error={fieldMessage(t, errors, "values")}>
            {(p) => (
              <input id={p.id} aria-describedby={p.describedBy} aria-invalid={p.invalid} value={v.values ?? ""} onChange={(e) => set({ values: e.target.value })} className={`${input} tabular`} />
            )}
          </Field>
        </>
      )}

      {(kind === "colours" || kind === "suitable-for" || kind === "tags") && (
        <LocalizedField
          label={t.lists[kind === "suitable-for" ? "suitableFor" : kind].name}
          value={v.name as Localized}
          onChange={(name) => set({ name })}
          invalid={!!errorFor(errors, "name")}
          t={t}
        />
      )}

      {message && (
        <p role="alert" className="text-sm font-medium text-[#c23a00]">
          {message}
        </p>
      )}
      <div className="flex flex-wrap items-center gap-2">
        <button type="submit" disabled={pending} className={adminButton.primary}>
          {pending ? t.common.saving : t.common.save}
        </button>
        <button type="button" onClick={onCancel} className={adminButton.secondary}>
          {t.common.cancel}
        </button>
        {existing && (
          <div className="ml-auto">
            <ConfirmDelete question={question} labels={t.common} onConfirm={remove} pending={deleting} />
          </div>
        )}
      </div>
    </form>
  );
}
