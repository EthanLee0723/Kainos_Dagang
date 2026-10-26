"use client";

import { useState, useTransition } from "react";
import { type ContactInput, saveContact } from "@/lib/admin/actions/contact";
import type { AdminDictionary } from "@/lib/admin/dictionaries/en";
import type { FieldErrors } from "@/lib/admin/format";
import { phoneE164 } from "@/lib/site";
import { SaveStatus } from "./controls";
import { Field, fieldMessage } from "./fields";
import { adminButton, card, input } from "./ui";

export function ContactForm({ initial, t }: { initial: ContactInput; t: AdminDictionary }) {
  const [values, setValues] = useState({ ...initial, sameAs: initial.sameAs.join("\n") });
  const [errors, setErrors] = useState<FieldErrors>();
  const [status, setStatus] = useState<{ tone: "ok" | "error"; text: string }>();
  const [pending, startTransition] = useTransition();
  const c = t.contact;

  const set = (key: keyof typeof values) => (e: { target: { value: string } }) => {
    setValues({ ...values, [key]: e.target.value });
    setStatus(undefined);
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    startTransition(async () => {
      const result = await saveContact({
        ...values,
        sameAs: values.sameAs.split("\n").map((l) => l.trim()).filter(Boolean),
      });
      setErrors(result.ok ? undefined : result.errors);
      setStatus(result.ok ? { tone: "ok", text: t.common.saved } : { tone: "error", text: t.common.fixErrors });
    });
  };

  const e164 = values.phone.replace(/\D/g, "").length >= 9 ? phoneE164(values.phone) : null;

  return (
    <form onSubmit={submit} noValidate className={`${card} max-w-2xl space-y-6 p-5 sm:p-7`}>
      <Field label={c.legalName} error={fieldMessage(t, errors, "legalName")}>
        {(p) => <input id={p.id} aria-describedby={p.describedBy} aria-invalid={p.invalid} value={values.legalName} onChange={set("legalName")} className={input} />}
      </Field>
      <Field label={c.registration} error={fieldMessage(t, errors, "registration")}>
        {(p) => <input id={p.id} aria-describedby={p.describedBy} aria-invalid={p.invalid} value={values.registration} onChange={set("registration")} className={input} />}
      </Field>
      <Field label={c.email} error={fieldMessage(t, errors, "email")}>
        {(p) => <input id={p.id} type="email" aria-describedby={p.describedBy} aria-invalid={p.invalid} value={values.email} onChange={set("email")} className={input} />}
      </Field>
      <Field label={c.phone} hint={c.phoneHint} error={fieldMessage(t, errors, "phone")}>
        {(p) => (
          <>
            <input id={p.id} type="tel" aria-describedby={p.describedBy} aria-invalid={p.invalid} value={values.phone} onChange={set("phone")} className={`${input} tabular max-w-xs`} />
            {e164 && (
              <p className="mt-2 text-sm text-muted">
                {c.preview}: <span className="tabular text-ink">wa.me/{e164.slice(1)}</span> · <span className="tabular text-ink">tel:{e164}</span>
              </p>
            )}
          </>
        )}
      </Field>
      <Field label={c.sameAs} hint={c.sameAsHint} optional={t.common.optional} error={fieldMessage(t, errors, "sameAs")}>
        {(p) => (
          <textarea
            id={p.id}
            aria-describedby={p.describedBy}
            aria-invalid={p.invalid}
            rows={4}
            value={values.sameAs}
            onChange={set("sameAs")}
            placeholder="https://www.facebook.com/…"
            className={`${input} resize-y`}
          />
        )}
      </Field>
      <div className="flex flex-wrap items-center gap-4 border-t border-line pt-5">
        <button type="submit" disabled={pending} className={adminButton.primary}>
          {pending ? t.common.saving : t.common.save}
        </button>
        <SaveStatus status={status} />
      </div>
    </form>
  );
}
