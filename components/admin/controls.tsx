"use client";

import { Check } from "lucide-react";
import { useState } from "react";
import { Pictogram } from "@/components/pictogram";
import { type Pictogram as PictogramKey, pictograms } from "@/lib/products";
import { adminButton } from "./ui";

/** Delete with a second, explicit click instead of a browser pop-up. */
export function ConfirmDelete({
  question,
  labels,
  onConfirm,
  pending,
}: {
  question: string;
  labels: { delete: string; cancel: string; deleting: string };
  onConfirm: () => void;
  pending?: boolean;
}) {
  const [asking, setAsking] = useState(false);
  if (!asking) {
    return (
      <button type="button" onClick={() => setAsking(true)} disabled={pending} className={adminButton.danger}>
        {pending ? labels.deleting : labels.delete}
      </button>
    );
  }
  return (
    <div role="alertdialog" aria-label={question} className="flex flex-wrap items-center gap-2 rounded-lg bg-[#c23a00]/5 p-2 pl-3">
      <p className="mr-auto max-w-md text-sm font-medium text-[#c23a00]">{question}</p>
      <button type="button" onClick={() => setAsking(false)} className={adminButton.secondary}>
        {labels.cancel}
      </button>
      <button
        type="button"
        onClick={() => {
          setAsking(false);
          onConfirm();
        }}
        className={adminButton.dangerSolid}
      >
        {labels.delete}
      </button>
    </div>
  );
}

/** Saved / error line next to a Save button; screen readers hear it too. */
export function SaveStatus({ status }: { status?: { tone: "ok" | "error"; text: string } }) {
  return (
    <p role="status" className={`text-sm font-medium ${status?.tone === "error" ? "text-[#c23a00]" : "text-[#1f7a3f]"}`}>
      {status && (
        <>
          {status.tone === "ok" && <Check className="mr-1.5 inline size-4 align-[-3px]" aria-hidden />}
          {status.text}
        </>
      )}
    </p>
  );
}

/** Pick one of the site's pictograms. */
export function PictogramPicker({
  value,
  onChange,
  label,
}: {
  value: PictogramKey;
  onChange: (value: PictogramKey) => void;
  label: string;
}) {
  return (
    <fieldset>
      <legend className="block text-sm font-semibold">{label}</legend>
      <div className="mt-2 flex flex-wrap gap-2">
        {pictograms.map((name) => (
          <label
            key={name}
            title={name}
            className="relative grid size-14 cursor-pointer place-items-center rounded-md border border-line bg-paper [--pict-bg:var(--color-paper)] has-checked:border-ink has-checked:bg-floor has-checked:[--pict-bg:var(--color-floor)] has-focus-visible:outline-3 has-focus-visible:outline-orange"
          >
            <input
              type="radio"
              name={`pictogram-${label}`}
              value={name}
              checked={value === name}
              onChange={() => onChange(name)}
              className="sr-only"
            />
            <Pictogram name={name} className="h-auto w-10 text-ink" />
            <span className="sr-only">{name}</span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}

/** Toggle chips for picking several items (colours, chips, tags), in list order. */
export function ChipPicker({
  options,
  selected,
  onChange,
  legend,
  empty,
}: {
  options: { id: string; label: string }[];
  selected: string[];
  onChange: (ids: string[]) => void;
  legend: string;
  empty?: string;
}) {
  const toggle = (id: string) =>
    onChange(
      selected.includes(id)
        ? selected.filter((s) => s !== id)
        : options.map((o) => o.id).filter((o) => o === id || selected.includes(o)),
    );
  return (
    <fieldset>
      <legend className="sr-only">{legend}</legend>
      {options.length === 0 && empty && <p className="text-sm text-muted">{empty}</p>}
      <div className="flex flex-wrap gap-2">
        {options.map((o) => {
          const on = selected.includes(o.id);
          return (
            <button
              key={o.id}
              type="button"
              aria-pressed={on}
              onClick={() => toggle(o.id)}
              className={`inline-flex min-h-11 items-center gap-1.5 rounded-full border px-4 text-sm font-medium transition-colors ${
                on ? "border-ink bg-ink text-paper" : "border-line bg-paper text-ink hover:border-ink"
              }`}
            >
              {on && <Check className="size-4" aria-hidden />}
              {o.label}
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}
