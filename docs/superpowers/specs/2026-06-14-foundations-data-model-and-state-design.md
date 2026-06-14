# Life Compass -- Foundations: Data Model, State Layer, and Component Decomposition

Date: 2026-06-14
Status: Approved (design)

## Background

Life Compass is a working React 19 + TypeScript + Vite + Tailwind 4 app that
implements steps 1-3 of the 5-step Life Compass method: define life areas, rate
importance and satisfaction, and visualize the gap on a radar chart. It has
i18n (10 languages), dark mode, localStorage persistence, export/import, unit
tests, E2E tests, and CI/CD to GitHub Pages.

The unbuilt half of the vision is step 4 (goals and action planning) and step 5
(track progress over time). Before building those, the foundation needs work.
Three problems block clean feature growth:

1. **Three incompatible data shapes.** `storageService.ts` reads/writes a key
   called `userData`. The actual app (`CreateLifeCompass.tsx`) ignores that
   service and writes a bare `LifeArea[]` array to a different key,
   `lifeCompass`, via inline `useEffect`. The export/import envelope is a third
   shape with `metadata` + `history`, and nothing produces it. The `history`
   array is declared but always empty.

2. **A god component.** `CreateLifeCompass.tsx` is ~579 lines holding ~20
   `useState`s: life-area data, persistence, edit-form state prop-drilled into
   every card, drag-and-drop, import, responsive detection, and scroll
   restoration. The desktop and mobile render branches duplicate the entire card
   grid verbatim.

3. **No history despite a reserved slot.** Step 5 (progress over time) needs a
   data model that records dated snapshots. The current flat array cannot
   express it.

## Goal

Strengthen the foundation so steps 4 and 5 slot in without another rewrite.
This phase delivers: a single versioned data model, a unified state and
persistence layer, decomposition of the god component, and one thin vertical
slice of history (a dated snapshot) to prove the foundation holds end to end.

Decisions made during brainstorming:

- State management: a Zustand store with persistence middleware.
- Scope: foundation plus one proof slice (dated snapshot). Not the full step-5
  feature (no trend charts yet).
- Existing live users' data under the legacy `lifeCompass` key is migrated, not
  discarded.

## Section 1 -- Versioned data model

Collapse the three shapes into one persisted document, versioned so it can
evolve:

```ts
interface LifeCompassDocument {
  schemaVersion: 1;
  lifeAreas: LifeArea[]; // unchanged: id, name, description, details, importance, satisfaction
  history: Snapshot[];
}

interface Snapshot {
  id: string;
  createdAt: string; // ISO 8601
  label?: string; // optional user note, e.g. "after summer"
  areas: SnapshotArea[];
}

interface SnapshotArea {
  id: string; // links back to a LifeArea
  name: string; // denormalized on purpose
  importance: number;
  satisfaction: number;
}
```

`LifeArea` keeps its current shape. The key design choice: a snapshot stores its
own copy of each area's name and ratings rather than referencing live areas. A
trend view must show what things actually were at the time, so history stays
truthful after an area is renamed or deleted. This is what makes step 5
possible later.

## Section 2 -- State and persistence layer

One `useLifeCompassStore` (Zustand) with the `persist` middleware as the single
source of truth. It replaces both the `userData` path in `storageService.ts` and
the inline `useEffect` writes in `CreateLifeCompass`.

- **Store owns:** `lifeAreas` and `history`, plus actions: `addArea`,
  `updateArea`, `removeArea`, `reorderAreas`, `removeAllAreas`,
  `importDocument`, `saveSnapshot`, `deleteSnapshot`.
- **Persistence:** `persist` middleware under a new key `life-compass`, with its
  `version` / `migrate` hooks owning schema evolution.
- **Legacy migration:** on first load, if the old bare-array `lifeCompass` key
  exists, read it, seed `lifeAreas`, then remove the legacy key. Existing users
  keep their data and never see an empty app.
- **Out of scope, deliberately:** theme and language stay in their existing
  `ThemeContext` and `AppSettingsContext`. Export continues to read settings
  from there. Folding them into the store would widen the blast radius for no
  foundational gain.

## Section 3 -- Component decomposition

`CreateLifeCompass.tsx` becomes an orchestrator. Three extractions:

- **Editing state moves into the card.** Today `editName`, `editDescription`,
  `editDetails`, `editImportance`, and `editSatisfaction` live in the parent and
  are prop-drilled through ~12 props into every `LifeAreaCard`. Instead, the
  card owns a local draft while `isEditing`; the parent tracks only
  `editingAreaId` and receives `onSave(area)` / `onCancel`. This removes ~10
  props and the duplicated reset logic.
- **Drag-reorder becomes a hook.** `handleDragStart` / `handleDragOver` /
  `handleDrop` plus `draggedIndex` / `dragOverIndex` move into
  `useDragReorder(areas, reorderAreas)`, returning the handlers and the
  drag-over index.
- **One grid, not two.** The desktop and mobile branches are the same card grid
  with different container classes. Extract a single `LifeAreaGrid` that takes
  the areas and a layout variant. This removes ~50 lines of duplication and
  fixes the hardcoded Swedish string at line 568
  (`'+ Lagg till nytt livsomrade'`) to use `t()`.

Small effects (scroll restoration, footer `IntersectionObserver`, resize
listener) stay as-is or fold into tiny hooks; they are low priority.

Result: `CreateLifeCompass` reads areas from the store and renders toolbar +
grid + radar + import. Data lives in the store; the card owns its own edit
lifecycle.

## Section 4 -- Proof slice: dated snapshot

Thin but real, exercising every new seam:

- A **"Save snapshot"** action in `FloatingToolbar` calls `store.saveSnapshot()`,
  which freezes current areas into a `Snapshot` with `createdAt` and pushes it
  to `history`.
- A minimal **history view**: snapshot count and last-saved date, a simple list
  (date + area count) with per-row delete. Placed in the lighter-touch spot
  (page panel or Settings), chosen during planning. No trend charts yet.
- **Export/import carries history.** Export populates the `history` array the
  envelope already declares; import restores it. This closes the loop the
  original authors stubbed out.

This is the smallest change that exercises store action -> persist -> reload ->
export -> import -> render.

## Section 5 -- Testing and migration of existing tests

- **New unit tests:** store actions (add, update, remove, reorder, removeAll),
  `saveSnapshot` / `deleteSnapshot`, legacy-data migration (old bare array seeds
  the store and the legacy key is removed), and an export/import round-trip that
  includes populated history.
- **Existing tests to update:** `storageService.test.ts` (the service is removed
  or reduced to import/export helpers), `exportService.test.ts` /
  `importService.test.ts` (the envelope now includes populated history).
  `lifeAreaService.test.ts` is unaffected.
- **TDD throughout:** tests are written before each unit. The Playwright E2E
  suite stays green; add one assertion that a saved snapshot survives reload.

## Out of scope

- Step 4 (goals and action planning).
- Step 5 trend charts and check-in scheduling.
- Moving theme/language into the store.
- Encryption of localStorage data (a separate optional user story).

## Success criteria

- One persisted document under key `life-compass`, schema-versioned.
- Existing users' data under `lifeCompass` is migrated with no data loss.
- `CreateLifeCompass` no longer holds life-area data, persistence, or
  prop-drilled edit state; the desktop/mobile grid duplication is gone.
- A user can save a dated snapshot, see it in a history list, delete it, and
  have it survive reload and an export/import round-trip.
- All unit tests and the E2E suite pass.
