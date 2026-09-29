# Stitchify creators page - gallery moved and merged, steps redesigned

Replaces the previous version.

## 1. "Share, shoot, sell." moved and merged

- Text changed from "Share, shoot, wear." to "Share, shoot, sell." (English
  only; Japanese unchanged, still 発信、撮影、着用。).
- The card gallery is no longer its own section near the hero. It now lives
  directly above "Confirm the terms, then begin.", inside the same lime
  section - one continuous block: gallery heading, the three cards, then the
  closing headline, body and CTA button.
- The fluorescent/lime background is kept - it's the same .kinetic-final
  background that was already there, now wrapping both parts.
- Cards are not clickable: confirmed no <a>, no pointer cursor, and (new in
  this change) the hover lift is gone too, so nothing about them suggests
  they can be clicked.

## 2. "From the offered amount to delivery." redesigned

Previously: three flat items with a thin top border, no colour, no imagery.
Now: each step is a bordered card with a round numbered badge, a small icon
top-right, and a dashed stitch line threading across all three (hidden on
phones, where the cards stack). Same three steps, same wording - this is a
visual change only.

## Notes

- The header/footer "SHOWROOM" link now lands on this combined closing
  section rather than a standalone gallery - it still makes sense, since
  the section is literally labelled "STITCHIFY SHOWROOM".
- No script anywhere; the no-<script> test still passes.

## Verified

- 42/42 tests, including new ones for the merged section and the redesigned
  steps.
- Real-browser checks: page order (hero, picker, tabs, tail - gallery no
  longer near the top), cards have no <a> and cursor:auto, both languages,
  desktop + phone screenshots of both changed sections.
- Relative paths, checked at
  https://pjstitchify.github.io/stitchifyui/dist-option2/en/creators/ depth:
  zero failed requests, hero pill click still switches the panel.

Not tested: real Safari (WebKit would not install in the build environment).

## To put this on GitHub

Replace everything in `dist-option2` with these files.
