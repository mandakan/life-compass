# Thought Record tool -- design spec

Date: 2026-06-17
Roadmap: rank #2 (Phase 2, build-order #3). See `docs/clinical_tool_expansion_roadmap.md`.
Pattern reference: the Behavioral Experiment tool (PR #67) and the Values Clarity tool (PR #69).

## Purpose

Add a **Thought Record** to the Practices shelf: the cognitive layer the app lacks. The
user captures a distressing situation + automatic thought + feeling, gently widens the
view, then notices how the feeling sits afterwards. It maps to the kbtiprimarvarden.se
cognitive-restructuring worksheet (CBT depression) / Worst Thought sheet (GAD), but is
worded in the app's gentle, ACT-compatible voice.

## Framing & voice (hard constraint)

**Hybrid: capture, then gently widen the view.** NOT classic cognitive restructuring.

- Forbidden register: "cognitive distortion", "challenge/dispute the thought", "irrational",
  "wrong", "negative thinking error", any percentage or numeric score, any before/after
  delta or "improvement" comparison, streaks.
- Wanted register: "what went through your mind", "what else might be true", "what might
  you say to a friend in this spot", "a kinder, wider way to hold this", "notice how it
  sits now". The reframe widens the view; it never proves the thought false.
- Reuse the no-scores ethos: word buckets only, never raw numbers; never compute or render
  a before/after difference.

## User flow

A guided reveal (one prompt at a time, like Values Clarity's 4-step flow), saved into a
re-openable **list of cards** (like the Behavioral Experiment list). The tool route is
`/practices/thought-record`.

Steps when creating / editing one record:

1. **Situation** -- "What happened? Where were you, who was there?" (free text) + an
   optional life-area link (reuse the same area `<select>` pattern as Behavioral
   Experiment; `attachesToArea: true`).
2. **Thought** -- "What went through your mind?" (free text; the thought that stings most).
3. **Feeling -- before** -- name the feeling in your own words (free text) AND how strong
   it feels on the existing 1-5 word-bucket `ScaleChooser` (`feelingBefore`, 1-5 or null).
   Use the `clay` accent. Provide five word labels (faint -> overwhelming) as i18n keys.
4. **Widen the view** -- three gentle free-text prompts:
   - `supports`: "What supports this thought?"
   - `widerView`: "What else might be true? What might you say to a friend in this spot?"
   - `kinderView`: "A kinder, wider way to hold this."
5. **Feeling -- after** -- "Notice how that feeling sits now" -> re-pick the bucket
   (`feelingAfter`, 1-5 or null). The two buckets are shown side by side as words on the
   saved card; **NO delta, arrow, percentage, or "you improved" text is ever rendered.**

A quiet, always-available **crisis line** ("If things feel overwhelming right now...")
appears on the tool, especially near the feeling steps. See Crisis resources below.

Saved cards in the list show situation (as title), the dated thought, both feeling words,
and are expandable to view/edit all fields. Each card can be deleted (with the app's
existing confirm pattern used by Behavioral Experiment / Goals).

## Data model

Add to `src/types/LifeCompassDocument.ts` (next to `BehavioralExperiment`):

```ts
export interface ThoughtRecord {
  id: string;
  areaId?: string;          // optional link to LifeArea.id (like BehavioralExperiment)
  situation: string;        // what happened
  thought: string;          // the automatic thought
  feeling: string;          // named emotion(s), free text
  feelingBefore?: number;   // 1-5 word-bucket, or undefined when not chosen
  supports: string;         // what supports the thought
  widerView: string;        // what else might be true
  kinderView: string;       // a kinder, wider way to hold it
  feelingAfter?: number;    // 1-5 word-bucket, or undefined when not chosen
  createdAt: string;        // ISO 8601
}
```

Add `thoughtRecords: ThoughtRecord[]` to `LifeCompassDocument`. Bump
`schemaVersion`/`CURRENT_SCHEMA_VERSION` 3 -> 4.

## Persistence checklist (follow exactly, mirroring `behavioralExperiments`)

Wherever `behavioralExperiments` appears outside the behavioral-experiment tool directory,
add a parallel `thoughtRecords`. Concretely:

- `src/store/lifeCompassStore.ts`:
  - State: `thoughtRecords: ThoughtRecord[]`, init `[]`.
  - Actions: `addThoughtRecord(partial?)`, `updateThoughtRecord(id, changes)` (preserve
    `id`), `removeThoughtRecord(id)`. Mirror the experiment action shapes.
  - Cascade: on area removal, `thoughtRecords.filter(t => t.areaId !== removedId)` (same
    place experiments are filtered).
  - `clearAll` / reset: include `thoughtRecords: []`.
  - `onRehydrate` / doc seeding: `thoughtRecords: doc.thoughtRecords ?? []`.
  - `partialize`: include `thoughtRecords`.
  - Bump `PERSIST_VERSION` 2 -> 3; add a `migrate` branch that seeds `thoughtRecords: []`
    for older persisted state.
- `src/types/LifeCompassDocument.ts`: type + `CURRENT_SCHEMA_VERSION` bump (above).
- `src/types/importExport.ts`: include `thoughtRecords` if it enumerates document fields.
- `src/utils/exportService.ts`: include `thoughtRecords` in the exported document.
- `src/components/ExportButton.tsx` and `src/components/guide/GuideDataActions.tsx`: wire
  `thoughtRecords` through the same way `behavioralExperiments` flows.
- `src/pages/YourCompass.tsx`: mirror any `behavioralExperiments` usage if present.
- `src/schemas/exportImportSchema.json`: add a `thoughtRecords` array schema (items with
  the fields above; `feelingBefore`/`feelingAfter`/`areaId` optional). Bump the schema's
  version constant if it carries one. Keep Ajv validation passing on round-trip.

Acceptance: export a document with thought records, re-import it, and all records (incl.
area links and feeling buckets) survive validation and round-trip.

## Tool registration

- `src/components/practices/tools/thought-record/index.ts`: push a `ToolDef`:
  - `id: 'thought-record'`
  - `labelKey: 'practices.tools.thought_record.label'`
  - `descriptionKey: 'practices.tools.thought_record.description'`
  - `icon`: a heroicon such as `ChatBubbleLeftEllipsisIcon` or `PencilSquareIcon`
  - `attachesToArea: true`
  - `component: lazy(() => import('./ThoughtRecord'))`
- Add a side-effect import to `src/practices/index.ts`.

Components in `src/components/practices/tools/thought-record/`:
`ThoughtRecord.tsx` (list + create entry point), the guided step flow, a record card/item,
reusing the Behavioral Experiment structure (`ExperimentItem` / `ExperimentStepList`
analogues) and the shared area-select row from Values Clarity's `AreaList` where it fits.

## Crisis resources (new, reusable)

New small reusable component, e.g. `src/components/practices/CrisisResources.tsx`, driven
by the current i18n language. Calm, collapsed-by-default or quiet inline line ("If things
feel overwhelming right now..."). Data per locale:

- `sv`: 112 (emergency), 1177 (vardguiden), Mind Sjalvmordslinjen 90101 / chat.
- English fallback / other locales: "contact your local emergency number" + a generic
  international line note. Keep copy non-alarming.

Built to be reusable by future distress-surfacing tools (Worry Postponement). No data
model, no persistence -- pure presentational + i18n.

## i18n

- All copy under `practices.tools.thought_record.*` and `practices.crisis.*`.
- Hand-translate `en` + `sv` in `public/locales/en/translation.json` and
  `public/locales/sv/translation.json`. The other 8 locales fall back to English.
- **DO NOT run `npm run extract`** -- `keepRemoved:false` + dynamic tool keys means extract
  deletes these keys.
- Five feeling-strength word labels (en + sv) under
  `practices.tools.thought_record.feeling_scale.*`.
- Mark `sv` copy for later native-Swedish review (same outstanding follow-up as the other
  two tools).

## Tests

- Store-action unit test (`src/tests/`): add/update/remove thought records; cascade delete
  when the linked area is removed; persist/migrate round-trip seeds `thoughtRecords: []`
  from a v2 state.
- Export/import test: a document with thought records validates against
  `exportImportSchema.json` and round-trips.
- Component smoke test using `@tests/test-i18n` with
  `i18n.addResourceBundle('sv','translation',{...},true,true)` to resolve the dynamic tool
  keys; render the tool, create a record, assert it appears; assert no numeric delta is
  rendered.

## Out of scope (v1, YAGNI)

- No closing "committed action / one small step" (avoid overlap with Goals/Values; can add
  later as an ACT bridge).
- No emotion taxonomy / preset feeling chips -- free text only for the feeling name.
- No trend chart of feelings over time.
- App-wide crisis signposting beyond this tool (the component is reusable, but only this
  tool mounts it for now).

## Non-negotiables (ethos)

No scores/percentages/progress bars/streaks; no before/after delta; gentle ACT-compatible
copy; local-only; any new wide element gets `w-full min-w-0` to avoid mobile overflow.
