# Thought Record Tool Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a Thought Record tool to the Practices shelf -- a guided "capture, then gently widen the view" CBT thought record, in the app's gentle ACT-compatible voice, with a reusable crisis-resource line.

**Architecture:** A new top-level persisted `thoughtRecords[]` slice in the Zustand store (mirroring `behavioralExperiments` exactly), a lazy-loaded tool registered into the Practices `TOOLS` registry, a guided step-reveal flow (like ValuesClarity) that saves into a re-openable list of cards (like the Behavioral Experiment list), and a small presentational `CrisisResources` component. No new architectural concepts -- every piece copies an existing pattern.

**Tech Stack:** React 19 + TypeScript, Zustand `persist`, React Router, Tailwind 4, i18next, Vitest + Testing Library, Ajv (export/import schema).

**Spec:** `docs/superpowers/specs/2026-06-17-thought-record-design.md`.

**Reference files to mirror (read these before the UI tasks):**

- Stepped flow: `src/components/practices/tools/values-clarity/ValuesClarity.tsx` (`StepFrame`, `step` state, next/back buttons).
- Persisted card list: `src/components/practices/tools/behavioral-experiment/BehavioralExperiment.tsx`, `ExperimentItem.tsx`, `ExperimentStepList.tsx`, `OutcomeField.tsx`.
- Tool registration: `src/components/practices/tools/behavioral-experiment/index.ts`, `src/practices/index.ts`.

**Two version numbers (do not conflate):** `PERSIST_VERSION` (store, 2 -> 3) and `CURRENT_SCHEMA_VERSION` (document, 3 -> 4).

**i18n rule:** Do NOT run `npm run extract`. Add keys by hand to `public/locales/en/translation.json` and `public/locales/sv/translation.json` only; the other 8 locales fall back to English.

---

## Task 1: Data model (`ThoughtRecord` type + document)

**Files:**

- Modify: `src/types/LifeCompassDocument.ts`

- [ ] **Step 1: Add the `ThoughtRecord` interface** after the `BehavioralExperiment` interface

```ts
/**
 * A thought record: a distressing situation, the automatic thought, the feeling
 * (named + a 1-5 word-bucket strength), a gentle widening of the view, and the
 * feeling noticed again afterwards. The hybrid "capture then widen" framing --
 * never disputing the thought, never showing a before/after delta. The area
 * link is optional, like BehavioralExperiment.
 */
export interface ThoughtRecord {
  id: string;
  areaId?: string; // optional link to LifeArea.id
  situation: string; // what happened
  thought: string; // the automatic thought
  feeling: string; // named emotion(s), free text
  feelingBefore?: number; // 1-5 word-bucket strength, omitted when not chosen
  supports: string; // what supports the thought
  widerView: string; // what else might be true
  kinderView: string; // a kinder, wider way to hold it
  feelingAfter?: number; // 1-5 word-bucket strength, omitted when not chosen
  createdAt: string; // ISO 8601
}
```

- [ ] **Step 2: Add `thoughtRecords` to `LifeCompassDocument` and bump the schema version**

In `LifeCompassDocument`, change `schemaVersion: 3;` to `schemaVersion: 4;`, add `thoughtRecords: ThoughtRecord[];` after `behavioralExperiments`, and change the constant:

```ts
export const CURRENT_SCHEMA_VERSION = 4 as const;
```

- [ ] **Step 3: Type-check**

Run: `npx tsc --noEmit`
Expected: errors only in files that build the document literal (store, GuideDataActions) -- these are fixed in later tasks. No error inside `LifeCompassDocument.ts` itself.

- [ ] **Step 4: Commit**

```bash
git add src/types/LifeCompassDocument.ts
git commit -m "feat(thought-record): add ThoughtRecord type and bump schema to v4"
```

---

## Task 2: Store slice (TDD)

**Files:**

- Modify: `src/store/lifeCompassStore.ts`
- Test: `src/tests/thoughtRecordStore.test.ts` (new)
- Test: `src/tests/thoughtRecordMigration.test.ts` (new)

Read `src/tests/behavioralExperimentStore.test.ts` and `src/tests/behavioralExperimentMigration.test.ts` first; these new tests mirror them.

- [ ] **Step 1: Write the failing store test** `src/tests/thoughtRecordStore.test.ts`

```ts
import { beforeEach, describe, expect, it } from 'vitest';
import { useLifeCompassStore } from '@/store/lifeCompassStore';
import type { LifeArea } from '@models/LifeArea';

const area = (id: string): LifeArea => ({
  id,
  name: `Area ${id}`,
  description: '',
  details: '',
  importance: 5,
  satisfaction: 5,
});

describe('thoughtRecords store slice', () => {
  beforeEach(() => {
    useLifeCompassStore.setState({
      lifeAreas: [],
      history: [],
      goals: [],
      behavioralExperiments: [],
      thoughtRecords: [],
    });
  });

  it('adds a thought record with defaults and a generated id', () => {
    useLifeCompassStore.getState().addThoughtRecord();
    const records = useLifeCompassStore.getState().thoughtRecords;
    expect(records).toHaveLength(1);
    expect(records[0].id).toBeTruthy();
    expect(records[0].situation).toBe('');
    expect(records[0].feeling).toBe('');
    expect(records[0].feelingBefore).toBeUndefined();
    expect(records[0].createdAt).toBeTruthy();
  });

  it('adds a thought record linked to an area', () => {
    useLifeCompassStore.getState().addThoughtRecord('area-1');
    expect(useLifeCompassStore.getState().thoughtRecords[0].areaId).toBe(
      'area-1',
    );
  });

  it('updates a thought record but never changes its id', () => {
    useLifeCompassStore.getState().addThoughtRecord();
    const { id } = useLifeCompassStore.getState().thoughtRecords[0];
    useLifeCompassStore
      .getState()
      .updateThoughtRecord(id, { situation: 'at work', feelingAfter: 2 });
    const rec = useLifeCompassStore.getState().thoughtRecords[0];
    expect(rec.id).toBe(id);
    expect(rec.situation).toBe('at work');
    expect(rec.feelingAfter).toBe(2);
  });

  it('removes a thought record', () => {
    useLifeCompassStore.getState().addThoughtRecord();
    const { id } = useLifeCompassStore.getState().thoughtRecords[0];
    useLifeCompassStore.getState().removeThoughtRecord(id);
    expect(useLifeCompassStore.getState().thoughtRecords).toHaveLength(0);
  });

  it('cascade-deletes thought records when their linked area is removed', () => {
    useLifeCompassStore.setState({ lifeAreas: [area('a'), area('b')] });
    useLifeCompassStore.getState().addThoughtRecord('a');
    useLifeCompassStore.getState().addThoughtRecord('b');
    useLifeCompassStore.getState().removeArea('a');
    const records = useLifeCompassStore.getState().thoughtRecords;
    expect(records).toHaveLength(1);
    expect(records[0].areaId).toBe('b');
  });

  it('clears thought records on removeAllAreas', () => {
    useLifeCompassStore.getState().addThoughtRecord();
    useLifeCompassStore.getState().removeAllAreas();
    expect(useLifeCompassStore.getState().thoughtRecords).toHaveLength(0);
  });

  it('imports thought records from a document', () => {
    useLifeCompassStore.getState().importDocument({
      schemaVersion: 4,
      lifeAreas: [],
      history: [],
      goals: [],
      behavioralExperiments: [],
      thoughtRecords: [
        {
          id: 't1',
          situation: 's',
          thought: 'th',
          feeling: 'sad',
          supports: '',
          widerView: '',
          kinderView: '',
          createdAt: '2026-06-17T00:00:00.000Z',
        },
      ],
    });
    expect(useLifeCompassStore.getState().thoughtRecords).toHaveLength(1);
  });
});
```

- [ ] **Step 2: Run it, verify it fails**

Run: `npx vitest run src/tests/thoughtRecordStore.test.ts`
Expected: FAIL -- `addThoughtRecord` is not a function / `thoughtRecords` undefined.

- [ ] **Step 3: Implement the store changes** in `src/store/lifeCompassStore.ts`

1. Import the type: add `ThoughtRecord` to the import from `../types/LifeCompassDocument`.
2. `PERSIST_VERSION`: change `2` to `3`.
3. `LifeCompassState` interface: add field `thoughtRecords: ThoughtRecord[];` (after `behavioralExperiments`) and these action signatures:

```ts
  addThoughtRecord: (areaId?: string) => void;
  updateThoughtRecord: (
    recordId: string,
    changes: Partial<ThoughtRecord>,
  ) => void;
  removeThoughtRecord: (recordId: string) => void;
```

4. Initial state: add `thoughtRecords: [],` next to `behavioralExperiments: [],`.
5. `removeArea`: add a cascade filter alongside the experiments one:

```ts
          thoughtRecords: state.thoughtRecords.filter(
            rec => rec.areaId !== id,
          ),
```

6. `removeAllAreas`: change to `set({ lifeAreas: [], goals: [], behavioralExperiments: [], thoughtRecords: [] })`.
7. `importDocument`: add `thoughtRecords: doc.thoughtRecords ?? [],`.
8. Add the three actions (place them after `setExperimentOutcome`):

```ts
      addThoughtRecord: areaId =>
        set(state => {
          const record: ThoughtRecord = {
            id: crypto.randomUUID(),
            situation: '',
            thought: '',
            feeling: '',
            supports: '',
            widerView: '',
            kinderView: '',
            createdAt: new Date().toISOString(),
            ...(areaId ? { areaId } : {}),
          };
          return { thoughtRecords: [...state.thoughtRecords, record] };
        }),

      updateThoughtRecord: (recordId, changes) =>
        set(state => ({
          thoughtRecords: state.thoughtRecords.map(rec =>
            rec.id === recordId ? { ...rec, ...changes, id: rec.id } : rec,
          ),
        })),

      removeThoughtRecord: recordId =>
        set(state => ({
          thoughtRecords: state.thoughtRecords.filter(
            rec => rec.id !== recordId,
          ),
        })),
```

9. `partialize`: add `thoughtRecords: state.thoughtRecords,`.
10. `migrate`: widen every `Pick<LifeCompassState, ...>` union in this function to include `'thoughtRecords'`, and add a new branch BEFORE the final `return`:

```ts
// v2 -> v3: thoughtRecords did not exist; seed an empty array.
if (version < 3) {
  return {
    ...state,
    thoughtRecords: state.thoughtRecords ?? [],
  } as Pick<
    LifeCompassState,
    | 'lifeAreas'
    | 'history'
    | 'goals'
    | 'behavioralExperiments'
    | 'thoughtRecords'
  >;
}
```

Also update the `persistedState as Partial<Pick<...>>` cast at the top of `migrate` to include `'thoughtRecords'`.

11. `onRehydrateStorage`: add a guard mirroring the experiments one:

```ts
if (!Array.isArray(state.thoughtRecords)) {
  state.thoughtRecords = [];
}
```

- [ ] **Step 4: Run the store test, verify it passes**

Run: `npx vitest run src/tests/thoughtRecordStore.test.ts`
Expected: PASS (all 7).

- [ ] **Step 5: Write the migration test** `src/tests/thoughtRecordMigration.test.ts`

Mirror `src/tests/behavioralExperimentMigration.test.ts`. It must assert that the store's `migrate` function, given a v2 persisted state with no `thoughtRecords`, returns state with `thoughtRecords: []`. Use the same technique that file uses to reach `migrate` (it persists a v2 blob to localStorage under `STORE_KEY` and re-imports the store, or calls the exposed migrate). Follow that file's exact approach; assert `useLifeCompassStore.getState().thoughtRecords` is `[]` after rehydration from a v2 blob that omits it.

- [ ] **Step 6: Run it, verify it passes**

Run: `npx vitest run src/tests/thoughtRecordMigration.test.ts`
Expected: PASS.

- [ ] **Step 7: Commit**

```bash
git add src/store/lifeCompassStore.ts src/tests/thoughtRecordStore.test.ts src/tests/thoughtRecordMigration.test.ts
git commit -m "feat(thought-record): add thoughtRecords store slice with cascade + migration"
```

---

## Task 3: Export / import wiring (TDD)

**Files:**

- Modify: `src/types/importExport.ts`
- Modify: `src/utils/exportService.ts`
- Modify: `src/schemas/exportImportSchema.json`
- Modify: `src/components/ExportButton.tsx`
- Modify: `src/components/guide/GuideDataActions.tsx`
- Modify: `src/pages/YourCompass.tsx` (a SECOND `importDocument` mapping, in `handleImportFile`)
- Test: `src/tests/exportService.test.ts` (extend) -- confirm with `ls src/tests` for the exact name; mirror whatever export test exists.

The schema's `data` block is `"additionalProperties": false`, so `thoughtRecords` MUST be added to the schema or export validation throws.

- [ ] **Step 1: Write a failing export round-trip test**

Add to the existing export service test file a case that exports an `ExportInput` including `thoughtRecords` and asserts (a) `exportData` does not throw, and (b) the parsed JSON's `data.thoughtRecords` contains the record. Example body:

```ts
it('includes thoughtRecords in the exported document', () => {
  const json = exportData({
    lifeAreas: [],
    history: [],
    goals: [],
    behavioralExperiments: [],
    thoughtRecords: [
      {
        id: 't1',
        situation: 's',
        thought: 'th',
        feeling: 'sad',
        feelingBefore: 4,
        supports: '',
        widerView: '',
        kinderView: '',
        feelingAfter: 2,
        createdAt: '2026-06-17T00:00:00.000Z',
      },
    ],
  });
  const parsed = JSON.parse(json);
  expect(parsed.data.thoughtRecords).toHaveLength(1);
  expect(parsed.data.thoughtRecords[0].feelingAfter).toBe(2);
});
```

- [ ] **Step 2: Run it, verify it fails**

Run: `npx vitest run src/tests/exportService.test.ts`
Expected: FAIL -- either a TS error (no `thoughtRecords` on `ExportInput`) or an Ajv "additionalProperties" validation throw.

- [ ] **Step 3: Wire `ExportInput` + export object** in `src/utils/exportService.ts`

- Import `ThoughtRecord` from `../types/LifeCompassDocument`.
- Add `thoughtRecords?: ThoughtRecord[];` to `ExportInput`.
- Add a local `let thoughtRecords: ThoughtRecord[];` and set it: `thoughtRecords = input.thoughtRecords ?? [];` in the `if (input)` branch, and `thoughtRecords = [];` in the `else` branch.
- Add `thoughtRecords,` to `exportJsonObj.data`.

- [ ] **Step 4: Add `thoughtRecords` to the schema** in `src/schemas/exportImportSchema.json`

Inside `data.properties`, after `behavioralExperiments`, add:

```json
        "thoughtRecords": {
          "type": "array",
          "items": {
            "type": "object",
            "properties": {
              "id": { "type": "string" },
              "areaId": { "type": "string" },
              "situation": { "type": "string" },
              "thought": { "type": "string" },
              "feeling": { "type": "string" },
              "feelingBefore": { "type": "number" },
              "supports": { "type": "string" },
              "widerView": { "type": "string" },
              "kinderView": { "type": "string" },
              "feelingAfter": { "type": "number" },
              "createdAt": { "type": "string" }
            },
            "required": [
              "id",
              "situation",
              "thought",
              "feeling",
              "supports",
              "widerView",
              "kinderView",
              "createdAt"
            ],
            "additionalProperties": true
          }
        }
```

- [ ] **Step 5: Add the `thoughtRecords` shape to `ImportedData`** in `src/types/importExport.ts`

After the `behavioralExperiments?` block inside `data`, add:

```ts
    thoughtRecords?: {
      id: string;
      areaId?: string;
      situation: string;
      thought: string;
      feeling: string;
      feelingBefore?: number;
      supports: string;
      widerView: string;
      kinderView: string;
      feelingAfter?: number;
      createdAt: string;
      [key: string]: unknown;
    }[];
```

- [ ] **Step 6: Thread it through the two UI call sites**

In `src/components/ExportButton.tsx`: add a selector `const thoughtRecords = useLifeCompassStore(state => state.thoughtRecords);` and pass `thoughtRecords` in the `exportData({ ... })` call.

In `src/components/guide/GuideDataActions.tsx`:

- add `type ThoughtRecord` to the `@models/LifeCompassDocument` import,
- add a selector `const thoughtRecords = useLifeCompassStore(state => state.thoughtRecords);`,
- pass `thoughtRecords` in the `exportData({ ... })` call,
- in `applyImport`, add to the `importDocument({ ... })` object: `thoughtRecords: (payload.data.thoughtRecords ?? []) as ThoughtRecord[],`.

In `src/pages/YourCompass.tsx` (the `handleImportFile` function has its OWN `importDocument({ ... })` mapping, ~line 153):

- add `type ThoughtRecord` to the `@models/LifeCompassDocument` import (or wherever `BehavioralExperiment` is imported there),
- add `thoughtRecords: (payload.data.thoughtRecords ?? []) as ThoughtRecord[],` to that `importDocument` object too.

Both import mappings must be patched or imported thought records are dropped on one path.

- [ ] **Step 7: Run the export test + typecheck, verify pass**

Run: `npx vitest run src/tests/exportService.test.ts && npx tsc --noEmit`
Expected: PASS, no type errors.

- [ ] **Step 8: Commit**

```bash
git add src/types/importExport.ts src/utils/exportService.ts src/schemas/exportImportSchema.json src/components/ExportButton.tsx src/components/guide/GuideDataActions.tsx src/pages/YourCompass.tsx src/tests/exportService.test.ts
git commit -m "feat(thought-record): export/import thoughtRecords through schema and call sites"
```

---

## Task 4: i18n copy (en + sv)

**Files:**

- Modify: `public/locales/en/translation.json`
- Modify: `public/locales/sv/translation.json`

- [ ] **Step 1: Add the English keys** under `practices.tools` (sibling of `behavioral_experiment` / `values_clarity`), plus a top-level `practices.crisis` block. Match the surrounding JSON nesting and the gentle, non-clinical register (NO "distortion", "challenge", "irrational", no numbers).

English values to add under `practices.tools.thought_record`:

```json
"thought_record": {
  "label": "Thought record",
  "description": "Notice a sticky thought, then gently widen the view.",
  "empty_state": "No thought records yet. Start one when a thought is weighing on you.",
  "new": "New thought record",
  "step_label": "Step {{current}} of {{total}}",
  "back": "Back",
  "next": "Next",
  "save": "Save",
  "done": "Done",
  "delete": "Delete",
  "edit": "Edit",
  "untitled": "Untitled situation",
  "step1": {
    "title": "What happened?",
    "prompt": "Where were you, who was there, what was going on?",
    "placeholder": "Describe the situation in a sentence or two.",
    "area_label": "Relates to (optional)",
    "area_none": "Not linked to an area"
  },
  "step2": {
    "title": "What went through your mind?",
    "prompt": "The thought that stings most. Write it as it came.",
    "placeholder": "e.g. I always let people down."
  },
  "step3": {
    "title": "How does it feel?",
    "prompt": "Name the feeling, and notice how strong it is right now.",
    "feeling_placeholder": "e.g. sad, anxious, ashamed",
    "strength_label": "How strong does it feel?"
  },
  "step4": {
    "title": "Widen the view",
    "prompt": "Gently, without arguing with yourself.",
    "supports_label": "What supports this thought?",
    "supports_placeholder": "What makes it feel true?",
    "wider_label": "What else might be true?",
    "wider_placeholder": "What might you say to a friend in this spot?",
    "kinder_label": "A kinder, wider way to hold this",
    "kinder_placeholder": "If you stepped back, how else could you carry it?"
  },
  "step5": {
    "title": "How does it feel now?",
    "prompt": "Just notice how the same feeling sits now. There is no right answer.",
    "strength_label": "How strong does it feel now?"
  },
  "feeling_scale": {
    "1": "faint",
    "2": "mild",
    "3": "noticeable",
    "4": "strong",
    "5": "overwhelming"
  }
}
```

Top-level `practices.crisis` block:

```json
"crisis": {
  "trigger": "If things feel overwhelming right now",
  "intro": "You don't have to sit with this alone.",
  "resources": [
    "Emergency: call 112",
    "Healthcare advice: call 1177",
    "Mind Suicide Line: call 90101 or chat at mind.se"
  ]
}
```

- [ ] **Step 2: Add the Swedish keys** with the same structure under `practices.tools.thought_record` and `practices.crisis` in `public/locales/sv/translation.json`. Suggested `sv` copy (mark for later native review):

`thought_record`: label "Tankeregistrering", description "Lagg marke till en envis tanke och vidga vyn varsamt.", step1.title "Vad hande?", step2.title "Vad for genom ditt huvud?", step3.title "Hur kanns det?", step4.title "Vidga vyn", step5.title "Hur kanns det nu?", feeling_scale 1-5: "svag", "mild", "markbar", "stark", "overvaldigande", back "Tillbaka", next "Nasta", save "Spara", done "Klar". Translate the prompts/placeholders/labels in the same gentle register.

`crisis`: trigger "Om det kanns overvaldigande just nu", intro "Du behover inte bara det har sjalv.", resources: ["Nodsituation: ring 112", "Sjukvardsradgivning: ring 1177", "Mind Sjalvmordslinjen: ring 90101 eller chatta pa mind.se"].

- [ ] **Step 3: Verify the JSON parses**

Run: `node -e "JSON.parse(require('fs').readFileSync('public/locales/en/translation.json','utf8'));JSON.parse(require('fs').readFileSync('public/locales/sv/translation.json','utf8'));console.log('ok')"`
Expected: `ok`

- [ ] **Step 4: Commit**

```bash
git add public/locales/en/translation.json public/locales/sv/translation.json
git commit -m "feat(thought-record): add en + sv copy and crisis resources"
```

---

## Task 5: Crisis resources component

**Files:**

- Create: `src/components/practices/CrisisResources.tsx`

- [ ] **Step 1: Write the component** -- a quiet `<details>` line, collapsed by default, locale copy via i18next (uses the `practices.crisis` keys from Task 4). `returnObjects` gives the resource array.

```tsx
import React from 'react';
import { useTranslation } from 'react-i18next';

/**
 * A calm, always-available crisis line for distress-surfacing tools (Thought
 * Record today; reusable by Worry Postponement etc. later). Collapsed by
 * default so it never alarms. Copy + resources come from `practices.crisis`
 * per locale. No data, no persistence.
 */
const CrisisResources: React.FC = () => {
  const { t } = useTranslation();
  const resources = t('practices.crisis.resources', {
    returnObjects: true,
  }) as string[];

  return (
    <details className="border-border bg-surface-sunken w-full min-w-0 rounded-lg border px-4 py-3">
      <summary className="text-text-muted cursor-pointer text-sm">
        {t('practices.crisis.trigger')}
      </summary>
      <div className="mt-2 flex flex-col gap-1">
        <p className="text-text text-sm">{t('practices.crisis.intro')}</p>
        <ul className="text-text-muted list-none text-sm">
          {(Array.isArray(resources) ? resources : []).map(line => (
            <li key={line}>{line}</li>
          ))}
        </ul>
      </div>
    </details>
  );
};

export default CrisisResources;
```

- [ ] **Step 2: Typecheck**

Run: `npx tsc --noEmit`
Expected: no new errors.

- [ ] **Step 3: Commit**

```bash
git add src/components/practices/CrisisResources.tsx
git commit -m "feat(thought-record): add reusable CrisisResources component"
```

---

## Task 6: Thought Record UI + registration (TDD)

**Files:**

- Create: `src/components/practices/tools/thought-record/ThoughtRecord.tsx` (list + "new" + renders the flow / cards)
- Create: `src/components/practices/tools/thought-record/ThoughtRecordFlow.tsx` (the 5-step guided reveal for one record)
- Create: `src/components/practices/tools/thought-record/ThoughtRecordItem.tsx` (saved card, expand to view/edit, delete)
- Create: `src/components/practices/tools/thought-record/index.ts` (ToolDef registration)
- Modify: `src/practices/index.ts` (side-effect import)
- Test: `src/tests/thoughtRecord.test.tsx` (new)

Read `BehavioralExperiment.tsx` + `ExperimentItem.tsx` (card list, expand, delete via `useConfirmDialog`) and `ValuesClarity.tsx` (`StepFrame`, `step` state, next/back) before writing. Mirror their structure, styles, and the `PREFIX` constant convention (`const PREFIX = 'practices.tools.thought_record';`).

**Component contracts:**

- `ThoughtRecord.tsx`: subscribes to `thoughtRecords` and `addThoughtRecord`; shows the empty state (`${PREFIX}.empty_state`) when none; a "New thought record" primary button that calls `addThoughtRecord()` then opens the flow for the new record's id; and a `<ul>` of `ThoughtRecordItem` for saved records (newest first). Use `useConfirmDialog` for delete confirmation, passing an `onRequestDelete` to each item exactly like `BehavioralExperiment.tsx` does.
- `ThoughtRecordFlow.tsx`: props `{ record: ThoughtRecord; onClose: () => void }`. Local `step` state 1..5 with `StepFrame` (copy `StepFrame` from ValuesClarity or extract a shared one -- copying is fine, keep it local). Each field writes through `updateThoughtRecord(record.id, { ... })` on change (controlled inputs bound to the live record). Steps:
  1. `Input`/textarea for `situation` + the optional area `<select>` (reuse the select markup from `ExperimentItem`/`BehavioralExperiment`; remember `w-full min-w-0 max-w-full truncate` on the select to avoid mobile overflow). Options come from `useLifeCompassStore(s => s.lifeAreas)`; the empty option uses `${PREFIX}.step1.area_none`.
  2. textarea for `thought`.
  3. text input for `feeling` + `ScaleChooser` (`labels` = the five `${PREFIX}.feeling_scale.1..5`, `value={record.feelingBefore ?? null}`, `accent="clay"`, `onChange={n => updateThoughtRecord(record.id, { feelingBefore: n })}`).
  4. three textareas: `supports`, `widerView`, `kinderView`.
  5. `ScaleChooser` for `feelingAfter` (same labels; `value={record.feelingAfter ?? null}`). Render the before + after words as plain text side by side, e.g. `t(scaleKey(record.feelingBefore))` and `t(scaleKey(record.feelingAfter))` -- **never compute or render a difference.**
     Footer: Back/Next buttons (disable Back on step 1); on step 5 a "Done" button calls `onClose()`. Mount `<CrisisResources />` once at the bottom of the flow.
- `ThoughtRecordItem.tsx`: props `{ record; onRequestDelete: () => Promise<boolean> }`. Collapsed shows `record.situation || t('${PREFIX}.untitled')` as title and the dated `record.thought`; expanded shows all fields read-only plus an Edit button that opens `ThoughtRecordFlow` inline (or toggles editing), and a Delete (Trash) button that calls `onRequestDelete()` then `removeThoughtRecord(record.id)`. Mirror `ExperimentItem.tsx` exactly for the expand/delete affordances.

Add `scaleKey` helper inline where used: `const scaleKey = (n?: number) => n ? \`${PREFIX}.feeling_scale.${n}\` : null;` and only render the word when non-null.

- [ ] **Step 1: Write the registration** `src/components/practices/tools/thought-record/index.ts`

```ts
import { lazy } from 'react';
import { ChatBubbleLeftEllipsisIcon } from '@heroicons/react/24/outline';
import { TOOLS, type ToolDef } from '@/practices/toolRegistry';

const thoughtRecordTool: ToolDef = {
  id: 'thought-record',
  labelKey: 'practices.tools.thought_record.label',
  descriptionKey: 'practices.tools.thought_record.description',
  icon: ChatBubbleLeftEllipsisIcon,
  attachesToArea: true,
  component: lazy(() => import('./ThoughtRecord')),
};

TOOLS.push(thoughtRecordTool);
```

- [ ] **Step 2: Register the side-effect import** in `src/practices/index.ts`

Add the import line next to the existing tool imports (match the existing style, e.g. `import './tools/thought-record';`). Read the file first to match its exact ordering/format.

- [ ] **Step 3: Write the failing component test** `src/tests/thoughtRecord.test.tsx`

Read `src/tests/behavioralExperiment.test.tsx` first and mirror its setup (it wraps in the i18n provider and adds a resource bundle for the dynamic tool keys). The test must:

- add the `practices.tools.thought_record.*` + `practices.crisis.*` keys via `i18n.addResourceBundle('sv','translation',{ practices: { tools: { thought_record: {...} }, crisis: {...} } }, true, true)`,
- render `ThoughtRecord` inside a Router + i18n provider,
- assert the empty state shows,
- click "New thought record", type a situation, advance steps, and assert the saved card appears with that situation,
- assert that NO numeric digit / `%` is rendered for the feeling (e.g. query the container text and assert it does not match `/\d+\s*%/` and that feeling strength shows a word label, not a number).

Keep assertions resilient (use roles/labels, not brittle text where possible).

- [ ] **Step 4: Run it, verify it fails**

Run: `npx vitest run src/tests/thoughtRecord.test.tsx`
Expected: FAIL -- components do not exist yet.

- [ ] **Step 5: Implement the three components** per the contracts above.

- [ ] **Step 6: Run the test + typecheck, verify pass**

Run: `npx vitest run src/tests/thoughtRecord.test.tsx && npx tsc --noEmit`
Expected: PASS, no type errors.

- [ ] **Step 7: Commit**

```bash
git add src/components/practices/tools/thought-record src/practices/index.ts src/tests/thoughtRecord.test.tsx
git commit -m "feat(thought-record): add guided Thought Record tool UI and registration"
```

---

## Task 7: Full verification

- [ ] **Step 1: Run the whole unit suite**

Run: `npm run test-verbose`
Expected: all pass, including the new thought-record + migration + export tests.

- [ ] **Step 2: Lint + typecheck + build**

Run: `npm run lint && npx tsc --noEmit && npm run build`
Expected: clean lint, no type errors, successful build.

- [ ] **Step 3: Manual smoke (optional but recommended)**

Run `npm run dev`, open `/practices`, confirm the Thought Record card appears, open it, walk the 5 steps, save, reopen the card, then export from the guide and confirm the JSON contains `thoughtRecords`. Confirm no number/percentage is shown for the feeling and no before/after delta.

- [ ] **Step 4: Final commit if anything was touched during verification**

```bash
git add -A && git commit -m "chore(thought-record): verification fixups"
```

---

## Notes for the implementer

- **Ethos non-negotiables:** no scores/percentages/progress bars/streaks; no before/after delta; gentle ACT-compatible copy; local-only; any new wide element (`select`, the flow container) gets `w-full min-w-0` to avoid the mobile overflow that PR #68 fixed.
- **`sv` copy is machine-suggested** -- leave it working but flag in the PR body that native-Swedish review is an outstanding follow-up (same as the other two tools).
- **Do not run `npm run extract`.**
