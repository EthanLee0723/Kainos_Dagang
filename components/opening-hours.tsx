"use client";

import { Clock } from "lucide-react";
import { useSyncExternalStore } from "react";
import type { HoursRow } from "@/lib/hours";

const subscribe = () => () => {};
const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

/** Today's weekday in Malaysia (0 = Sunday), whatever the visitor's own time zone. */
function malaysianWeekday() {
  const short = new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Kuala_Lumpur",
    weekday: "short",
  }).format(new Date());
  return weekdays.indexOf(short);
}

/**
 * A branch's hours, shown inside its card. Today's row lights orange once the
 * page is in the browser; the static HTML shows plain rows, so nothing shifts on load.
 */
export function BranchHours({
  rows,
  title,
  todayLabel,
}: {
  rows: HoursRow[];
  title: string;
  todayLabel: string;
}) {
  const today = useSyncExternalStore(subscribe, malaysianWeekday, () => -1);

  return (
    <div className="mt-5 border-t border-line pt-4">
      <h4 className="flex items-center gap-2 text-sm font-semibold">
        <Clock className="size-4 text-muted" strokeWidth={2} aria-hidden />
        {title}
      </h4>
      <dl className="mt-2 text-[0.95rem]">
        {rows.map((row) => {
          const isToday = row.days.includes(today);
          return (
            <div
              key={row.label}
              className={`-mx-2 flex flex-wrap items-baseline justify-between gap-x-4 px-2 py-1.5 transition-colors duration-300 ${
                isToday ? "on-orange bg-orange text-ink" : ""
              }`}
            >
              <dt className={`flex items-center gap-2 ${isToday ? "text-ink/80" : "text-muted"}`}>
                {row.label}
                {isToday && (
                  <span className="rounded-sm bg-ink px-1.5 py-0.5 text-[0.68rem] font-semibold tracking-wider text-paper uppercase">
                    {todayLabel}
                  </span>
                )}
              </dt>
              <dd className="tabular font-semibold">{row.time}</dd>
            </div>
          );
        })}
      </dl>
    </div>
  );
}
