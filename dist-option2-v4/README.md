# Stitchify creators page — horizontal scroll + hover zoom + a real bug fix

Replaces the previous version.

## What changed

1. **Horizontal scroll.** Influencers / Photographers / Models are now a
   horizontal scroll-snap carousel instead of a vertical stack - scroll
   or swipe sideways to compare them, with a visible peek of the next
   card as a hint that there's more. Plain CSS (scroll-snap-type), no
   script.
2. **Hover zoom kept** from the previous version - each photo scales up
   slightly on hover. Desktop-only by design (no hover on touch).
3. **A real bug fix, unrelated to what you asked for but found along
   the way:** "Back to roles" and "Next: Photographers/Models" were
   hardcoded English and had no language gate, so they were showing up
   as literal English text on the Japanese page. Fixed - on the
   Japanese route these now render icon-only, with an English
   aria-label for screen readers rather than nothing. Confirmed zero
   English text visible on /creators/ (the Japanese route) after the fix.

## Verified, not assumed

- All 42 tests pass, including the one that fails the build if any
  <script> tag appears on this page.
- Scrolled the actual container in a real browser and screenshotted at
  two scroll positions - Influencers, then snapped to Photographers with
  a peek of Models.
- Checked at a 390px mobile viewport - the card stacks vertically inside
  the horizontal scroller correctly, swipe still works.
- Paths are relative, verified against the real nested structure at:

      https://pjstitchify.github.io/stitchifyui/dist-option2/en/creators/

  with zero failed requests.

## To put this on GitHub

Replace everything in `dist-option2` with these files.
