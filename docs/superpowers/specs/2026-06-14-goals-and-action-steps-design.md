# Life Compass -- Goals and Action Steps (Step 4)

Date: 2026-06-14
Status: Approved (design)

## Background

Life Compass implements steps 1-3 of the 5-step method (define life areas, rate
importance/satisfaction, visualize the gap) plus a foundation phase that added a
versioned `LifeCompassDocument`, a Zustand store, and dated snapshots. This spec
covers **step 4: goal setting and action planning** (epic 3).

Epic 3 has seven user stories. This spec implements only the three **Must**
stories, deliberately scoped small:

- 3.1 Set goals for life areas (create/edit/delete).
- 3.3 Define action steps for goals (checkable steps).
- 3.2 Track goal progress (progress derived from completed steps).

Deferred (not in this spec): goal prioritization (3.4), deadlines and reminders
(3.5), review-over-time (3.6, which overlaps the future step-5 trend work), and
smart suggestions (3.7).

Two constraints from the product owner shape the work:

- A design-system revisit is planned **after** this step, so goals reuse the
  existing UI components and tokens and add only minimal new primitives. No new
  visual language.
- More self-help tools beyond the compass are planned for the future, so goals
  stay attached to life areas without entangling them with compass internals.

## Section 1 -- Data model

Goals attach to a life area but live as a top-level array on the document. This
keeps `LifeArea` unchanged and makes goals independently queryable, which suits
the future multi-tool direction.

```ts
interface ActionStep {
  id: string;
  text: string;
  done: boolean;
}

interface Goal {
  id: string;
  areaId: string; // -> LifeArea.id
  title: string;
  steps: ActionStep[];
  createdAt: string; // ISO 8601
}
```

`LifeCompassDocument` gains `goals: Goal[]` alongside `lifeAreas` and `history`.
`schemaVersion` becomes 2, and the persist `migrate` hook gains a branch that
adds `goals: []` to existing v1 stores. Existing users keep their data; goals
start empty.

Progress is purely derived, never stored: `doneSteps / totalSteps`. A goal with
zero steps reads as "no steps yet" (0%). There is no manual "mark done" -- step
completion is the single source of truth.

## Section 2 -- Store actions and cascade rules

The Zustand store gains goal state and actions, mirroring the existing area
actions:

- `addGoal(areaId, title)`, `updateGoal(goalId, changes)`, `removeGoal(goalId)`
- `addStep(goalId, text)`, `updateStep(goalId, stepId, changes)`,
  `toggleStep(goalId, stepId)`, `removeStep(goalId, stepId)`

Cascade rules keep goals consistent with areas:

- `removeArea(id)` also drops goals whose `areaId` matches.
- `removeAllAreas()` clears all goals.
- `importDocument(doc)` replaces goals wholesale.

So a goal never dangles against a deleted area. This is the integrity rule for
this phase, analogous to (but distinct from) the snapshot denormalization from
the foundations phase: here it is a cascade-delete.

Out of scope: goals are not captured in snapshots (`history`). That is step-5
review-over-time territory.

## Section 3 -- UI

A per-area goals dialog, built on existing components plus two small new
primitives.

- `LifeAreaCard` gains a "Goals" affordance: a button showing a count (target
  icon + e.g. `Goals 2`) that opens the dialog for that area. It sits with the
  card's existing edit/remove actions and does not disturb the rating UI.
- `GoalsDialog` (one area at a time, built on the existing `Dialog`): an "add
  goal" input at the top, then the list of that area's goals, with an inviting
  empty state.
- `GoalItem` (one goal): inline-editable title, a progress bar (`done/total`
  steps), expand to reveal steps, and edit/delete. Extracted so `GoalsDialog`
  stays a thin list.
- `GoalStepList` (inside a goal): each step is a checkbox + text with a delete
  control, plus an "add step" input. Toggling a checkbox updates the derived
  progress immediately.
- Two new `ui/` primitives (none exist today): a minimal accessible `Checkbox`
  and a small `ProgressBar`. Kept plain and consistent with current tokens; no
  new visual language, since the design-system pass comes later.

Validation mirrors life areas: empty goal title and empty step text are
rejected. Deleting a goal confirms via the existing `useConfirmDialog`.

## Section 4 -- Export/import and i18n

- Export/import carry goals. The envelope (`src/types/importExport.ts` and
  `src/schemas/exportImportSchema.json`) gains a `goals` array next to
  `lifeAreas`/`history`. Export populates it from the store; import restores it,
  following the round-trip pattern the foundations phase established for history.
  Importing an older file with no `goals` key defaults to `[]`.
- i18n: new English keys for all goal UI strings (add goal, add step, progress
  label, delete confirmations, empty states), following the existing
  react-i18next pattern. Other locales fall back to English until translated.

## Section 5 -- Testing

- Unit (store): goal and step CRUD, derived-progress correctness, and the
  cascade rules (removing an area drops its goals; remove-all clears goals;
  import replaces them).
- Component: `GoalsDialog` -- add a goal, add a step, toggle it, see progress
  update; empty-title rejection.
- Export/import: round-trip asserting goals (with steps) survive.
- E2E: open a card's goals, add a goal and a step, check the step off, see
  progress, and confirm it survives a reload (base-path-safe entry via the app
  router, like the existing snapshot test).
- TDD throughout. The existing 55 unit tests and 4 chromium E2E tests stay
  green.

## Out of scope

- Goal prioritization (3.4), deadlines/reminders (3.5), review-over-time (3.6),
  smart suggestions (3.7).
- Goals in snapshots / trend charts (step 5).
- The design-system revisit (planned after this step).

## Success criteria

- A user can open a life area's goals, create/edit/delete goals, add/check/
  delete action steps, and see step-derived progress.
- Goals and steps persist across reload and survive an export/import round-trip.
- Removing an area (or all areas) removes its goals; no goal dangles against a
  missing area.
- `schemaVersion` 1 documents migrate to 2 with `goals: []`, no data loss.
- All unit tests and the E2E suite pass.
