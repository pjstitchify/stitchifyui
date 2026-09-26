# Stitchify — role panel navigation mockups

Two options for moving between the Influencers/Photographers/Models detail
panels without scrolling back up manually.

## Open them

Just double-click `option1.html` or `option2.html` — no server needed,
everything is self-contained with relative paths.

Or push this whole folder to a GitHub repo and enable **GitHub Pages**
(Settings → Pages → Deploy from branch → root), then visit:

```
https://<username>.github.io/<repo>/option1.html
https://<username>.github.io/<repo>/option2.html
```

## What's what

- `option1.html` — a single "Back to roles" link
- `option2.html` — "Back to roles" plus a "Next: [role]" button
- `assets/` — the real site.css, fonts and buttons.css, copied straight
  from the current build, so what you see here matches the live site
  exactly (not an approximation)

Both are built around the real Photographers panel markup and styling.
