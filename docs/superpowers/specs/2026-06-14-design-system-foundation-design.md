# Life Compass -- Design System Foundation (Phase A)

Date: 2026-06-14
Status: Approved (design)

## Background

Life Compass implements steps 1-4 of the method. Its styling layer has grown
ad-hoc and is the next thing to address before more screens or tools are built:

- `src/designTokens.ts` is dead code, imported nowhere; theming is entirely
  hand-rolled CSS variables.
- `src/index.css` carries ~292 lines of one-off CSS variables across five
  themes (light, dark, high-contrast, sugar-sweet light/dark).
- Components use ~198 arbitrary `[var(--...)]` Tailwind values -- the opposite
  of a reusable system.
- The project runs Tailwind 4 (`@import 'tailwindcss'`) but still carries a
  v3-style `tailwind.config.js` and no `@theme` block, so the idiomatic v4
  token system is unused.

This is the first of two cycles. Phase A (this spec) builds the design system
foundation: tokens, themes, and reusable primitives. Phase B (a later spec)
redesigns each screen's layout and UX on top of it.

Decisions from brainstorming:

- Sequencing: foundation first (Phase A), then screens (Phase B).
- Themes: light, dark, and high-contrast. The two sugar-sweet themes are
  removed.
- Aesthetic: calm, warm, encouraging -- a supportive wellbeing feel.
- Breaking changes are acceptable: no backward-compat shims or preserved legacy
  variable names. Phase A defines clean canonical tokens and migrates every
  reference in one pass, so the app stays functional on the new system rather
  than half-broken between phases.
- WCAG: AA (4.5:1) minimum on light and dark; AAA (7:1) for the high-contrast
  theme and, where practical, body text everywhere.

The frontend-design skill drives the visual quality and concretizes the
"calm/warm/encouraging" direction into the token values.

## Section 1 -- Token architecture (Tailwind 4 @theme)

Two layers:

- Primitive tokens (raw, theme-independent scales): a calm/warm color palette
  (primary, warm neutrals, success/warning/danger), a type scale (family,
  sizes, weights, line-heights), and spacing, radius (soft/rounded), elevation/
  shadow, motion (durations + easings), and z-index scales. Registered through a
  Tailwind 4 `@theme` block so they become real utilities.
- Semantic tokens (theme-aware contract the components consume): `--color-bg`,
  `--color-surface`, `--color-text`, `--color-text-muted`, `--color-primary`,
  `--color-on-primary`, `--color-border`, `--color-focus`, plus state colors.
  These resolve to primitive values and flip per theme.

Because breaking changes are acceptable, the token names are chosen cleanly
(canonical, well-documented), not inherited from the current ad-hoc set. Every
reference in the codebase migrates to the new tokens in this phase.

## Section 2 -- Theme system

Three themes as semantic-token overrides on `[data-theme]`: light (default),
dark, high-contrast. The sugar-sweet themes and their CSS are removed;
`ThemeContext`'s `Theme` union, `ThemeSwitcher`, and all references narrow to
these three.

- WCAG: every semantic text/background pair is contrast-checked -- AA minimum
  on light and dark, AAA for high-contrast (and body text where practical).
  Focus, state, and border colors verified.
- The switching mechanism is unchanged: the existing `ThemeContext` +
  localStorage and the follow-system option stay. Only the token values and the
  theme set change.

## Section 3 -- Primitives rebuild

Rebuild the `src/components/ui` layer as the reusable component system, each on
the new tokens with consistent variants and built-in accessibility:

- Form/control: `Button` (variants primary/secondary/ghost/danger; sizes
  sm/md/lg; disabled and loading states), `Input`, `Textarea`, `Checkbox`,
  `ToggleSwitch`, `Slider`, and a `Field` wrapper (label + description + error
  with correct `aria-describedby`).
- Surface/overlay: `Card`, `Dialog`, `Popover`, `ProgressBar`, `Icon`,
  `LinkButton`, `Navigation`.
- Built-in accessibility for all: visible `:focus-visible` rings from a focus
  token, touch targets at least 44px, `prefers-reduced-motion` honored on
  transitions, and correct roles/labels.

Each primitive has a small usage contract (props + variants) so Phase B and
future tools consume it without reading internals. Arbitrary `[var(--...)]`
styling is replaced with semantic, variant-driven classes.

## Section 4 -- Aesthetic direction

The frontend-design skill establishes the concrete "calm/warm/encouraging"
visual language -- the palette (with light/dark/high-contrast values), type
choices, radii, shadows, and motion -- and the primitive design approach. The
result is captured as the finalized token values that the implementation builds
to. Built surfaces are screenshotted (via Playwright) across all three themes
and shown to the product owner, who can request adjustments; the visual is
refined against that feedback rather than locked blindly.

## Section 5 -- Cleanup, verification, WCAG

- Cleanup: delete `src/designTokens.ts`; replace the v3 `tailwind.config.js`
  with the Tailwind 4 `@theme` approach (config removed or reduced to only what
  is required); strip the sugar-sweet theme CSS; collapse `index.css`'s ad-hoc
  variables into the canonical token set; migrate all ~198 arbitrary
  `[var(--...)]` usages to semantic utilities or primitive components.
- Verification: existing unit tests and the 5 chromium E2E tests stay green
  (selectors are role/label-based, so visual changes do not break them).
  Screenshot key surfaces in all three themes for review. A documented contrast
  check per semantic pair (AA on light/dark, AAA on high-contrast).
- Out of scope (Phase B): per-screen layout redesign, responsive reflow of
  pages, and navigation/onboarding UX. Phase A keeps existing layouts and only
  swaps in the new tokens and primitives.

## Out of scope

- Phase B screen/UX redesign and responsive reflow.
- New themes beyond light/dark/high-contrast.
- Functional changes to features (compass, goals, snapshots).

## Success criteria

- A documented two-layer token system (primitive + semantic) exists via Tailwind
  4 `@theme`; `designTokens.ts` and the sugar-sweet themes are gone.
- Three themes (light, dark, high-contrast) pass their WCAG contrast targets.
- The `ui` primitives are rebuilt on the tokens with variants, visible focus,
  44px touch targets, and reduced-motion support; no arbitrary `[var(--...)]`
  usages remain.
- The app is functional on the new system (not half-migrated): all unit tests
  and the E2E suite pass; the app renders correctly in all three themes.
- The aesthetic reads as calm/warm/encouraging and is confirmed via screenshots.
