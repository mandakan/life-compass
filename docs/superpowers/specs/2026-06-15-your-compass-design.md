# Your Compass -- design & implementation contract

Date: 2026-06-15. Source design package: Life Compass Design System,
`templates/your-compass/` (prototype mirrored at
`docs/your-compass/Compass.prototype.jsx`). This spec is the single source of
truth for the build; where it and the prototype disagree, this spec wins.

## Goal

Make the design package's "Your Compass" the canonical experience of the app:
you at the centre with the things that matter around you, offered as four
switchable perspectives (Map default, List, Today, This week), plus a first-run
build flow and a calm bottom-sheet area editor. Faithful to the worksheet,
warm, no numbers in the UI, no streaks, no guilt.

## Decisions (locked)

1. **Landing.** Your Compass owns `/`. Empty store -> first-run flow
   (Welcome -> Suggest -> app). Non-empty store -> the four-view compass (Map
   default). `/create-life-compass` redirects to `/`.
2. **Existing features folded in where natural.** Snapshot `history` feeds the
   "This week" sparklines/deltas. The detailed `SnapshotHistory` + save-snapshot,
   `RadarChart`, and import/export stay reachable from a quiet overflow menu in
   the compass header (not promoted to a 5th tab). Goals reachable from the area
   editor (existing `GoalsDialog`).
3. **Scale model.** Store stays **1-10** (`importance`, `satisfaction`). The UI
   speaks in **1-5** word scales via an adapter. Reads bucket `round(v/2)`
   clamped 1-5; writes `bucket*2` and ONLY on an explicit pill tap, so untouched
   areas keep their exact 1-10 value. Radar, export schema, snapshots unchanged.
4. **Suggestions** come from existing `getPredefinedLifeAreas()` (already
   translated), not the prototype's hardcoded English list.
5. **i18n.** All copy under a nested `your_compass` object in
   `public/locales/<lng>/translation.json`. Author `en` + `sv` now; English
   fallback covers the other 8; follow-up fills them.

## Tech context

React 19 + TS + Vite, Tailwind 4 (`@theme` tokens already in `src/index.css` ->
utilities `bg-bg bg-surface bg-surface-sunken text-text text-text-muted
bg-primary text-on-primary bg-secondary border-border ring-focus font-display
font-body text-xs..text-4xl rounded-sm..rounded-xl rounded-full shadow-warm-sm
shadow-warm-md duration-150/200/300 ease-[...]`), Radix UI, Heroicons, i18next
(`useTranslation`), Zustand store with `localStorage` persist.

**Styling rule:** prefer Tailwind utilities mapped to tokens for static styles;
use inline `style` only for COMPUTED values (map node x/y, `opacity: 1 -
drift*0.1`, `color-mix(...)` selected tints, dynamic border color). Match the
conventions in `src/components/ui/Button.tsx`, `ui/Textarea.tsx`, `ui/Dialog.tsx`,
`components/LifeAreaCard.tsx`. Honor `:focus-visible`, >=44px targets, 16px inputs.

## Data model bridge

Existing `LifeArea { id, name, description, details, importance, satisfaction }`.
Prototype's `prompt` maps to `description`. Prototype's `matters` = bucket of
`importance`; `lived`/weekly value = bucket of `satisfaction`. No model changes.

New areas: create a `LifeArea` with `importance: 6, satisfaction: 6` (bucket 3),
empty `name/description/details`, fresh id. "isNew" (autofocus + Untitled
fallback) is NOT stored -- track the newly-added area id in page state (see
`CreateLifeCompass` `newAreaId` for the existing pattern) and pass `isNew` to
`AreaDetail`.

## Files & ownership

New dir `src/components/your-compass/`. Components are function components in TSX.

### Foundation (no UI)

- `src/utils/compassModel.ts` -- pure, i18n-free adapter. Exports:
  - `toBucket(v: number): number` = `Math.min(5, Math.max(1, Math.round(v / 2)))`
  - `fromBucket(b: number): number` = `b * 2`
  - `matters(a: LifeArea): number` = `toBucket(a.importance)`
  - `lived(a: LifeArea): number` = `toBucket(a.satisfaction)`
  - `drift(a: LifeArea): number` = `Math.max(0, matters(a) - lived(a))`
  - `weeksFor(a: LifeArea, history: Snapshot[]): number[]` = for each snapshot
    in `history` sorted by `createdAt` ascending that contains a `SnapshotArea`
    with `id === a.id`, push `toBucket(sa.satisfaction)`; then append
    `lived(a)`. Returns `[lived(a)]` when no history matches.
  - `tone(a: LifeArea): 'sage' | 'clay' | 'muted'` = lived>=4 sage, lived<=2 clay, else muted.
  - `isTender(a: LifeArea): boolean` = `lived(a) <= 2 && matters(a) >= 4`.
  - `reflectionKey(a): 'far_off'|'close'|'aligned'|'small_distance'`:
    matters>=4 && lived<=2 -> far_off; matters>=4 && lived>=4 -> close;
    drift===0 -> aligned; else small_distance.
  - `weekDeltaKey(a, history): 'new'|'closer'|'same'|'further'`: let
    `w = weeksFor(a, history)`; if `w.length < 2` -> new; compare
    `w.at(-1)` vs `w.at(-2)`: greater -> closer, equal -> same, less -> further.
  - `LIVED_KEY`/`MATTERS_KEY` helpers returning the i18n key for a bucket
    (`your_compass.scale.lived.<n>` / `your_compass.scale.matters.<n>`).
- `src/components/your-compass/views.ts` -- `export type ViewId =
'map'|'list'|'today'|'week'`; `export const VIEWS: {id: ViewId; labelKey:
string; subKey: string}[]` (keys `your_compass.views.<id>.label/.sub`).

### Primitives -- `src/components/your-compass/primitives.tsx`

- `CompassMark({ size? })`, `Figure({ size?, className? })`,
  `Spark({ weeks: number[] })`. Inline SVG, ports of the prototype. `aria-hidden`.

### Components (each its own file in `src/components/your-compass/`)

- `MapView.tsx` -- `MapView({ areas, history, onOpen, onAdd })`. Radial canvas
  sized via `ResizeObserver` (`SIZE = clamp(248, width, 380)`), figure centered,
  nodes on circle `R = SIZE*0.33` from -90deg, drift pushes out (`+drift*6`) and
  fades (`opacity 1 - drift*0.1`), spokes from center. Empty -> 8 add-slots;
  populated -> `areas.length + 2` slots. Helper line below (empty vs populated).
- `ListView.tsx` -- `ListView({ areas, onOpen })`. Rows: name over description;
  right = lived word colored by `tone`.
- `TodayView.tsx` -- `TodayView({ areas, history, onOpen })`. Picks largest-drift
  area first; vertical 5-row word scale (local selection state, clay dot when
  selected); "Open & save" -> onOpen; "Show me another" cycles.
- `WeekView.tsx` -- `WeekView({ areas, history, onOpen })`. Affirming line, rows
  with `weekDeltaKey` line, tender note when `isTender`, right = `Spark`.
- `PerspectiveSwitcher.tsx` -- `PerspectiveSwitcher({ view, onChange })`.
  `role=tablist` pill on `bg-surface-sunken`, wraps, active tab raised. Tabs only;
  the page renders the subtitle from `VIEWS`.
- `ScaleChooser.tsx` -- `ScaleChooser({ labels: string[], value, onChange, accent? }`
  where `accent` is `'clay'|'sage'` (default clay). AAA-safe pills: always 2px
  border, selected = accent border + `color-mix(accent 14%, surface)` + dark
  label + weight 700 + `aria-pressed`.
- `AreaDetail.tsx` -- `AreaDetail({ area, isNew, history, onClose, onChange,
onRemove, onOpenGoals })`. Bottom-sheet built on **Radix Dialog** (use existing
  `ui/Dialog.tsx` if it fits a bottom sheet; otherwise Radix `Dialog` primitive
  directly) for focus-trap + Escape + scrim; top corners `rounded-xl`,
  `shadow-warm-md`, max-width 600, max-height 92vh, safe-area bottom padding,
  grab-handle + 44x44 close. Fields top->bottom: editable name (Fraunces 600
  text-2xl clay, focus underline), editable description input, "What you value
  here" + help + `ui/Textarea` (3 rows), "How much does this matter" + help +
  MATTERS `ScaleChooser` (clay), "How close did you live to it this past week" +
  help + lived `ScaleChooser` (sage), derived reflection block
  (`bg-surface-sunken`, text from `reflectionKey`), footer Remove (ghost) + Done
  (primary `ui/Button`). A quiet "Goals" affordance calls `onOpenGoals`.
  `onChange(changes: Partial<LifeArea>)`: name->name, description->description,
  details->details, matters pill n -> `{ importance: fromBucket(n) }`, lived pill
  n -> `{ satisfaction: fromBucket(n) }`.
- `Welcome.tsx` -- `Welcome({ onSuggest, onOwn })`. CompassMark, h1, body,
  primary "Start from a few common areas", ghost "Add my own first", privacy note.
- `Suggest.tsx` -- `Suggest({ suggestions, onContinue, onOwn })` where
  `suggestions: LifeArea[]` (from predefined). Pill multi-select; primary label
  "Choose a few to continue" (disabled at 0) else "Continue with {{count}}";
  ghost "Add my own instead". `onContinue(chosen: LifeArea[])`.

### Page -- `src/pages/YourCompass.tsx`

- Reads `lifeAreas`, `history`, actions (`addArea`, `updateArea`, `removeArea`,
  `removeAllAreas`) from `useLifeCompassStore`.
- Phase machine: `phase: 'welcome'|'suggest'|'app'` initialized to `'welcome'`
  when `lifeAreas.length === 0` else `'app'`. View state, `editingId`,
  `newAreaId`, `confirmFresh`.
- `welcome`/`suggest` render `Welcome`/`Suggest`. Suggest builds areas via
  `addArea` (clone predefined entries, keep their importance/satisfaction) then
  phase `app`. "Add my own"/buildOwn -> phase `app`, empty -> Map shows add-slots.
- App: header (eyebrow + h1 + Start-fresh inline confirm wired to
  `removeAllAreas` -> phase `welcome`), overflow menu (Radar dialog, Snapshot
  history, Import/Export -- reuse existing components), switcher + subtitle,
  body by view. Map also renders for empty store regardless of view.
- `AreaDetail` mounts when `editingId` set; add-slot/`onAdd` creates a default
  `LifeArea` via `addArea`, sets `editingId` + `newAreaId`. `GoalsDialog` mounts
  for the editing area when goals opened.

### Wiring (shared files -- single owner to avoid conflicts)

- `src/App.tsx`: route `/` -> `YourCompass`; `/create-life-compass` -> `<Navigate to="/" replace />`. Leave `/about /settings /privacy /design-principles`.
- `src/components/ui/Navigation.tsx` + `Footer`/any links: point "home"/start to `/`.
- `public/locales/en/translation.json` and `public/locales/sv/translation.json`:
  add the `your_compass` block (keys below). Keep each file's existing
  `version: "1.0.0"`. Confirm i18next `keySeparator` is not disabled (read
  `src/i18n.ts`); nested keys must resolve.

## i18n keys (`your_compass.*`) -- exact English copy

```
heading.eyebrow            "Your compass"
heading.title              "What matters to you, and how this week has felt."
start_fresh                "Start fresh"
start_over_q               "Start over?"
cancel                     "Cancel"
yes                        "Yes"
welcome.title              "Let's build your compass."
welcome.body               "This is the whole idea: you in the middle, and the handful of things that matter most around you. We'll add them one at a time. There's no right answer, and you can change anything later."
welcome.cta_suggest        "Start from a few common areas"
welcome.cta_own            "Add my own first"
welcome.privacy            "Everything stays on your device. Nothing is tracked or shared."
suggest.title              "Which of these matter to you?"
suggest.body               "Just starting points -- choose any that fit, skip the rest, and add your own later. Nothing here is fixed."
suggest.cta_zero           "Choose a few to continue"
suggest.cta_n              "Continue with {{count}}"
suggest.cta_own            "Add my own instead"
views.map.label            "Map"
views.map.sub              "You, and the things that matter around you"
views.list.label           "List"
views.list.sub             "What matters, in plain words"
views.today.label          "Today"
views.today.sub            "Just one gentle thing"
views.week.label           "This week"
views.week.sub             "How the week has felt"
map.helper_empty           "Tap a + to name something that matters to you. Add as few or as many as you like."
map.helper_populated       "Tap anything to open it and reflect. A faded box means you've drifted a little from what matters there."
map.add_aria               "Add something that matters"
map.open_aria              "Open {{name}}"
map.untitled               "Untitled"
today.eyebrow              "Just one thing today."
today.question             "How close did this past week feel?"
today.open_save            "Open & save"
today.show_another         "Show me another"
week.affirm                "You showed up and noticed how things are. That matters more than any number."
week.delta.new             "Newly added -- nothing to compare yet."
week.delta.closer          "A little closer than last week."
week.delta.same            "About the same as last week."
week.delta.further         "A bit further -- be gentle with yourself."
week.tender                "This one matters to you -- somewhere to be kind to yourself."
scale.lived.1              "Far from it"
scale.lived.2              "A little"
scale.lived.3              "Some of the time"
scale.lived.4              "Mostly"
scale.lived.5              "Fully"
scale.matters.1            "A little"
scale.matters.2            "Somewhat"
scale.matters.3            "Quite a bit"
scale.matters.4            "A lot"
scale.matters.5            "Deeply"
detail.name_placeholder    "Name this area"
detail.name_aria           "Name this area"
detail.prompt_placeholder  "a few words for what this means to you"
detail.prompt_aria         "A few words for what this means"
detail.value_label         "What you value here"
detail.value_help          "In your own words. There's no right answer."
detail.value_placeholder   "What does living well in this area look like for you?"
detail.matters_label       "How much does this matter to you?"
detail.matters_help        "Your compass needle -- this rarely changes week to week."
detail.lived_label         "How close did you live to it this past week?"
detail.lived_help          "Just this week. Be honest and kind -- both at once."
detail.remove              "Remove"
detail.done                "Done"
detail.close               "Close"
detail.goals               "Goals"
detail.new_area_aria       "New area"
reflection.far_off         "This matters a lot to you, and lately it's felt far off. Not a failure -- just a gentle signal of where your attention wants to go."
reflection.close           "This matters to you, and you've been living close to it. Worth noticing what's helping."
reflection.aligned         "What you value here and how you've lived it are close together right now."
reflection.small_distance  "A small distance between what you value and how the week felt. Nothing to fix -- just something to see."
overflow.menu              "More"
overflow.radar             "Balance wheel"
overflow.history           "History"
overflow.import_export     "Import / export"
```

Swedish (`sv`) translations should match this gentle ACT/Livskompass tone (the
existing `sv` copy is the reference register). Note `{{count}}` plural via
i18next (`suggest.cta_n` / `_other` as needed).

## Testing

- `src/tests/compassModel.test.ts` -- bucketing (1->1,2->1,...,10->5), fromBucket,
  drift, weeksFor from a fixture history, reflectionKey + weekDeltaKey branches,
  tone, isTender.
- `src/tests/areaDetail.test.tsx` -- render with a fixture area; tapping a matters
  pill calls `onChange` with `{ importance }`, a lived pill with `{ satisfaction }`;
  Remove calls `onRemove`; Escape/scrim closes.
- Keep the suite green: tests/e2e tied to `/create-life-compass` must be updated
  for the redirect or retargeted at `/`.

## Verification

`npm run build` (tsc + vite) clean, `npm test` green, `npm run lint` clean. No
horizontal overflow at 320px (the app already guards this). Reduced-motion
respected (token CSS already collapses motion).

## Out of scope

Weekly-check-in template, any 1-5 data migration, filling locales beyond en/sv.
