# TOLK Typography

## Purpose
This file fixes the typography approach for TOLK as a system-level reference.

It should answer:
- what textual mood the project should hold;
- which font roles exist;
- which font families are allowed in implementation;
- which font sizes are allowed on the page;
- how headings, body text, meta text, and navigation should behave.

This document should be read together with:
- [visual-direction.md](/home/rotvein/Desktop/TOLK_design/docs/design/system/visual-direction.md)
- [design-tokens.md](/home/rotvein/Desktop/TOLK_design/docs/design/system/design-tokens.md)

## Typography Intent
TOLK typography should feel editorial, intelligent, and composed.

It must not feel:
- startup-like;
- ornamental for its own sake;
- church-decorative;
- luxury-glossy;
- tech-product generic.

The text system should create atmosphere through:
- strong serif display moments;
- calm sans-serif reading text;
- restrained uppercase metadata;
- consistent spacing and vertical rhythm.

## Core Principles
- Typography is a primary expressive tool, not a neutral transport layer.
- Display type should feel literary and sculpted, not flashy.
- Body text should stay readable and calm in long passages.
- Meta text should be clean, compressed, and structurally useful.
- The same small set of type sizes should repeat across the page.
- Visual hierarchy should come more from role and spacing than from constant size variation.

## Font Roles

### 1. Display
Used for:
- `h1`
- `h2`
- `h3`
- logo mark where serif character is desirable

Desired character:
- editorial serif;
- high-contrast but not fragile;
- adult, composed, literary;
- readable in Cyrillic.

### 2. Body
Used for:
- paragraph text;
- long descriptions;
- supporting explanatory copy;
- button labels if no special reason exists to deviate.

Desired character:
- neutral but not corporate;
- readable in long blocks;
- strong Cyrillic support;
- good rendering in browser without visual noise.

### 3. Meta
Meta is not a separate family by default.
It is usually the same family as body, used with different size, tracking, and weight.

Used for:
- navigation;
- eyebrows;
- labels;
- timestamps;
- small utility text;
- secondary brand line.

## Approved Font Sets

### System Direction Level
At direction level, the system requires:
- one editorial serif display family;
- one readable sans-serif body family.

### Current Real Webfont Set For `about.html`
Current implemented webfonts:
- `Cormorant Garamond` for display
- `Source Sans 3` for body and meta

Current CSS tokens:
- `--font-display: "Cormorant Garamond", "Times New Roman", serif;`
- `--font-body: "Source Sans 3", "Segoe UI", "Helvetica Neue", sans-serif;`

### Fallback Policy
Fallbacks are required, but typography should not rely on generic `serif` / `sans-serif` as the primary visual result.

If a page depends on typography quality for its mood, real webfonts should be connected explicitly.

## Weight Policy

### Display
- preferred working weights: `500`, `600`
- avoid very thin display weights in browser rendering
- avoid synthetic italics and accidental oblique fallback

### Body
- preferred working weights: `500`, `600`
- standard reading text may use `500`
- stronger interface emphasis may use `600` or `700`

### Meta
- usually `600` or `700`
- uppercase labels should rely on spacing and casing, not extreme size reduction alone

## Global Size System
The page should use no more than 4 core type sizes as a default rule.

Current approved size set:
- `--type-display-size`
- `--type-title-size`
- `--type-body-size`
- `--type-meta-size`

Current values:
- `--type-display-size: clamp(38px, 5vw, 64px)`
- `--type-title-size: clamp(30px, 3.6vw, 48px)`
- `--type-body-size: 16px`
- `--type-meta-size: 12px`

## Size Roles

### Display Size
Use for:
- main hero headline
- rare largest page-level emphasis

Do not use for:
- standard cards
- utility headings
- repeated section rows

### Title Size
Use for:
- card headings
- section headings inside content cards
- `voice-card h3`
- major content titles

This should be the dominant heading size across the page.

### Body Size
Use for:
- standard paragraphs
- explanatory text
- descriptive copy
- card text

This should be the default reading size.

### Meta Size
Use for:
- navigation
- eyebrows
- labels
- small footer text
- supportive brand text

## Current Exceptions
Exceptions should be rare and justified.

At the moment, the main intentional exceptions are:
- navigation text in some contexts uses `14px` for parity with `home-mvp.html`;
- brand mark uses a fixed size for visual identity consistency.

If a page starts accumulating many exceptions, the system is drifting and should be normalized back to the 4-size scale.

## Spacing Rules Around Text

### Under Headings
Inside cards, the downward spacing under the heading block should be singular and non-stacking.

Rule:
- there should be one active bottom spacing under the heading area;
- default value: `24px`;
- `h2/h3` inside `.section-head` should not add their own extra bottom margin;
- direct headings outside `.section-head` may carry the same `24px` themselves.

This rule exists to avoid accidental doubled spacing.

### Paragraph Flow
- paragraph-to-paragraph spacing inside cards should be restrained and repeatable;
- current standard pattern in cards: `p + p { margin-top: 14px; }`

### Eyebrow To Heading
- eyebrow spacing should stay tighter than heading-to-body spacing;
- eyebrow should feel attached to the title block, not detached from it.

## Tracking And Line Height

### Display
Current direction:
- tight tracking is allowed;
- line-height may be compact;
- but must not damage Cyrillic readability.

Practical rule:
- avoid overly aggressive negative tracking if the selected serif looks unstable in browser rendering.

### Body
- line-height should favor calm reading;
- target feeling: literary and breathable, not UI-tight.

### Meta
- uppercase labels may use increased letter-spacing;
- spacing should remain crisp, not noisy.

## Component Mapping

### Hero
- headline: display size
- supporting paragraph: body size
- eyebrow: meta size

### Content Cards
- title: title size
- paragraphs: body size
- eyebrow / label: meta size

### Voice Cards
- person name: title size
- description: body size

### Navigation
- item labels: meta-sized interface text
- same sizes should match between `home` and `about`

### Footer
- footer text: meta size

## Responsive Behavior
- Typography should remain based on the same 4 roles.
- Responsive behavior should come primarily from clamp-based display/title sizes and layout changes, not from introducing many extra font sizes.
- Mobile should not become a separate typography system.

## Anti-Patterns
Avoid:
- relying on unconnected system fallback fonts as the final aesthetic result;
- introducing one-off font sizes for isolated blocks;
- using thin serif weights that render poorly in-browser;
- mixing too many type scales on one page;
- letting spacing under headings be controlled by multiple stacked margins;
- making nav typography drift from page to page.

## Implementation Notes
- If typography is visually important on a page, connect real webfonts explicitly.
- Before approving a new serif, check Cyrillic rendering in browser, not just Latin previews.
- When adjusting hierarchy, prefer changing role assignment before inventing new size steps.
- If a component looks typographically “off”, first inspect:
  - actual rendered font family;
  - font weight;
  - tracking;
  - line-height;
  - stacked heading margins.

## Current Recommended Baseline
For current MVP work, the baseline recommendation is:
- display: `Cormorant Garamond`
- body/meta: `Source Sans 3`
- max 4 size roles per page
- single 24px heading-to-body gap inside cards
- consistent nav typography between `home` and `about`

