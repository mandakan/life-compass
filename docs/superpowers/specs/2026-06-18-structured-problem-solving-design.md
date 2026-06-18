# Structured Problem Solving tool -- design spec

Date: 2026-06-18
Roadmap: rank #5 (Phase 2, build-order #4). See `docs/clinical_tool_expansion_roadmap.md`.
Pattern reference: the Behavioral Experiment tool (PR #67), Values Clarity tool (PR #69),
and Thought Record tool (PR #70). This tool mirrors the Behavioral Experiment / Thought
Record shape almost verbatim.

## Purpose

Add a **Structured Problem Solving** tool to the Practices shelf: a guided way to work a
concrete problem loose. The user names the problem, brainstorms options without filtering,
weighs each gently (what's good / what's hard), picks one to try and breaks it into small
steps, then reviews how it went. It maps to the kbtiprimarvarden.se problem-solving
worksheet (CBT depression Module 10; GAD Module 4), worded in the app's gentle,
ACT-compatible voice. The tool route is `/practices/problem-solving`.

## Framing & voice (hard constraint)

- Forbidden register: deficit/clinical framing ("your problem-solving deficit"), "the best
  solution", "the correct/right solution", any score, ranking number, percentage,
  pro/con tally or count, before/after delta, streaks, achievement language on the steps.
- Wanted register: "a knot you'd like to work loose", "all ideas welcome, even the
  unlikely ones", "what's good about this / what's hard about this", "what's one small
  step", "how did it go?". Pros and cons are words only, never rated or counted.
- Reuse the no-scores ethos: completing plan steps means "I tried it", never "I succeeded".
  Never rank or score options; the user simply marks the one they chose to try.

## User flow

A guided reveal (one step at a time, like the Thought Record / Values Clarity flow), saved
into a re-openable **list of cards** (like the Behavioral Experiment list).

Steps when creating / editing one record:

1. **Define the problem** -- "What's the knot you'd like to work loose? Keep it concrete."
   (free text) + an optional life-area link (reuse the same area `<select>` pattern as
   Behavioral Experiment / Thought Record; `attachesToArea: true`).
2. **Brainstorm options** -- "Add a few options. All ideas welcome, even the unlikely
   ones." Add/remove a list of candidate options (free text per option). No filtering,
   no scoring at this step.
3. **Weigh each option** -- for each option, an optional "what's good about this" and
   "what's hard about this" pair (free text, both start empty). No tally, no count, no
   "winner" -- just gently noticing.
4. **Choose & plan** -- mark the one option you'll try (`chosenOptionId`), then break it
   into small steps (reuse `ActionStep`, the same checkbox list UI as Behavioral
   Experiment / Goals).
5. **Review** -- "How did it go?" free-text reflection on what actually happened
   (`outcome`, starts empty).

A quiet, always-available **crisis line** reuses the existing
`src/components/practices/CrisisResources.tsx` component (driven by the current i18n
language). This tool can surface during stress, and the roadmap flags Problem Solving for
suicidality/severity screening, so the calm crisis line is mounted on the tool.

Saved cards in the list show the problem (as title), the dated created time, a hint of the
chosen option / step progress, and are expandable to view/edit all fields. Each card can be
deleted with the app's existing confirm pattern (as Behavioral Experiment / Goals use).

## Data model

Add to `src/types/LifeCompassDocument.ts` (next to `ThoughtRecord`):

```ts
export interface SolutionOption {
  id: string;
  text: string;
  pros: string; // "what's good about this", free text, starts empty
  cons: string; // "what's hard about this", free text, starts empty
}

export interface ProblemSolving {
  id: string;
  areaId?: string; // optional link to LifeArea.id (like BehavioralExperiment / ThoughtRecord)
  problem: string; // step 1: the problem, concretely
  options: SolutionOption[]; // steps 2-3: brainstormed options, each optionally weighed
  chosenOptionId?: string; // step 4: which option is being tried (omitted when none chosen)
  steps: ActionStep[]; // step 4 plan; reuse ActionStep verbatim
  outcome: string; // step 5: review reflection; starts empty
  createdAt: string; // ISO 8601
}
```

Add `problemSolvings: ProblemSolving[]` to `LifeCompassDocument`. Bump
`schemaVersion`/`CURRENT_SCHEMA_VERSION` 4 -> 5.

Note on `chosenOptionId`: it references a `SolutionOption.id` within the same record's
`options`. If the chosen option is later deleted, clear `chosenOptionId` (set to undefined)
in the same update so it never dangles.

## Persistence checklist (follow exactly, mirroring `thoughtRecords`)

Wherever `thoughtRecords` appears outside the thought-record tool directory, add a parallel
`problemSolvings`. Concretely:

- `src/store/lifeCompassStore.ts`:
  - State: `problemSolvings: ProblemSolving[]`, init `[]`.
  - Actions: `addProblemSolving(partial?)`, `updateProblemSolving(id, changes)` (preserve
    `id`), `removeProblemSolving(id)`. Mirror the thought-record / experiment action shapes.
  - Cascade: on area removal, `problemSolvings.filter(p => p.areaId !== removedId)` (same
    place experiments / thought records are filtered).
  - `clearAll` / reset: include `problemSolvings: []`.
  - `onRehydrate` / doc seeding: `problemSolvings: doc.problemSolvings ?? []`.
  - `partialize`: include `problemSolvings`.
  - Bump `PERSIST_VERSION` 3 -> 4; add a `migrate` branch that seeds `problemSolvings: []`
    for older persisted state.
- `src/types/LifeCompassDocument.ts`: types + `CURRENT_SCHEMA_VERSION` bump (above).
- `src/types/importExport.ts`: include `problemSolvings` if it enumerates document fields.
- `src/utils/exportService.ts`: include `problemSolvings` in the exported document.
- `src/components/ExportButton.tsx` and `src/components/guide/GuideDataActions.tsx`: wire
  `problemSolvings` through the same way `thoughtRecords` flows.
- `src/pages/YourCompass.tsx`: mirror any `thoughtRecords` usage if present.
- `src/schemas/exportImportSchema.json`: add a `problemSolvings` array schema (items with
  the fields above; `options` is an array of `{id, text, pros, cons}`; `areaId` and
  `chosenOptionId` optional). Bump the schema's version constant if it carries one. Keep
  Ajv validation passing on round-trip.

Acceptance: export a document with problem-solving records, re-import it, and all records
(incl. area links, options with pros/cons, chosen option, and plan steps) survive
validation and round-trip.

## Tool registration

- `src/components/practices/tools/problem-solving/index.ts`: push a `ToolDef`:
  - `id: 'problem-solving'`
  - `labelKey: 'practices.tools.problem_solving.label'`
  - `descriptionKey: 'practices.tools.problem_solving.description'`
  - `icon`: a heroicon such as `PuzzlePieceIcon`
  - `attachesToArea: true`
  - `component: lazy(() => import('./ProblemSolving'))`
- Add a side-effect import to `src/practices/index.ts`.

Components in `src/components/practices/tools/problem-solving/`:
`ProblemSolving.tsx` (list + create entry point), the guided step flow, a record card/item,
an options list (brainstorm + weigh), reusing the Behavioral Experiment structure
(`ExperimentItem` / `ExperimentStepList` analogues for the card and the plan steps) and the
shared area-select row pattern where it fits.

## i18n

- All copy under `practices.tools.problem_solving.*`.
- Hand-translate `en` + `sv` in `public/locales/en/translation.json` and
  `public/locales/sv/translation.json`. The other 8 locales fall back to English.
- **DO NOT run `npm run extract`** -- `keepRemoved:false` + dynamic tool keys means extract
  deletes these keys.
- Mark `sv` copy for later native-Swedish review (same outstanding follow-up as the other
  three tools).

## Tests

- Store-action unit test (`src/tests/`): add/update/remove problem-solving records; cascade
  delete when the linked area is removed; clearing `chosenOptionId` when the chosen option
  is removed; persist/migrate round-trip seeds `problemSolvings: []` from a v3 state.
- Export/import test: a document with problem-solving records validates against
  `exportImportSchema.json` and round-trips.
- Component smoke test using `@tests/test-i18n` with
  `i18n.addResourceBundle('sv','translation',{...},true,true)` to resolve the dynamic tool
  keys; render the tool, create a record with a couple of options, assert it appears; assert
  no numeric score / option count / "best option" text is rendered.

## Out of scope (v1, YAGNI)

- No spawning real `Goal`s from the chosen option -- plan steps stay self-contained in the
  record (decision confirmed during brainstorming; keeps the area link optional and avoids
  Goals' achievement framing).
- No option scoring, ranking, weighting, or pro/con counts.
- No multiple chosen options -- exactly one `chosenOptionId` at a time in v1.
- No reminders / scheduling; no trend view over time.

## Non-negotiables (ethos)

No scores/percentages/progress bars/streaks; no option ranking or counts; no "best/correct
solution"; gentle ACT-compatible copy; local-only; any new wide element gets
`w-full min-w-0` to avoid mobile overflow.
