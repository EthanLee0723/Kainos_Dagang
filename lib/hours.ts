import type { Locale } from "./i18n/config";

/**
 * A branch's weekly opening hours. Days use JavaScript numbering: 0 = Sunday …
 * 6 = Saturday. Each row's days must be consecutive, so they read as a range
 * ("Tuesday – Saturday"). A day missing from every row is shown as closed.
 */
export type WeeklyHours = { days: number[]; opens: string; closes: string }[];

export type HoursLabels = { days: string[]; through: string; closed: string };

export type HoursRow = { days: number[]; label: string; time: string };

/** "9:00 am" / "9:00 pagi" / "上午9:00", written out so server and browser always agree. */
export function formatTime(hhmm: string, locale: Locale) {
  const [hour, minute] = hhmm.split(":").map(Number);
  const clock = `${hour % 12 === 0 ? 12 : hour % 12}:${String(minute).padStart(2, "0")}`;
  if (locale === "ms") {
    const period = hour < 12 ? "pagi" : hour < 14 ? "tengah hari" : hour < 19 ? "petang" : "malam";
    return `${clock} ${period}`;
  }
  if (locale === "zh") {
    const period = hour < 12 ? "上午" : hour < 13 ? "中午" : hour < 19 ? "下午" : "晚上";
    return `${period}${clock}`;
  }
  return `${clock} ${hour < 12 ? "am" : "pm"}`;
}

/** Position in a Monday-first week, the order Malaysian shop signs list days in. */
const weekOrder = (day: number) => (day + 6) % 7;

/** Closed days, grouped into runs of consecutive days (Monday-first). */
function closedRuns(hours: WeeklyHours) {
  const open = new Set(hours.flatMap((row) => row.days));
  const runs: number[][] = [];
  for (const day of [1, 2, 3, 4, 5, 6, 0]) {
    if (open.has(day)) continue;
    const last = runs[runs.length - 1];
    if (last && weekOrder(last[last.length - 1]) === weekOrder(day) - 1) last.push(day);
    else runs.push([day]);
  }
  return runs;
}

export function hoursRows(hours: WeeklyHours, locale: Locale, labels: HoursLabels): HoursRow[] {
  const label = (days: number[]) =>
    days.length === 1
      ? labels.days[days[0]]
      : `${labels.days[days[0]]}${labels.through}${labels.days[days[days.length - 1]]}`;

  return [
    ...hours.map(({ days, opens, closes }) => ({
      days,
      label: label(days),
      time: `${formatTime(opens, locale)} – ${formatTime(closes, locale)}`,
    })),
    ...closedRuns(hours).map((days) => ({ days, label: label(days), time: labels.closed })),
  ].sort((a, b) => weekOrder(a.days[0]) - weekOrder(b.days[0]));
}

const schemaDays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

/** schema.org OpeningHoursSpecification, for a store in the page's structured data. */
export function openingHoursSchema(hours: WeeklyHours) {
  return hours.map(({ days, opens, closes }) => ({
    "@type": "OpeningHoursSpecification",
    dayOfWeek: days.map((d) => schemaDays[d]),
    opens,
    closes,
  }));
}

/** One day in the admin's hours editor (index = JavaScript day, 0 = Sunday). */
export type DayHours = { open: boolean; opens: string; closes: string };

/** WeeklyHours → seven day rows, for editing. */
export function hoursToDays(hours: WeeklyHours): DayHours[] {
  return Array.from({ length: 7 }, (_, day) => {
    const row = hours.find((r) => r.days.includes(day));
    return row ? { open: true, opens: row.opens, closes: row.closes } : { open: false, opens: "10:00", closes: "18:00" };
  });
}

/**
 * Seven day rows → WeeklyHours: consecutive open days (Monday first) with the
 * same times become one row, which is how hoursRows() expects them.
 */
export function daysToHours(days: DayHours[]): WeeklyHours {
  const rows: WeeklyHours = [];
  for (const day of [1, 2, 3, 4, 5, 6, 0]) {
    const { open, opens, closes } = days[day];
    if (!open) continue;
    const last = rows[rows.length - 1];
    const previous = last?.days[last.days.length - 1];
    if (last && previous !== undefined && weekOrder(previous) === weekOrder(day) - 1 && last.opens === opens && last.closes === closes) {
      last.days.push(day);
    } else {
      rows.push({ days: [day], opens, closes });
    }
  }
  return rows;
}
