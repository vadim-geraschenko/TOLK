# TOLK operational memory

> Status: active operational guide.
> Authority order is defined in `docs/design/source-of-truth.md`.

## Purpose
This file is not a full project spec.

It exists to reduce avoidable mistakes during design, layout, parity, and migration work.

## Current project state
- The project is in an in-between state: approved HTML MVP sources exist, and a Next.js migration has already started.
- For visual and content parity work, the HTML MVP remains the safer source of truth unless the user explicitly approves the Next.js version as the new baseline.
- `home` and `about` should not be treated as if they share one universal responsive composition. `about` is intentionally more authored and more fragile.

## Source of truth

### System level
- `docs/design/system/visual-direction.md`
- `docs/design/system/design-tokens.md`
- `docs/design/system/typography.md`
- `docs/design/system/image-policy.md`

### Page level
- `docs/design/pages/home/source/spec.md`
- `docs/design/pages/home/source/home-mvp.html`
- `docs/design/pages/about/source/spec.md`
- `docs/design/pages/about/source/content.md`
- `docs/design/pages/about/source/background-video-by-images-sequence-animation.md`
- `docs/design/pages/about/source/about.html`

### Migration context
- `docs/design/pages/home/production-migration-note.md`
- `.local/nextjs-migration-plan.md`

## Conflict handling
- If `.md` and current HTML differ, do not silently pick a new truth source.
- Report the mismatch unless the user already defined a priority for that exact case.
- For `about` background and motion details, `about.html` plus `background-video-by-images-sequence-animation.md` have higher authority than stale descriptive text.

## Current design direction guardrails
- The approved direction is still `Nocturnal Editorial`.
- The project should stay graphite-first and silver-led.
- Do not introduce warm metallic or mystical-premium styling as a default language.
- Symbolic religious cues must stay reduced and controlled.
- The interface should remain dry, editorial, calm, and deliberate.

## Things not to improve "from taste" without approval
- Do not redesign during parity or migration work.
- Do not rewrite copy unless explicitly asked.
- Do not normalize visual quirks if they are present in the approved HTML and are clearly intentional.
- Do not simplify motion architecture just because it is harder to maintain.
- Do not merge `home` and `about` into one flatter generic component language if that reduces the authored feel of `about`.

## Fragile areas
- `about` spacing is sensitive.
- Pair-card behavior in `about` is fragile.
- Desktop and non-desktop compositions in `about` should be treated as separate compositions, not automatic stack-downs.
- Header and navigation should stay visually aligned with `home-mvp`.
- Typography consistency is a project-wide constraint and should be checked against `docs/design/system/typography.md`.

## What must stay consistent
- Header pattern across `home` and `about`
- Button system
- Card material language
- Editorial serif / calm sans pair
- Section rhythm
- CTA labels unless an intentional copy pass is requested

## Working rule for parity tasks
- Visual parity must be checked against screenshots or source HTML, not only against code.
- A task is not “done” just because the code builds.
- If reliable visual verification is unavailable, say so explicitly.
