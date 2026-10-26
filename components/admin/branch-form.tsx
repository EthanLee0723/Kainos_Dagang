"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { type BranchInput, deleteBranch, saveBranch } from "@/lib/admin/actions/branches";
import type { AdminDictionary } from "@/lib/admin/dictionaries/en";
import { type FieldErrors, tr } from "@/lib/admin/format";
import { ConfirmDelete, SaveStatus } from "./controls";
import { errorFor, Field, fieldMessage, LocalizedField } from "./fields";
import { adminButton, card, errorText, input, sectionTitle } from "./ui";

type Values = Omit<BranchInput, "addressLines"> & { addressLines: string };

/** Monday first, as the shops list their hours. */
const weekOrder = [1, 2, 3, 4, 5, 6, 0];

export function BranchForm({ initial, t, justCreated }: { initial: BranchInput; t: AdminDictionary; justCreated?: boolean }) {
  const router = useRouter();
  const [values, setValues] = useState<Values>({ ...initial, addressLines: initial.addressLines.join("\n") });
  const [errors, setErrors] = useState<FieldErrors>();
  const [status, setStatus] = useState<{ tone: "ok" | "error"; text: string } | undefined>(
    justCreated ? { tone: "ok", text: t.common.saved } : undefined,
  );
  const [pending, startTransition] = useTransition();
  const [deleting, startDelete] = useTransition();
  const b = t.branches;

  // A new branch arrives here with ?saved=1; drop it so a reload doesn't repeat the message.
  useEffect(() => {
    if (justCreated) window.history.replaceState(null, "", window.location.pathname);
  }, [justCreated]);

  const update = (patch: Partial<Values>) => {
    setValues({ ...values, ...patch });
    setStatus(undefined);
  };
  const textInput = (key: "name" | "phone" | "street" | "locality" | "postalCode" | "mapsUrl", type = "text") =>
    function Control(p: { id: string; describedBy?: string; invalid: boolean }) {
      return (
        <input
          id={p.id}
          type={type}
          aria-describedby={p.describedBy}
          aria-invalid={p.invalid}
          value={values[key] ?? ""}
          onChange={(e) => update({ [key]: e.target.value })}
          className={input}
        />
      );
    };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    startTransition(async () => {
      const result = await saveBranch({ ...values, addressLines: values.addressLines.split("\n") });
      if (result.ok) {
        setErrors(undefined);
        setStatus({ tone: "ok", text: t.common.saved });
        if (!values.id && result.data) router.replace(`/admin/branches/${result.data.id}?saved=1`);
      } else {
        setErrors(result.errors);
        setStatus({ tone: "error", text: result.message ? tr(t, result.message) : t.common.fixErrors });
      }
    });
  };

  const remove = () =>
    startDelete(async () => {
      const result = await deleteBranch(values.id!);
      if (result.ok) router.push("/admin/branches");
      else setStatus({ tone: "error", text: result.message ? tr(t, result.message) : t.common.error });
    });

  return (
    <form onSubmit={submit} noValidate className="max-w-3xl space-y-6">
      <section className={`${card} space-y-6 p-5 sm:p-7`}>
        <Field label={b.name} hint={b.nameHint} error={fieldMessage(t, errors, "name")}>
          {textInput("name")}
        </Field>
        <LocalizedField label={b.area} hint={b.areaHint} value={values.area} onChange={(area) => update({ area })} invalid={!!errorFor(errors, "area")} t={t} />
        <Field label={b.phone} error={fieldMessage(t, errors, "phone")}>
          {textInput("phone", "tel")}
        </Field>
        <Field label={b.addressLines} hint={b.addressHint} error={fieldMessage(t, errors, "addressLines")}>
          {(p) => (
            <textarea
              id={p.id}
              aria-describedby={p.describedBy}
              aria-invalid={p.invalid}
              rows={3}
              value={values.addressLines}
              onChange={(e) => update({ addressLines: e.target.value })}
              className={`${input} resize-y`}
            />
          )}
        </Field>
        <fieldset>
          <legend className="block text-sm font-semibold">{b.postalHint}</legend>
          <div className="mt-3 grid gap-4 sm:grid-cols-[2fr_1fr_1fr]">
            <Field label={b.street} error={fieldMessage(t, errors, "street")}>
              {textInput("street")}
            </Field>
            <Field label={b.locality} error={fieldMessage(t, errors, "locality")}>
              {textInput("locality")}
            </Field>
            <Field label={b.postalCode} error={fieldMessage(t, errors, "postalCode")}>
              {textInput("postalCode")}
            </Field>
          </div>
        </fieldset>
        <Field label={b.mapsUrl} hint={b.mapsHint} optional={t.common.optional} error={fieldMessage(t, errors, "mapsUrl")}>
          {textInput("mapsUrl", "url")}
        </Field>
      </section>

      <section className={`${card} p-5 sm:p-7`}>
        <h2 className={sectionTitle}>{b.hours}</h2>
        <ul className="mt-4 divide-y divide-line">
          {weekOrder.map((day) => {
            const d = values.days[day];
            const setDay = (patch: Partial<typeof d>) =>
              update({ days: values.days.map((x, i) => (i === day ? { ...x, ...patch } : x)) });
            const dayError = fieldMessage(t, errors, `days.${day}`);
            return (
              <li key={day} className="flex flex-wrap items-center gap-x-4 gap-y-2 py-3">
                <span className="w-28 font-medium">{b.days[day]}</span>
                <label className="inline-flex min-h-11 items-center gap-2 text-sm">
                  <input type="checkbox" checked={d.open} onChange={(e) => setDay({ open: e.target.checked })} className="size-5 accent-ink" />
                  {d.open ? b.open : b.closed}
                </label>
                {d.open && (
                  <span className="flex items-center gap-2 text-sm">
                    <input
                      type="time"
                      aria-label={`${b.days[day]}: ${b.opens}`}
                      value={d.opens}
                      onChange={(e) => setDay({ opens: e.target.value })}
                      aria-invalid={!!dayError}
                      className={`${input} w-32 py-2`}
                    />
                    <span aria-hidden>–</span>
                    <input
                      type="time"
                      aria-label={`${b.days[day]}: ${b.closes}`}
                      value={d.closes}
                      onChange={(e) => setDay({ closes: e.target.value })}
                      aria-invalid={!!dayError}
                      className={`${input} w-32 py-2`}
                    />
                  </span>
                )}
                {dayError && <p className={`${errorText} mt-0 w-full`}>{dayError}</p>}
              </li>
            );
          })}
        </ul>
      </section>

      <div className="flex flex-wrap items-center gap-4">
        <button type="submit" disabled={pending} className={adminButton.primary}>
          {pending ? t.common.saving : t.common.save}
        </button>
        <SaveStatus status={status} />
        {values.id && (
          <div className="ml-auto">
            <ConfirmDelete
              question={t.common.confirmDelete.replace("{name}", values.name)}
              labels={t.common}
              onConfirm={remove}
              pending={deleting}
            />
          </div>
        )}
      </div>
    </form>
  );
}
