import { eq } from "drizzle-orm";
import type { Metadata } from "next";
import { ContactForm } from "@/components/admin/contact-form";
import { PageHeader } from "@/components/admin/page-header";
import { getAdminDict } from "@/lib/admin/i18n";
import { db, schema } from "@/lib/db";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getAdminDict();
  return { title: t.contact.title };
}

export default async function ContactPage() {
  const { t } = await getAdminDict();
  const [settings] = await db.select().from(schema.settings).where(eq(schema.settings.id, 1));

  return (
    <>
      <PageHeader title={t.contact.title} intro={t.contact.intro} />
      <ContactForm
        t={t}
        initial={{
          legalName: settings.legalName,
          registration: settings.registration,
          email: settings.email,
          phone: settings.phone,
          sameAs: settings.sameAs,
        }}
      />
    </>
  );
}
