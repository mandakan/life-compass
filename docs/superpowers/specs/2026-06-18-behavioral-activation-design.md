# Behavioral Activation tool -- design spec

Date: 2026-06-18
Roadmap: rank #1 (Phase 2, build-order #5, effort L, archFit "hard"). See
`docs/clinical_tool_expansion_roadmap.md`. Folds in Mood & Activity Self-Monitoring (#9)
as BA's logging substrate rather than as a separate tool.
Pattern reference: the Behavioral Experiment tool (PR #67), Values Clarity (PR #69),
Thought Record (PR #70), and Structured Problem Solving (PR #71). This tool reuses the
saved-card grammar and the new persisted-array wiring almost verbatim; its one genuine
departure is a new data shape (a planned activity with a date) and a Planned->Done
lifecycle.

## Purpose

Add a **Behavioral Activation** tool to the Practices shelf: a gentle way to plan a
meaningful or pleasant activity ahead of time, then come back and notice how it actually
went. The clinical mechanism is the **predicted-vs-experienced** contrast on two axes --
pleasure and mastery (reframed toward meaning) -- which is what helps a low mood notice
that dreaded or "pointless-seeming" activities often feel better than predicted. It maps
to the kbtiprimarvarden.se depression worksheets: the Activity & Mood Schedule (red/green),
Plus Activities, and TRAP/TRAC. The route is `/practices/behavioral-activation`.

This tool is **dual-mode** (see `docs/clinical_tool_expansion_roadmap.md`). It must be
usable clinically: it captures the full clinical field set (planned activity, life area,
date, predicted + experienced pleasure & mastery, free-text outcome, whether it happened)
and carries all of it through the existing JSON export/import so a therapist can review it.
There is **no dedicated clinician-mode UI in this build** -- the therapist reviews the card
over the client's shoulder or via export, the same way Thought Record / Problem Solving
already serve clinical use. A numbers-forward clinician view is deferred as its own future
feature; the data shape defined here already holds everything it would need.

## Framing & voice (hard constraint)

- Forbidden register: any score, percentage, progress bar, streak, ranking; a computed
  before/after **delta** of any kind; achievement language ("you accomplished", "well
  done", "goal reached"); "mastery"/"accomplishment" as user-facing words; deficit/clinical
  framing.
- Wanted register: "plan something that might feel good or meaningful", "how do you expect
  it to feel?", "how did it go?", "did it feel meaningful?". The predicted and experienced
  feelings are shown **as two words, side by side, with no delta** -- the same display
  Thought Record uses and that was explicitly approved there. Marking an activity **done**
  means "I did it", never "I succeeded".
- The two numeric axes (pleasure, mastery) are the clinically load-bearing P/A pair. They
  are stored as 1-5 word-buckets and never rendered as numbers, deltas, or charts.

## Data model

New persisted top-level array `behavioralActivations`, mirroring the `problemSolvings`
slice field-for-field in its wiring. New interface in `src/types/LifeCompassDocument.ts`:

```ts
export interface BehavioralActivation {
  id: string;
  areaId?: string;            // optional link to LifeArea.id (like the sibling tools)
  activity: string;           // "what I plan to do"
  plannedDate?: string;       // ISO date (day granularity), optional
  timeOfDay?: 'morning' | 'afternoon' | 'evening'; // optional; mirrors the schedule's day x slot
  done: boolean;              // did it happen? starts false
  // predicted (captured at plan time) + experienced (captured at review); all optional 1-5 buckets
  pleasureExpected?: number;  // "how good do you expect it to feel?"
  pleasureActual?: number;    // "how good did it feel?"
  masteryExpected?: number;   // "do you expect it to feel meaningful?"  (mastery, reframed)
  masteryActual?: number;     // "did it feel meaningful?"
  outcome: string;            // free-text "how it went"; starts empty
  createdAt: string;          // ISO 8601
}
```

No "best activity", no scores, no delta. `done` is the only boolean and encodes the BA
target (avoidance vs. activation), not achievement. The two axes are optional so a solo
user can skip them and the card still reads as a calm note rather than a worksheet.

## User flow

A guided reveal on **create** (one step at a time, like the Thought Record / Problem
Solving flow), saved into a re-openable **list of cards** (like the sibling tools). The one
real departure: a record has a **Planned -> Done** lifecycle, so the saved card is freely
editable afterward to add the review fields. We do **not** force a rigid two-step wizard --
create runs the plan flow; everything else is free editing on the saved card.

**Plan phase (on create):**

1. **What will you do?** -- "Plan something that might feel good or meaningful." (free text)
   + an optional life-area link (reuse the same area `<select>` pattern as the sibling
   tools; `attachesToArea: true`).
2. **When?** -- optional date (a plain date input, day granularity) + optional time-of-day
   (morning / afternoon / evening). Both skippable.
3. **How do you expect it to feel?** -- optional predicted pleasure ("how good do you expect
   it to feel?") and predicted meaning ("do you expect it to feel meaningful?"), each via
   the existing `ScaleChooser` 1-5 word-bucket. Skippable.

Save -> the card appears in the list as **Planned**.

**Review phase (reopen the saved card later):**

- A **done** toggle ("I did this").
- **How did it go?** -- free-text outcome.
- **How did it actually feel?** -- experienced pleasure + experienced meaning, same
  `ScaleChooser` buckets.

The saved card then shows the planned and experienced feelings **as two words side by
side, with no computed delta** -- e.g. expected "Dreading it" / actual "It was OK".

## Crisis signposting

Mount the existing `src/components/practices/CrisisResources.tsx` in the flow, as Thought
Record and Problem Solving do. BA is a depression worksheet and carries the same
suicidality-adjacent risk noted in the roadmap; the gentle locale-aware crisis line stays
consistent across the clinical tools.

## Persistence wiring (mechanical checklist -- mirror Problem Solving exactly)

- `PERSIST_VERSION` 4 -> 5 in `src/store/lifeCompassStore.ts`, plus a v4 -> v5 branch in the
  `migrate` hook (seed `behavioralActivations: []` for existing users).
- `CURRENT_SCHEMA_VERSION` 5 -> 6 in `src/types/LifeCompassDocument.ts`; add the field to
  `LifeCompassDocument`.
- Store: `behavioralActivations` array + actions (add / update / remove / and a per-record
  field setter as needed), `partialize` includes it, `removeAllAreas` clears it, the
  `onRehydrate` guard defaults it to `[]`, and area deletion **cascade-deletes** records
  whose `areaId` matches (matching the Problem Solving cascade; records with no `areaId`
  are untouched).
- Export/import: extend `exportService`, `exportImportSchema.json` (it is
  `additionalProperties:false`, so the `behavioralActivations` key MUST be listed), and
  thread it through **both** `importDocument` call sites (`GuideDataActions` AND
  `YourCompass` -- there are two).
- Migration-version test assertions use `toBeGreaterThanOrEqual` (the established pattern)
  so they stop re-breaking on each future bump.

## Tool registration & i18n

- `src/components/practices/tools/behavioral-activation/` with `index.ts` that pushes a
  `ToolDef` (`id: 'behavioral-activation'`, `attachesToArea: true`, `icon: CalendarDaysIcon`
  from `@heroicons/react/24/outline`, lazy `component`). Add the side-effect import to
  `src/practices/index.ts`.
- Files mirror the sibling tools: `BehavioralActivation` (list + entry), a flow component,
  an item/card component, `index.ts`.
- i18n: keys under `practices.tools.behavioral_activation.*`, hand-written `en` + `sv` (keep
  correct a-ring / a-umlaut / o-umlaut diacritics), the other 8 locales fall back to
  English. **Do NOT run `npm run extract`** (it deletes dynamically-referenced tool keys).
  Tests resolve dynamic keys via `@tests/test-i18n` `addResourceBundle`.

## Ethos (hard constraints, repeated for the implementer)

No scores / percentages / progress bars / streaks / deltas; gentle ACT-compatible copy;
local-only; any new wide element gets `w-full min-w-0`. Predicted vs experienced feelings
render as words side by side, never a delta.

## Out of scope (YAGNI)

- No weekly grid / calendar UI (this is the card-based "A" cut; the data shape leaves room
  to add a weekly view later without migration).
- No scheduled reminders / notifications (the SPA cannot deliver them).
- No dedicated clinician-mode numbers view (deferred as its own feature).
- No activity-type taxonomy (routine / necessary / pleasurable); the two rating axes already
  carry the pleasure/mastery distinction.

## Verification

Build clean, full unit suite green (including a migration test for v4 -> v5 and an
export/import round-trip that carries `behavioralActivations`), `npm run lint` 0, and
`npm run check:knip` clean -- the same green bar used for Problem Solving.
