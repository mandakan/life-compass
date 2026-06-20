# Behavioral Activation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a "Behavioral Activation" tool to the Practices shelf: plan a meaningful/pleasant activity, then reopen the saved card to record how it actually went, with a predicted-vs-experienced contrast on two gentle axes (pleasure + meaning) shown as words side by side, never as a delta.

**Architecture:** Mirror the Thought Record tool field-for-field. A new persisted top-level `behavioralActivations` array on the Zustand store, threaded through migration, export/import, and the JSON schema, plus a new tool component folder registered into the `TOOLS` registry. No new shared primitives -- reuse `ScaleChooser`, `Button`, `CrisisResources`, `useConfirmDialog`. The one new data shape is a planned activity with an optional date + time-of-day and a `done` flag; the one new interaction is a Planned -> Done lifecycle on the saved card (free editing after create, not a rigid wizard).

**Tech Stack:** React + TypeScript, Zustand (persist middleware), react-i18next (runtime HTTP backend), Tailwind 4, Vitest + Testing Library, Ajv schema validation.

**Spec:** `docs/superpowers/specs/2026-06-18-behavioral-activation-design.md`. Read it first.

**House rules (do not violate):**
- Do NOT run `npm run extract` (it deletes the dynamically-referenced tool keys).
- Swedish copy keeps real diacritics (å ä ö); the ASCII-punctuation rule is punctuation-only.
- No scores / percentages / progress bars / streaks / computed before-after deltas. Predicted and experienced feelings render as two words side by side.
- Any new wide element gets `w-full min-w-0`.
- Prettier: single quotes, semicolons, trailing commas, `arrowParens: avoid`, 80 cols.
- Commit after each task. Node 22 (`.nvmrc`).

---

## File Structure

**Create:**
- `src/components/practices/tools/behavioral-activation/BehavioralActivation.tsx` -- list + entry point (mirror `ThoughtRecord.tsx`)
- `src/components/practices/tools/behavioral-activation/BehavioralActivationFlow.tsx` -- the guided create/edit flow (mirror `ThoughtRecordFlow.tsx`)
- `src/components/practices/tools/behavioral-activation/BehavioralActivationItem.tsx` -- the saved card (mirror `ThoughtRecordItem.tsx`)
- `src/components/practices/tools/behavioral-activation/index.ts` -- `ToolDef` registration (mirror `thought-record/index.ts`)
- `src/tests/behavioralActivationStore.test.ts` -- store slice test
- `src/tests/behavioralActivationMigration.test.ts` -- v4 -> v5 migration test
- `src/tests/behavioralActivation.test.tsx` -- component smoke test

**Modify:**
- `src/types/LifeCompassDocument.ts` -- add `BehavioralActivation` interface, add field to `LifeCompassDocument`, bump `schemaVersion` literal + `CURRENT_SCHEMA_VERSION` 5 -> 6
- `src/types/importExport.ts` -- add optional `behavioralActivations` block to `ImportedData.data`
- `src/store/lifeCompassStore.ts` -- state field, 3 actions, cascade in `removeArea`, `removeAllAreas`, `importDocument`, `partialize`, `migrate` (PERSIST_VERSION 4 -> 5 + branch + Pick widening), `onRehydrateStorage` guard
- `src/utils/exportService.ts` -- thread `behavioralActivations` through `ExportInput` + the export object
- `src/schemas/exportImportSchema.json` -- add `behavioralActivations` definition under `data.properties`
- `src/pages/YourCompass.tsx` -- add `behavioralActivations` to the `importDocument` call
- `src/components/guide/GuideDataActions.tsx` -- subscribe + thread through export + import
- `src/practices/index.ts` -- side-effect import of the new tool
- `src/tests/thoughtRecordStore.test.ts`, `src/tests/problemSolvingStore.test.ts` -- add `behavioralActivations: []` and bump `schemaVersion` to 6 in their `importDocument` literals
- `public/locales/en/translation.json`, `public/locales/sv/translation.json` -- `practices.tools.behavioral_activation.*` keys

---

## Task 1: Data model + store slice

**Files:**
- Modify: `src/types/LifeCompassDocument.ts`
- Modify: `src/types/importExport.ts`
- Modify: `src/store/lifeCompassStore.ts`
- Modify: `src/tests/thoughtRecordStore.test.ts`, `src/tests/problemSolvingStore.test.ts`
- Test: `src/tests/behavioralActivationStore.test.ts` (create)

- [ ] **Step 1: Write the failing store test**

Create `src/tests/behavioralActivationStore.test.ts`:

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

describe('behavioralActivations store slice', () => {
  beforeEach(() => {
    useLifeCompassStore.setState({
      lifeAreas: [],
      history: [],
      goals: [],
      behavioralExperiments: [],
      thoughtRecords: [],
      problemSolvings: [],
      behavioralActivations: [],
    });
  });

  it('adds a behavioral activation with defaults and a generated id', () => {
    useLifeCompassStore.getState().addBehavioralActivation();
    const records = useLifeCompassStore.getState().behavioralActivations;
    expect(records).toHaveLength(1);
    expect(records[0].id).toBeTruthy();
    expect(records[0].activity).toBe('');
    expect(records[0].done).toBe(false);
    expect(records[0].outcome).toBe('');
    expect(records[0].plannedDate).toBeUndefined();
    expect(records[0].pleasureExpected).toBeUndefined();
    expect(records[0].createdAt).toBeTruthy();
  });

  it('adds a behavioral activation linked to an area', () => {
    useLifeCompassStore.getState().addBehavioralActivation('area-1');
    expect(
      useLifeCompassStore.getState().behavioralActivations[0].areaId,
    ).toBe('area-1');
  });

  it('updates a behavioral activation but never changes its id', () => {
    useLifeCompassStore.getState().addBehavioralActivation();
    const { id } = useLifeCompassStore.getState().behavioralActivations[0];
    useLifeCompassStore.getState().updateBehavioralActivation(id, {
      activity: 'walk by the river',
      done: true,
      pleasureActual: 4,
    });
    const rec = useLifeCompassStore.getState().behavioralActivations[0];
    expect(rec.id).toBe(id);
    expect(rec.activity).toBe('walk by the river');
    expect(rec.done).toBe(true);
    expect(rec.pleasureActual).toBe(4);
  });

  it('removes a behavioral activation', () => {
    useLifeCompassStore.getState().addBehavioralActivation();
    const { id } = useLifeCompassStore.getState().behavioralActivations[0];
    useLifeCompassStore.getState().removeBehavioralActivation(id);
    expect(
      useLifeCompassStore.getState().behavioralActivations,
    ).toHaveLength(0);
  });

  it('cascade-deletes activations when their linked area is removed', () => {
    useLifeCompassStore.setState({ lifeAreas: [area('a'), area('b')] });
    useLifeCompassStore.getState().addBehavioralActivation('a');
    useLifeCompassStore.getState().addBehavioralActivation('b');
    useLifeCompassStore.getState().removeArea('a');
    const records = useLifeCompassStore.getState().behavioralActivations;
    expect(records).toHaveLength(1);
    expect(records[0].areaId).toBe('b');
  });

  it('clears activations on removeAllAreas', () => {
    useLifeCompassStore.getState().addBehavioralActivation();
    useLifeCompassStore.getState().removeAllAreas();
    expect(
      useLifeCompassStore.getState().behavioralActivations,
    ).toHaveLength(0);
  });

  it('imports behavioral activations from a document', () => {
    useLifeCompassStore.getState().importDocument({
      schemaVersion: 6,
      lifeAreas: [],
      history: [],
      goals: [],
      behavioralExperiments: [],
      thoughtRecords: [],
      problemSolvings: [],
      behavioralActivations: [
        {
          id: 'b1',
          activity: 'call a friend',
          done: false,
          outcome: '',
          createdAt: '2026-06-18T00:00:00.000Z',
        },
      ],
    });
    expect(
      useLifeCompassStore.getState().behavioralActivations,
    ).toHaveLength(1);
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npx vitest run src/tests/behavioralActivationStore.test.ts`
Expected: FAIL -- `addBehavioralActivation` is not a function / `schemaVersion: 6` not assignable / `behavioralActivations` missing on document.

- [ ] **Step 3: Add the `BehavioralActivation` type and bump the document version**

In `src/types/LifeCompassDocument.ts`, add this interface immediately after the `ProblemSolving` interface (after the line `  createdAt: string; // ISO 8601\n}` that closes `ProblemSolving`, before the `LifeCompassDocument` doc comment):

```ts
/**
 * A planned activity for behavioral activation: something the user means to do,
 * optionally on a date/time-of-day, then reviewed after the fact. The two
 * feeling axes -- pleasure ("how good it felt") and meaning (mastery, reframed
 * toward values) -- are captured as predicted + experienced 1-5 word-buckets.
 * They are never rendered as numbers or a before/after delta. `done` encodes
 * activation-vs-avoidance ("I did it"), never achievement. The area link is
 * optional, like BehavioralExperiment / ThoughtRecord / ProblemSolving.
 */
export interface BehavioralActivation {
  id: string;
  areaId?: string; // optional link to LifeArea.id
  activity: string; // what I plan to do
  plannedDate?: string; // ISO date (day granularity), optional
  timeOfDay?: 'morning' | 'afternoon' | 'evening'; // optional schedule slot
  done: boolean; // did it happen? starts false
  pleasureExpected?: number; // 1-5 word-bucket, "how good do you expect it to feel?"
  pleasureActual?: number; // 1-5 word-bucket, "how good did it feel?"
  masteryExpected?: number; // 1-5 word-bucket, "do you expect it to feel meaningful?"
  masteryActual?: number; // 1-5 word-bucket, "did it feel meaningful?"
  outcome: string; // free-text "how it went"; starts empty
  createdAt: string; // ISO 8601
}
```

Then update the `LifeCompassDocument` interface and the version constant. Replace:

```ts
export interface LifeCompassDocument {
  schemaVersion: 5;
  lifeAreas: LifeArea[];
  history: Snapshot[];
  goals: Goal[];
  behavioralExperiments: BehavioralExperiment[];
  thoughtRecords: ThoughtRecord[];
  problemSolvings: ProblemSolving[];
}

export const CURRENT_SCHEMA_VERSION = 5 as const;
```

with:

```ts
export interface LifeCompassDocument {
  schemaVersion: 6;
  lifeAreas: LifeArea[];
  history: Snapshot[];
  goals: Goal[];
  behavioralExperiments: BehavioralExperiment[];
  thoughtRecords: ThoughtRecord[];
  problemSolvings: ProblemSolving[];
  behavioralActivations: BehavioralActivation[];
}

export const CURRENT_SCHEMA_VERSION = 6 as const;
```

- [ ] **Step 4: Add the import/export interface field**

In `src/types/importExport.ts`, add this block inside `data`, immediately after the `problemSolvings?: { ... }[];` block (before the closing `};` of `data`):

```ts
    behavioralActivations?: {
      id: string;
      areaId?: string;
      activity: string;
      plannedDate?: string;
      timeOfDay?: 'morning' | 'afternoon' | 'evening';
      done: boolean;
      pleasureExpected?: number;
      pleasureActual?: number;
      masteryExpected?: number;
      masteryActual?: number;
      outcome: string;
      createdAt: string;
      [key: string]: unknown;
    }[];
```

- [ ] **Step 5: Update existing `importDocument` test literals**

The document now requires `behavioralActivations`. Two store tests pass a full typed document literal and must gain the field.

In `src/tests/thoughtRecordStore.test.ts`, find the `importDocument({ ... })` call (it starts `schemaVersion: 5,`). Change `schemaVersion: 5,` to `schemaVersion: 6,` and add `behavioralActivations: [],` immediately after the `problemSolvings: [],` line.

In `src/tests/problemSolvingStore.test.ts`, do the same: change its `schemaVersion: 5,` to `schemaVersion: 6,` and add `behavioralActivations: [],` after its `problemSolvings: [` array literal closes (i.e. as the last property before the object closes). If `problemSolvings` is the final property, add `behavioralActivations: [],` after it.

(Leave `src/tests/behavioralExperimentStore.test.ts` and `src/tests/lifeCompassStore.test.ts` alone -- they use `as unknown as` casts or older `schemaVersion: 2/3` literals and do not type-check against the full document.)

- [ ] **Step 6: Add the store state, actions, and wiring**

In `src/store/lifeCompassStore.ts`:

(a) Add the type import. In the import block from `'../types/LifeCompassDocument'`, add `BehavioralActivation,` (alphabetical, before `BehavioralExperiment,`):

```ts
import {
  ActionStep,
  BehavioralActivation,
  BehavioralExperiment,
  CURRENT_SCHEMA_VERSION,
  Goal,
  LifeCompassDocument,
  ProblemSolving,
  Snapshot,
  SnapshotArea,
  SolutionOption,
  ThoughtRecord,
} from '../types/LifeCompassDocument';
```

(b) Add the state field to the `LifeCompassState` type. After the `problemSolvings: ProblemSolving[];` line:

```ts
  behavioralActivations: BehavioralActivation[];
```

(c) Add the action signatures to the `LifeCompassState` type. After the `removeProblemSolvingStep` signature (the last problem-solving action):

```ts
  addBehavioralActivation: (areaId?: string) => void;
  updateBehavioralActivation: (
    recordId: string,
    changes: Partial<BehavioralActivation>,
  ) => void;
  removeBehavioralActivation: (recordId: string) => void;
```

(d) Seed the initial state. After `problemSolvings: [],` in the `create(...)` initial object:

```ts
      behavioralActivations: [],
```

(e) Cascade-delete in `removeArea`. After the `problemSolvings: state.problemSolvings.filter(rec => rec.areaId !== id,),` entry:

```ts
          behavioralActivations: state.behavioralActivations.filter(
            rec => rec.areaId !== id,
          ),
```

(f) `removeAllAreas`. After `problemSolvings: [],` in the `set({ ... })`:

```ts
          behavioralActivations: [],
```

(g) `importDocument`. After `problemSolvings: doc.problemSolvings ?? [],`:

```ts
          behavioralActivations: doc.behavioralActivations ?? [],
```

(h) Add the three actions. Place them immediately after the `removeProblemSolvingStep` action (after its closing `})),`), before the closing of the store-creator object:

```ts
      addBehavioralActivation: areaId =>
        set(state => {
          const record: BehavioralActivation = {
            id: crypto.randomUUID(),
            activity: '',
            done: false,
            outcome: '',
            createdAt: new Date().toISOString(),
            ...(areaId ? { areaId } : {}),
          };
          return {
            behavioralActivations: [...state.behavioralActivations, record],
          };
        }),

      updateBehavioralActivation: (recordId, changes) =>
        set(state => ({
          behavioralActivations: state.behavioralActivations.map(rec =>
            rec.id === recordId ? { ...rec, ...changes, id: rec.id } : rec,
          ),
        })),

      removeBehavioralActivation: recordId =>
        set(state => ({
          behavioralActivations: state.behavioralActivations.filter(
            rec => rec.id !== recordId,
          ),
        })),
```

(i) `partialize`. After `problemSolvings: state.problemSolvings,`:

```ts
        behavioralActivations: state.behavioralActivations,
```

(Leave the `migrate` hook and `onRehydrateStorage` for Task 2.)

- [ ] **Step 7: Run the store test to verify it passes**

Run: `npx vitest run src/tests/behavioralActivationStore.test.ts`
Expected: PASS (all 7 cases).

- [ ] **Step 8: Run the two touched sibling tests**

Run: `npx vitest run src/tests/thoughtRecordStore.test.ts src/tests/problemSolvingStore.test.ts`
Expected: PASS (the added `behavioralActivations: []` keeps them valid).

- [ ] **Step 9: Commit**

```bash
git add src/types/LifeCompassDocument.ts src/types/importExport.ts src/store/lifeCompassStore.ts src/tests/behavioralActivationStore.test.ts src/tests/thoughtRecordStore.test.ts src/tests/problemSolvingStore.test.ts
git commit -m "feat(practices): add behavioralActivations store slice + data model"
```

---

## Task 2: Persist migration (v4 -> v5)

**Files:**
- Modify: `src/store/lifeCompassStore.ts`
- Test: `src/tests/behavioralActivationMigration.test.ts` (create)

- [ ] **Step 1: Write the failing migration test**

Create `src/tests/behavioralActivationMigration.test.ts`:

```ts
import { describe, it, expect } from 'vitest';
import {
  useLifeCompassStore,
  PERSIST_VERSION,
} from '../store/lifeCompassStore';

describe('behavioralActivations persist migration', () => {
  it('PERSIST_VERSION is at least 5', () => {
    expect(PERSIST_VERSION).toBeGreaterThanOrEqual(5);
  });

  it('migrate seeds behavioralActivations:[] for a v4 state', () => {
    const migrate = useLifeCompassStore.persist.getOptions().migrate!;
    const v4 = {
      lifeAreas: [],
      history: [],
      goals: [],
      behavioralExperiments: [],
      thoughtRecords: [],
      problemSolvings: [],
    };
    const result = migrate(v4, 4) as { behavioralActivations: unknown[] };
    expect(result.behavioralActivations).toEqual([]);
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npx vitest run src/tests/behavioralActivationMigration.test.ts`
Expected: FAIL -- `PERSIST_VERSION` is 4, and the migrate result has no `behavioralActivations`.

- [ ] **Step 3: Bump `PERSIST_VERSION`**

In `src/store/lifeCompassStore.ts`, change:

```ts
export const PERSIST_VERSION = 4;
```

to:

```ts
export const PERSIST_VERSION = 5;
```

- [ ] **Step 4: Widen the `migrate` Pick type and add the v4 -> v5 branch**

In the `migrate` hook, every `Pick<LifeCompassState, | 'lifeAreas' | 'history' | 'goals' | 'behavioralExperiments' | 'thoughtRecords' | 'problemSolvings'>` union must gain `| 'behavioralActivations'`. There are five such unions (the `state` cast, the v0->v1 return cast, the v1->v2 return cast, the v2->v3 return cast, the v3->v4 return cast, and the final fall-through return cast). Add `| 'behavioralActivations'` after `| 'problemSolvings'` in **every** one of them.

Then add the new branch immediately after the existing `// v3 -> v4: problemSolvings did not exist...` block (after its closing `}`), before the final `return state as Pick<...>`:

```ts
        // v4 -> v5: behavioralActivations did not exist; seed an empty array.
        if (version < 5) {
          return {
            ...state,
            behavioralActivations: state.behavioralActivations ?? [],
          } as Pick<
            LifeCompassState,
            | 'lifeAreas'
            | 'history'
            | 'goals'
            | 'behavioralExperiments'
            | 'thoughtRecords'
            | 'problemSolvings'
            | 'behavioralActivations'
          >;
        }
```

- [ ] **Step 5: Add the `onRehydrate` defensive guard**

In `onRehydrateStorage`, after the `if (!Array.isArray(state.problemSolvings)) { state.problemSolvings = []; }` block:

```ts
        if (!Array.isArray(state.behavioralActivations)) {
          state.behavioralActivations = [];
        }
```

- [ ] **Step 6: Run the migration test to verify it passes**

Run: `npx vitest run src/tests/behavioralActivationMigration.test.ts`
Expected: PASS (both cases).

- [ ] **Step 7: Commit**

```bash
git add src/store/lifeCompassStore.ts src/tests/behavioralActivationMigration.test.ts
git commit -m "feat(practices): migrate persisted store v4 -> v5 for behavioralActivations"
```

---

## Task 3: Export / import wiring

**Files:**
- Modify: `src/utils/exportService.ts`
- Modify: `src/schemas/exportImportSchema.json`
- Modify: `src/pages/YourCompass.tsx`
- Modify: `src/components/guide/GuideDataActions.tsx`
- Test: `src/tests/exportService.test.ts` (add a case)

- [ ] **Step 1: Write the failing export test**

In `src/tests/exportService.test.ts`, add this case immediately after the existing `it('includes problemSolvings in the exported document', ...)` test (inside the same `describe`):

```ts
  it('includes behavioralActivations in the exported document', () => {
    const json = exportData({
      lifeAreas: [],
      history: [],
      goals: [],
      behavioralExperiments: [],
      thoughtRecords: [],
      problemSolvings: [],
      behavioralActivations: [
        {
          id: 'b1',
          activity: 'walk by the river',
          plannedDate: '2026-06-20',
          timeOfDay: 'morning',
          done: true,
          pleasureExpected: 2,
          pleasureActual: 4,
          outcome: 'better than I expected',
          createdAt: '2026-06-18T00:00:00.000Z',
        },
      ],
    });
    const parsed = JSON.parse(json);
    expect(parsed.data.behavioralActivations).toHaveLength(1);
    expect(parsed.data.behavioralActivations[0].activity).toBe(
      'walk by the river',
    );
    expect(parsed.data.behavioralActivations[0].pleasureActual).toBe(4);
  });
```

- [ ] **Step 2: Run it to verify it fails**

Run: `npx vitest run src/tests/exportService.test.ts -t behavioralActivations`
Expected: FAIL -- `behavioralActivations` is not on `ExportInput`, and the schema rejects the unknown property (`data` is `additionalProperties: false`).

- [ ] **Step 3: Thread `behavioralActivations` through `exportService`**

In `src/utils/exportService.ts`:

(a) Import the type. Change the import from `'../types/LifeCompassDocument'` to add `BehavioralActivation,` (alphabetical, first):

```ts
import {
  BehavioralActivation,
  BehavioralExperiment,
  Goal,
  ProblemSolving,
  Snapshot,
  ThoughtRecord,
} from '../types/LifeCompassDocument';
```

(b) Add to `ExportInput`, after `problemSolvings?: ProblemSolving[];`:

```ts
  behavioralActivations?: BehavioralActivation[];
```

(c) Declare the local. After `let problemSolvings: ProblemSolving[];`:

```ts
  let behavioralActivations: BehavioralActivation[];
```

(d) In the `if (input) { ... }` branch, after `problemSolvings = input.problemSolvings ?? [];`:

```ts
    behavioralActivations = input.behavioralActivations ?? [];
```

(e) In the `else { ... }` branch, after `problemSolvings = [];`:

```ts
    behavioralActivations = [];
```

(f) In the `exportJsonObj.data` object, after `problemSolvings,`:

```ts
      behavioralActivations,
```

- [ ] **Step 4: Add the schema definition**

In `src/schemas/exportImportSchema.json`, inside `data.properties`, add this entry immediately after the entire `"problemSolvings": { ... }` block (after its closing `}` and a comma). The property before it must end with a comma:

```json
        "behavioralActivations": {
          "type": "array",
          "items": {
            "type": "object",
            "properties": {
              "id": { "type": "string" },
              "areaId": { "type": "string" },
              "activity": { "type": "string" },
              "plannedDate": { "type": "string" },
              "timeOfDay": {
                "type": "string",
                "enum": ["morning", "afternoon", "evening"]
              },
              "done": { "type": "boolean" },
              "pleasureExpected": { "type": "number" },
              "pleasureActual": { "type": "number" },
              "masteryExpected": { "type": "number" },
              "masteryActual": { "type": "number" },
              "outcome": { "type": "string" },
              "createdAt": { "type": "string" }
            },
            "required": ["id", "activity", "done", "outcome", "createdAt"],
            "additionalProperties": true
          }
        }
```

Note: do NOT add `behavioralActivations` to the `data.required` array -- it stays optional, like `goals`/`thoughtRecords`/`problemSolvings`. `data` keeps `"required": ["userSettings", "lifeAreas", "history"]`.

- [ ] **Step 5: Run the export test to verify it passes**

Run: `npx vitest run src/tests/exportService.test.ts`
Expected: PASS (all cases, including the new one).

- [ ] **Step 6: Thread `behavioralActivations` through both import sites**

In `src/pages/YourCompass.tsx`, in the `importDocument({ ... })` call, after `problemSolvings: (payload.data.problemSolvings ?? []) as ProblemSolving[],`:

```ts
      behavioralActivations: (payload.data.behavioralActivations ??
        []) as BehavioralActivation[],
```

Add `BehavioralActivation` to the type import from `@models/LifeCompassDocument` in that file (it already imports `ProblemSolving`, `ThoughtRecord`, etc. -- add `BehavioralActivation` alongside them).

In `src/components/guide/GuideDataActions.tsx`:

(a) Subscribe, after `const problemSolvings = useLifeCompassStore(state => state.problemSolvings);`:

```ts
  const behavioralActivations = useLifeCompassStore(
    state => state.behavioralActivations,
  );
```

(b) In `handleExport`'s `exportData({ ... })`, after `problemSolvings,`:

```ts
      behavioralActivations,
```

(c) In `applyImport`'s `importDocument({ ... })`, after `problemSolvings: (payload.data.problemSolvings ?? []) as ProblemSolving[],`:

```ts
      behavioralActivations: (payload.data.behavioralActivations ??
        []) as BehavioralActivation[],
```

(d) Add `BehavioralActivation` to the `@models/LifeCompassDocument` type import in that file.

- [ ] **Step 7: Run the full suite to verify nothing regressed**

Run: `npm run test-verbose`
Expected: all tests PASS.

- [ ] **Step 8: Commit**

```bash
git add src/utils/exportService.ts src/schemas/exportImportSchema.json src/pages/YourCompass.tsx src/components/guide/GuideDataActions.tsx src/tests/exportService.test.ts
git commit -m "feat(practices): export/import wiring for behavioralActivations"
```

---

## Task 4: i18n copy (en + sv)

**Files:**
- Modify: `public/locales/en/translation.json`
- Modify: `public/locales/sv/translation.json`

Do NOT run `npm run extract`. Add keys by hand. Keep the JSON valid (2-space indent, comma discipline). The other 8 locales intentionally fall back to English.

- [ ] **Step 1: Add the English keys**

In `public/locales/en/translation.json`, under `practices.tools`, add a `behavioral_activation` object as a sibling of `thought_record` / `problem_solving`. Insert it (mind the trailing comma on the preceding sibling):

```json
        "behavioral_activation": {
          "label": "Behavioral Activation",
          "description": "Plan something that might feel good or meaningful, then notice how it actually went.",
          "new": "Plan an activity",
          "empty_state": "Nothing planned yet. Plan one small activity -- something that might feel good or meaningful.",
          "untitled": "Untitled activity",
          "step_label": "Step {{current}} of {{total}}",
          "back": "Back",
          "next": "Next",
          "done": "Done",
          "edit": "Edit",
          "delete": "Delete",
          "delete_confirm": "Remove \"{{title}}\"? This can't be undone.",
          "expand": "Show details",
          "collapse": "Hide details",
          "status_planned": "Planned",
          "status_done": "Done",
          "step1": {
            "title": "What will you do?",
            "prompt": "Plan something that might feel good or meaningful.",
            "area_label": "Life area (optional)",
            "area_none": "No particular area",
            "activity_label": "The activity",
            "placeholder": "e.g. a short walk, call a friend, tidy one drawer"
          },
          "step2": {
            "title": "When?",
            "prompt": "Pick a rough time, if it helps. Both are optional.",
            "date_label": "Day (optional)",
            "time_label": "Time of day (optional)",
            "time_none": "No particular time",
            "time_morning": "Morning",
            "time_afternoon": "Afternoon",
            "time_evening": "Evening"
          },
          "step3": {
            "title": "How do you expect it to feel?",
            "prompt": "Just a guess -- there's no right answer.",
            "pleasure_label": "How good do you expect it to feel?",
            "meaning_label": "Do you expect it to feel meaningful?"
          },
          "step4": {
            "title": "Afterwards",
            "prompt": "Come back to this once you've done it.",
            "done_label": "I did this",
            "outcome_label": "How did it go?",
            "outcome_placeholder": "A few words on how it actually went",
            "pleasure_label": "How good did it feel?",
            "meaning_label": "Did it feel meaningful?",
            "expected_tag": "Expected",
            "actual_tag": "Actual"
          },
          "pleasure_scale": {
            "1": "Not good",
            "2": "A little good",
            "3": "Okay",
            "4": "Good",
            "5": "Really good"
          },
          "meaning_scale": {
            "1": "Not really",
            "2": "A little",
            "3": "Somewhat",
            "4": "Quite",
            "5": "Very meaningful"
          }
        }
```

- [ ] **Step 2: Add the Swedish keys**

In `public/locales/sv/translation.json`, under `practices.tools`, add the matching `behavioral_activation` object with correct diacritics:

```json
        "behavioral_activation": {
          "label": "Beteendeaktivering",
          "description": "Planera något som kan kännas bra eller meningsfullt, och märk sedan hur det faktiskt blev.",
          "new": "Planera en aktivitet",
          "empty_state": "Inget planerat än. Planera en liten aktivitet -- något som kan kännas bra eller meningsfullt.",
          "untitled": "Namnlös aktivitet",
          "step_label": "Steg {{current}} av {{total}}",
          "back": "Tillbaka",
          "next": "Nästa",
          "done": "Klar",
          "edit": "Redigera",
          "delete": "Ta bort",
          "delete_confirm": "Ta bort \"{{title}}\"? Det går inte att ångra.",
          "expand": "Visa detaljer",
          "collapse": "Dölj detaljer",
          "status_planned": "Planerad",
          "status_done": "Gjord",
          "step1": {
            "title": "Vad ska du göra?",
            "prompt": "Planera något som kan kännas bra eller meningsfullt.",
            "area_label": "Livsområde (valfritt)",
            "area_none": "Inget särskilt område",
            "activity_label": "Aktiviteten",
            "placeholder": "t.ex. en kort promenad, ringa en vän, städa en låda"
          },
          "step2": {
            "title": "När?",
            "prompt": "Välj en ungefärlig tid om det hjälper. Båda är valfria.",
            "date_label": "Dag (valfritt)",
            "time_label": "Tid på dagen (valfritt)",
            "time_none": "Ingen särskild tid",
            "time_morning": "Morgon",
            "time_afternoon": "Eftermiddag",
            "time_evening": "Kväll"
          },
          "step3": {
            "title": "Hur tror du att det känns?",
            "prompt": "Bara en gissning -- det finns inget rätt svar.",
            "pleasure_label": "Hur bra tror du att det känns?",
            "meaning_label": "Tror du att det känns meningsfullt?"
          },
          "step4": {
            "title": "Efteråt",
            "prompt": "Kom tillbaka hit när du har gjort det.",
            "done_label": "Jag gjorde det här",
            "outcome_label": "Hur gick det?",
            "outcome_placeholder": "Några ord om hur det faktiskt blev",
            "pleasure_label": "Hur bra kändes det?",
            "meaning_label": "Kändes det meningsfullt?",
            "expected_tag": "Förväntat",
            "actual_tag": "Faktiskt"
          },
          "pleasure_scale": {
            "1": "Inte bra",
            "2": "Lite bra",
            "3": "Okej",
            "4": "Bra",
            "5": "Riktigt bra"
          },
          "meaning_scale": {
            "1": "Inte direkt",
            "2": "Lite",
            "3": "Något",
            "4": "Ganska",
            "5": "Mycket meningsfullt"
          }
        }
```

- [ ] **Step 3: Verify both JSON files are valid**

Run: `node -e "JSON.parse(require('fs').readFileSync('public/locales/en/translation.json','utf8')); JSON.parse(require('fs').readFileSync('public/locales/sv/translation.json','utf8')); console.log('ok')"`
Expected: prints `ok`.

- [ ] **Step 4: Commit**

```bash
git add public/locales/en/translation.json public/locales/sv/translation.json
git commit -m "feat(practices): en + sv copy for behavioral activation"
```

---

## Task 5: Tool components + registration

**Files:**
- Create: `src/components/practices/tools/behavioral-activation/BehavioralActivationFlow.tsx`
- Create: `src/components/practices/tools/behavioral-activation/BehavioralActivationItem.tsx`
- Create: `src/components/practices/tools/behavioral-activation/BehavioralActivation.tsx`
- Create: `src/components/practices/tools/behavioral-activation/index.ts`
- Modify: `src/practices/index.ts`
- Test: `src/tests/behavioralActivation.test.tsx` (create)

- [ ] **Step 1: Create the guided flow**

Create `src/components/practices/tools/behavioral-activation/BehavioralActivationFlow.tsx`:

```tsx
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { BehavioralActivation } from '@models/LifeCompassDocument';
import { useLifeCompassStore } from '@/store/lifeCompassStore';
import Button from '@components/ui/Button';
import ScaleChooser from '@components/your-compass/ScaleChooser';
import CrisisResources from '../../CrisisResources';

const PREFIX = 'practices.tools.behavioral_activation';
const TOTAL_STEPS = 4;

const StepFrame: React.FC<{
  title: string;
  prompt: string;
  children?: React.ReactNode;
}> = ({ title, prompt, children }) => (
  <div className="flex flex-col gap-4">
    <div>
      <h2 className="font-display text-text text-xl">{title}</h2>
      <p className="text-text-muted mt-1">{prompt}</p>
    </div>
    {children}
  </div>
);

const INPUT_CLASS =
  'border-border bg-surface text-text placeholder:text-text-muted focus-visible:outline-focus min-h-[44px] w-full min-w-0 rounded-md border px-3 focus-visible:outline-2 focus-visible:outline-offset-2';
const TEXTAREA_CLASS =
  'w-full min-w-0 rounded-md border border-border bg-surface px-3 py-2 text-text placeholder:text-text-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus resize-none';
const LABEL_CLASS = 'flex min-w-0 flex-col gap-1 text-sm text-text-muted';

interface BehavioralActivationFlowProps {
  record: BehavioralActivation;
  onClose: () => void;
}

const BehavioralActivationFlow: React.FC<BehavioralActivationFlowProps> = ({
  record,
  onClose,
}) => {
  const { t } = useTranslation();
  const update = useLifeCompassStore(s => s.updateBehavioralActivation);
  const lifeAreas = useLifeCompassStore(s => s.lifeAreas);
  const [step, setStep] = useState(1);

  const pleasureLabels = [1, 2, 3, 4, 5].map(n =>
    t(`${PREFIX}.pleasure_scale.${n}`),
  );
  const meaningLabels = [1, 2, 3, 4, 5].map(n =>
    t(`${PREFIX}.meaning_scale.${n}`),
  );

  return (
    <div className="flex flex-col gap-6">
      <p className="text-text-muted text-sm">
        {t(`${PREFIX}.step_label`, { current: step, total: TOTAL_STEPS })}
      </p>

      {step === 1 && (
        <StepFrame
          title={t(`${PREFIX}.step1.title`)}
          prompt={t(`${PREFIX}.step1.prompt`)}
        >
          <label className={LABEL_CLASS}>
            {t(`${PREFIX}.step1.area_label`)}
            <select
              value={record.areaId ?? ''}
              onChange={e =>
                update(record.id, { areaId: e.target.value || undefined })
              }
              className="border-border bg-surface text-text focus-visible:outline-focus min-h-[44px] w-full max-w-full min-w-0 truncate rounded-md border px-3 focus-visible:outline-2 focus-visible:outline-offset-2"
            >
              <option value="">{t(`${PREFIX}.step1.area_none`)}</option>
              {lifeAreas.map(area => (
                <option key={area.id} value={area.id}>
                  {area.name}
                </option>
              ))}
            </select>
          </label>
          <label className={LABEL_CLASS}>
            {t(`${PREFIX}.step1.activity_label`)}
            <textarea
              rows={3}
              value={record.activity}
              onChange={e => update(record.id, { activity: e.target.value })}
              placeholder={t(`${PREFIX}.step1.placeholder`)}
              className={TEXTAREA_CLASS}
            />
          </label>
        </StepFrame>
      )}

      {step === 2 && (
        <StepFrame
          title={t(`${PREFIX}.step2.title`)}
          prompt={t(`${PREFIX}.step2.prompt`)}
        >
          <label className={LABEL_CLASS}>
            {t(`${PREFIX}.step2.date_label`)}
            <input
              type="date"
              value={record.plannedDate ?? ''}
              onChange={e =>
                update(record.id, { plannedDate: e.target.value || undefined })
              }
              className={INPUT_CLASS}
            />
          </label>
          <label className={LABEL_CLASS}>
            {t(`${PREFIX}.step2.time_label`)}
            <select
              value={record.timeOfDay ?? ''}
              onChange={e =>
                update(record.id, {
                  timeOfDay:
                    (e.target.value as BehavioralActivation['timeOfDay']) ||
                    undefined,
                })
              }
              className="border-border bg-surface text-text focus-visible:outline-focus min-h-[44px] w-full max-w-full min-w-0 truncate rounded-md border px-3 focus-visible:outline-2 focus-visible:outline-offset-2"
            >
              <option value="">{t(`${PREFIX}.step2.time_none`)}</option>
              <option value="morning">{t(`${PREFIX}.step2.time_morning`)}</option>
              <option value="afternoon">
                {t(`${PREFIX}.step2.time_afternoon`)}
              </option>
              <option value="evening">{t(`${PREFIX}.step2.time_evening`)}</option>
            </select>
          </label>
        </StepFrame>
      )}

      {step === 3 && (
        <StepFrame
          title={t(`${PREFIX}.step3.title`)}
          prompt={t(`${PREFIX}.step3.prompt`)}
        >
          <div className="flex flex-col gap-2">
            <p className="text-text-muted text-sm">
              {t(`${PREFIX}.step3.pleasure_label`)}
            </p>
            <ScaleChooser
              labels={pleasureLabels}
              value={record.pleasureExpected ?? null}
              accent="clay"
              onChange={n => update(record.id, { pleasureExpected: n })}
            />
          </div>
          <div className="flex flex-col gap-2">
            <p className="text-text-muted text-sm">
              {t(`${PREFIX}.step3.meaning_label`)}
            </p>
            <ScaleChooser
              labels={meaningLabels}
              value={record.masteryExpected ?? null}
              accent="sage"
              onChange={n => update(record.id, { masteryExpected: n })}
            />
          </div>
        </StepFrame>
      )}

      {step === 4 && (
        <StepFrame
          title={t(`${PREFIX}.step4.title`)}
          prompt={t(`${PREFIX}.step4.prompt`)}
        >
          <label className="text-text flex min-h-[44px] cursor-pointer items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={record.done}
              onChange={e => update(record.id, { done: e.target.checked })}
              className="size-5"
            />
            {t(`${PREFIX}.step4.done_label`)}
          </label>
          <label className={LABEL_CLASS}>
            {t(`${PREFIX}.step4.outcome_label`)}
            <textarea
              rows={3}
              value={record.outcome}
              onChange={e => update(record.id, { outcome: e.target.value })}
              placeholder={t(`${PREFIX}.step4.outcome_placeholder`)}
              className={TEXTAREA_CLASS}
            />
          </label>
          <div className="flex flex-col gap-2">
            <p className="text-text-muted text-sm">
              {t(`${PREFIX}.step4.pleasure_label`)}
            </p>
            <ScaleChooser
              labels={pleasureLabels}
              value={record.pleasureActual ?? null}
              accent="clay"
              onChange={n => update(record.id, { pleasureActual: n })}
            />
            {(record.pleasureExpected != null ||
              record.pleasureActual != null) && (
              <div className="text-text-muted flex flex-wrap gap-x-4 gap-y-1 text-sm">
                {record.pleasureExpected != null && (
                  <span>
                    {t(`${PREFIX}.step4.expected_tag`)}:{' '}
                    {t(`${PREFIX}.pleasure_scale.${record.pleasureExpected}`)}
                  </span>
                )}
                {record.pleasureActual != null && (
                  <span>
                    {t(`${PREFIX}.step4.actual_tag`)}:{' '}
                    {t(`${PREFIX}.pleasure_scale.${record.pleasureActual}`)}
                  </span>
                )}
              </div>
            )}
          </div>
          <div className="flex flex-col gap-2">
            <p className="text-text-muted text-sm">
              {t(`${PREFIX}.step4.meaning_label`)}
            </p>
            <ScaleChooser
              labels={meaningLabels}
              value={record.masteryActual ?? null}
              accent="sage"
              onChange={n => update(record.id, { masteryActual: n })}
            />
            {(record.masteryExpected != null ||
              record.masteryActual != null) && (
              <div className="text-text-muted flex flex-wrap gap-x-4 gap-y-1 text-sm">
                {record.masteryExpected != null && (
                  <span>
                    {t(`${PREFIX}.step4.expected_tag`)}:{' '}
                    {t(`${PREFIX}.meaning_scale.${record.masteryExpected}`)}
                  </span>
                )}
                {record.masteryActual != null && (
                  <span>
                    {t(`${PREFIX}.step4.actual_tag`)}:{' '}
                    {t(`${PREFIX}.meaning_scale.${record.masteryActual}`)}
                  </span>
                )}
              </div>
            )}
          </div>
        </StepFrame>
      )}

      <div className="flex items-center justify-between gap-3">
        <Button
          variant="ghost"
          onClick={() => setStep(s => Math.max(1, s - 1))}
          disabled={step === 1}
        >
          {t(`${PREFIX}.back`)}
        </Button>
        {step < TOTAL_STEPS ? (
          <Button
            variant="primary"
            onClick={() => setStep(s => Math.min(TOTAL_STEPS, s + 1))}
          >
            {t(`${PREFIX}.next`)}
          </Button>
        ) : (
          <Button variant="primary" onClick={onClose}>
            {t(`${PREFIX}.done`)}
          </Button>
        )}
      </div>

      <CrisisResources />
    </div>
  );
};

export default BehavioralActivationFlow;
```

- [ ] **Step 2: Create the saved-record card**

Create `src/components/practices/tools/behavioral-activation/BehavioralActivationItem.tsx`:

```tsx
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  ChevronDownIcon,
  ChevronRightIcon,
  PencilIcon,
  TrashIcon,
} from '@heroicons/react/24/outline';
import type { BehavioralActivation } from '@models/LifeCompassDocument';
import { useLifeCompassStore } from '@/store/lifeCompassStore';

const PREFIX = 'practices.tools.behavioral_activation';

export interface BehavioralActivationItemProps {
  record: BehavioralActivation;
  onEdit: () => void;
  /** Confirms removal; resolves true when the user accepts. */
  onRequestDelete: () => Promise<boolean>;
}

const FIELD_CLASS = 'flex flex-col gap-1';
const LABEL_CLASS =
  'text-xs font-medium text-text-muted uppercase tracking-wide';
const VALUE_CLASS = 'text-sm text-text';

const BehavioralActivationItem: React.FC<BehavioralActivationItemProps> = ({
  record,
  onEdit,
  onRequestDelete,
}) => {
  const { t } = useTranslation();
  const remove = useLifeCompassStore(s => s.removeBehavioralActivation);
  const [expanded, setExpanded] = useState(false);

  const title = record.activity.trim() || t(`${PREFIX}.untitled`);
  const status = record.done
    ? t(`${PREFIX}.status_done`)
    : t(`${PREFIX}.status_planned`);

  const when = [
    record.plannedDate,
    record.timeOfDay ? t(`${PREFIX}.step2.time_${record.timeOfDay}`) : '',
  ]
    .filter(Boolean)
    .join(' · ');

  const handleDelete = async () => {
    const ok = await onRequestDelete();
    if (ok) {
      remove(record.id);
    }
  };

  return (
    <li className="border-border bg-surface shadow-warm-sm rounded-lg border p-4">
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => setExpanded(prev => !prev)}
          aria-expanded={expanded}
          aria-label={
            expanded ? t(`${PREFIX}.collapse`) : t(`${PREFIX}.expand`)
          }
          className="text-text-muted duration-base ease-out-soft hover:text-text focus-visible:outline-focus -m-1 flex-none cursor-pointer rounded-md border-none bg-transparent p-1 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2"
        >
          {expanded ? (
            <ChevronDownIcon className="size-5" />
          ) : (
            <ChevronRightIcon className="size-5" />
          )}
        </button>

        <button
          type="button"
          onClick={() => setExpanded(prev => !prev)}
          className="text-text min-w-0 flex-1 cursor-pointer truncate border-none bg-transparent text-left font-medium"
          title={title}
        >
          {title}
        </button>

        <span className="text-text-muted flex-none text-xs">{status}</span>

        <div className="flex flex-none items-center gap-1">
          <button
            type="button"
            onClick={onEdit}
            title={t(`${PREFIX}.edit`)}
            aria-label={`${t(`${PREFIX}.edit`)}: ${title}`}
            className="text-text-muted duration-base ease-out-soft hover:text-text focus-visible:outline-focus cursor-pointer rounded-md border-none bg-transparent p-1.5 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2"
          >
            <PencilIcon className="size-4" />
          </button>
          <button
            type="button"
            onClick={handleDelete}
            title={t(`${PREFIX}.delete`)}
            aria-label={`${t(`${PREFIX}.delete`)}: ${title}`}
            className="text-text-muted duration-base ease-out-soft hover:text-danger focus-visible:outline-focus cursor-pointer rounded-md border-none bg-transparent p-1.5 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2"
          >
            <TrashIcon className="size-4" />
          </button>
        </div>
      </div>

      {expanded && (
        <div className="border-border mt-4 flex flex-col gap-4 border-t pt-4">
          {when && (
            <div className={FIELD_CLASS}>
              <span className={LABEL_CLASS}>{t(`${PREFIX}.step2.title`)}</span>
              <p className={VALUE_CLASS}>{when}</p>
            </div>
          )}
          {(record.pleasureExpected != null ||
            record.pleasureActual != null) && (
            <div className={FIELD_CLASS}>
              <span className={LABEL_CLASS}>
                {t(`${PREFIX}.step4.pleasure_label`)}
              </span>
              <p className={VALUE_CLASS}>
                {record.pleasureExpected != null && (
                  <span>
                    {t(`${PREFIX}.step4.expected_tag`)}:{' '}
                    {t(`${PREFIX}.pleasure_scale.${record.pleasureExpected}`)}
                  </span>
                )}
                {record.pleasureActual != null && (
                  <span className={record.pleasureExpected != null ? 'ml-3' : ''}>
                    {t(`${PREFIX}.step4.actual_tag`)}:{' '}
                    {t(`${PREFIX}.pleasure_scale.${record.pleasureActual}`)}
                  </span>
                )}
              </p>
            </div>
          )}
          {(record.masteryExpected != null ||
            record.masteryActual != null) && (
            <div className={FIELD_CLASS}>
              <span className={LABEL_CLASS}>
                {t(`${PREFIX}.step4.meaning_label`)}
              </span>
              <p className={VALUE_CLASS}>
                {record.masteryExpected != null && (
                  <span>
                    {t(`${PREFIX}.step4.expected_tag`)}:{' '}
                    {t(`${PREFIX}.meaning_scale.${record.masteryExpected}`)}
                  </span>
                )}
                {record.masteryActual != null && (
                  <span className={record.masteryExpected != null ? 'ml-3' : ''}>
                    {t(`${PREFIX}.step4.actual_tag`)}:{' '}
                    {t(`${PREFIX}.meaning_scale.${record.masteryActual}`)}
                  </span>
                )}
              </p>
            </div>
          )}
          {record.outcome && (
            <div className={FIELD_CLASS}>
              <span className={LABEL_CLASS}>
                {t(`${PREFIX}.step4.outcome_label`)}
              </span>
              <p className={VALUE_CLASS}>{record.outcome}</p>
            </div>
          )}
        </div>
      )}
    </li>
  );
};

export default BehavioralActivationItem;
```

- [ ] **Step 3: Create the list / entry point**

Create `src/components/practices/tools/behavioral-activation/BehavioralActivation.tsx`:

```tsx
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLifeCompassStore } from '@/store/lifeCompassStore';
import { useConfirmDialog } from '@components/ui/hooks/useConfirmDialog';
import Button from '@components/ui/Button';
import BehavioralActivationFlow from './BehavioralActivationFlow';
import BehavioralActivationItem from './BehavioralActivationItem';

const PREFIX = 'practices.tools.behavioral_activation';

const BehavioralActivation: React.FC = () => {
  const { t } = useTranslation();
  const records = useLifeCompassStore(s => s.behavioralActivations);
  const add = useLifeCompassStore(s => s.addBehavioralActivation);
  const { confirm, ConfirmationDialog } = useConfirmDialog();

  const [openId, setOpenId] = useState<string | null>(null);

  const handleNew = () => {
    add();
    const id = useLifeCompassStore.getState().behavioralActivations.at(-1)!.id;
    setOpenId(id);
  };

  const requestDelete = (title: string) =>
    confirm({
      title: t(`${PREFIX}.delete`),
      message: t(`${PREFIX}.delete_confirm`, { title }),
      type: 'warning',
    });

  if (openId !== null) {
    const record = records.find(r => r.id === openId);
    if (record != null) {
      return (
        <BehavioralActivationFlow
          record={record}
          onClose={() => setOpenId(null)}
        />
      );
    }
  }

  return (
    <div>
      <div className="flex flex-col items-start gap-3">
        <Button variant="primary" onClick={handleNew}>
          {t(`${PREFIX}.new`)}
        </Button>
      </div>

      {records.length === 0 ? (
        <p className="border-border bg-surface-sunken text-text-muted mt-6 rounded-lg border border-dashed px-4 py-6 text-center text-sm">
          {t(`${PREFIX}.empty_state`)}
        </p>
      ) : (
        <ul className="mt-5 flex flex-col gap-3">
          {[...records].reverse().map(record => (
            <BehavioralActivationItem
              key={record.id}
              record={record}
              onEdit={() => setOpenId(record.id)}
              onRequestDelete={() =>
                requestDelete(record.activity.trim() || t(`${PREFIX}.untitled`))
              }
            />
          ))}
        </ul>
      )}

      {ConfirmationDialog}
    </div>
  );
};

export default BehavioralActivation;
```

- [ ] **Step 4: Create the `ToolDef` registration**

Create `src/components/practices/tools/behavioral-activation/index.ts`:

```ts
import { lazy } from 'react';
import { CalendarDaysIcon } from '@heroicons/react/24/outline';
import { TOOLS, type ToolDef } from '@/practices/toolRegistry';

const behavioralActivationTool: ToolDef = {
  id: 'behavioral-activation',
  labelKey: 'practices.tools.behavioral_activation.label',
  descriptionKey: 'practices.tools.behavioral_activation.description',
  icon: CalendarDaysIcon,
  attachesToArea: true,
  component: lazy(() => import('./BehavioralActivation')),
};

TOOLS.push(behavioralActivationTool);
```

- [ ] **Step 5: Register the side-effect import**

In `src/practices/index.ts`, add at the end of the side-effect import block:

```ts
import '@components/practices/tools/behavioral-activation';
```

- [ ] **Step 6: Write the component smoke test**

Create `src/tests/behavioralActivation.test.tsx`:

```tsx
import { beforeEach, describe, expect, it } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import i18n from '@tests/test-i18n';
import en from '../../public/locales/en/translation.json';
import { useLifeCompassStore } from '@/store/lifeCompassStore';
import BehavioralActivation from '@components/practices/tools/behavioral-activation/BehavioralActivation';

// Register the en tool keys so the dynamic `practices.tools.behavioral_activation.*`
// lookups resolve in tests.
i18n.addResourceBundle('en', 'translation', en, true, true);

describe('BehavioralActivation tool', () => {
  beforeEach(() => {
    useLifeCompassStore.setState({
      lifeAreas: [],
      history: [],
      goals: [],
      behavioralExperiments: [],
      thoughtRecords: [],
      problemSolvings: [],
      behavioralActivations: [],
    });
  });

  it('renders the empty state', () => {
    render(<BehavioralActivation />);
    expect(
      screen.getByText(en.practices.tools.behavioral_activation.empty_state),
    ).toBeInTheDocument();
  });

  it('creates a new activity and opens the flow', () => {
    render(<BehavioralActivation />);
    fireEvent.click(
      screen.getByRole('button', {
        name: en.practices.tools.behavioral_activation.new,
      }),
    );
    expect(useLifeCompassStore.getState().behavioralActivations).toHaveLength(1);
    // The flow shows step 1's title.
    expect(
      screen.getByText(en.practices.tools.behavioral_activation.step1.title),
    ).toBeInTheDocument();
  });
});
```

If the `import en from '../../public/locales/en/translation.json'` path or the `i18n.addResourceBundle` registration differs from the sibling test, mirror exactly what `src/tests/thoughtRecord.test.tsx` does instead -- open it and copy its import + bundle-registration lines verbatim, swapping only the tool name.

- [ ] **Step 7: Run the component test to verify it passes**

Run: `npx vitest run src/tests/behavioralActivation.test.tsx`
Expected: PASS (both cases).

- [ ] **Step 8: Commit**

```bash
git add src/components/practices/tools/behavioral-activation src/practices/index.ts src/tests/behavioralActivation.test.tsx
git commit -m "feat(practices): behavioral activation tool components + registration"
```

---

## Task 6: Full verification

**Files:** none (verification only)

- [ ] **Step 1: Type-check + production build**

Run: `npm run build`
Expected: builds with no TypeScript errors.

- [ ] **Step 2: Full unit suite**

Run: `npm run test-verbose`
Expected: all tests PASS (new BA store/migration/export/component tests included; no regressions).

- [ ] **Step 3: Lint**

Run: `npm run lint`
Expected: 0 errors, 0 warnings.

- [ ] **Step 4: Format**

Run: `npm run format`
Expected: files formatted; review the diff is limited to the new/edited files. Re-commit if Prettier changed anything.

- [ ] **Step 5: Unused-code check**

Run: `npm run check:knip`
Expected: clean (no new unused files/exports/deps). The new components are reachable via the registry side-effect import, so they should not report as unused.

- [ ] **Step 6: Manual smoke (recommended)**

Run: `npm run dev`, open `/practices`, confirm a "Behavioral Activation" card appears, open it, plan an activity, navigate the 4 steps, mark it done, reopen, and confirm the planned-vs-experienced words show side by side with no delta. Export from the data actions and confirm `behavioralActivations` is present in the JSON.

- [ ] **Step 7: Final commit (if format/verification produced changes)**

```bash
git add -A
git commit -m "chore(practices): formatting + verification for behavioral activation"
```

---

## Self-Review notes (reconciled against the spec)

- **Spec coverage:** data model (Task 1), persistence/migration (Tasks 1-2), export/import incl. schema (Task 3), Planned->Done lifecycle + two-axis predicted/experienced display with no delta (Task 5 flow + item), CrisisResources mount (Task 5 flow), i18n en+sv with diacritics + no `extract` (Task 4), tool registration + icon (Task 5), verification green bar (Task 6). All spec sections map to a task.
- **Mastery wording:** user-facing copy never says "mastery"/"accomplishment" -- only "did it feel meaningful?" / "kändes det meningsfullt?". The field name `mastery*` stays internal (data layer), matching the spec.
- **No clinician-mode UI** built (out of scope per spec); export carries the full field set so clinical review works through JSON.
- **Type consistency:** action names `addBehavioralActivation` / `updateBehavioralActivation` / `removeBehavioralActivation`, state key `behavioralActivations`, type `BehavioralActivation`, prefix `practices.tools.behavioral_activation`, tool id `behavioral-activation` -- used identically across every task.
- **Version bumps:** `PERSIST_VERSION` 4->5 (Task 2), `schemaVersion` literal + `CURRENT_SCHEMA_VERSION` 5->6 (Task 1), migration assertions use `toBeGreaterThanOrEqual` (Task 2).
```
