import type { ReactNode } from "react";

/** Title, one line of explanation and the page's main action. */
export function PageHeader({ title, intro, actions }: { title: string; intro?: string; actions?: ReactNode }) {
  return (
    <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="font-display text-[1.8rem] leading-none uppercase sm:text-[2.2rem]">{title}</h1>
        {intro && <p className="mt-3 max-w-2xl leading-relaxed text-muted">{intro}</p>}
      </div>
      {actions && <div className="flex shrink-0 gap-2">{actions}</div>}
    </div>
  );
}
