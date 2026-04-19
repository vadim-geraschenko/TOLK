# TOLK Design Tokens

## Token Basis
Source direction: `Nocturnal Editorial`

This is a lightweight reusable token set for the responsive TOLK web experience. It is built for a dark editorial site with clean tonal contrast, fine framing, restrained symbolism, and selective ambient motion.

## Assumptions
- Platform priority: responsive web, desktop-first mood with strong mobile support.
- Density preference: balanced, with selective airy sections.
- Accessibility: text and core controls should maintain strong contrast even when decorative layers are present.
- Imagery is important, but should sit inside a disciplined layout system.
- Motion should degrade gracefully and respect reduced-motion settings.
- The current `home-mvp.html` uses a silver-toned, graphite-first palette rather than a gold-first palette.

## Core Palette

### Background Foundations
- `bg.canvas` — `#0F1114`
  Main site canvas. Charcoal-black with enough lift to avoid dead black.
- `bg.surface-1` — `#171A1F`
  Standard section surface.
- `bg.surface-2` — `#20242A`
  Raised card and panel surface.
- `bg.surface-3` — `#252A30`
  Highest dark elevation for focused overlays or emphasized cards.
- `bg.inset` — `#0B0D10`
  Deep inset zone for media wells, nav recesses, and dramatic separators.

### Text And Neutrals
- `text.primary` — `#F2F4F7`
  Main reading text and high-priority labels.
- `text.secondary` — `#C6CBD2`
  Supporting text with a cooler editorial neutrality.
- `text.muted` — `#8D959F`
  Metadata, timestamps, secondary UI labels.
- `text.inverse` — `#121418`
  For light-on-pale chips when needed.

### Accent Neutrals
- `accent.silver` — `#CFD6DF`
  Primary accent for eyebrows, fine lines, rings, and editorial emphasis.
- `accent.silver-hot` — `#EEF2F6`
  Highest-contrast pale accent for active labels and select status elements.
- `accent.silver-soft` — `#BCC6D2`
  Subtle contour and quiet UI separators.
- `accent.steel` — `#7E8EA0`
  Cooler structural support tone for metadata and secondary framing.

### Atmospheric Colors
- `fx.halo` — `rgba(255, 255, 255, 0.08)`
  Pale halo and aureole washes.
- `fx.fog` — `rgba(226, 231, 238, 0.04)`
  Haze for media transitions and cinematic overlays.
- `fx.cool-bloom` — `rgba(126, 142, 160, 0.08)`
  Rare low-contrast cool bloom for background depth only.

### Semantic Colors
- `state.info` — `#BCC6D2`
- `state.success` — `#7FA676`
- `state.warning` — `#CFD6DF`
- `state.locked` — `#89929C`
- `state.error` — `#A96565`

## Semantic Surface Rules
- Default sections use `bg.surface-1`.
- Interactive cards use `bg.surface-2`.
- Featured cards or current-event cards may use `bg.surface-3`.
- Primary accents should appear mostly as linework, text emphasis, small icons, CTA emphasis, and restrained glow edges.
- Warm metallic color should not be a first-class default on the home page.

## Spacing Scale
- `space.2` — `0.125rem`
- `space.4` — `0.25rem`
- `space.8` — `0.5rem`
- `space.12` — `0.75rem`
- `space.16` — `1rem`
- `space.24` — `1.5rem`
- `space.32` — `2rem`
- `space.48` — `3rem`
- `space.64` — `4rem`
- `space.96` — `6rem`
- `space.128` — `8rem`

Usage guidance:
- compact UI internals: `space.8` to `space.16`
- card padding: `space.16` to `space.24`
- section spacing on desktop: `space.48` to `space.96`
- section spacing on mobile: `space.32` to `space.64`

## Layout Widths
- `layout.content-max` — `80rem`
- `layout.text-max` — `44rem`
- `layout.media-max` — `88rem`
- `layout.gutter.desktop` — `2rem`
- `layout.gutter.mobile` — `1rem`

## Typography Scale
Font families are directional placeholders; final implementation can select exact licensed fonts later.

- `font.display`
  High-contrast editorial serif or serif-adjacent display family with sculptural forms.
- `font.body`
  Calm, readable text face with literary rather than product feel.
- `font.meta`
  Cleaner companion face for labels, dates, taxonomies, and utility navigation.

Type tokens:
- `type.hero` — `clamp(2.125rem, 4.2vw, 3.125rem)` / line-height `0.96`
- `type.display-1` — `clamp(2.25rem, 4vw, 3.5rem)` / line-height `0.98`
- `type.display-2` — `clamp(1.75rem, 3vw, 2.625rem)` / line-height `1.02`
- `type.h1` — `clamp(1.75rem, 3vw, 2.5rem)` / line-height `1.08`
- `type.h2` — `clamp(1.375rem, 2.4vw, 1.875rem)` / line-height `1.14`
- `type.h3` — `1.125rem` / line-height `1.22`
- `type.body-lg` — `1.125rem` / line-height `1.65`
- `type.body` — `1rem` / line-height `1.7`
- `type.body-sm` — `0.9375rem` / line-height `1.6`
- `type.meta` — `0.75rem` / line-height `1.35`

Typography guidance:
- display headings should feel sculpted and measured, not flamboyant;
- body text should stay pale, never harsh white in long paragraphs;
- metadata should lean toward steel or soft silver depending on hierarchy.

## Radius Scale
- `radius.xs` — `0.25rem`
- `radius.sm` — `0.5rem`
- `radius.md` — `0.875rem`
- `radius.lg` — `1.25rem`
- `radius.xl` — `1.75rem`
- `radius.frame` — `2rem`

Guidance:
- standard UI cards: `radius.md` to `radius.lg`
- featured editorial modules: `radius.xl`
- frame overlays may combine modest rounding with inset pale borders

## Border And Frame Tokens
- `line.subtle` — `1px solid rgba(242, 244, 247, 0.08)`
- `line.silver` — `1px solid rgba(207, 214, 223, 0.22)`
- `line.silver-soft` — `1px solid rgba(226, 231, 238, 0.1)`
- `line.steel` — `1px solid rgba(126, 142, 160, 0.22)`
- `line.frame-ornament` — double-layer treatment using soft silver outside and faint pale inner contour

Frame guidance:
- frames are a primary motif, not an exception;
- use them to formalize sections, quotes, featured content, and narrative blocks;
- ornaments must remain geometric and sparse;
- halos, arches, and manuscript-derived corners are preferred over floral decoration.

## Shadow And Elevation Rules
Avoid generic black box-shadows. Depth should come from layered contrast and inner illumination.

- `elevation.rest`
  `0 10px 30px rgba(0, 0, 0, 0.22)`
- `elevation.float`
  `0 18px 42px rgba(0, 0, 0, 0.28)`
- `glow.inner-soft`
  `inset 0 0 0 1px rgba(255, 255, 255, 0.03), inset 0 0 32px rgba(255, 255, 255, 0.015)`
- `glow.hover-soft`
  `0 0 0 1px rgba(255, 255, 255, 0.12), 0 0 24px rgba(255, 255, 255, 0.03)`
- `glow.halo`
  `0 0 52px rgba(226, 231, 238, 0.08)`

Usage guidance:
- at rest, components should feel dense and composed;
- on hover, cards brighten slightly from within;
- active glow should remain soft-edged, pale, and restrained.

## Control Sizing Guidance
- `control.height-sm` — `2.25rem`
- `control.height-md` — `2.75rem`
- `control.height-lg` — `3.25rem`
- `control.padding-x-sm` — `0.75rem`
- `control.padding-x-md` — `1rem`
- `control.padding-x-lg` — `1.25rem`

Guidance:
- primary CTAs should feel restrained and editorial rather than luxurious;
- avoid oversized “startup buttons”;
- icons can be ringed, framed, or lightly haloed when they mark important actions.

## Component State Guidance

### Rest
- Surfaces remain matte-charcoal with faint contour definition.
- Accent color is restrained to lines, icons, or small labels.

### Hover
- Introduce slight lift and controlled brightening of pale edges.
- Optional micro motion: 2 to 4 px float or 1% scale, never both aggressively.

### Focus
- Use readable high-contrast ring, mixing pale silver and white.
- Focus indication must remain visible without relying on glow alone.

### Active
- Accent may intensify toward `accent.silver-hot`.
- For special controls, a brief pale glow pulse may appear once, then settle.

### Disabled / Locked
- Shift surfaces cooler and duller.
- Locked premium content can use soft silver framing with a clear lock glyph.

## Image Treatment Rules
- Covers and stills should sit inside framed or softly masked containers.
- Maintain detail; avoid heavy blur overlays on source imagery.
- Prefer neutral-dark grading over cold cinematic blue.
- Featured media may use halo or fog overlays at edges for integration.
- Parallax or layered image motion should be slow and low-amplitude.
- Rounded overlapping imagery is allowed in selected modules, but must remain deliberate rather than decorative.

## Motion Tokens
- `motion.float-slow` — vertical drift, 8 to 14 px amplitude, 7 to 12 s ease-in-out infinite
- `motion.breathe` — 1% to 2% scale / translate blend, 10 to 16 s ease-in-out infinite
- `motion.glow-pulse` — opacity and blur modulation, 4 to 7 s ease-in-out infinite
- `motion.scroll-cinematic` — media progression tied to scroll, with text remaining independently legible

Reduced motion guidance:
- disable float, breathing, and glow traces;
- replace scroll-linked video with static poster or sparse frame progression;
- preserve hierarchy with opacity and contrast rather than motion.

## Special System Zones

### Cinematic Background Section
For `About` and similar narrative sections:
- foreground text blocks use stronger dark backing or gradient shields;
- media sits in a separate depth layer behind content;
- halo, fog, and glow tokens are allowed here at slightly higher intensity than the global baseline;
- frame density may increase to make prose blocks feel authored and anchored.

### Optional Character Layer
Reserved for future use with `reference_3.gif`-type entities:
- size should remain small relative to section content;
- default opacity should be subdued;
- motion should use `motion.float-slow` or contained cursor response;
- the layer should never obscure reading paths or CTA zones.

## Handoff Notes For Page Composer
The home page composition should:
- use framed editorial modules as a recurring structural rhythm;
- prioritize a strong hero, curated entry points, and featured content lanes;
- reserve the more immersive cinematic behavior for selected narrative moments rather than the whole page;
- allow a hierarchy where cards, events, and support blocks all feel part of one clean symbolic visual language.
