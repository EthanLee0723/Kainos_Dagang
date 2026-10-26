# SEO and search engine setup

How the site presents itself to Google, Bing and AI assistants, and the one-time setup to do once the real domain is live.

## What the site already does

| What | Where | Notes |
|---|---|---|
| `robots.txt` | `app/robots.ts` → `/robots.txt` | Allows every crawler and points to the sitemap. Blocks everything on non-live deployments (see "Indexing switch" below). |
| `sitemap.xml` | `app/sitemap.ts` → `/sitemap.xml` | Every page in all three languages, each with hreflang links to its translations, and every product photo (image sitemap). Updates itself when products are added to `lib/catalogue/`. |
| Canonical + hreflang | `lib/i18n/alternates.ts` | Each page names itself as canonical and links its `en` / `ms` / `zh-Hans` versions. `x-default` is English. Filtered catalogue URLs (`/products?category=…`) point their canonical at `/products`. |
| Titles and descriptions | `lib/i18n/dictionaries/*.ts` (`meta`), each page's `generateMetadata` | Product pages use the product name, code and summary. |
| Robots meta | `lib/seo.ts` → `robotsMeta()` | `max-image-preview:large` so Google can show big product photos. |
| Link previews | `app/[lang]/**/opengraph-image.tsx`, `lib/og.tsx` | Branded 1200×630 card per page (WhatsApp, Facebook, X, LinkedIn). |
| Structured data (JSON-LD) | `lib/seo.ts`, `components/json-ld.tsx` | See below. |
| Icons | `app/favicon.ico` (48px), `app/icon.svg`, `app/apple-icon.png`, `public/icons/*` | Google shows the favicon next to the result; it needs a multiple of 48px, which `favicon.ico` and the SVG both meet. |
| Web manifest | `app/manifest.ts` → `/manifest.webmanifest` | Name, colours and icons for Add to Home Screen. |
| `llms.txt` | `app/llms.txt/route.ts` → `/llms.txt` | Plain-Markdown summary of the business, shops, hours and full catalogue, for ChatGPT, Perplexity, Gemini and similar. |
| Search console verification | `lib/seo.ts` → `siteVerification()` | Reads tokens from environment variables (below). |

### Structured data on each page

All entities share stable `@id`s, so Google links them together across pages.

- **Every page:** `Organization` (legal name, logo, slogan, HQ address, SSM number, phone, email, WhatsApp sales contact, links to each shop) and `WebSite`.
- **Home page:** `WebPage` plus one `ShoeStore` per branch: full postal address, phone, opening hours, Google Maps link.
- **Catalogue (`/products`):** `CollectionPage` with an `ItemList` of every product, and a `BreadcrumbList`.
- **Product pages:** `Product` (name, code as SKU/MPN, brand, category, description, all photos, colours, sizes) and a `BreadcrumbList`.

Prices are never published, so `Product` has no `offers`. Google will still read the product, but in Search Console's **Product snippets** report these pages may show as *"Either offers, review, or aggregateRating should be specified"*. That is expected: it only means no price/star rich result, not a ranking penalty. Don't add fake reviews or a placeholder price to silence it.

## Before launch

1. **Set the domain.** In the hosting dashboard set `NEXT_PUBLIC_SITE_URL` to the final address, e.g. `https://www.kainosdagang.com` (https, no trailing slash), and redeploy. Pick one host (`www` or bare) and redirect the other to it at the DNS/host level.
2. **Check the indexing switch.** Visit `https://<domain>/robots.txt`. It must say `Allow: /` and list the sitemap. If it says `Disallow: /`, the domain variable is missing or `NEXT_PUBLIC_NOINDEX` is set.
3. Open `https://<domain>/sitemap.xml` and confirm the URLs use the real domain, not `localhost`.

### Indexing switch

Search engines are told **not** to index (`noindex` meta + `Disallow: /`) when any of these is true:

- `NEXT_PUBLIC_SITE_URL` is not set (a site whose canonicals point at `localhost` would do more harm than good),
- it's a Vercel preview deployment (`VERCEL_ENV=preview`),
- `NEXT_PUBLIC_NOINDEX=1` (use this on a staging server).

## Google Search Console

### 1. Add and verify the property

Go to <https://search.google.com/search-console> and sign in with the Google account the client will keep (ideally the client's own, with the developer added as a user).

**Option A: Domain property (recommended).** Covers `http`/`https` and `www`/bare in one property.

1. *Add property* → **Domain** → enter `kainosdagang.com` (no `https://`, no `www`).
2. Google shows a `TXT` record like `google-site-verification=abc123…`.
3. At the domain registrar's DNS settings, add a `TXT` record on the root (`@`) with that value.
4. Back in Search Console, click **Verify**. DNS can take minutes to a few hours.

**Option B: URL-prefix property, HTML tag.** Use this if you can't edit DNS.

1. *Add property* → **URL prefix** → `https://www.kainosdagang.com/`.
2. Choose **HTML tag**. It shows `<meta name="google-site-verification" content="abc123…" />`.
3. Set the environment variable `GOOGLE_SITE_VERIFICATION=abc123…` (the `content` value only) and redeploy.
4. View the page source of the home page, confirm the tag is in `<head>`, then click **Verify**.

**Option C: URL-prefix property, HTML file.**

1. Download the file Google offers (named like `google1234abcd.html`).
2. Put it in `public/` unchanged and redeploy. It is served at `https://<domain>/google1234abcd.html` (files with an extension bypass the language redirect in `proxy.ts`).
3. Click **Verify**. Keep the file in the repo forever: removing it un-verifies the site.

Keep the verification in place after verifying; Google re-checks periodically.

### 2. Submit the sitemap

*Indexing → Sitemaps* → enter `sitemap.xml` → **Submit**. Status should turn to *Success* with a discovered-URL count of roughly (number of products + 2) × 3. Re-submitting is unnecessary when products change; Google re-reads it on its own.

### 3. Request indexing of the key pages

*URL inspection* → paste each URL → **Request indexing**:

- `https://<domain>/en`, `/ms`, `/zh`
- `https://<domain>/en/products`, `/ms/products`, `/zh/products`

Product pages are found through the sitemap; there's no need to request them one by one.

### 4. Check the results (after a few days)

- **Indexing → Pages:** most URLs should be *Indexed*. *"Alternate page with proper canonical tag"* for `?category=` URLs is correct and expected. *"Page with redirect"* for `/` is expected too (it redirects to a language).
- **Enhancements:** *Breadcrumbs* should be valid. *Product snippets* may warn about missing `offers` (see above).
- **Experience → Core Web Vitals / HTTPS:** should be green.
- **Links → Top linking sites:** nothing to do; it fills over time.

### 5. Add the client as owner

*Settings → Users and permissions → Add user* → the client's Google account → **Owner**. Do this before handing over so the property doesn't depend on the developer's account.

## Google Business Profile (most important for local search)

For "safety shoes near me" and Google Maps, a **Business Profile per branch** matters far more than anything on the website.

1. Go to <https://business.google.com> and create (or claim, if one exists) a profile for each branch: Taman Equine, Kota Damansara, Klang.
2. Use **exactly** the same name, address and phone as the site (`lib/site.ts`): consistency between the site's structured data and the profile is how Google matches them.
3. Category: *Shoe store* (primary) plus *Safety equipment supplier* and *Work clothing store*.
4. Website field: link each profile to `https://<domain>/en` (or the language most of that branch's customers use).
5. Hours: same as `lib/hours.ts`. Add public-holiday hours when the client knows them.
6. Add real photos of the shopfront, signage and shelves.
7. Once live, copy each profile's share link (`https://maps.app.goo.gl/…`) into `company.sameAs` in `lib/site.ts`, along with any Facebook / Instagram / TikTok page the client owns. Those links go into the Organization structured data.

## Bing Webmaster Tools (also feeds DuckDuckGo, Yahoo, ChatGPT search)

1. Go to <https://www.bing.com/webmasters>.
2. Fastest route: **Import from Google Search Console**. It copies the verified site and sitemap in one step.
3. Otherwise: *Add site* → **HTML Meta Tag** → set `BING_SITE_VERIFICATION` to the `content` value of the `msvalidate.01` tag and redeploy, then verify. (Or download `BingSiteAuth.xml` into `public/`.)
4. *Sitemaps* → submit `https://<domain>/sitemap.xml`.

## Testing tools

- Rich Results Test: <https://search.google.com/test/rich-results> (paste a product URL and the home URL)
- Schema Markup Validator: <https://validator.schema.org/>
- PageSpeed Insights: <https://pagespeed.web.dev/>
- Link preview check: <https://developers.facebook.com/tools/debug/> (also refreshes WhatsApp's cached preview)
- hreflang check: URL inspection in Search Console → *View crawled page* → HTML, confirm the `<link rel="alternate" hreflang>` tags.

## Ongoing

- **New products** appear in the sitemap, `llms.txt` and structured data automatically. Give each a real photo and a specific, unique summary in all three languages: that text becomes the search snippet.
- **Branch or hours change:** edit `lib/site.ts` / `lib/hours.ts` and the Business Profiles on the same day.
- **Don't** add fabricated reviews, ratings, prices, certifications or "authorised dealer" claims to the structured data. Google treats misleading structured data as spam (manual action), and `PRODUCT.md` rules them out anyway.
