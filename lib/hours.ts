import type { Locale } from "./i18n/config";

/**
 * Opening hours, the same at all three branches (from the client, 2026-10-06).
 * Days use JavaScript numbering: 0 = Sunday … 6 = Saturday. Each row's days must
 * be consecutive, so they read as a range ("Tuesday – Saturday").
 */
export const openingHours: { days: number[]; opens: string; closes: string }[] = [
  { days: [1], opens: "09:00", closes: "18:00" },
  { days: [2, 3, 4, 5, 6], opens: "10:00", closes: "18:00" },
  { days: [0], opens: "11:00", closes: "17:00" },
];

export type HoursLabels = { days: string[]; through: string };

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

export function hoursRows(locale: Locale, labels: HoursLabels): HoursRow[] {
  return openingHours.map(({ days, opens, closes }) => ({
    days,
    label:
      days.length === 1
        ? labels.days[days[0]]
        : `${labels.days[days[0]]}${labels.through}${labels.days[days[days.length - 1]]}`,
    time: `${formatTime(opens, locale)} – ${formatTime(closes, locale)}`,
  }));
}

const schemaDays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

/** schema.org OpeningHoursSpecification, for each store in the page's structured data. */
export function openingHoursSchema() {
  return openingHours.map(({ days, opens, closes }) => ({
    "@type": "OpeningHoursSpecification",
    dayOfWeek: days.map((d) => schemaDays[d]),
    opens,
    closes,
  }));
}
