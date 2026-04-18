# TOLK Design Tokens

## Token Basis
Source direction: `Nocturnal Editorial`

This is a lightweight reusable token set for the responsive TOLK web experience. It is built for a dark editorial site with cinematic warmth, fine framing, restrained symbolism, and selective ambient motion.

## Assumptions
- Platform priority: responsive web, desktop-first mood with strong mobile support.
- Density preference: balanced, with selective airy sections.
- Accessibility: text and core controls should maintain strong contrast even when decorative layers are present.
- Imagery is important, but should sit inside a disciplined layout system.
- Motion should degrade gracefully and respect reduced-motion settings.

## Core Palette

### Background Foundations
- `bg.canvas` — `#111214`
  Main site canvas. Charcoal-black with enough lift to avoid dead black.
- `bg.surface-1` — `#17191C`
  Standard section surface.
- `bg.surface-2` — `#1D2024`
  Raised card and panel surface.
- `bg.surface-3` — `#262A30`
  Highest dark elevation for focused overlays or emphasized cards.
- `bg.inset` — `#0C0D0F`
  Deep inset zone for media wells, nav recesses, and dramatic separators.

### Text And Neutrals
- `text.primary` — `#F3F1EA`
  Main reading text and high-priority labels.
- `text.secondary` — `#C8C1B4`
  Supporting text with warmth.
- `text.muted` — `#928B80`
  Metadata, timestamps, secondary UI labels.
- `text.inverse` — `#121316`
  For light-on-gold or light-on-ivory chips when needed.

### Accent Metals
- `accent.gold` — `#C7A45B`
  Primary gold accent.
- `accent.gold-soft` — `#A88749`
  Muted gold for thin lines and secondary highlights.
- `accent.gold-hot` — `#E0BC72`
  High-energy gold for active glow moments only.
- `accent.silver` — `#A8B0BA`
  Cool balancing accent for metadata, secondary frames, and mixed-metal detailing.
- `accent.silver-soft` — `#7F8791`
  Subtle silver contour and quiet UI separators.

### Atmospheric Colors
- `fx.ember` — `#E98A3A`
  Rare ember-like motion accents.
- `fx.storm` — `#C9B36A`
  Gold-lightning / thunder accent, used sparingly.
- `fx.halo` — `rgba(236, 203, 128, 0.22)`
  Halo and aureole washes.
- `fx.fog` — `rgba(255, 247, 230, 0.05)`
  Haze for media transitions and cinematic overlays.

### Semantic Colors
- `state.info` — `#A8B0BA`
- `state.success` — `#7FA676`
- `state.warning` — `#C7A45B`
- `state.locked` — `#8F8573`
- `state.error` — `#A96565`

## Semantic Surface Rules
- Default sections use `bg.surface-1`.
- Interactive cards use `bg.surface-2`.
- Featured cards or current-event cards may use `bg.surface-3`.
- Gold should appear mostly as linework, text emphasis, small icons, CTA emphasis, and glow edges.
- Silver should support information architecture, not compete with gold.

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
- card padding: `space.20` equivalent via `space.16` plus local offsets, or `space.24`
- section spacing on desktop: `space.64` to `space.128`
- section spacing on mobile: `space.32` to `space.64`

## Layout Widths
- `layout.content-max` — `76rem`
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
  Narrower or cleaner companion face for labels, dates, taxonomies, and utility navigation.

Type tokens:
- `type.hero` — `clamp(3.5rem, 7vw, 7rem)` / line-height `0.94`
- `type.display-1` — `clamp(2.75rem, 5vw, 4.75rem)` / line-height `0.98`
- `type.display-2` — `clamp(2rem, 4vw, 3rem)` / line-height `1.02`
- `type.h1` — `clamp(1.75rem, 3vw, 2.5rem)` / line-height `1.08`
- `type.h2` — `clamp(1.375rem, 2.4vw, 1.875rem)` / line-height `1.14`
- `type.h3` — `1.125rem` / line-height `1.22`
- `type.body-lg` — `1.125rem` / line-height `1.65`
- `type.body` — `1rem` / line-height `1.7`
- `type.body-sm` — `0.9375rem` / line-height `1.6`
- `type.meta` — `0.75rem` / line-height `1.35`

Typography guidance:
- display headings should feel sculpted and measured, not flamboyant;
- body text should stay warm-white, never pure stark white on large paragraphs;
- metadata may lean toward silver or muted gold depending on hierarchy.

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
- frame overlays may combine modest rounding with inset gold borders

## Border And Frame Tokens
- `line.subtle` — `1px solid rgba(243, 241, 234, 0.08)`
- `line.silver` — `1px solid rgba(168, 176, 186, 0.34)`
- `line.gold` — `1px solid rgba(199, 164, 91, 0.52)`
- `line.gold-soft` — `1px solid rgba(199, 164, 91, 0.24)`
- `line.frame-ornament` — double-layer treatment using `accent.gold-soft` outside and faint silver inside

Frame guidance:
- frames are a primary motif, not an exception;
- use them to formalize sections, quotes, featured content, and narrative blocks;
- ornaments must remain geometric and sparse;
- halo circles, arches, and manuscript-derived corners are preferred over floral decoration.

## Shadow And Elevation Rules
Avoid generic black box-shadows. Depth should come from layered contrast and inner illumination.

- `elevation.rest`
  `0 10px 30px rgba(0, 0, 0, 0.22)`
- `elevation.float`
  `0 18px 42px rgba(0, 0, 0, 0.28)`
- `glow.inner-gold`
  `inset 0 0 0 1px rgba(199, 164, 91, 0.12), inset 0 0 32px rgba(199, 164, 91, 0.05)`
- `glow.hover-gold`
  `0 0 0 1px rgba(224, 188, 114, 0.2), 0 0 28px rgba(224, 188, 114, 0.12)`
- `glow.halo`
  `0 0 60px rgba(236, 203, 128, 0.14)`

Usage guidance:
- at rest, components should feel dense and composed;
- on hover, cards brighten from within;
- active glow should remain soft-edged and warm.

## Control Sizing Guidance
- `control.height-sm` — `2.25rem`
- `control.height-md` — `2.75rem`
- `control.height-lg` — `3.25rem`
- `control.padding-x-sm` — `0.75rem`
- `control.padding-x-md` — `1rem`
- `control.padding-x-lg` — `1.25rem`

Guidance:
- primary CTAs should feel ceremonial but restrained;
- avoid oversized “startup buttons”;
- icons can be ringed, framed, or lightly haloed when they mark premium actions.

## Component State Guidance

### Rest
- Surfaces remain matte-charcoal with faint contour definition.
- Gold is restrained to lines, icons, or small labels.

### Hover
- Introduce inner warmth, slight lift, and controlled brightening of gold edges.
- Optional micro motion: 2 to 4 px float or 1% scale, never both aggressively.

### Focus
- Use readable high-contrast ring, mixing ivory and gold.
- Focus indication must remain visible without relying on glow alone.

### Active
- Gold may intensify toward `accent.gold-hot`.
- For special controls, a brief ember or storm flicker may appear once, then settle.

### Disabled / Locked
- Shift surfaces cooler and duller.
- Locked premium content can use soft silver-gold hybrid framing with a clear lock glyph.

## Image Treatment Rules
- Covers and stills should sit inside framed or softly masked containers.
- Maintain detail; avoid heavy blur overlays on source imagery.
- Prefer warm-dark grading over cold cinematic blue.
- Featured media may use halo or fog overlays at edges for integration.
- Parallax or layered image motion should be slow and low-amplitude.
- Rounded overlapping imagery is allowed in selected modules, but must remain deliberate rather than decorative.

## Motion Tokens
- `motion.float-slow` — vertical drift, 8 to 14 px amplitude, 7 to 12 s ease-in-out infinite
- `motion.breathe` — 1% to 2% scale / translate blend, 10 to 16 s ease-in-out infinite
- `motion.glow-pulse` — opacity and blur modulation, 4 to 7 s ease-in-out infinite
- `motion.ember-drift` — rare particulate or flicker accent for featured modules only
- `motion.storm-trace` — short gold-lightning sweep or contour trace for hero / section reveal moments only
- `motion.scroll-cinematic` — media progression tied to scroll, with text remaining independently legible

Reduced motion guidance:
- disable float, breathing, ember, and storm traces;
- replace scroll-linked video with static poster or sparse frame progression;
- preserve hierarchy with opacity and contrast rather than motion.

## Special System Zones

### Cinematic Background Section
For `About` and similar narrative sections:
- foreground text blocks use stronger dark backing or gradient shields;
- media sits in a separate depth layer behind content;
- halo, fog, and glow tokens are allowed here at higher intensity than the global baseline;
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
- allow a hierarchy where cards, events, and support blocks all feel part of one symbolic visual language.
