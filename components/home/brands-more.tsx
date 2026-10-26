"use client";

import { ChevronDown } from "lucide-react";
import { type ReactNode, useId, useState } from "react";

/**
 * The brands past the first few, folded away behind a button. They stay in the
 * server HTML (hidden until opened), so their links are still crawlable.
 */
export function BrandsMore({
  children,
  labels,
}: {
  children: ReactNode;
  labels: { showAll: string; showFewer: string };
}) {
  const [open, setOpen] = useState(false);
  const id = useId();

  return (
    <>
      <div id={id} hidden={!open}>
        {children}
      </div>
      <button
        type="button"
        aria-expanded={open}
        aria-controls={id}
        onClick={() => setOpen(!open)}
        className="group flex h-14 w-full items-center justify-between gap-4 border-b border-ink/15 text-left text-[0.95rem] font-semibold"
      >
        <span className="underline decoration-line decoration-2 underline-offset-[6px] transition-colors group-hover:decoration-ink">
          {open ? labels.showFewer : labels.showAll}
        </span>
        <ChevronDown
          className={`size-5 transition-transform duration-300 ease-out-strong ${open ? "rotate-180" : ""}`}
          aria-hidden
        />
      </button>
    </>
  );
}
