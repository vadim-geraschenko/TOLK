# Visual regression contract

## Purpose
This file defines the expected workflow for visual regression checks on TOLK.

It is intentionally pragmatic:
- what to compare,
- where screenshots live,
- how to name them,
- when a diff is a failure.

## Pages in scope
- `home`
- `about`

## Source of truth for baselines
Until the user explicitly re-approves the Next.js output as the new visual baseline:
- `docs/design/pages/home/source/home-mvp.html`
- `docs/design/pages/about/source/about.html`

This means current screenshots should be compared against the HTML MVP unless another baseline is explicitly approved.

## Folder structure

### Home
- `docs/design/pages/home/snapshots/baselines/`
- `docs/design/pages/home/snapshots/current/`
- `docs/design/pages/home/snapshots/diffs/`

### About
- `docs/design/pages/about/snapshots/baselines/`
- `docs/design/pages/about/snapshots/current/`
- `docs/design/pages/about/snapshots/diffs/`

## Capture commands
Baseline capture:
- `npm run baseline:home`
- `npm run baseline:about`

Current capture:
- `npm run current:home`
- `npm run current:about`

Current capture scripts are intended for the migrated implementation and default to:
- `http://127.0.0.1:3000/` for `home`
- `http://127.0.0.1:3000/about` for `about`

They can be pointed at another target with:
- `--base-url`
- `--path`

## Recommended naming
Use one consistent naming scheme:

### Home
- `home-1440-default.png`
- `home-1440-hero-button-hover.png`
- `home-1440-hero-button-active.png`
- `home-1440-episode-card-hover.png`
- `home-1440-participant-hover.png`
- `home-1440-social-button-hover.png`
- `home-390-default.png`
- `home-390-hero-button-hover.png`
- `home-390-hero-button-active.png`
- `home-390-episode-card-hover.png`
- `home-390-participant-hover.png`
- `home-390-social-button-hover.png`

### About
- `about-1440-default-full.png`
- `about-1440-top-viewport.png`
- `about-1440-sequence-early.png`
- `about-1440-pair-1-mid.png`
- `about-1440-pair-2-mid.png`
- `about-1440-reading-method.png`
- `about-1440-pair-3-mid.png`
- `about-1440-voices.png`
- `about-1440-audience.png`
- `about-1100-static-full.png`
- `about-1100-static-top.png`
- `about-390-default-full.png`
- `about-390-voices.png`

## Required capture rules
- Use the same viewport for baseline, current, and diff.
- Use the same page state.
- Do not compare a top-of-page screenshot against a mid-scroll screenshot.
- Wait for full render before capture.
- For `about`, do not trust a screenshot if the background frame sequence or cloud layer has clearly not settled.
- Before full-page capture, wait for:
  - `domcontentloaded`
  - `networkidle`, if possible
  - `document.fonts.ready`
  - image/frame readiness
  - a short additional delay
- Baseline capture should use Playwright-friendly settings:
  - `animations: "disabled"`
  - `caret: "hide"`
  - `scale: "css"`

## About-specific baseline states
`about` needs more than one top-of-page screenshot. The baseline set should explicitly cover:
- desktop top state with the initial card stack;
- an early sequence state where the background frame has already changed;
- mid-scroll states for all three pair-card scenes;
- the `Как Мы Читаем` state;
- the `Три точки зрения` state;
- the `Для кого TOLK` state;
- the `1100px` static fallback state;
- the mobile full-page fallback;
- a mobile state around the voices block.

## Current technical caveat
Headless browser screenshots can be misleading if they are captured before CSS or heavy visual layers finish initializing.

So:
- do not treat a broken capture as proof of a broken layout;
- verify whether the screenshot itself is reliable before acting on the diff.

For `home` specifically:
- decorative off-screen layers should not be allowed to define the effective capture width;
- baseline capture should use viewport width plus true document height;
- the decorative layers themselves should be redesigned over time so they do not unnecessarily inflate scrollable area.

For `about` specifically:
- intermediate motion states are part of the baseline contract, not an optional extra;
- the desktop baseline must cover clouds, frame-sequence progression, and pair-card motion states;
- mobile and `1100px` fallback captures should be treated as separate visual modes, not as degraded desktop screenshots.
- some desktop motion states may produce tiny non-user-visible pixel drift even when the visual result is effectively identical;
- if this happens, tolerances should be explicit and file-specific, not global and not hand-waved.

## Failure rule
A visual diff is a failure unless the difference is explicitly listed as acceptable in `docs/design/parity-rules.md`.

## Acceptance rule
A parity task should be considered successful only when:
1. the code builds,
2. the relevant viewport checks are captured,
3. the remaining visual differences are either negligible or explicitly accepted.
