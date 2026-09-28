# Stitchify creators page - choose your role in the hero

Replaces the previous version (tabs only, further down the page).

## What it does

The hero now has a "Choose your role" row: Influencers / Photographers /
Models. Choosing one changes the page:

- the hero shows that role's own line ("What you hand over is ...")
- the matching card in the gallery gets a ring in its role colour
- the detail panel below switches to that role

The tab bar above the panel still works and stays in sync with the hero,
so you can switch from wherever you are on the page. Influencers is
selected by default.

## How it works (no script)

The three radio inputs now sit at the very top of <main>, ahead of the
hero. Hero pills, gallery cards' highlight and the panels are all
reached with `:checked ~` sibling rules. Same technique as the tabs, so
it inherits the same browser support; the page still contains no
<script> tag, and the test suite enforces that.

All wording comes from copy that already existed (role names and the
"what you hand over" lines), in both languages. The only new wording is
the small "Choose your role" prompt, English only; it is left out on the
Japanese page rather than guessing at Japanese phrasing.

## Notes / limits

- The three photo cards still link to the tab strip; a link can scroll
  but cannot also select a role, so they land on whichever role is
  currently chosen.
- On a phone the pills fit on one row down to 360px wide; the role line
  has a soft white backing so it stays readable over the moving photos.

## Verified

- 42/42 tests, including new ones: radios precede the hero, each hero
  pill points at its own radio, role names/lines are real copy, and the
  English prompt is absent on the Japanese route.
- Clicked through in a browser: hero -> panel, tab bar -> hero, both
  directions stay in sync.
- Japanese page: pills show インフルエンサー / カメラマン / モデル.
- Relative paths, checked at
  https://pjstitchify.github.io/stitchifyui/dist-option2/en/creators/
  depth with zero failed requests.

## To put this on GitHub

Replace everything in `dist-option2` with these files.
