# Stitchify MAKE — React source

The MAKE desktop and mobile UIs as React components (previously delivered as built HTML).

## Files
- `src/MakeDesktop.jsx` — the `/make/` app (one default-exported `App` component)
- `src/MakeMobile.jsx`  — the `/make-mobile/` app (one default-exported `App` component)
- `src/icons.js`        — `ICONS` map (Radix icon inner-SVG + the custom needle-and-thread glyph)
- `src/images.js`       — `IMAGES` map (base64 data URIs for the demo product images + logo)
- `src/assets.js`       — sets `window._ICONS` / `window._D` from the two maps above
- `src/index.css`       — fonts (Hind + Noto Sans JP), resets, and the `.stitched` / `.embroidered` button decorations
- `src/main.jsx`        — example entry; switch `MakeDesktop` <-> `MakeMobile`

## Run
```bash
npm install
npm run dev
```

## Important: runtime globals
The components read icons via `window._ICONS` and images via `window._D` (through the internal
`Ic` component and `resolveImg()` helper). `src/assets.js` populates both from `icons.js` / `images.js`,
so you MUST import `./assets.js` **before** the component renders — `src/main.jsx` already does this.

If `window._D` is missing, image areas fall back to a placeholder icon (the app still runs).
To use your own product images, replace the values in `src/images.js` (any of `IMG_0`..`IMG_5`, `LOGO_AUTH`).

## Notes
- Each file is a single self-contained `App` (all sub-components live in the same file).
- Tailwind/UI libraries are NOT required — styling is inline + the small `index.css`.
- Desktop was originally compiled in-browser via Babel; here it's a normal Vite/React module.
