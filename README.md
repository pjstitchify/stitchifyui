# Handoff: Stitchify marketing landing page + Guides blog

## Overview
A public marketing site for Stitchify, covering the two product surfaces - **MAKE** (spec building, factory matching, production from one piece) and **SHOWROOM** (gifting/rental campaigns with creators) - plus a **Guides** blog index. Goal of the page: get a brand to submit the "Apply to use" application form.

Repo this belongs to: `pjstitchify/stitchifyui` (branch `main`). See `github.md` in the design project for the screen-to-source map.

## About the design files
The files in `design/` are **design references created in HTML** - prototypes showing intended look and behaviour, not production code to lift. They are "Design Components": a custom `<x-dc>` template + a small logic class, rendered by `support.js`. **Do not port `support.js` or the `<x-dc>` syntax.** Recreate these screens in the target codebase's own environment (this repo is React), using its existing components, routing and styling patterns. Read the HTML for exact structure, copy, colours and spacing; re-express it idiomatically.

## Fidelity
**High-fidelity.** Colours, type, spacing, radii, motion and copy are final. Recreate pixel-accurately using the repo's existing primitives (`stitchify-make-react/src/index.css` already carries the token set).

## Files
| File | What |
|---|---|
| `design/Stitchify LP - Brief.dc.html` | **Primary** landing page (the approved direction) |
| `design/Stitchify Blog.dc.html` | Guides index page |
| `design/Stitchify LP - Design System.dc.html` | Earlier alternate direction - reference only, do not build |
| `design/assets/` | Logos + the four creator photographs used in SHOWROOM |
| `design/support.js`, `design/image-slot.js` | Prototype runtime only - **not** for production |

Open the `.dc.html` files directly in a browser to view them. The bottom-right Desktop/Mobile switch is a **prototype-only affordance** - in production this is a normal responsive breakpoint (see Responsive behaviour).

---

## Design tokens

### Colour
| Token | Hex | Use |
|---|---|---|
| Purple (brand) | `#4E35E8` | CTAs, brand rule, accents, active states, section headings' eyebrow |
| Purple hover | `#3D27D4` | Primary button hover |
| Lime | `#A3E635` | Highlight only - the top factory's "Excellent match" badge. Never a CTA. |
| Cream (page) | `#EBE5CC` | Hero, alternating sections, header background |
| Cream tint | `#EFE9D6` | Selected chips, badge fills, image placeholders |
| Warm tint | `#F4F0E1` | Inset panels, toggle track |
| White | `#FFFFFF` | Cards, alternating sections |
| Ink | `#1C1B19` | Body text |
| Ink muted | `#6F6A5E` | Secondary text |
| Ink faint | `rgba(0,0,0,0.40)` | Captions, meta |
| Border | `#DCD3B4` | 1px card/input borders |
| Hairline | `rgba(28,27,25,0.10)` | Dividers, section rules |
| Deep ink | `#1A1A2E` | Statement section background |
| Footer black | `#0A0A0A` | Footer |
| Error | `#B91C1C` | Required marks, invalid inputs |
| Success | `#15803D` | "Matched" status |

### Typography
- **Display / headings:** `Instrument Serif`, Georgia, serif - weight 400 only.
- **UI / body:** `Hind`, `Noto Sans JP`, system sans.
- Sizes (desktop → mobile): H1 76 → 40 (line-height 1.05, letter-spacing -1px / -0.5px) · section H2 large 56 → 32 (1.15, -0.5px) · H2 spec 48 → 28 · H2 plain 48 → 28 · CTA H2 68 → 34 (1.1, -0.6px) · statement 56 → 28 (1.3).
- Body 16-18 / line-height 1.6-1.7 · UI 14-15 · caption 12-13 · eyebrow 11-12, weight 600, letter-spacing 1.2-1.4px, uppercase, purple.
- All numeric values use `font-variant-numeric: tabular-nums`.
- Japanese text: line-height 1.8, letter-spacing 0.04em, `font-feature-settings: "palt" 1`.

### Spacing, radius, elevation
- Section padding desktop `96px 32px` (hero `88px 32px`, MAKE `80px 32px`, Guides `120px 32px`); mobile `64px 20px` (hero `48px 20px 56px`).
- Content max-width 1200px; FAQ column 760px; CTA copy 720px.
- Radii: 12 chips/inputs · 16 inner cards · 24 cards/modals · 32 hero cards · 999 pills.
- Shadows: card `0 14px 34px rgba(28,27,25,0.10)` · popover `0 4px 16px rgba(10,10,10,0.08)` · modal `0 24px 64px rgba(10,10,10,0.12)`. No resting shadow on plain cards.
- Motion: 80ms press (`scale(0.95)`) · 150ms hover/colour · 250ms standard · 400ms cross-fade · 600ms reveal. Easing standard `cubic-bezier(.25,.1,.25,1)`, enter `cubic-bezier(.05,.7,.1,1)`. Never `transition: all`. All motion disabled under `prefers-reduced-motion: reduce`.

---

## Screens

### 1. Sticky header (all pages)
- Sticky, `z-index: 100`, `backdrop-filter: blur(7px)`, bottom hairline.
- Background is **cream `rgba(235,229,204,0.92)` by default and switches to white `rgba(255,255,255,0.96)` while the user scrolls UP** past 60px (border softens to `rgba(28,27,25,0.06)`); returns to cream on downward scroll. 250ms colour transition.
- Row: logo (26px tall; 22px mobile) · nav links MAKE / Showroom / Guides / FAQ (14px, weight 500) · **EN / 日本語 language pill** · primary "Apply to use" button.
- Language pill: 2px padding track, `rgba(28,27,25,0.05)` fill, 1px `#DCD3B4` border, radius 999. Each option 11px/600, padding 4px 10px, `white-space: nowrap`; active = ink `#1C1B19` fill, white text. **Visual only in the prototype** - wire to real i18n locale switching.
- Mobile: nav links hidden, header padding `12px 16px`, gap 10px; logo + language pill + Apply button remain.
- "Guides" navigates to the blog index.

### 2. Hero
Three-column flex, gap 56px, wraps on narrow: **(a)** copy column (`flex: 1 1 420px`), **(b)** editorial photo (`flex: 1 1 240px`, aspect 2/3, radius 32, `object-position: 62% 26%`), **(c)** interactive product card (`flex: 1 1 420px`).
- Copy: purple 64×2px rule + `MAKE × SHOWROOM` eyebrow, H1 "Factory quality, / from one piece.", 18px body (max-width 460), hero button + text link "See how MAKE works →".
- Card: white, 1px `#DCD3B4`, radius 32, padding 28, card shadow. Serif 26px "What are you making?" → four pills (T-shirt / Hoodie / Sweatshirt / Other; active = purple fill, white text; inactive = white + border). Below, a 4:3 image well cross-fading (400ms opacity) between one photo per product. Footer row: "Rough estimate · 100 pcs" + live range, and right-aligned "Final quote after factory matching"; the row wraps on mobile.
- Estimate maths (per 100 pcs): base = T-shirt 200 / Hoodie 520 / Sweatshirt 420 / Other 300. `low = round((base*100 + 350*100*0.6 + 15000)/1000)*1000`; `high = round((base*100*1.25 + 350*100 + 25000)/1000)*1000`. Rendered `¥x,xxx - ¥y,yyy`.

### 3. Spec section - "The document your factory actually needs."
White. Left: 4:3 photo of a flat-lay tee (radius 24, 1px border) with **four numbered hotspots** (32px circles, absolutely positioned at left/top `50%/62%`, `36%/44%`, `50%/44%`, `50%/26%`). Active hotspot: purple fill, white number, `box-shadow: 0 0 0 6px rgba(78,53,232,0.18)`. Inactive: white 92%, 1px border, popover shadow.
Right: white card (radius 24, padding 28) showing the selected spec - purple eyebrow tag, 24px/600 title, 15px note, then key/value rows (14px, hairline separators, values tabular and right-aligned). Caption under the card: "Sample spec - SS Collection T-shirt · 100 pcs".
Spec content (1 BODY / 2 FABRIC / 3 PRINT / 4 LABEL) is in the prototype's `SPECS` object - copy it verbatim.

### 4. MAKE section (`#make`)
Cream. Heading block "Zero inventory. / Production from one piece." + three bulleted benefits (6px purple dots).
- **Configurator card** (white, radius 24, card shadow): top bar holds a **disabled** MAKE | Showroom segmented control - MAKE first and selected (white pill, purple 700 text, `0 1px 3px rgba(0,0,0,0.12)`), Showroom second; whole control at `opacity: 0.45`, `pointer-events: none`, `user-select: none`, `aria-disabled="true"`. It is a static illustration of the product - do not make it clickable.
- Body: "Garment type *" and "Primary material *" chip rows (selected = 1.5px purple border, `#EFE9D6` fill, 16px purple dot, weight 600), a "Select a body" row (Gildan G500, "Recommended" purple badge, `White / Black / Navy · XS-XXL · ¥180-220/pc`), and a 300px Summary panel (rows + "Rough estimate ¥68,000 - ¥94,000" + full-width purple "Get factory matches" pill).
- **Factory matches card**: title, purple dot + "AI ranked 3 compatible factories for your spec", then three rows (1.5px border, radius 16): name, meta, specialty on the left; large purple percentage + match badge on the right. **Top match badge uses lime `#A3E635` with ink text**; the other two are `#EFE9D6` with purple text. Data: TOKYO STITCH Co. 94% / OSAKA KNIT Lab 87% / FUKUOKA CRAFT 79%.

### 5. Statement band
`#1A1A2E`, centred, padding `96px 32px` (mobile `64px 20px`). Serif 56px "Making it isn't where it ends." + 18px "Items produced through MAKE continue into SHOWROOM." Nothing else - no tagline line.

### 6. SHOWROOM section (`#showroom`)
White. Heading "Made it. / Now put it on people." + three benefits.
- **Browse board** (`flex: 1 1 520px`): header row "Showroom" + All / Gifting / Rental pills, then an auto-fill grid (`minmax(150px, 1fr)`, gap 14) of job cards. Each card: square photo (`object-fit: cover`) with a white type badge top-left, then brand, `reward · deadline` (tabular), and purple applicant count. Cards: MUJI Studio ¥25,000 Jul 15 (creator-1), Tokyo Denim ¥30,000 Jul 12 (creator-2), Kyoto Modern ¥28,000 Jul 5 (creator-3).
- **Creator match panel** (`flex: 1 1 300px`): 48px round avatar (creator-4), "Yuki Tanaka / @yukistyle · 48K followers", three tag pills, green dot + "Matched - brand contact unlocked", a `#F4F0E1` brief block, and a Reward row (¥25,000).

### 7. Guides teaser (`#guides`)
Cream section with a background photograph under an `rgba(235,229,204,0.86)` scrim. Heading row: "Guides" + "All guides →" link. Three cards (white, radius 24, padding 32) - eyebrow category, serif 30px title, 15px description, read time. Hover: `translateY(-2px)` + lavender shadow. All cards and the link route to the blog index.

### 8. FAQ (`#faq`)
760px column. Five rows, each a full-width button (17px/500, 22px vertical padding, hairline底 border) with a purple `+` that rotates 45° over 250ms when open. Single-open accordion; answers 15px/1.7 with right padding 40px.

### 9. Screening note
White section, cream card (radius 24, padding 48): "SCREENING" eyebrow, serif 34px "Every application is reviewed.", body copy, and three inline facts (What we look at / Turnaround: 2 business days / Cost to apply: None).

### 10. Final CTA
Full-bleed purple `#4E35E8`, centred. Serif 68px "Start with your first piece." + 18px body + white pill button "Apply to use" (purple text, `scale(0.95)` on press).

### 11. Footer
`#0A0A0A`, light logo, links MAKE / Showroom / FAQ / support@stitchify.ai at `rgba(255,255,255,0.62)`, centred copyright at 38% opacity.

### 12. Application modal
Triggered by every "Apply to use". Overlay `rgba(10,10,10,0.45)`, centred white sheet (max-width 560, radius 24, padding 40, modal shadow), closes on overlay click or ×.
- Fields (all required, two-column auto-fit `minmax(200px, 1fr)`, gap 16): First name, Last name, Company / brand, Email address, Contact number, Country. Inputs: 16px, padding 12/14, 1px `#DCD3B4`, radius 12.
- Submit validates all fields non-empty; on failure invalid inputs get a `#B91C1C` border and the message "Please complete every field before submitting."; on success the sheet swaps to a confirmation state ("Application received." + two-business-day note + Close).

### 13. Guides blog index (`Stitchify Blog.dc.html`)
- Cream masthead: purple rule, serif 64px "Guides", 18px intro (max-width 560).
- White body: category filter pills (All / MANUFACTURING / COST / BRAND BUILDING / SHOWROOM; active = ink fill, white text) filtering the grid client-side.
- Tile grid `repeat(auto-fit, minmax(300px, 1fr))`, gap 20. **The whole tile is one `<a>`.** Contents: category eyebrow, serif 30px title, 15px description, then a footer row pinned with `margin-top: auto` holding the read time and a 36px circular arrow.
- Hover on the tile: `translateY(-2px)`, card shadow, border → purple, **and the arrow translates `translateX(8px)` and fills purple with a white glyph** (250ms enter easing). Active: `scale(0.99)`.
- Then the purple CTA band and the standard footer. Six posts ship in the prototype's `POSTS` array.

---

## Interactions & behaviour
| Trigger | Result |
|---|---|
| Scroll up past 60px | Header background → white; scroll down → cream |
| Section enters viewport | `[data-reveal]` blocks fade from `opacity 0 / translateY(8px)` over 600ms via IntersectionObserver (`rootMargin: 0px 0px -8% 0px`, threshold 0.05), unobserved after firing |
| Hero product pill | Sets product; image well cross-fades 400ms; estimate recalculates |
| Spec hotspot | Swaps the spec card content |
| FAQ row | Toggles single-open accordion; `+` rotates 45° |
| Any "Apply to use" | Opens the modal, resets submitted/error state |
| Modal submit | Validates, then error state or confirmation state |
| Language pill | Sets locale (prototype: visual only) |
| Blog category pill | Filters the tile grid |
| Any interactive element | `scale(0.95)` on `:active`; focus-visible `2px solid #4E35E8`, offset 2px |

## State
`product` (T-shirt) · `spec` (1) · `faq` (-1 = all closed) · `modalOpen` · `submitted` · `formError` · `form` {first, last, company, email, phone, country} · `hdrWhite` · `lang` ("EN"). No data fetching - all content is static. In production, the application form should POST to the real applications endpoint and the estimate should come from the pricing service rather than the local formula.

## Responsive behaviour
The prototype fakes viewports with a Desktop/Mobile switch; **implement as a single breakpoint at 768px.** Mobile deltas: section padding drops to `64px 20px` (hero `48px 20px 56px`), header padding `12px 16px`, header nav links hidden, type scales to the mobile sizes listed above, every multi-column flex row wraps to a single column, and the hero card's estimate row wraps. Verified: no horizontal overflow at 390px.

## Assets
- `assets/stitchify-logo-dark.png` (light backgrounds), `assets/stitchify-logo-light.png` (dark backgrounds) - use the repo's own logo assets in production.
- `assets/hero-web.jpg` - hero editorial photograph.
- `assets/creator-1..3.jpg` - SHOWROOM job-card photography; `assets/creator-4.jpg` - Yuki Tanaka avatar. (User-supplied Unsplash photographs.)
- Spec-section flat-lay is hot-linked from Unsplash (`photo-1620799139507-2a76f79a2f4d`) - **replace with a licensed/self-hosted asset before shipping.**
- The Guides background and the hero card's product shots are placeholders in the prototype and still need real photography.

## Notes for implementation
- Fonts: Hind + Noto Sans JP (Google Fonts, as the product already loads them) and Instrument Serif for display.
- No gradients anywhere, including CTAs. Lime is a highlight only, never a CTA or a section fill.
- The MAKE/Showroom segmented control in section 4 is intentionally disabled - don't wire it up.
