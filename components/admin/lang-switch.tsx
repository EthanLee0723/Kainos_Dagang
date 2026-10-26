import { setAdminLang } from "@/lib/admin/actions/auth";
import type { AdminDictionary } from "@/lib/admin/dictionaries/en";
import type { AdminLang } from "@/lib/admin/i18n";

/** EN / 中文 for the admin interface. Plain forms, so it works before JavaScript loads. */
export function AdminLangSwitch({ lang, t, tone = "dark" }: { lang: AdminLang; t: AdminDictionary; tone?: "dark" | "light" }) {
  const options: { value: AdminLang; label: string }[] = [
    { value: "en", label: t.langSwitch.en },
    { value: "zh", label: t.langSwitch.zh },
  ];
  return (
    <div role="group" aria-label={t.langSwitch.label} className="flex items-center">
      {options.map((o) => (
        <form key={o.value} action={setAdminLang.bind(null, o.value)}>
          <button
            type="submit"
            aria-pressed={lang === o.value}
            className={`inline-flex h-11 min-w-11 items-center justify-center px-2.5 text-sm font-semibold whitespace-nowrap transition-colors ${
              tone === "dark"
                ? "text-paper/55 hover:text-paper aria-pressed:text-paper"
                : "text-muted hover:text-ink aria-pressed:text-ink"
            } aria-pressed:underline aria-pressed:decoration-orange aria-pressed:decoration-2 aria-pressed:underline-offset-[6px]`}
          >
            {o.label}
          </button>
        </form>
      ))}
    </div>
  );
}
