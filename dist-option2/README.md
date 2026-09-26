# Stitchify creators page — Option 2 (GitHub Pages ready)

Back to roles, plus a "Next: [role]" button that steps forward through
Influencers → Photographers → Models without scrolling back up. Models
(the last panel) only shows "Back to roles", since there's nowhere
further to go.

Every internal link and asset uses a **relative** path based on each
file's actual folder depth, so it works correctly nested inside
`dist-option2/` the way it is on GitHub. Verified against the exact
structure at:

    https://pjstitchify.github.io/stitchifyui/dist-option2/en/creators/

with zero failed requests.

## To put this on GitHub

Create (or replace) a `dist-option2` folder in the repo with these files.
