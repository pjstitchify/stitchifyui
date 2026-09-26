# Stitchify creators page — full site, option1

This is the complete site (all 4 pages: brand + creators, EN + JA),
not just the role-panel section.

## To preview locally (recommended, always works)

From inside this folder, run:

    python3 -m http.server 8000

Then open:

    http://localhost:8000/en/creators/

## About GitHub Pages

This site uses absolute paths (/assets/..., /en/, /creators/), which only
resolve correctly when served from a domain root. That means:

- Works out of the box on a repo named exactly `<username>.github.io`
  (a personal root-page site)
- Will 404 on assets if pushed to an ordinary project repo like
  `stitchify-check` and served at `/stitchify-check/` — the browser
  looks for assets at the domain root, not under the repo subpath

If you want to use an ordinary project repo, tell me and I'll rewrite
the paths to relative ones first — same content, just safer to deploy
anywhere.
