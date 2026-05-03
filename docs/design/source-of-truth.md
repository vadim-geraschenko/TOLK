# TOLK Design Source Of Truth

## Purpose
This file defines which documents are authoritative now.
If documents conflict, resolve by this priority list.

## Priority Order
1. Approved baseline implementation (Next.js):
   - `app/page.tsx`
   - `app/about/page.tsx`
   - `components/home/*`
   - `components/about/*`
2. Snapshot baselines (Next-approved states):
   - `docs/design/pages/home/snapshots/baselines/*`
   - `docs/design/pages/about/snapshots/baselines/*`
3. Critical page specs:
   - `docs/design/pages/home/source/spec.md`
   - `docs/design/pages/about/source/spec.md`
   - `docs/design/pages/about/source/content.md`
   - `docs/design/pages/about/source/background-video-by-images-sequence-animation.md`
4. System rules:
   - `docs/design/system/visual-direction.md`
   - `docs/design/system/typography.md`
   - `docs/design/system/design-tokens.md`
   - `docs/design/system/image-policy.md`
5. Working contracts:
   - `docs/design/memory.md`
   - `docs/design/parity-rules.md`
   - `docs/design/visual-regression.md`
   - `docs/design/viewports.md`
6. Reserve legacy reference (not baseline):
   - `docs/design/pages/home/source/home-mvp.html`
   - `docs/design/pages/about/source/about.html`

## Operational Rule
- Do not treat exploratory notes or screenshots as truth sources.
- `docs/design/for-codex/*` is reference material only.
- If a conflict remains unresolved, escalate to explicit user decision.

## Baseline Status
- Current approved visual baseline for parity and regression is Next.js output.
- HTML MVP files remain as reserve references and historical fallback only.
