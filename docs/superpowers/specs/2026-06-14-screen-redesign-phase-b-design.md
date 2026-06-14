# Life Compass -- Screen & UX Redesign (Phase B)

Date: 2026-06-14
Status: Approved (design)

## Background

Phase A established the design system: a two-layer token set via Tailwind 4
`@theme`, three WCAG-checked themes (light, dark, high-contrast), self-hosted
Fraunces + Hanken Grotesk, and rebuilt accessible `ui` primitives. It
deliberately left page layouts untouched.

Phase B (this spec) redesigns the screens and UX on top of that foundation:
the app shell, the core compass flow, the content pages, and onboarding --
mobile-first, with full WCAG, in the calm/warm "earthen journal" aesthetic.

Decisions from brainstorming:

- Scope: the full app in one cycle (shell + core flow + content pages).
- Intensity: bold restructure -- rethink layouts and information architecture
  where it helps, not just spacing tweaks.
- The visual layouts are concretized with the frontend-design skill and
  screenshotted for approval before the full build.
- No feature or behavior changes; no new routes. Step 5 (trends) stays for
  later.

## Section 1 -- App shell and navigation

Replace the full-width clay (`bg-primary`) header with a lighter shell:

- Header on `bg-surface` with a subtle bottom border, the clay Fraunces wordmark
  on the left, minimal inline links on desktop (Compass), and
  theme/language/settings on the right. The header is sticky so navigation stays
  reachable.
- On mobile, a clean slide-down menu from a single hamburger (keep the existing
  open/close pattern, restyled to tokens with focus management).
- Footer: lighter and quieter, token-consistent, readable measure -- links and
  support without competing with content.

## Section 2 -- Compass screen restructure (core)

The largest change. Today every action hides behind a floating FAB popover
(add predefined, save snapshot, export, import, delete all, and the
cards/radar toggle). Replace it with clear hierarchy:

- A page action bar at the top of the compass: a prominent primary "Add life
  area", a segmented Cards / Radar view toggle (replacing the mystery FAB), and
  a small overflow menu for occasional actions (add predefined, save snapshot,
  export, import, delete all).
- Mobile-first reflow: cards go one column, then two, then three as width grows;
  the action bar collapses to a sticky bottom bar (primary "Add" + view toggle +
  overflow) that stays thumb-reachable and respects safe-area insets.
- Refined `LifeAreaCard`: clearer importance and satisfaction rows with a
  visible gap indicator (the core of the method), the goals affordance, and tidy
  edit/remove -- all on Phase A tokens.
- A real empty / first-run state: a welcoming card prompting "Add your first
  life area" or "Use predefined", distinct from the onboarding overlay.
- Radar view: framed with a heading and legend, using the clay/sage series.

The existing edit flow (inline on mobile, dialog on desktop) and all store
actions are preserved; only presentation and the action layout change.

## Section 3 -- Home and content pages

- Home: a calm editorial hero -- a large Fraunces headline, a short supportive
  subline, and one clear primary CTA to the compass, on warm sand with generous
  space. The `Introduction` content reflows as readable editorial sections
  (constrained measure ~65ch, clear hierarchy).
- Settings, About, Privacy: one shared content-page layout -- constrained
  measure, Fraunces section headings, consistent spacing, the rebuilt
  primitives. Settings is grouped into sections (Appearance, Language, Data,
  About) instead of a flat list. About and Privacy become legible long-form
  pages.
- The dev-only `DesignPrinciplesDemo` page stays gated behind `showDevTools`;
  it is brought onto tokens but not otherwise invested in.

## Section 4 -- Onboarding and goals dialog

- Onboarding tutorial: restyle the overlay to match -- calm surface card,
  Fraunces heading, clear steps, token buttons, and strong focus management
  (focus trap, escape to close, focus returned on close). The step flow is
  unchanged; only presentation.
- Goals dialog: polish the Phase A version -- tighter spacing, clearer goal and
  step hierarchy, a more legible progress bar, comfortable mobile sizing. A
  refinement, not a rebuild.

## Section 5 -- Responsive, WCAG, verification

- Mobile-first throughout: every screen is designed at narrow width first, then
  enhanced. Touch targets at least 44px (Phase A primitives enforce this), no
  horizontal scroll, sticky bars respect safe-area insets.
- WCAG: keyboard-operable everywhere, visible focus from the Phase A focus
  tokens, correct landmarks/headings/labels, dialog focus traps,
  `prefers-reduced-motion` honored, and contrast preserved across all three
  themes.
- Verification: the existing unit tests and the 5 chromium E2E tests stay green
  (selectors are role/label based and survive layout changes). Every redesigned
  screen is screenshotted in all three themes at mobile and desktop widths for
  review. An adversarial pass checks keyboard/focus/landmarks and confirms no
  functionality regressed.

## Out of scope

- Feature or behavior changes to the compass, goals, or snapshots.
- New routes or new themes.
- Step 5 (progress-over-time trend charts).

## Success criteria

- The shell uses a light surface header (no full-width clay bar), sticky, with a
  working restyled mobile menu.
- The compass uses a clear action bar (desktop) / sticky bottom bar (mobile)
  with a real Cards/Radar toggle, replacing the catch-all FAB popover.
- Every screen reflows cleanly mobile-first with no horizontal scroll; cards go
  1 -> 2 -> 3 columns.
- A first-run empty state exists on the compass.
- Home and the content pages use the shared editorial layout; settings is
  grouped.
- All three themes render correctly across all redesigned screens; WCAG
  (keyboard, focus, landmarks, contrast, reduced-motion) holds.
- All unit tests and the E2E suite pass; no feature regressed.
