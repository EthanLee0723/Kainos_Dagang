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
 * The shop-door hours plate. Today's row lights orange once the page is in the
 * browser; the static HTML shows the plain plate, so nothing shifts on load.
 */
export function OpeningHoursPlate({
  rows,
  title,
  scope,
  todayLabel,
}: {
  rows: HoursRow[];
  title: string;
  scope: string;
  todayLabel: string;
}) {
  const today = useSyncExternalStore(subscribe, malaysianWeekday, () => -1);

  return (
    <div className="mt-5 grid bg-ink text-paper lg:grid-cols-[minmax(0,22rem)_minmax(0,1fr)]">
      <div className="flex items-center gap-4 border-b border-ink-line px-5 py-5 sm:px-6 lg:border-r lg:border-b-0">
        <Clock className="size-6 shrink-0 text-paper/60" strokeWidth={2} aria-hidden />
        <div>
          <h3 className="font-display text-[1.2rem] leading-none uppercase sm:text-[1.35rem]">{title}</h3>
          <p className="mt-2 text-sm text-paper/60">{scope}</p>
        </div>
      </div>
      <dl className="grid sm:grid-cols-3">
        {rows.map((row, i) => {
          const isToday = row.days.includes(today);
          return (
            <div
              key={row.label}
              className={`px-5 py-4 transition-colors duration-300 sm:px-6 sm:py-5 ${
                i < rows.length - 1 ? "border-b border-ink-line sm:border-r sm:border-b-0" : ""
              } ${isToday ? "on-orange bg-orange text-ink" : ""}`}
            >
              <dt className={`flex flex-wrap items-center gap-2 text-sm ${isToday ? "text-ink/80" : "text-paper/65"}`}>
                {row.label}
                {isToday && (
                  <span className="rounded-sm bg-ink px-1.5 py-0.5 text-[0.72rem] font-semibold tracking-wider text-paper uppercase">
                    {todayLabel}
                  </span>
                )}
              </dt>
              <dd className="tabular mt-1 text-[1.05rem] font-semibold sm:mt-1.5 sm:text-lg">
                {row.time}
              </dd>
            </div>
          );
        })}
      </dl>
    </div>
  );
}
