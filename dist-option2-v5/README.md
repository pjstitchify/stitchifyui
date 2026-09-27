# Stitchify creators page — tabs, replacing the horizontal scroll

Replaces the previous version. Influencers / Photographers / Models are
now tabs, not a horizontal scroll-snap carousel: click a tab, see that
role's full panel, the other two are hidden entirely.

## How it works

Classic CSS-only tabs: three hidden radio inputs (one per role, first
one checked by default), three visible <label> buttons acting as the
tab bar, and a `:checked ~` sibling rule per panel. No script - this
technique has worked in every browser for well over a decade, chosen
deliberately after the last two attempts (animation-timeline:view(),
background-attachment:fixed) both turned out to have real reliability
gaps for this page.

"Next: Photographers" / "Next: Models" at the bottom of a panel are
labels too, pointing at the next role's radio - clicking one switches
tabs the same way the tab bar does. Models, being last, has no Next
button. "Back to roles" is gone - with tabs there's no long scroll to
escape from.

## Two real bugs found and fixed while building this

1. Tab labels were built with `element()` instead of `text()`, meaning
   copy-sourced text would have gone into the page unescaped - exactly
   the class of bug this codebase's own security test exists to catch.
   Fixed by switching to `text()`; confirmed via that test now passing.
2. The three photo cards above the tabs used to link to `#influencer`
   etc, which no longer exist as scroll targets. A link can't also
   check a radio button - those are two different mechanisms. Cards now
   link to the tab strip itself (landing on Influencers) rather than
   falsely promising a jump to a specific tab.

Also cleaned up a block of genuinely dead CSS (old bento-grid rules,
an unused nav-back class) left over from earlier in this session.

## Verified, not assumed

- All 42 tests pass, including the no-<script> test and the
  copy-escaping security test.
- Clicked through all three tabs in a real browser: each shows only
  its own panel, correct accent colour, correct content, "Next"
  present/absent correctly.
- Checked at 390px mobile - tab bar fits, panels stack correctly.
- Confirmed zero English text visible on the Japanese route (the
  "Next: X" / tab labels are icon-only there, with an English
  aria-label for screen readers).
- Paths are relative, re-verified against the real nested structure at:

      https://pjstitchify.github.io/stitchifyui/dist-option2/en/creators/

  with zero failed requests, and the tab click still works correctly
  after the relative-path rewrite.

## To put this on GitHub

Replace everything in `dist-option2` with these files.
