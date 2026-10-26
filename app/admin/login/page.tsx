import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { LogoMark } from "@/components/brand/logo";
import { AdminLangSwitch } from "@/components/admin/lang-switch";
import { LoginForm } from "@/components/admin/login-form";
import { getAdminDict } from "@/lib/admin/i18n";
import { isAdmin } from "@/lib/admin/session";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getAdminDict();
  return { title: t.login.submit };
}

export default async function LoginPage() {
  if (await isAdmin()) redirect("/admin");
  const { lang, t } = await getAdminDict();

  return (
    <main className="grid min-h-dvh place-items-center bg-ink px-4 py-12">
      <div className="w-full max-w-sm rounded-lg bg-paper p-6 sm:p-8">
        <div className="flex items-start justify-between gap-4">
          <LogoMark label="Kainos Dagang" className="h-12 w-auto text-orange" />
          <div className="-mt-2 -mr-2">
            <AdminLangSwitch lang={lang} t={t} tone="light" />
          </div>
        </div>
        <h1 className="mt-6 font-display text-[1.6rem] uppercase">{t.login.title}</h1>
        <p className="mt-1 text-muted">{t.login.intro}</p>
        <LoginForm labels={{ password: t.login.password, submit: t.login.submit, wrong: t.login.wrong, locked: t.login.locked }} />
      </div>
    </main>
  );
}
