# Visual test viewports

## Purpose
These are the control widths that matter for TOLK layout verification.

They are based on:
- current HTML MVP breakpoints,
- current migration notes,
- current responsive risks in `home` and `about`.

## Required

### Home
- `1280px`
  Main desktop editorial layout
- `1100px`
  Edge of compact desktop / large tablet behavior
- `979px`
  Hero + reading-card transition zone
- `760px`
  Main mobile breakpoint
- `561px`
  Reading-card two-column edge case
- `520px`
  Tight mobile breakpoint
- `390px`
  Small-phone sanity check

### About
- `1440px`
  Main cinematic desktop check
- `1100px`
  Desktop-to-static-background transition threshold
- `760px`
  Main non-desktop composition check
- `520px`
  Tight mobile composition check
- `390px`
  Small-phone readability check

## Optional
- `1024px`
  Useful if a tablet-specific check is needed for migration work
- `1280px` for `about`
  Useful for parity screenshots when `1440px` is unavailable

## What to watch at each width

### Desktop
- section composition
- card proportions
- hero balance
- lower-row balance on `home`
- pair-card motion and background scene on `about`

### Mid widths
- breakpoint transitions
- stacking order
- card width limits
- spacing continuity

### Mobile
- grouping readability
- no accidental full-width overstretch where max-width should remain constrained
- no horizontal scroll
- preserved hierarchy despite simplified motion
