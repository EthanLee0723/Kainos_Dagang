# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

- **B2B buyers**: contractors, factories, site supervisors, and companies that buy safety equipment in bulk for their workers.
- **Retail customers**: individual workers who buy their own safety gear.

Both groups are served side by side; neither is secondary.

## Product Purpose

A company and catalogue site for Kainos Dagang, a Malaysian seller of safety equipment (PPE). Visitors browse the range, find the right product, and then enquire on WhatsApp or visit a branch. There is no online checkout. The site succeeds when it produces qualified WhatsApp enquiries and store visits.

## Positioning

- **Branded safety gear, in store, with expert fitting and advice.** Stocks established safety brands (Black Hammer, Kickers, and others), and staff help customers choose the right safety rating, size, and fit. A plain online marketplace listing cannot offer that.
- The shops present themselves as a **"Kedai Kasut"** (shoe shop) and a **"Black Hammer Safety Shoes Outlet"** on their own signage. Safety footwear is the core.
- **Do not claim "authorised dealer"** for any brand (user decision, 2026-10-06). List brands as brands stocked.

## Operating Context

- Enquiries and orders happen over **WhatsApp** (click-to-chat), not on the site. Every WhatsApp button (the floating button and each product's button) goes to the main line, **019-662 8919**. A product enquiry pre-fills the product name, code, and a link to its page.
- Customers can **visit a physical branch**. There are three:
  - **Taman Equine**: No.6-1, Jalan Equine 10D, Taman Equine, 43300 Seri Kembangan. Tel 017-665 8919. This is also the HQ address on the letterhead.
  - **Kota Damansara**: No.49-1, Jalan Cecawi 6/19A, 47810 Kota Damansara, Selangor. Tel 017-891 9550.
  - **Klang**: No.16A, Jalan Kampar 1/KU 1, Bukit Kuda Heights, 41300 Klang, Selangor. Tel 017-363 8919.
- **Opening hours** (from the client, 2026-10-06; shown as the same at all three branches): Monday 9am–6pm; Tuesday to Saturday 10am–6pm; Sunday 11am–5pm. Public-holiday hours are not known, so the site shows no live "open now" claim, only today's hours highlighted.
- Company: **Kainos Dagang Sdn Bhd**, 202301009526 (1503447-K). Email samhong8919@gmail.com. Main line 019-662 8919.
- **No prices are shown publicly.** All pricing, retail and bulk alike, goes through WhatsApp enquiry.
- Trilingual audience: **English, Bahasa Melayu, Simplified Chinese**. The site opens in the visitor's browser language when it is one of the three, otherwise English. Visitors can switch.

## Capabilities and Constraints

- Stack: Next.js 16 (App Router), React 19, Tailwind CSS v4, TypeScript (existing scaffold).
- Product categories confirmed so far: safety shoes, safety helmets, socks. The brand guideline's own mockups also show gloves, goggles, gumboots, traffic batons, and safety netting. The full category list comes from the client's product list.
- Until the real product list arrives, the catalogue uses clearly marked sample products. They live in one data file so they are easy to replace.
- Content must support three languages (EN / BM / 中文).
- Open: the real product list and photos, whether any branch keeps different hours or closes on public holidays, and whether there are other contact channels (social media).

## Brand Commitments

- Name: Kainos Dagang. Tagline: **"Melindungi Setiap Langkah"** ("Protecting every step"). It is translated on the English and Chinese sites ("Protecting Every Step", "守护每一步"); the Malay original shows on the Malay site and on the link-preview card.
- The **brand guideline (Aug 2026)** is binding. The user said "with the color theme given". It covers the shield logo (shield + footprint + "K" chevrons), the colours orange #FE5200 / black / white, Moderniz (primary display, licensed for web per the user) and Poppins (secondary/body), the tagline band with black hazard stripes, and the bootprint motif. Source: `~/Downloads/Kainos Dagang Brand Guideline/`.
- Brand lines from the guideline's own materials: "Kami menyediakan pelbagai jenis peralatan keselamatan" (we provide many kinds of safety equipment); "Kami menyediakan perkhidmatan konsultasi keselamatan" (we provide safety consultation services); "Selamat di tempat kerja, selamat sampai ke rumah" (safe at work, safe home).

## Evidence on Hand

- Logo: vector, extracted from the guideline's print files.
- Company details, branches, and contacts: from the business card and letterhead.
- Still with the client, not yet supplied: real product photos, the product list (prices exist but must not be published), and the company story.

Do not fabricate testimonials, client logos, certifications, brand-authorisation claims, years in business, safety-standard compliance for specific products, or branch details. Use only what the client supplies.

## Product Principles

1. **Every path ends in a conversation.** Each product and page should lead to a WhatsApp enquiry or a branch visit.
2. **Safety first, sales second.** Help buyers pick the correct protection (rating, size, use case) before pushing a sale. The expertise is the differentiator.
3. **Serve the bulk buyer and the individual equally.** A company buying for a whole site and a worker buying one pair should both find their path quickly.
4. **Trust through authenticity.** Show genuine branded goods and real branches. Never use stock-photo filler or unverifiable claims.

## Accessibility & Inclusion

- Trilingual (EN / BM / 中文). Typography and layout must handle Chinese script and longer Malay strings.
- *(Inferred, not yet confirmed)* Many visitors will be on mobile, often outdoors or on site. WhatsApp and directions actions should be reachable one-handed.
