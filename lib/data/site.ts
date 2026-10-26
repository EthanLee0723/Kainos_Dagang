import "server-only";
import { asc, eq } from "drizzle-orm";
import { cache } from "react";
import { db, schema } from "@/lib/db";
import { COMPANY_NAME, phoneE164, type Site, TAGLINE } from "@/lib/site";

/** Company contact details and branches, loaded once per render (React cache). */
export const getSite = cache(async (): Promise<Site> => {
  const [[settings], branchRows] = await Promise.all([
    db.select().from(schema.settings).where(eq(schema.settings.id, 1)),
    db.select().from(schema.branches).orderBy(asc(schema.branches.position)),
  ]);
  if (!settings) throw new Error("The settings row is missing. Run `npm run db:seed` on a new database.");

  const phone = phoneE164(settings.phone);
  return {
    company: {
      name: COMPANY_NAME,
      tagline: TAGLINE,
      legalName: settings.legalName,
      registration: settings.registration,
      email: settings.email,
      phoneDisplay: settings.phone,
      phoneE164: phone,
      whatsappNumber: phone.slice(1),
      sameAs: settings.sameAs,
    },
    branches: branchRows.map((b) => ({
      id: b.slug,
      name: b.name,
      area: b.area,
      phoneDisplay: b.phone,
      phoneE164: phoneE164(b.phone),
      addressLines: b.addressLines,
      postal: { street: b.street, locality: b.locality, postalCode: b.postalCode },
      mapsUrl: b.mapsUrl ?? undefined,
      hours: b.hours,
    })),
  };
});
