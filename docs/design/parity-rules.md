# TOLK parity rules

## Purpose
This file defines what must match, what may differ slightly, and what is not important enough to block a parity task.

Use it during:
- HTML-to-production migration,
- visual regression review,
- layout repair after refactors.

## Default source of truth
Unless the user says otherwise, parity is judged against:
- current Next.js implementation (`app/*`, `components/*`) validated by approved snapshot baselines in:
  - `docs/design/pages/home/snapshots/baselines/`
  - `docs/design/pages/about/snapshots/baselines/`

Legacy HTML MVP stays as reserve reference only.

## Must match

### Shared
- overall dark editorial tone
- typography roles and relative hierarchy
- header structure and navigation pattern
- button family and button feel
- card material language
- section rhythm
- no horizontal scroll

### Home
- first-screen composition:
  - left hero frame
  - right reading card on wide layouts
- section order
- section dividers between major sections
- participants block rhythm and hierarchy
- four-card episode row on desktop
- lower row composition and ratio logic
- merch + socials as the closing paired block

### About
- hero tone and constrained width
- story structure as alternating single and pair logic
- pair-card scenes staying visibly distinct from ordinary cards
- voices section hierarchy
- audience and continuation cards as ordinary cards, not banner-style exceptions
- desktop-only heavy background treatment
- non-desktop degradation prioritizing readability and stability

## Can differ slightly
- exact shadow softness
- exact grain density
- exact frame of the `about` image sequence at a given scroll position
- micro-timing of hover and ambient motion
- tiny differences in cloud drift
- tiny line thickness variations caused by browser rendering

## May differ if explicitly intentional
- internal code structure
- component boundaries
- data layer structure
- how motion logic is organized under the hood

These are allowed to change as long as visual behavior and hierarchy remain aligned.

## Not important enough to block parity on their own
- sub-pixel rasterization differences between browsers
- tiny antialiasing differences in serif type
- negligible one-frame motion desync in a screenshot if live behavior is correct

## Automatic failure conditions
- broken layout
- collapsed sections
- missing major content blocks
- missing dividers where they define page rhythm
- wrong navigation hierarchy
- missing or visibly broken background scene on `about` desktop
- mobile layout that reads as a generic card dump instead of grouped authored content
- any introduced horizontal overflow
- typography drift that changes the perceived tone of the page

## Rule for migration work
- Do not use “it is cleaner in code” as a reason to accept a visible regression.
