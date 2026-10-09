---
name: Kainos Dagang
description: The shop's own black signboard and shop floor, as a website. Melindungi Setiap Langkah.
colors:
  ink: "#000000"
  ink-2: "#111111"
  ink-line: "#2b2b2b"
  orange: "#fe5200"
  paper: "#ffffff"
  floor: "#f4f2ee"
  floor-2: "#ebe8e1"
  line: "#d8d3c9"
  muted: "#55524b"
  whatsapp: "#25d366"
typography:
  display:
    fontFamily: "Moderniz, Noto Sans SC, sans-serif"
    fontSize: "clamp(2.2rem, 4.5vw, 4rem)"
    fontWeight: 400
    lineHeight: 0.95
    letterSpacing: "0.01em"
  headline:
    fontFamily: "Poppins, Noto Sans SC, system-ui, sans-serif"
    fontSize: "clamp(1.65rem, 2.5vw, 2.5rem)"
    fontWeight: 600
    lineHeight: 1.15
    letterSpacing: "-0.015em"
  title:
    fontFamily: "Poppins, Noto Sans SC, system-ui, sans-serif"
    fontSize: "1.02rem"
    fontWeight: 600
    lineHeight: 1.35
  body:
    fontFamily: "Poppins, Noto Sans SC, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.625
  label:
    fontFamily: "Poppins, Noto Sans SC, system-ui, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 600
    lineHeight: 1.2
  sign-label:
    fontFamily: "Moderniz, Noto Sans SC, sans-serif"
    fontSize: "0.78rem"
    fontWeight: 400
    lineHeight: 1
    letterSpacing: "0.01em"
rounded:
  none: "0px"
  tag: "2px"
  pill: "9999px"
spacing:
  gutter-sm: "16px"
  gutter-md: "24px"
  gutter-lg: "40px"
  grid-gap: "16px"
  section-sm: "64px"
  section-md: "80px"
  section-lg: "96px"
components:
  button-ink:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper}"
    rounded: "{rounded.pill}"
    height: "48px"
    padding: "0 24px"
  button-ink-hover:
    backgroundColor: "{colors.ink-2}"
  button-whatsapp:
    backgroundColor: "{colors.whatsapp}"
    textColor: "{colors.ink}"
    rounded: "{rounded.pill}"
    height: "48px"
    padding: "0 24px"
  button-outline:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    rounded: "{rounded.pill}"
    height: "44px"
    padding: "0 16px"
  chip:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.pill}"
    height: "44px"
    padding: "0 16px"
  chip-active:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper}"
  product-tile:
    backgroundColor: "{colors.paper}"
    rounded: "{rounded.none}"
    padding: "20px"
  masuk-plaque:
    backgroundColor: "{colors.orange}"
    textColor: "{colors.ink}"
    rounded: "{rounded.none}"
    padding: "24px"
  tagline-band:
    backgroundColor: "{colors.orange}"
    textColor: "{colors.ink}"
    height: "72px"
  code-tag:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.tag}"
    padding: "4px 8px"
---

# Design System: Kainos Dagang

## Overview

**Creative North Star: "The Shop Signboard"**

The website is the shop that Klang Valley workers have already driven past. Every page opens on a face of the black acrylic signboard: white Moderniz caps, the orange shield, the shop's own small print. The orange tagline band with its black hazard stripes stitches each sign to the white shop floor below. The visual system comes straight from the client's brand guideline (Aug 2026): orange, black and white, Moderniz for display, Poppins for reading. The website adds only what a screen needs: a warm shop-floor neutral, hairlines, pill controls, and WhatsApp green.

The system is flat, loud where the sign is loud, and quiet where people read. Big fields of black and orange carry the identity. The floor stays white or a warm off-white so products and copy read clearly. Signage furniture does real jobs: the category board on the sign is navigation, the MASUK plaque is the way into the catalogue, the store directory is the category index, and each branch card is headed by its own small signboard.

Motion is a single idea, "setiap langkah" (every step). Boot-sole prints step in, one at a time, as the visitor scrolls: across the three fitting steps, and down the shop floor beside the shop window. When reduced motion is on, or scroll timelines are unsupported, the prints are simply there.

Around that idea sits a quiet supporting layer, all on the 0.23/1/0.32/1 strong ease-out:
- **Signboard lights up:** on load the lockup, the promise, the category board and the legal strip rise 14px into place, 140ms apart.
- **Stock set out on the shelf:** sections, directory rows, brand rows, branch cards and product tiles marked `data-reveal` rise 22px as they first scroll into view, 70ms apart when several arrive together (`components/scroll-reveal.tsx`). Anything already on screen at load is never held back.
- **Hover:** tile photos ease up to 104.5% and the tile arrow turns to point up-right; directory and brand names step 6–8px right; nav links draw a white underline from the left.
- **Page changes:** a 160/260ms crossfade, and a product's photo travels from its tile into the product page (React `<ViewTransition>`, shared name `photo-<slug>`).
- **Phone menu:** the sheet fades in, then each link rises in turn.
With reduced motion on, all of this is off and content simply shows.

**Key Characteristics:**
- Black signboard faces on top, orange hazard band as the seam, white shop floor beneath.
- Moderniz caps for headings and sign labels; Poppins for everything people read.
- Orange as whole fields, never as scattered accents.
- WhatsApp green appears only on WhatsApp actions.
- Flat surfaces; depth comes from field changes, not shadows.

## Colors

A three-colour brand (signboard black, safety orange, paper white), widened with warm shop-floor neutrals and one functional green.

### Primary
- **Safety Orange** (#fe5200): the brand orange from the guideline (Pantone 021C, screen value). It is used only as whole fields: the tagline band, the MASUK plaque, the bulk-order panel, the lit row of the store directory on hover, the hazard seams, and the shield mark. Text on it is always black (6.4:1).

### Neutral
- **Signboard Black** (#000000): sign faces (hero, inner-page header, footer, store directory, branch sign headers), primary buttons, body text on paper.
- **Raised Black** (#111111): hover state of black buttons.
- **Sign Keyline** (#2b2b2b): hairline rules on black (category board, legal strip, directory rows).
- **Paper** (#ffffff): the main shop floor behind the shop window, fitting section, catalogue and product pages; text on black.
- **Shop Floor** (#f4f2ee): a warm off-white for alternate sections (brands, branches, related products) and the product art well.
- **Shop Floor Deep** (#ebe8e1): the product art well on hover.
- **Floor Line** (#d8d3c9): card borders, dividers, link underlines at rest, faint bootprints on the floor.
- **Muted Ink** (#55524b): secondary text on paper and floor (7.7:1 on paper).

### Functional
- **WhatsApp Green** (#25d366): the WhatsApp float, the product page's main enquiry button, the closing call to action, and the glyph inside black WhatsApp buttons. Text on it is black (10.6:1).

### Named Rules
**The Fields-Not-Flecks Rule.** Orange covers whole areas or nothing. No orange body text, no orange icons, no orange link underlines. The only small orange marks allowed are the slashes on the signboard's category board, the hazard seams, the focus ring and text selection.

**The Black-On-Orange Rule.** Anything set on orange is black. White on orange (3.3:1) is never used for text.

**The Green-Means-WhatsApp Rule.** Green appears only where tapping opens WhatsApp. It is not a success colour, decoration or second accent.

## Typography

**Display Font:** Moderniz (self-hosted from the client's licensed file, one heavy weight), falling back to Noto Sans SC.
**Body Font:** Poppins 400–700 (Google Fonts, self-hosted by next/font).
**Chinese:** Noto Sans SC (variable, loaded by unicode-range). Chinese headings set in the display style render at weight 900.

**Character:** Moderniz is wide, heavy and square, the lettering of the shop's own signboard. Poppins is round and plain beside it, so long Malay and English sentences stay easy to read.

### Hierarchy
- **Display** (Moderniz 400, uppercase, line-height 0.95): section titles such as "Store directory" and "Visit a branch" step from 2.2rem on phones to 3rem from 640px and 3.6–4rem from 1024px. The catalogue title and the closing line run larger (up to 5.25rem). Never larger than 6rem.
- **Headline** (Poppins 600, clamp(1.65rem, 2.5vw, 2.5rem), line-height 1.15, -0.015em): the hero's one-line promise and product names on product pages (1.9–2.4rem).
- **Title** (Poppins 600, 1.02–1.35rem, line-height 1.35): product tile names, fitting step titles, branch details.
- **Body** (Poppins 400, 1rem–1.08rem, line-height 1.625): intros and descriptions, kept to about 34–52ch.
- **Label** (Poppins 600, 0.875rem): buttons, chips, form labels, the language switcher.
- **Sign Label** (Moderniz 400, uppercase, 0.72–0.78rem): the signboard's category board, product codes, footer column headings.

### Named Rules
**The Signage Caps Rule.** Moderniz is always uppercase and only ever used for headings and short sign labels. Running text, captions and legal small print are never set in caps.

**The Signage Speaks the Visitor's Language Rule.** The tagline band ("MELINDUNGI SETIAP LANGKAH"), the MASUK plaque and the closing line ("Selamat di tempat kerja, selamat sampai ke rumah") are translated per locale like all other copy (English: PROTECTING EVERY STEP / ENTER; Chinese: 守护每一步 / 进店). The Malay originals appear on the Malay site. The only exception is the link-preview card (`lib/og.tsx`), which stays in Malay because it renders Latin glyphs only.

**The No Fake Bold Rule.** Moderniz has one weight. `font-synthesis: none` stays on, so the browser never fakes bold or italic.

## Layout

- **Container:** max 90rem (1440px), with side gutters of 16px (phones), 24px (≥640px) and 40px (≥1024px).
- **Section rhythm:** sections breathe at 64px (phones), 80px (≥640px) and 96–112px (≥1024px) top and bottom. A heading always has more space above it than below.
- **Grids:** product grids step 1 → 2 → 3 → 4 columns (≥640px, ≥1024px, ≥1280px) with 16px gaps. Section headers pair a display title on the left with a short intro on the right from 1024px.
- **First viewport:** on the home page, the signboard takes about 55% of a 900px screen. The tagline band sits right under it, and the MASUK plaque and first products are visible above the fold.
- **Phones:** the nav collapses into a full-screen black menu (a native dialog). The signboard's category board becomes a single scrolling line that fades out at the right edge. Product tiles use a shorter 16:10 art well. Branch actions wrap.
- **Floating WhatsApp:** fixed 16px (phones) and 24px (≥640px) from the bottom-right corner. The footer reserves room so it never covers the last line.

## Elevation & Depth

The system is flat. Depth comes from field changes (black sign, then orange band, then white floor) and from hairlines, not from layered cards. The WhatsApp float and its hover label are the only elements with a shadow, because they sit above the page.

### Shadow Vocabulary
- **Float** (`box-shadow: 0 10px 28px -6px rgb(0 0 0 / 0.45)`): the WhatsApp button.
- **Float label** (`box-shadow: 0 8px 24px -8px rgb(0 0 0 / 0.5)`): the phone-number pill revealed on desktop hover.

### Named Rules
**The Flat Sign Rule.** Sign faces are flat black: no bevels, gloss, brushed-metal textures or embossing to imitate acrylic or aluminium. The signboard is evoked by its layout and lettering, never by faked material.

## Shapes

- **Square sign faces:** signboards, product tiles, the MASUK plaque, the bulk and advice panels and the branch cards all have 0px corners.
- **Pill controls:** every button, chip, search field, select and quantity stepper is fully rounded (9999px), with touch targets of at least 44px.
- **Tags:** the product code tag and the Coming Soon tag use a 2px radius.
- **Hazard stripes:** black bars leaning 13.3° off vertical, measured from the guideline. Each bar is 0.322 of the band height thick and repeats every 0.7 heights. In the tagline band they appear as three-bar groups at each end. In seams they run as a continuous strip 8px tall.
- **Shield mark:** the logo's shield appears on its own only at small scale (branch signs, the favicon). The full lockup is never redrawn, only used from the vector paths in `components/brand/logo-paths.ts`.

## Components

### Buttons
Tactile, plain-spoken pills.
- **Shape:** fully rounded (9999px), 48px tall (44px for outline buttons), with a 0.97 press scale and a 150ms strong ease-out.
- **Ink (primary):** black with white text. Used for tile WhatsApp buttons (with a green glyph) and "Request a quotation" on orange.
- **WhatsApp:** green with black text and the WhatsApp glyph. Used for the product page's main enquiry and the closing call to action.
- **Outline:** a 1px black border at 20% opacity, turning solid black on hover. Used for branch actions (Google Maps, Waze, Call). On black surfaces it uses a white border at 25% opacity.
- **Focus:** a 3px orange outline with a 3px offset. On orange fields the ring turns black.

### Chips
- **Style:** white pill with a 1px Floor Line border and semibold 0.875rem text. A product count sits in the chip at 60% opacity.
- **State:** selected chips turn black with white text and expose `aria-pressed`. Used for catalogue sections and product size or colour choices.

### Product Tile
The catalogue's unit, built like a hang tag in a shop window.
- **Structure:** a square-cornered white tile with a 1px Floor Line border. The top is a full-bleed art well in Shop Floor. The code sits in Moderniz on a small paper tag at top-left. Below come the name (Title), a meta line (brand · size range), a black WhatsApp pill, and a round arrow that marks the tile as a link.
- **Behaviour:** the whole tile links to the product page. The WhatsApp button sits above that link and opens a pre-filled message. On hover the border turns black, the art well deepens, and the arrow fills black.
- **Art:** a real product photo when one exists: studio shots fill the well (`object-cover`); cut-outs sit whole on it (`object-contain`, multiplied onto the floor), with room above for the code tag. Otherwise a flat black-and-orange safety pictogram stands in.

### Inputs / Fields
- **Style:** white pill, 44px tall, with a 1px Floor Line border that darkens to black on hover. Placeholders are in Muted Ink, with a leading search icon. The caret is orange.
- **Quantity stepper:** a pill holding a minus button, a numeric field and a plus button, with a 4px inset. Minus is disabled at 1.

### Navigation
- **Desktop:** links in Poppins 500 at 75% white along the top edge of the sign, turning white on hover. Then the EN · BM · 中文 switcher (the active language underlined in orange) and a WhatsApp pill showing the main number.
- **Phones:** a menu button opens a full-screen black dialog with large Moderniz links, a hazard seam under the top bar, and a full-width WhatsApp button.

### Signboard Hero (signature)
The full-bleed black sign at the top of the home page, built in this order:
1. The nav row along its top edge.
2. The lockup at signage scale (up to 48rem wide).
3. The headline and intro beside the lockup.
4. The category board: Moderniz sign labels separated by orange slashes, each linking into the catalogue.
5. The legal strip: "Owned by: Kainos Dagang Sdn. Bhd. 202301009526 (1503447-K)" with the three branch names, in small Poppins.

Inner pages use a slim version: the compact lockup, the nav, and an 8px hazard seam.

### Tagline Band (signature)
The full-width orange band with three-bar hazard groups at both ends and "MELINDUNGI SETIAP LANGKAH" in black Moderniz. Its text is sized from the room left between the stripe groups, so it never clips. It sits under the hero and opens the footer.

### MASUK Plaque (signature)
An orange door plaque leading into the catalogue: "MASUK" in Moderniz with the arrowhead from the shop's metal sign, plus a translated line ("Step inside: browse all 134 products", counted from the catalogue). It uses a container query so MASUK always fits. On hover the arrow nudges right and a hazard strip wipes in along the bottom edge.

### Store Directory
A black board with one row per section: a white pictogram, the section name in Moderniz, a one-line description, and a product count. On hover the whole row lights orange with black text.

### Branch Shopfront Card
A white card headed by a small black signboard (shield and branch name in Moderniz) over an 8px hazard seam. Below come the locality, the address, a tap-to-call number, and pill actions for Google Maps, Waze and Call.

### Opening Hours Plate
The shop-door hours sign under the branch cards: a black plate whose left cell holds the Moderniz title and a scope line (same hours at all branches). It has one cell per day range: the day in Muted-on-black, the hours in Poppins 600. Once the page is in the browser, the row for today (Malaysia time) lights orange with black text and a black "Today" tag, following the Fields-Not-Flecks Rule. The static HTML shows the plain plate, so nothing shifts on load. There is no "open now" claim. On phones the rows stack, with each day above its hours. The footer repeats the hours as a plain list.

### Bootprint Trail (signature)
Boot-sole prints with chevron tread, drawn as one even-odd SVG path. Feet fall on the correct sides of the direction of travel. Each print steps in on its own scroll position (`animation-timeline: view()`). Prints are black across the fitting steps and faint Floor Line grey on the shop floor.

## Do's and Don'ts

### Do:
- **Do** open every page on a black sign face, and keep the orange hazard seam between the sign and the white floor.
- **Do** set section titles and sign labels in uppercase Moderniz, and everything people read in Poppins.
- **Do** put black text on orange, and keep orange to whole fields (band, plaque, panels, lit directory rows).
- **Do** give every product a WhatsApp action that pre-fills the product name, code, choices and page link.
- **Do** keep motion supporting, never blocking: nothing waits on an animation to be read or tapped, and reduced motion turns it all off.
- **Do** keep touch targets at 44px or more, and keep the floating WhatsApp button clear of content on phones.

### Don't:
- **Don't** use orange for body text, icons or link underlines (the Fields-Not-Flecks Rule).
- **Don't** use green anywhere a tap does not open WhatsApp.
- **Don't** translate or re-letter "MELINDUNGI SETIAP LANGKAH", or redraw the logo; use the vector paths.
- **Don't** imitate acrylic, metal or reflective materials with bevels, gloss or textures.
- **Don't** add eyebrow labels above headings, gradient text, glass panels or decorative shadows.
- **Don't** show prices or claim that Kainos Dagang is an "authorised dealer" of any brand.
