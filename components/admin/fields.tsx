"use client";

import { useId, type ReactNode } from "react";
import type { AdminDictionary } from "@/lib/admin/dictionaries/en";
import { type FieldErrors, fill, tr } from "@/lib/admin/format";
import type { Locale } from "@/lib/i18n/config";
import type { Localized } from "@/lib/site";
import { errorText, hint as hintClass, input, label as labelClass } from "./ui";

const langs: { code: Locale; short: string }[] = [
  { code: "en", short: "EN" },
  { code: "ms", short: "BM" },
  { code: "zh", short: "中文" },
];

export const emptyLocalized = (): Localized => ({ en: "", ms: "", zh: "" });

/** The error for a field, or for any of its parts ("name" covers "name.ms"). */
export function errorFor(errors: FieldErrors | undefined, path: string) {
  if (!errors) return undefined;
  return errors[path] ?? Object.entries(errors).find(([k]) => k.startsWith(`${path}.`))?.[1];
}

type FieldProps = {
  label: string;
  hint?: string;
  error?: string;
  optional?: string;
  children: (props: { id: string; describedBy?: string; invalid: boolean }) => ReactNode;
};

/** Label, control, hint and error, wired together for screen readers. */
export function Field({ label, hint, error, optional, children }: FieldProps) {
  const id = useId();
  const hintId = hint ? `${id}-hint` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  return (
    <div>
      <label htmlFor={id} className={labelClass}>
        {label}
        {optional && <span className="ml-1.5 font-normal text-muted">({optional})</span>}
      </label>
      {hint && (
        <p id={hintId} className={hintClass}>
          {hint}
        </p>
      )}
      <div className="mt-2">
        {children({ id, describedBy: [hintId, errorId].filter(Boolean).join(" ") || undefined, invalid: !!error })}
      </div>
      {error && (
        <p id={errorId} className={errorText}>
          {error}
        </p>
      )}
    </div>
  );
}

/**
 * One piece of site text in English, Malay and Chinese. All three are
 * required; an empty one is outlined and named in the error.
 */
export function LocalizedField({
  label,
  hint,
  value,
  onChange,
  multiline,
  rows = 3,
  invalid,
  optional,
  t,
}: {
  label: string;
  hint?: string;
  value: Localized;
  onChange: (value: Localized) => void;
  multiline?: boolean;
  rows?: number;
  invalid?: boolean;
  optional?: boolean;
  t: AdminDictionary;
}) {
  const id = useId();
  const missing = langs.filter((l) => !value[l.code].trim());
  const showMissing = invalid && missing.length > 0 && missing.length < 3;
  const message = invalid
    ? showMissing
      ? fill(t.common.missingIn, { langs: missing.map((l) => t.languages[l.code]).join(", ") })
      : optional
        ? t.products.packIncomplete
        : t.common.required
    : undefined;

  return (
    <fieldset>
      <legend className={labelClass}>
        {label}
        {optional && <span className="ml-1.5 font-normal text-muted">({t.common.optional})</span>}
      </legend>
      {hint && <p className={hintClass}>{hint}</p>}
      <div className="mt-2 space-y-2">
        {langs.map((l) => {
          const Control = multiline ? "textarea" : "input";
          const empty = invalid && !value[l.code].trim();
          return (
            <div key={l.code} className="flex items-start gap-2">
              <span
                aria-hidden
                className="mt-2 inline-flex h-7 w-11 shrink-0 items-center justify-center rounded-sm bg-floor-2 text-[0.72rem] font-semibold"
              >
                {l.short}
              </span>
              <Control
                id={`${id}-${l.code}`}
                aria-label={`${label} (${t.languages[l.code]})`}
                aria-invalid={empty}
                lang={l.code === "zh" ? "zh-Hans" : l.code}
                rows={multiline ? rows : undefined}
                value={value[l.code]}
                onChange={(e) => onChange({ ...value, [l.code]: e.target.value })}
                className={`${input} ${multiline ? "resize-y leading-relaxed" : ""}`}
              />
            </div>
          );
        })}
      </div>
      {message && <p className={errorText}>{message}</p>}
    </fieldset>
  );
}

/** The message for a field path, translated, if the last save rejected it. */
export function fieldMessage(t: AdminDictionary, errors: FieldErrors | undefined, path: string) {
  const error = errorFor(errors, path);
  return error ? tr(t, error) : undefined;
}
