# Stitchify creators page - eight requested changes

Replaces the previous version.

1. Banner: the "CHOOSE YOUR ROLE" prompt and the role line
   ("What you hand over is the post URL.") are removed. Only the three pills remain.
2. Card section: the "01 ROLES" label is removed (English and Japanese).
3. "The pay is fixed. The brand pays the fee, and the agreed amount is paid to
   you in full." is on a single line at 900px and wider. On phones it wraps
   naturally, since one line would run off the screen.
4. Headline: "Wear the clothes. Share them." is now "Wear it. Sell it." /
   "Get paid." - your words, broken between sentences because one line does not
   fit the hero column. English only; the Japanese headline is untouched.
5. Banner pills are links: one click both switches to that role and scrolls
   to its panel, landing with the tab bar visible under the header. The tab bar
   does the same. Each role also has its own address, e.g.
   .../en/creators/#panel-photographer. Influencers shows when there is no
   fragment.
6. The "Share, shoot, wear." cards are plain cards - not links, no pointer.
7. The "Next:" buttons are removed.
8. Photographers: the panel ("Product and look.") and the card use the same
   photo of a photographer at work (corridor-9.webp, already in the project).

## How item 5 works (and what changed underneath)

A <label> can select a role but cannot scroll; a link can scroll but cannot
select. To get both from one click the role is now chosen by the URL fragment
(:target) rather than by radio inputs, which are gone. No script; the page
still has no <script> tag (a test enforces this). It needs :has(), supported
by all current browsers; where it is missing, all three panels simply stack.

## Two behaviours worth knowing

- Choosing a role puts #panel-... in the address bar. Following a different
  in-page link (e.g. the header's FAQ) drops it, and the panel falls back to
  Influencers if you scroll back up.
- The photo for item 8 shows fashion photography of a model in a studio, not
  a product-only shoot. It is a single file, so swapping it is one change
  (PHOTOGRAPHER_PHOTO in site/build.py) and the card and panel both follow.

## Verified

- 42/42 tests (updated to describe the new behaviour, including a guard on the
  scroll landing position).
- Real-browser checks: all three pills and all three tabs, default state, deep
  link, tab bar clear of the header at 390 / 768 / 1440px, Japanese page,
  one row of pills on a phone, no horizontal scroll.
- Relative paths, checked at
  https://pjstitchify.github.io/stitchifyui/dist-option2/en/creators/ depth:
  zero failed requests, all three pill clicks work.

Not tested: real Safari (WebKit could not be installed in the build
environment), and the no-:has() fallback.

## To put this on GitHub

Replace everything in `dist-option2` with these files.
