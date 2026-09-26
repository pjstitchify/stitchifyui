# Stitchify creators page — redesigned, single option going forward

This replaces both earlier option folders. From here on there is one
version: Option 2's back+next navigation, now with the three role panels
redesigned.

## What changed from the last version

1. Each role panel (Influencers / Photographers / Models) now pairs a
   real photo with the point list, sides alternating per role, instead
   of a full-width text grid. Same photos already used on the tilt-cards
   above, for visual continuity.
2. Subtle parallax on each photo as its panel scrolls through view - the
   image drifts slightly against the scroll. CSS-only (animation-timeline:
   view()), no script. Falls back to no motion on browsers that don't
   support it yet, and is disabled entirely under prefers-reduced-motion.
3. Influencers' copy was noticeably denser than the other two roles -
   trimmed to the same facts, fewer words.
4. Back-to-roles and Next-role navigation carried over unchanged.

Every internal link and asset uses a relative path, verified against the
real nested structure at:

    https://pjstitchify.github.io/stitchifyui/dist-option2/en/creators/

with zero failed requests.

## To put this on GitHub

Delete everything currently in `dist-option1` and `dist-option2` in the
repo (we are down to one version now), and replace `dist-option2` with
the contents of this folder.
