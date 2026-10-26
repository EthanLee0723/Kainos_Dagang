"use client";

import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { useState, useTransition } from "react";
import { reorderBranches } from "@/lib/admin/actions/branches";
import type { AdminDictionary } from "@/lib/admin/dictionaries/en";
import { SaveStatus } from "./controls";
import { SortableList } from "./sortable";
import { card } from "./ui";

type Row = { id: string; name: string; area: string; phone: string };

export function BranchList({ initial, t }: { initial: Row[]; t: AdminDictionary }) {
  const [rows, setRows] = useState(initial);
  const [status, setStatus] = useState<{ tone: "ok" | "error"; text: string }>();
  const [, startTransition] = useTransition();

  const reorder = (next: Row[]) => {
    setRows(next);
    startTransition(async () => {
      const result = await reorderBranches(next.map((r) => r.id));
      setStatus(result.ok ? { tone: "ok", text: t.common.orderSaved } : { tone: "error", text: t.common.error });
    });
  };

  return (
    <div className="max-w-3xl">
      <SortableList
        items={rows}
        onReorder={reorder}
        labels={t.common}
        className={`${card} divide-y divide-line`}
        renderItem={(row, _, { handle, arrows }) => (
          <div className="flex items-center gap-1 bg-paper p-2 pr-3">
            {handle}
            <Link href={`/admin/branches/${row.id}`} className="group flex min-w-0 flex-1 items-center gap-3 rounded-md p-2 hover:bg-floor">
              <span className="min-w-0 flex-1">
                <span className="block font-semibold">{row.name}</span>
                <span className="block truncate text-sm text-muted">
                  {row.area} · <span className="tabular">{row.phone}</span>
                </span>
              </span>
              <ChevronRight className="size-5 shrink-0 text-muted group-hover:text-ink" aria-hidden />
            </Link>
            {arrows}
          </div>
        )}
      />
      <div className="mt-3 min-h-6">
        <SaveStatus status={status} />
      </div>
    </div>
  );
}
