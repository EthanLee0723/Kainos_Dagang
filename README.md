# Kainos Dagang website

The corporate site and product catalogue for Kainos Dagang Sdn. Bhd., a safety shoe and safety gear shop with three branches in the Klang Valley. Built with Next.js 16 (App Router), React 19 and Tailwind CSS v4, in English, Bahasa Melayu and Simplified Chinese.

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build (every page is pre-rendered)
npm run start
```

## How it works

- **Languages:** every page lives under `/en`, `/ms` or `/zh`. A visit to `/` is redirected (`proxy.ts`) to the language last picked in the switcher, otherwise the visitor's browser language, otherwise English. Interface text is in `lib/i18n/dictionaries/{en,ms,zh}.ts`.
- **WhatsApp:** every WhatsApp button (the floating button and each product's button) opens a chat with the main line, **019-662 8919**. A product enquiry pre-fills the product name, code, chosen size, colour and quantity, plus a link to the product page. The number lives in `lib/site.ts` (`company.whatsappNumber`); the message templates are in `lib/whatsapp.ts`.
- **Branches, company details:** `lib/site.ts`.
- **Products:** `lib/products.ts`.

## Replacing the sample products

The catalogue currently holds **sample products** (each marked "Sample" on the site). For each real product in `lib/products.ts`:

1. Fill in `name`, `summary`, `description` and `features` in all three languages, plus `code`, `brand`, `category`, `sizes` and `colours`.
2. Put the photo in `public/products/` (e.g. `public/products/kd-ss-101.webp`) and set `image: "/products/kd-ss-101.webp"`. Without a photo, the product shows a placeholder pictogram.
3. Set `sample: false`. The "Sample" tag and the catalogue's sample note disappear once no product is a sample.

Set `featured: true` on the eight products to show in the home page's shop window. Never add prices: all pricing goes through WhatsApp.

## Before going live

- Set `NEXT_PUBLIC_SITE_URL` to the real domain (e.g. `https://www.kainosdagang.com`) so link previews and SEO tags use absolute URLs. WhatsApp product links already use whatever domain the visitor is on.
- The headings use the brand's **Moderniz** font (`app/fonts/Moderniz.otf`), which the client confirmed is licensed for web use. Keep proof of that licence.

## Design

The visual system (the black signboard, the orange hazard band, Moderniz and Poppins) comes from the client's brand guideline and is documented in `DESIGN.md`. Product facts and constraints are in `PRODUCT.md`.
