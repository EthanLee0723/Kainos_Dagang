import "server-only";
import { cookies } from "next/headers";
import { ADMIN_LANG_COOKIE } from "./constants";
import en, { type AdminDictionary } from "./dictionaries/en";
import zh from "./dictionaries/zh";

export type AdminLang = "en" | "zh";

const dictionaries: Record<AdminLang, AdminDictionary> = { en, zh };

/** The admin interface language, from the EN / 中文 switch (English by default). */
export async function getAdminLang(): Promise<AdminLang> {
  return (await cookies()).get(ADMIN_LANG_COOKIE)?.value === "zh" ? "zh" : "en";
}

export async function getAdminDict() {
  const lang = await getAdminLang();
  return { lang, t: dictionaries[lang] };
}
