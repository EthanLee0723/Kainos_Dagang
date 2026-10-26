# Kainos Dagang website

The corporate site and product catalogue for Kainos Dagang Sdn. Bhd., a safety shoe and safety gear shop with three branches in the Klang Valley. Built with Next.js 16 (App Router), React 19, Tailwind CSS v4 and Postgres (Drizzle ORM), in English, Bahasa Melayu and Simplified Chinese. Products, branches and contact details are edited in an admin area at `/admin`.

```bash
npm install
cp .env.example .env.local   # then set ADMIN_PASSWORD and SESSION_SECRET
npm run db:dev               # local Postgres on port 5433; leave it running (Ctrl+C stops it)
npm run db:migrate           # create the tables (once per new database)
npm run db:seed              # fill a new database with the catalogue (once)
npm run dev                  # http://localhost:3000, admin at http://localhost:3000/admin
npm run build                # production build: public pages are pre-rendered from the database
npm run start
```

`npm run db:dev` needs no Docker or system install: it runs a real Postgres from the `embedded-postgres` package, with its data in `.data/postgres` (git-ignored).

## How it works

- **Languages:** every page lives under `/en`, `/ms` or `/zh`. A visit to `/` is redirected (`proxy.ts`) to the language last picked in the switcher, otherwise the visitor's browser language, otherwise English. Interface text is in `lib/i18n/dictionaries/{en,ms,zh}.ts`.
- **Data:** products, categories, brands, colours, sizes, "Suitable for" chips, tags, branches and contact details live in Postgres (schema: `lib/db/schema.ts`) and are edited at `/admin`. Pages load them with `getCatalogue()` (`lib/data/catalogue.ts`) and `getSite()` (`lib/data/site.ts`).
- **Updates:** public pages are pre-rendered. After any admin save, every page, the sitemap and `llms.txt` are regenerated on their next visit (`lib/admin/revalidate.ts`), so changes show straight away. Products added in the admin get their page on first visit.
- **WhatsApp:** every WhatsApp button (the floating button and each product's button) opens a chat with the main line set under *Contact details* in the admin. A product enquiry pre-fills the product name, code, chosen size, colour and quantity, plus a link to the product page. The message templates are in `lib/whatsapp.ts`.
- **Photos:** the original catalogue photos ship in `public/products/`. Photos uploaded in the admin are shrunk in the browser (at most 2000px, WebP) and stored in Vercel Blob, or in `./uploads` (served at `/media/…`) when `BLOB_READ_WRITE_TOKEN` isn't set (`lib/admin/storage.ts`).
- **SEO:** `robots.txt`, `sitemap.xml` (with hreflang and product photos), the web manifest, `llms.txt` and schema.org structured data are all generated from the same data. See [`docs/SEO.md`](docs/SEO.md).

## The admin (`/admin`)

- **Sign in** with `ADMIN_PASSWORD`. Five wrong attempts from one address lock it out for 15 minutes; changing the password signs everyone out. The admin's own interface switches between English and 中文 (top right).
- **Products:** add, edit, hide or delete. Photos: upload several at once, drag (or use the arrows) to reorder; the first is the main photo. Also sizes, colours, "Suitable for" chips, tags, feature lines, and whether the product shows in the home page's shop window.
- **Categories, Brands, Colours, Sizes, Suitable for, Tags:** add, edit, delete and drag into order. A category or brand that still has products can't be deleted; deleting a colour, size system, chip or tag asks first and removes it from the products using it.
- **Branches:** address, phone, Google Maps link and opening hours for each day.
- **Contact details:** company name, registration number, email, the main WhatsApp line and official social profiles.
- Every piece of text shown on the site is entered in English, Malay and Chinese; all three are required. Feature lines already used on another product are suggested as you type, with their translations.
- The home page's *Brands on our shelves* lists brands by number of products, six at most, with a button for the rest.
- Never add prices: all pricing goes through WhatsApp.

## Database

- **Changing the schema:** edit `lib/db/schema.ts`, run `npm run db:generate` (writes a migration into `drizzle/`), then `npm run db:migrate`. Commit the migration.
- **Seeding:** `npm run db:seed` fills an empty database from `scripts/seed/catalogue/` (the catalogue as it was hard-coded before the admin). It refuses to run on a database that already has products; `npm run db:seed -- --force` wipes every table first, including the client's edits.
- **Browsing the data:** `npm run db:studio` opens Drizzle Studio.

## Before going live

- **Database:** create a Postgres database on [Neon](https://neon.tech) (free tier; also available from the Vercel Marketplace) and set `DATABASE_URL` to its pooled connection string. Then, once, from your machine: `DATABASE_URL="…" npm run db:migrate` and `DATABASE_URL="…" npm run db:seed`. Builds need this database: `next build` pre-renders every public page from it.
- **Photo storage:** on Vercel, create a Blob store and set `BLOB_READ_WRITE_TOKEN`. On a server with a persistent disk you can leave it unset and photos go to `./uploads` (back it up with the database).
- **Admin:** set `ADMIN_PASSWORD` and `SESSION_SECRET` (`openssl rand -base64 32`). The admin is at `https://<domain>/admin`.
- Set `NEXT_PUBLIC_SITE_URL` to the real domain (e.g. `https://www.kainosdagang.com`) so link previews and SEO tags use absolute URLs. **Search engines are told not to index the site until it is set.** WhatsApp product links already use whatever domain the visitor is on. All environment variables are listed in `.env.example`.
- Verify the site in Google Search Console and Bing Webmaster Tools, submit the sitemap, and set up a Google Business Profile per branch: step by step in [`docs/SEO.md`](docs/SEO.md).
- The headings use the brand's **Moderniz** font (`app/fonts/Moderniz.otf`), which the client confirmed is licensed for web use. Keep proof of that licence.

## Design

The visual system (the black signboard, the orange hazard band, Moderniz and Poppins) comes from the client's brand guideline and is documented in `DESIGN.md`. Product facts and constraints are in `PRODUCT.md`.
