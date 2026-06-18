# Structured Problem Solving Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a Structured Problem Solving tool to the Practices shelf: define a problem, brainstorm options, weigh each, choose one and plan small steps, then review.

**Architecture:** A new top-level `problemSolvings: ProblemSolving[]` array on the persisted document, mirroring `behavioralExperiments` / `thoughtRecords` exactly. Each record holds an `options: SolutionOption[]` list (each with free-text pros/cons), an optional `chosenOptionId`, a self-contained `steps: ActionStep[]` plan, and a free-text `outcome`. The tool is a code-split `ToolDef` registered in the static registry; a 5-step guided flow writes through Zustand store actions. No new infrastructure, no backend, no scores.

**Tech Stack:** React 19, TypeScript, Zustand + persist, react-i18next, Tailwind 4, Vitest + Testing Library, Ajv (export/import schema).

**Reference spec:** `docs/superpowers/specs/2026-06-18-structured-problem-solving-design.md`
**Pattern source:** the Thought Record tool (PR #70) -- this plan mirrors it field-for-field.

---

## File Structure

**Create:**
- `src/components/practices/tools/problem-solving/index.ts` -- `ToolDef` registration
- `src/components/practices/tools/problem-solving/ProblemSolving.tsx` -- list + "new" entry point
- `src/components/practices/tools/problem-solving/ProblemSolvingFlow.tsx` -- the 5-step guided flow
- `src/components/practices/tools/problem-solving/ProblemSolvingItem.tsx` -- a saved record card
- `src/components/practices/tools/problem-solving/ProblemSolvingStepList.tsx` -- the plan's ActionStep checkbox list (mirror of `ExperimentStepList`)
- `src/tests/problemSolvingStore.test.ts` -- store-action unit tests
- `src/tests/problemSolvingMigration.test.ts` -- persist-migration test
- `src/tests/problemSolving.test.tsx` -- component smoke test

**Modify:**
- `src/types/LifeCompassDocument.ts` -- add `SolutionOption` + `ProblemSolving`, add to doc, bump version
- `src/types/importExport.ts` -- add optional `problemSolvings` field
- `src/store/lifeCompassStore.ts` -- state, actions, cascade, clear, import, partialize, persist version + migrate + rehydrate guard
- `src/schemas/exportImportSchema.json` -- add `problemSolvings` array schema
- `src/utils/exportService.ts` -- thread `problemSolvings`
- `src/components/ExportButton.tsx` -- thread `problemSolvings`
- `src/components/guide/GuideDataActions.tsx` -- thread `problemSolvings` (export + import)
- `src/pages/YourCompass.tsx` -- thread `problemSolvings` on import
- `src/practices/index.ts` -- side-effect import of the new tool
- `src/tests/thoughtRecordStore.test.ts` -- bump one `schemaVersion: 4` literal to `5`
- `public/locales/en/translation.json` -- `practices.tools.problem_solving.*`
- `public/locales/sv/translation.json` -- `practices.tools.problem_solving.*`

---

## Task 1: Data model + store slice

**Files:**
- Test: `src/tests/problemSolvingStore.test.ts` (create)
- Modify: `src/types/LifeCompassDocument.ts`, `src/types/importExport.ts`, `src/store/lifeCompassStore.ts`, `src/tests/thoughtRecordStore.test.ts`

- [ ] **Step 1: Write the failing store test**

Create `src/tests/problemSolvingStore.test.ts`:

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

const reset = () =>
  useLifeCompassStore.setState({
    lifeAreas: [],
    history: [],
    goals: [],
    behavioralExperiments: [],
    thoughtRecords: [],
    problemSolvings: [],
  });

describe('problemSolvings store slice', () => {
  beforeEach(reset);

  it('adds a record with defaults and a generated id', () => {
    useLifeCompassStore.getState().addProblemSolving();
    const recs = useLifeCompassStore.getState().problemSolvings;
    expect(recs).toHaveLength(1);
    expect(recs[0].id).toBeTruthy();
    expect(recs[0].problem).toBe('');
    expect(recs[0].options).toEqual([]);
    expect(recs[0].steps).toEqual([]);
    expect(recs[0].outcome).toBe('');
    expect(recs[0].chosenOptionId).toBeUndefined();
    expect(recs[0].createdAt).toBeTruthy();
  });

  it('adds a record linked to an area', () => {
    useLifeCompassStore.getState().addProblemSolving('area-1');
    expect(useLifeCompassStore.getState().problemSolvings[0].areaId).toBe('area-1');
  });

  it('updates a record but never changes its id', () => {
    useLifeCompassStore.getState().addProblemSolving();
    const { id } = useLifeCompassStore.getState().problemSolvings[0];
    useLifeCompassStore.getState().updateProblemSolving(id, {
      problem: 'too much on my plate',
      outcome: 'it helped',
    });
    const rec = useLifeCompassStore.getState().problemSolvings[0];
    expect(rec.id).toBe(id);
    expect(rec.problem).toBe('too much on my plate');
    expect(rec.outcome).toBe('it helped');
  });

  it('removes a record', () => {
    useLifeCompassStore.getState().addProblemSolving();
    const { id } = useLifeCompassStore.getState().problemSolvings[0];
    useLifeCompassStore.getState().removeProblemSolving(id);
    expect(useLifeCompassStore.getState().problemSolvings).toHaveLength(0);
  });

  it('adds, updates, and removes options', () => {
    const s = useLifeCompassStore.getState();
    s.addProblemSolving();
    const { id } = useLifeCompassStore.getState().problemSolvings[0];
    s.addProblemSolvingOption(id, 'ask for help');
    let rec = useLifeCompassStore.getState().problemSolvings[0];
    expect(rec.options).toHaveLength(1);
    expect(rec.options[0].text).toBe('ask for help');
    expect(rec.options[0].pros).toBe('');
    expect(rec.options[0].cons).toBe('');

    const optionId = rec.options[0].id;
    s.updateProblemSolvingOption(id, optionId, {
      pros: 'less alone',
      cons: 'feels awkward',
    });
    rec = useLifeCompassStore.getState().problemSolvings[0];
    expect(rec.options[0].pros).toBe('less alone');
    expect(rec.options[0].cons).toBe('feels awkward');
    expect(rec.options[0].id).toBe(optionId);

    s.removeProblemSolvingOption(id, optionId);
    rec = useLifeCompassStore.getState().problemSolvings[0];
    expect(rec.options).toHaveLength(0);
  });

  it('clears chosenOptionId when the chosen option is removed', () => {
    const s = useLifeCompassStore.getState();
    s.addProblemSolving();
    const { id } = useLifeCompassStore.getState().problemSolvings[0];
    s.addProblemSolvingOption(id, 'option A');
    const optionId =
      useLifeCompassStore.getState().problemSolvings[0].options[0].id;
    s.updateProblemSolving(id, { chosenOptionId: optionId });
    expect(useLifeCompassStore.getState().problemSolvings[0].chosenOptionId).toBe(
      optionId,
    );
    s.removeProblemSolvingOption(id, optionId);
    expect(
      useLifeCompassStore.getState().problemSolvings[0].chosenOptionId,
    ).toBeUndefined();
  });

  it('adds, toggles, and removes plan steps', () => {
    const s = useLifeCompassStore.getState();
    s.addProblemSolving();
    const { id } = useLifeCompassStore.getState().problemSolvings[0];
    s.addProblemSolvingStep(id, 'send one email');
    let rec = useLifeCompassStore.getState().problemSolvings[0];
    expect(rec.steps).toHaveLength(1);
    expect(rec.steps[0].done).toBe(false);

    const stepId = rec.steps[0].id;
    s.toggleProblemSolvingStep(id, stepId);
    rec = useLifeCompassStore.getState().problemSolvings[0];
    expect(rec.steps[0].done).toBe(true);

    s.removeProblemSolvingStep(id, stepId);
    rec = useLifeCompassStore.getState().problemSolvings[0];
    expect(rec.steps).toHaveLength(0);
  });

  it('cascade-deletes records when their linked area is removed', () => {
    useLifeCompassStore.setState({ lifeAreas: [area('a'), area('b')] });
    useLifeCompassStore.getState().addProblemSolving('a');
    useLifeCompassStore.getState().addProblemSolving('b');
    useLifeCompassStore.getState().removeArea('a');
    const recs = useLifeCompassStore.getState().problemSolvings;
    expect(recs).toHaveLength(1);
    expect(recs[0].areaId).toBe('b');
  });

  it('clears records on removeAllAreas', () => {
    useLifeCompassStore.getState().addProblemSolving();
    useLifeCompassStore.getState().removeAllAreas();
    expect(useLifeCompassStore.getState().problemSolvings).toHaveLength(0);
  });

  it('imports records from a document', () => {
    useLifeCompassStore.getState().importDocument({
      schemaVersion: 5,
      lifeAreas: [],
      history: [],
      goals: [],
      behavioralExperiments: [],
      thoughtRecords: [],
      problemSolvings: [
        {
          id: 'p1',
          problem: 'a knot',
          options: [{ id: 'o1', text: 'try this', pros: '', cons: '' }],
          steps: [],
          outcome: '',
          createdAt: '2026-06-18T00:00:00.000Z',
        },
      ],
    });
    expect(useLifeCompassStore.getState().problemSolvings).toHaveLength(1);
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npx vitest run src/tests/problemSolvingStore.test.ts`
Expected: FAIL -- `addProblemSolving` is not a function / `problemSolvings` undefined / type errors.

- [ ] **Step 3: Add the types**

In `src/types/LifeCompassDocument.ts`, add directly after the `ThoughtRecord` interface (after line 84):

```ts
/**
 * One brainstormed solution inside a ProblemSolving record. `pros`/`cons` are
 * free text ("what's good about this / what's hard about this") -- never rated,
 * counted, or tallied. There is no "best" option; the user simply marks the one
 * they chose to try via ProblemSolving.chosenOptionId.
 */
export interface SolutionOption {
  id: string;
  text: string;
  pros: string; // "what's good about this", free text, starts empty
  cons: string; // "what's hard about this", free text, starts empty
}

/**
 * A structured problem-solving record: a concrete problem, a set of
 * brainstormed options (each optionally weighed), the option chosen to try, a
 * self-contained plan (reusing ActionStep), and a free-text review of how it
 * went. The area link is optional, like BehavioralExperiment / ThoughtRecord.
 * No scores: completing plan steps means "I tried it", never "I succeeded".
 */
export interface ProblemSolving {
  id: string;
  areaId?: string; // optional link to LifeArea.id
  problem: string; // the problem, concretely
  options: SolutionOption[]; // brainstormed options, each optionally weighed
  chosenOptionId?: string; // which option is being tried; cleared if that option is removed
  steps: ActionStep[]; // the plan; reuse ActionStep verbatim
  outcome: string; // review reflection; starts empty
  createdAt: string; // ISO 8601
}
```

Then update the document interface and version constant:

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

- [ ] **Step 4: Add the import/export interface field**

In `src/types/importExport.ts`, add directly after the `thoughtRecords?: {...}[];` block (after the line `}[];` that closes it, near line 62):

```ts
  problemSolvings?: {
    id: string;
    areaId?: string;
    problem: string;
    options: {
      id: string;
      text: string;
      pros: string;
      cons: string;
      [key: string]: unknown;
    }[];
    chosenOptionId?: string;
    steps: { id: string; text: string; done: boolean; [key: string]: unknown }[];
    outcome: string;
    createdAt: string;
    [key: string]: unknown;
  }[];
```

- [ ] **Step 5: Bump the literal in the existing thought-record store test**

In `src/tests/thoughtRecordStore.test.ts`, the `importDocument` call passes `schemaVersion: 4`. Change that single line to `schemaVersion: 5,` and add `problemSolvings: [],` to that same document object so it satisfies the new `LifeCompassDocument` shape:

```ts
    useLifeCompassStore.getState().importDocument({
      schemaVersion: 5,
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
      problemSolvings: [],
    });
```

- [ ] **Step 6: Add the store state, action types, and actions**

In `src/store/lifeCompassStore.ts`:

(a) Extend the type import (line 4-13) to include the new types:

```ts
import {
  ActionStep,
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

(b) Add the state field after `thoughtRecords: ThoughtRecord[];` (line 32):

```ts
  problemSolvings: ProblemSolving[];
```

(c) Add the action signatures after the three `...ThoughtRecord` signatures (after line 73, before the closing `}` of the interface):

```ts
  addProblemSolving: (areaId?: string) => void;
  updateProblemSolving: (
    recordId: string,
    changes: Partial<ProblemSolving>,
  ) => void;
  removeProblemSolving: (recordId: string) => void;
  addProblemSolvingOption: (recordId: string, text: string) => void;
  updateProblemSolvingOption: (
    recordId: string,
    optionId: string,
    changes: Partial<SolutionOption>,
  ) => void;
  removeProblemSolvingOption: (recordId: string, optionId: string) => void;
  addProblemSolvingStep: (recordId: string, text: string) => void;
  toggleProblemSolvingStep: (recordId: string, stepId: string) => void;
  removeProblemSolvingStep: (recordId: string, stepId: string) => void;
```

(d) Add `problemSolvings: [],` to the initial state, right after `thoughtRecords: [],` (line 92).

(e) In `removeArea`, add a cascade filter after the `thoughtRecords` filter (line 113):

```ts
          problemSolvings: state.problemSolvings.filter(
            rec => rec.areaId !== id,
          ),
```

(f) In `removeAllAreas` (line 132-133), add `problemSolvings: []`:

```ts
      removeAllAreas: () =>
        set({
          lifeAreas: [],
          goals: [],
          behavioralExperiments: [],
          thoughtRecords: [],
          problemSolvings: [],
        }),
```

(g) In `importDocument` (line 135-142), add the seeding line after `thoughtRecords`:

```ts
          problemSolvings: doc.problemSolvings ?? [],
```

(h) Add the action implementations directly after `removeThoughtRecord` (after line 384, before the closing `}),` of the store creator):

```ts
      addProblemSolving: areaId =>
        set(state => {
          const record: ProblemSolving = {
            id: crypto.randomUUID(),
            problem: '',
            options: [],
            steps: [],
            outcome: '',
            createdAt: new Date().toISOString(),
            ...(areaId ? { areaId } : {}),
          };
          return { problemSolvings: [...state.problemSolvings, record] };
        }),

      updateProblemSolving: (recordId, changes) =>
        set(state => ({
          problemSolvings: state.problemSolvings.map(rec =>
            rec.id === recordId ? { ...rec, ...changes, id: rec.id } : rec,
          ),
        })),

      removeProblemSolving: recordId =>
        set(state => ({
          problemSolvings: state.problemSolvings.filter(
            rec => rec.id !== recordId,
          ),
        })),

      addProblemSolvingOption: (recordId, text) =>
        set(state => {
          const trimmed = text.trim();
          if (trimmed === '') {
            return {};
          }
          const option: SolutionOption = {
            id: crypto.randomUUID(),
            text: trimmed,
            pros: '',
            cons: '',
          };
          return {
            problemSolvings: state.problemSolvings.map(rec =>
              rec.id === recordId
                ? { ...rec, options: [...rec.options, option] }
                : rec,
            ),
          };
        }),

      updateProblemSolvingOption: (recordId, optionId, changes) =>
        set(state => ({
          problemSolvings: state.problemSolvings.map(rec =>
            rec.id === recordId
              ? {
                  ...rec,
                  options: rec.options.map(opt =>
                    opt.id === optionId
                      ? { ...opt, ...changes, id: opt.id }
                      : opt,
                  ),
                }
              : rec,
          ),
        })),

      removeProblemSolvingOption: (recordId, optionId) =>
        set(state => ({
          problemSolvings: state.problemSolvings.map(rec =>
            rec.id === recordId
              ? {
                  ...rec,
                  options: rec.options.filter(opt => opt.id !== optionId),
                  // Never let chosenOptionId dangle against a deleted option.
                  chosenOptionId:
                    rec.chosenOptionId === optionId
                      ? undefined
                      : rec.chosenOptionId,
                }
              : rec,
          ),
        })),

      addProblemSolvingStep: (recordId, text) =>
        set(state => {
          const trimmed = text.trim();
          if (trimmed === '') {
            return {};
          }
          const step: ActionStep = {
            id: crypto.randomUUID(),
            text: trimmed,
            done: false,
          };
          return {
            problemSolvings: state.problemSolvings.map(rec =>
              rec.id === recordId
                ? { ...rec, steps: [...rec.steps, step] }
                : rec,
            ),
          };
        }),

      toggleProblemSolvingStep: (recordId, stepId) =>
        set(state => ({
          problemSolvings: state.problemSolvings.map(rec =>
            rec.id === recordId
              ? {
                  ...rec,
                  steps: rec.steps.map(step =>
                    step.id === stepId
                      ? { ...step, done: !step.done }
                      : step,
                  ),
                }
              : rec,
          ),
        })),

      removeProblemSolvingStep: (recordId, stepId) =>
        set(state => ({
          problemSolvings: state.problemSolvings.map(rec =>
            rec.id === recordId
              ? {
                  ...rec,
                  steps: rec.steps.filter(step => step.id !== stepId),
                }
              : rec,
          ),
        })),
```

(i) In `partialize` (line 392-398), add `problemSolvings: state.problemSolvings,` after the `thoughtRecords` line.

- [ ] **Step 7: Run the store test to verify it passes**

Run: `npx vitest run src/tests/problemSolvingStore.test.ts`
Expected: PASS (all assertions green).

- [ ] **Step 8: Commit**

```bash
git add src/types/LifeCompassDocument.ts src/types/importExport.ts src/store/lifeCompassStore.ts src/tests/problemSolvingStore.test.ts src/tests/thoughtRecordStore.test.ts
git commit -m "feat(practices): add problemSolvings data model + store slice"
```

---

## Task 2: Persist migration (v3 -> v4)

**Files:**
- Test: `src/tests/problemSolvingMigration.test.ts` (create)
- Modify: `src/store/lifeCompassStore.ts`

- [ ] **Step 1: Write the failing migration test**

Create `src/tests/problemSolvingMigration.test.ts`:

```ts
import { describe, it, expect } from 'vitest';
import {
  useLifeCompassStore,
  PERSIST_VERSION,
} from '../store/lifeCompassStore';

describe('problemSolvings persist migration', () => {
  it('PERSIST_VERSION is at least 4', () => {
    expect(PERSIST_VERSION).toBeGreaterThanOrEqual(4);
  });

  it('migrate seeds problemSolvings:[] for a v3 state', () => {
    const migrate = useLifeCompassStore.persist.getOptions().migrate!;
    const v3 = {
      lifeAreas: [],
      history: [],
      goals: [],
      behavioralExperiments: [],
      thoughtRecords: [],
    };
    const result = migrate(v3, 3) as { problemSolvings: unknown[] };
    expect(result.problemSolvings).toEqual([]);
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npx vitest run src/tests/problemSolvingMigration.test.ts`
Expected: FAIL -- `PERSIST_VERSION` is 3; `result.problemSolvings` is undefined.

- [ ] **Step 3: Bump PERSIST_VERSION**

In `src/store/lifeCompassStore.ts` line 25:

```ts
export const PERSIST_VERSION = 4;
```

- [ ] **Step 4: Widen the migrate `Pick` type and add the v3 -> v4 branch**

In the `migrate` hook (lines 402-464), every `Pick<LifeCompassState, ...>` union currently ends at `'thoughtRecords'`. Add `| 'problemSolvings'` to each of those unions (the `persistedState as Partial<Pick<...>>` cast at the top, the three `return ... as Pick<...>` casts, and the final `return state as Pick<...>`). Then add a new branch directly before the final `return state` (after the `if (version < 3)` block, line 455):

```ts
        // v3 -> v4: problemSolvings did not exist; seed an empty array.
        if (version < 4) {
          return {
            ...state,
            problemSolvings: state.problemSolvings ?? [],
          } as Pick<
            LifeCompassState,
            | 'lifeAreas'
            | 'history'
            | 'goals'
            | 'behavioralExperiments'
            | 'thoughtRecords'
            | 'problemSolvings'
          >;
        }
```

The earlier branches (`version < 1`, `< 2`, `< 3`) fall through to later branches, so a genuinely old state still reaches this branch and gets `problemSolvings` seeded. The `Partial<Pick<...>>` cast must also include `'problemSolvings'` so `state.problemSolvings` type-checks.

- [ ] **Step 5: Add the onRehydrate defensive guard**

In `onRehydrateStorage` (after the `thoughtRecords` guard, line 481-483), add:

```ts
        if (!Array.isArray(state.problemSolvings)) {
          state.problemSolvings = [];
        }
```

- [ ] **Step 6: Run the migration test to verify it passes**

Run: `npx vitest run src/tests/problemSolvingMigration.test.ts`
Expected: PASS.

- [ ] **Step 7: Commit**

```bash
git add src/store/lifeCompassStore.ts src/tests/problemSolvingMigration.test.ts
git commit -m "feat(practices): bump persist version, migrate problemSolvings"
```

---

## Task 3: Export / import wiring

**Files:**
- Modify: `src/utils/exportService.ts`, `src/schemas/exportImportSchema.json`, `src/components/ExportButton.tsx`, `src/components/guide/GuideDataActions.tsx`, `src/pages/YourCompass.tsx`
- Test: `src/tests/exportService.test.ts` (append one case)

- [ ] **Step 1: Write the failing export test**

In `src/tests/exportService.test.ts`, add this case directly after the existing `'includes thoughtRecords in the exported document'` test:

```ts
  it('includes problemSolvings in the exported document', () => {
    const json = exportData({
      lifeAreas: [],
      history: [],
      goals: [],
      behavioralExperiments: [],
      thoughtRecords: [],
      problemSolvings: [
        {
          id: 'p1',
          problem: 'too much on at once',
          options: [
            { id: 'o1', text: 'drop one thing', pros: 'breathing room', cons: 'guilt' },
          ],
          chosenOptionId: 'o1',
          steps: [{ id: 's1', text: 'email the team', done: false }],
          outcome: '',
          createdAt: '2026-06-18T00:00:00.000Z',
        },
      ],
    });
    const parsed = JSON.parse(json);
    expect(parsed.data.problemSolvings).toHaveLength(1);
    expect(parsed.data.problemSolvings[0].options[0].pros).toBe('breathing room');
    expect(parsed.data.problemSolvings[0].chosenOptionId).toBe('o1');
  });
```

- [ ] **Step 2: Run it to verify it fails**

Run: `npx vitest run src/tests/exportService.test.ts -t "problemSolvings"`
Expected: FAIL -- `ExportInput` has no `problemSolvings`; export object / schema validation rejects it.

- [ ] **Step 3: Thread problemSolvings through exportService**

In `src/utils/exportService.ts`:

(a) Extend the type import:

```ts
import {
  BehavioralExperiment,
  Goal,
  ProblemSolving,
  Snapshot,
  ThoughtRecord,
} from '../types/LifeCompassDocument';
```

(b) Add to `ExportInput`:

```ts
  problemSolvings?: ProblemSolving[];
```

(c) Declare the local and assign it in both branches. Add `let problemSolvings: ProblemSolving[];` next to the other declarations. In the `if (input)` branch add `problemSolvings = input.problemSolvings ?? [];`; in the `else` branch add `problemSolvings = [];`.

(d) Add `problemSolvings,` to the `data` object of `exportJsonObj` (after `thoughtRecords,`).

- [ ] **Step 4: Add the schema definition**

In `src/schemas/exportImportSchema.json`, inside `data.properties` (directly after the `thoughtRecords` array definition that ends around line 153), add:

```json
"problemSolvings": {
  "type": "array",
  "items": {
    "type": "object",
    "properties": {
      "id": { "type": "string" },
      "areaId": { "type": "string" },
      "problem": { "type": "string" },
      "chosenOptionId": { "type": "string" },
      "outcome": { "type": "string" },
      "createdAt": { "type": "string" },
      "options": {
        "type": "array",
        "items": {
          "type": "object",
          "properties": {
            "id": { "type": "string" },
            "text": { "type": "string" },
            "pros": { "type": "string" },
            "cons": { "type": "string" }
          },
          "required": ["id", "text", "pros", "cons"],
          "additionalProperties": true
        }
      },
      "steps": {
        "type": "array",
        "items": {
          "type": "object",
          "properties": {
            "id": { "type": "string" },
            "text": { "type": "string" },
            "done": { "type": "boolean" }
          },
          "required": ["id", "text", "done"],
          "additionalProperties": true
        }
      }
    },
    "required": ["id", "problem", "options", "steps", "outcome", "createdAt"],
    "additionalProperties": true
  }
}
```

Note: add a comma after the preceding `thoughtRecords` block's closing `}` so the JSON stays valid. Do not change `metadata.version` (it stays `"1.0.0"` -- it gates locale files, not document schema).

- [ ] **Step 5: Run the export test to verify it passes**

Run: `npx vitest run src/tests/exportService.test.ts -t "problemSolvings"`
Expected: PASS.

- [ ] **Step 6: Thread problemSolvings through the export buttons and import**

(a) `src/components/ExportButton.tsx`: after the `thoughtRecords` selector line add:

```ts
  const problemSolvings = useLifeCompassStore(state => state.problemSolvings);
```

and add `problemSolvings` to the `exportData({ ... })` call args.

(b) `src/components/guide/GuideDataActions.tsx`: add the same selector line; add `problemSolvings` to the `exportData({ ... })` call; and on import, after the `thoughtRecords: (payload.data.thoughtRecords ?? []) as ThoughtRecord[],` line, add:

```ts
      problemSolvings: (payload.data.problemSolvings ?? []) as ProblemSolving[],
```

Add `ProblemSolving` to the type import from `@models/LifeCompassDocument` in that file.

(c) `src/pages/YourCompass.tsx`: add `ProblemSolving` to the type import on line 10, and after the import's `thoughtRecords: ...` line (line 70) add:

```ts
      problemSolvings: (payload.data.problemSolvings ?? []) as ProblemSolving[],
```

- [ ] **Step 7: Run the full suite to verify nothing regressed**

Run: `npx vitest run`
Expected: PASS (all existing + new tests).

- [ ] **Step 8: Commit**

```bash
git add src/utils/exportService.ts src/schemas/exportImportSchema.json src/components/ExportButton.tsx src/components/guide/GuideDataActions.tsx src/pages/YourCompass.tsx src/tests/exportService.test.ts
git commit -m "feat(practices): export/import problemSolvings"
```

---

## Task 4: i18n copy (en + sv)

**Files:**
- Modify: `public/locales/en/translation.json`, `public/locales/sv/translation.json`

Do **NOT** run `npm run extract` -- it deletes dynamic tool keys.

- [ ] **Step 1: Add the English keys**

In `public/locales/en/translation.json`, inside `practices.tools` (a sibling of `thought_record`), add:

```json
"problem_solving": {
  "label": "Problem solving",
  "description": "Work a knot loose: name it, find options, weigh them, plan a small step.",
  "empty_state": "No problems worked through yet. Start one when something feels stuck.",
  "new": "New problem to work through",
  "step_label": "Step {{current}} of {{total}}",
  "back": "Back",
  "next": "Next",
  "done": "Done",
  "delete": "Delete",
  "edit": "Edit",
  "untitled": "Untitled problem",
  "expand": "Expand",
  "collapse": "Collapse",
  "delete_confirm": "Delete \"{{title}}\"? This can't be undone.",
  "step1": {
    "title": "What's the knot?",
    "prompt": "Name the problem as concretely as you can.",
    "problem_label": "The problem",
    "placeholder": "e.g. I keep running out of time in the evenings.",
    "area_label": "Relates to (optional)",
    "area_none": "Not linked to an area"
  },
  "step2": {
    "title": "Brainstorm options",
    "prompt": "Add a few. All ideas welcome, even the unlikely ones.",
    "add_option": "Add option",
    "add_option_placeholder": "An option worth jotting down",
    "delete_option": "Remove option",
    "empty": "No options yet. Add the first idea that comes to mind."
  },
  "step3": {
    "title": "Weigh each option",
    "prompt": "For each one, notice what's good and what's hard. No need to score anything.",
    "pros_label": "What's good about this?",
    "pros_placeholder": "What draws you to it?",
    "cons_label": "What's hard about this?",
    "cons_placeholder": "What gives you pause?",
    "empty": "Add some options first, then come back here to weigh them."
  },
  "step4": {
    "title": "Choose and plan",
    "prompt": "Pick one to try, then break it into small steps.",
    "choose_label": "Which will you try?",
    "choose_none": "Not chosen yet",
    "steps_intro": "Small steps for the option you chose",
    "add_step": "Add step",
    "add_step_placeholder": "One small step",
    "delete_step": "Remove step",
    "choose_first": "Choose an option above to start planning."
  },
  "step5": {
    "title": "How did it go?",
    "prompt": "After you've tried it, notice what actually happened. There's no right answer.",
    "outcome_placeholder": "What happened when you tried it?"
  }
}
```

- [ ] **Step 2: Add the Swedish keys**

In `public/locales/sv/translation.json`, inside `practices.tools`, add (mark for later native review):

```json
"problem_solving": {
  "label": "Problemlosning",
  "description": "Los upp en knut: satt ord pa den, hitta alternativ, vag dem, planera ett litet steg.",
  "empty_state": "Inga problem genomarbetade an. Borja ett nar nagot kanns fast.",
  "new": "Nytt problem att arbeta igenom",
  "step_label": "Steg {{current}} av {{total}}",
  "back": "Tillbaka",
  "next": "Nasta",
  "done": "Klar",
  "delete": "Ta bort",
  "edit": "Redigera",
  "untitled": "Namnlost problem",
  "expand": "Visa mer",
  "collapse": "Visa mindre",
  "delete_confirm": "Ta bort \"{{title}}\"? Det gar inte att angra.",
  "step1": {
    "title": "Vad ar knuten?",
    "prompt": "Satt ord pa problemet sa konkret du kan.",
    "problem_label": "Problemet",
    "placeholder": "t.ex. Jag far aldrig tiden att racka till pa kvallarna.",
    "area_label": "Hor samman med (valfritt)",
    "area_none": "Inte kopplad till ett omrade"
  },
  "step2": {
    "title": "Brainstorma alternativ",
    "prompt": "Lagg till nagra. Alla ideer ar valkomna, aven de osannolika.",
    "add_option": "Lagg till alternativ",
    "add_option_placeholder": "Ett alternativ vart att notera",
    "delete_option": "Ta bort alternativ",
    "empty": "Inga alternativ an. Lagg till den forsta iden som dyker upp."
  },
  "step3": {
    "title": "Vag varje alternativ",
    "prompt": "Lagg for varje ett marke till vad som ar bra och vad som ar svart. Du behover inte poangsatta nagot.",
    "pros_label": "Vad ar bra med det har?",
    "pros_placeholder": "Vad lockar dig till det?",
    "cons_label": "Vad ar svart med det har?",
    "cons_placeholder": "Vad far dig att tveka?",
    "empty": "Lagg till nagra alternativ forst, kom sedan tillbaka hit och vag dem."
  },
  "step4": {
    "title": "Valj och planera",
    "prompt": "Valj ett att prova, och dela sedan upp det i sma steg.",
    "choose_label": "Vilket vill du prova?",
    "choose_none": "Inte valt an",
    "steps_intro": "Sma steg for alternativet du valde",
    "add_step": "Lagg till steg",
    "add_step_placeholder": "Ett litet steg",
    "delete_step": "Ta bort steg",
    "choose_first": "Valj ett alternativ ovan for att borja planera."
  },
  "step5": {
    "title": "Hur gick det?",
    "prompt": "Nar du har provat, lagg marke till vad som faktiskt hande. Det finns inget ratt svar.",
    "outcome_placeholder": "Vad hande nar du provade?"
  }
}
```

- [ ] **Step 3: Verify the JSON is valid**

Run: `node -e "JSON.parse(require('fs').readFileSync('public/locales/en/translation.json','utf8')); JSON.parse(require('fs').readFileSync('public/locales/sv/translation.json','utf8')); console.log('ok')"`
Expected: prints `ok` (no JSON parse error).

- [ ] **Step 4: Commit**

```bash
git add public/locales/en/translation.json public/locales/sv/translation.json
git commit -m "feat(practices): add problem-solving i18n copy (en + sv)"
```

---

## Task 5: Tool components + registration

**Files:**
- Create: `src/components/practices/tools/problem-solving/{index.ts,ProblemSolving.tsx,ProblemSolvingFlow.tsx,ProblemSolvingItem.tsx,ProblemSolvingStepList.tsx}`
- Modify: `src/practices/index.ts`
- Test: `src/tests/problemSolving.test.tsx` (create)

- [ ] **Step 1: Create the plan step list (mirror of ExperimentStepList)**

Create `src/components/practices/tools/problem-solving/ProblemSolvingStepList.tsx`:

```tsx
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { TrashIcon } from '@heroicons/react/24/outline';
import type { ActionStep } from '@models/LifeCompassDocument';
import { useLifeCompassStore } from '@/store/lifeCompassStore';
import Checkbox from '@components/ui/Checkbox';
import Input from '@components/ui/Input';
import Button from '@components/ui/Button';

export interface ProblemSolvingStepListProps {
  recordId: string;
  steps: ActionStep[];
}

const PREFIX = 'practices.tools.problem_solving';

/**
 * The small-steps plan inside one record. Toggling a step is just noticing what
 * was tried -- never framed as progress toward a target.
 */
const ProblemSolvingStepList: React.FC<ProblemSolvingStepListProps> = ({
  recordId,
  steps,
}) => {
  const { t } = useTranslation();
  const toggleStep = useLifeCompassStore(s => s.toggleProblemSolvingStep);
  const removeStep = useLifeCompassStore(s => s.removeProblemSolvingStep);
  const addStep = useLifeCompassStore(s => s.addProblemSolvingStep);

  const [newStep, setNewStep] = useState('');

  const handleAddStep = () => {
    if (newStep.trim() === '') {
      return;
    }
    addStep(recordId, newStep);
    setNewStep('');
  };

  return (
    <div className="mt-3 flex flex-col gap-3">
      <ul className="flex flex-col gap-1">
        {steps.map(step => (
          <li
            key={step.id}
            className="flex items-center justify-between gap-2 rounded-md px-1 py-1 hover:bg-surface-sunken"
          >
            <Checkbox
              checked={step.done}
              onChange={() => toggleStep(recordId, step.id)}
              label={step.text}
              className="min-w-0 flex-1"
            />
            <button
              type="button"
              onClick={() => removeStep(recordId, step.id)}
              title={t(`${PREFIX}.step4.delete_step`)}
              aria-label={`${t(`${PREFIX}.step4.delete_step`)}: ${step.text}`}
              className="flex-none cursor-pointer rounded-md border-none bg-transparent p-1.5 text-text-muted transition-colors duration-base ease-out-soft hover:text-danger focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
            >
              <TrashIcon className="size-4" />
            </button>
          </li>
        ))}
      </ul>

      <form
        className="flex items-center gap-2"
        onSubmit={e => {
          e.preventDefault();
          handleAddStep();
        }}
      >
        <Input
          value={newStep}
          onChange={e => setNewStep(e.target.value)}
          placeholder={t(`${PREFIX}.step4.add_step_placeholder`)}
          aria-label={t(`${PREFIX}.step4.add_step`)}
        />
        <Button
          type="submit"
          variant="secondary"
          className="flex-none"
          disabled={newStep.trim() === ''}
        >
          {t(`${PREFIX}.step4.add_step`)}
        </Button>
      </form>
    </div>
  );
};

export default ProblemSolvingStepList;
```

- [ ] **Step 2: Create the guided flow**

Create `src/components/practices/tools/problem-solving/ProblemSolvingFlow.tsx`:

```tsx
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { TrashIcon } from '@heroicons/react/24/outline';
import type { ProblemSolving } from '@models/LifeCompassDocument';
import { useLifeCompassStore } from '@/store/lifeCompassStore';
import Button from '@components/ui/Button';
import Input from '@components/ui/Input';
import CrisisResources from '../../CrisisResources';
import ProblemSolvingStepList from './ProblemSolvingStepList';

const PREFIX = 'practices.tools.problem_solving';
const TOTAL_STEPS = 5;

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

const TEXTAREA_CLASS =
  'w-full min-w-0 rounded-md border border-border bg-surface px-3 py-2 text-text placeholder:text-text-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus resize-none';
const LABEL_CLASS = 'flex min-w-0 flex-col gap-1 text-sm text-text-muted';

interface ProblemSolvingFlowProps {
  record: ProblemSolving;
  onClose: () => void;
}

const ProblemSolvingFlow: React.FC<ProblemSolvingFlowProps> = ({
  record,
  onClose,
}) => {
  const { t } = useTranslation();
  const update = useLifeCompassStore(s => s.updateProblemSolving);
  const addOption = useLifeCompassStore(s => s.addProblemSolvingOption);
  const updateOption = useLifeCompassStore(s => s.updateProblemSolvingOption);
  const removeOption = useLifeCompassStore(s => s.removeProblemSolvingOption);
  const lifeAreas = useLifeCompassStore(s => s.lifeAreas);
  const [step, setStep] = useState(1);
  const [newOption, setNewOption] = useState('');

  const handleAddOption = () => {
    if (newOption.trim() === '') {
      return;
    }
    addOption(record.id, newOption);
    setNewOption('');
  };

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
              className="min-h-[44px] w-full min-w-0 max-w-full truncate rounded-md border border-border bg-surface px-3 text-text focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
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
            {t(`${PREFIX}.step1.problem_label`)}
            <textarea
              rows={4}
              value={record.problem}
              onChange={e => update(record.id, { problem: e.target.value })}
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
          <ul className="flex flex-col gap-1">
            {record.options.map(opt => (
              <li
                key={opt.id}
                className="flex items-center justify-between gap-2 rounded-md px-1 py-1 hover:bg-surface-sunken"
              >
                <span className="min-w-0 flex-1 truncate text-sm text-text">
                  {opt.text}
                </span>
                <button
                  type="button"
                  onClick={() => removeOption(record.id, opt.id)}
                  title={t(`${PREFIX}.step2.delete_option`)}
                  aria-label={`${t(`${PREFIX}.step2.delete_option`)}: ${opt.text}`}
                  className="flex-none cursor-pointer rounded-md border-none bg-transparent p-1.5 text-text-muted transition-colors duration-base ease-out-soft hover:text-danger focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
                >
                  <TrashIcon className="size-4" />
                </button>
              </li>
            ))}
          </ul>
          {record.options.length === 0 && (
            <p className="text-sm text-text-muted">{t(`${PREFIX}.step2.empty`)}</p>
          )}
          <form
            className="flex items-center gap-2"
            onSubmit={e => {
              e.preventDefault();
              handleAddOption();
            }}
          >
            <Input
              value={newOption}
              onChange={e => setNewOption(e.target.value)}
              placeholder={t(`${PREFIX}.step2.add_option_placeholder`)}
              aria-label={t(`${PREFIX}.step2.add_option`)}
            />
            <Button
              type="submit"
              variant="secondary"
              className="flex-none"
              disabled={newOption.trim() === ''}
            >
              {t(`${PREFIX}.step2.add_option`)}
            </Button>
          </form>
        </StepFrame>
      )}

      {step === 3 && (
        <StepFrame
          title={t(`${PREFIX}.step3.title`)}
          prompt={t(`${PREFIX}.step3.prompt`)}
        >
          {record.options.length === 0 ? (
            <p className="text-sm text-text-muted">{t(`${PREFIX}.step3.empty`)}</p>
          ) : (
            <div className="flex flex-col gap-5">
              {record.options.map(opt => (
                <div
                  key={opt.id}
                  className="flex flex-col gap-2 rounded-lg border border-border p-3"
                >
                  <p className="font-medium text-text">{opt.text}</p>
                  <label className={LABEL_CLASS}>
                    {t(`${PREFIX}.step3.pros_label`)}
                    <textarea
                      rows={2}
                      value={opt.pros}
                      onChange={e =>
                        updateOption(record.id, opt.id, { pros: e.target.value })
                      }
                      placeholder={t(`${PREFIX}.step3.pros_placeholder`)}
                      className={TEXTAREA_CLASS}
                    />
                  </label>
                  <label className={LABEL_CLASS}>
                    {t(`${PREFIX}.step3.cons_label`)}
                    <textarea
                      rows={2}
                      value={opt.cons}
                      onChange={e =>
                        updateOption(record.id, opt.id, { cons: e.target.value })
                      }
                      placeholder={t(`${PREFIX}.step3.cons_placeholder`)}
                      className={TEXTAREA_CLASS}
                    />
                  </label>
                </div>
              ))}
            </div>
          )}
        </StepFrame>
      )}

      {step === 4 && (
        <StepFrame
          title={t(`${PREFIX}.step4.title`)}
          prompt={t(`${PREFIX}.step4.prompt`)}
        >
          <label className={LABEL_CLASS}>
            {t(`${PREFIX}.step4.choose_label`)}
            <select
              value={record.chosenOptionId ?? ''}
              onChange={e =>
                update(record.id, {
                  chosenOptionId: e.target.value || undefined,
                })
              }
              className="min-h-[44px] w-full min-w-0 max-w-full truncate rounded-md border border-border bg-surface px-3 text-text focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
            >
              <option value="">{t(`${PREFIX}.step4.choose_none`)}</option>
              {record.options.map(opt => (
                <option key={opt.id} value={opt.id}>
                  {opt.text}
                </option>
              ))}
            </select>
          </label>
          {record.chosenOptionId ? (
            <div className="flex flex-col gap-2">
              <p className="text-sm text-text-muted">
                {t(`${PREFIX}.step4.steps_intro`)}
              </p>
              <ProblemSolvingStepList
                recordId={record.id}
                steps={record.steps}
              />
            </div>
          ) : (
            <p className="text-sm text-text-muted">
              {t(`${PREFIX}.step4.choose_first`)}
            </p>
          )}
        </StepFrame>
      )}

      {step === 5 && (
        <StepFrame
          title={t(`${PREFIX}.step5.title`)}
          prompt={t(`${PREFIX}.step5.prompt`)}
        >
          <label className={LABEL_CLASS}>
            <textarea
              rows={4}
              value={record.outcome}
              onChange={e => update(record.id, { outcome: e.target.value })}
              placeholder={t(`${PREFIX}.step5.outcome_placeholder`)}
              className={TEXTAREA_CLASS}
            />
          </label>
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

export default ProblemSolvingFlow;
```

- [ ] **Step 3: Create the saved-record card**

Create `src/components/practices/tools/problem-solving/ProblemSolvingItem.tsx`:

```tsx
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  ChevronDownIcon,
  ChevronRightIcon,
  PencilIcon,
  TrashIcon,
} from '@heroicons/react/24/outline';
import type { ProblemSolving } from '@models/LifeCompassDocument';
import { useLifeCompassStore } from '@/store/lifeCompassStore';

const PREFIX = 'practices.tools.problem_solving';

export interface ProblemSolvingItemProps {
  record: ProblemSolving;
  onEdit: () => void;
  /** Confirms removal; resolves true when the user accepts. */
  onRequestDelete: () => Promise<boolean>;
}

const FIELD_CLASS = 'flex flex-col gap-1';
const LABEL_CLASS = 'text-xs font-medium text-text-muted uppercase tracking-wide';
const VALUE_CLASS = 'text-sm text-text';

const ProblemSolvingItem: React.FC<ProblemSolvingItemProps> = ({
  record,
  onEdit,
  onRequestDelete,
}) => {
  const { t } = useTranslation();
  const removeRecord = useLifeCompassStore(s => s.removeProblemSolving);
  const [expanded, setExpanded] = useState(false);

  const title = record.problem.trim() || t(`${PREFIX}.untitled`);
  const chosen = record.options.find(o => o.id === record.chosenOptionId);

  const handleDelete = async () => {
    const ok = await onRequestDelete();
    if (ok) {
      removeRecord(record.id);
    }
  };

  return (
    <li className="rounded-lg border border-border bg-surface p-4 shadow-warm-sm">
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => setExpanded(prev => !prev)}
          aria-expanded={expanded}
          aria-label={expanded ? t(`${PREFIX}.collapse`) : t(`${PREFIX}.expand`)}
          className="-m-1 flex-none cursor-pointer rounded-md border-none bg-transparent p-1 text-text-muted transition-colors duration-base ease-out-soft hover:text-text focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
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
          className="min-w-0 flex-1 cursor-pointer truncate border-none bg-transparent text-left font-medium text-text"
          title={title}
        >
          {title}
        </button>

        <div className="flex flex-none items-center gap-1">
          <button
            type="button"
            onClick={onEdit}
            title={t(`${PREFIX}.edit`)}
            aria-label={`${t(`${PREFIX}.edit`)}: ${title}`}
            className="cursor-pointer rounded-md border-none bg-transparent p-1.5 text-text-muted transition-colors duration-base ease-out-soft hover:text-text focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
          >
            <PencilIcon className="size-4" />
          </button>
          <button
            type="button"
            onClick={handleDelete}
            title={t(`${PREFIX}.delete`)}
            aria-label={`${t(`${PREFIX}.delete`)}: ${title}`}
            className="cursor-pointer rounded-md border-none bg-transparent p-1.5 text-text-muted transition-colors duration-base ease-out-soft hover:text-danger focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
          >
            <TrashIcon className="size-4" />
          </button>
        </div>
      </div>

      {expanded && (
        <div className="mt-4 flex flex-col gap-4 border-t border-border pt-4">
          {record.options.length > 0 && (
            <div className={FIELD_CLASS}>
              <span className={LABEL_CLASS}>{t(`${PREFIX}.step2.title`)}</span>
              <ul className="list-disc pl-5">
                {record.options.map(opt => (
                  <li key={opt.id} className={VALUE_CLASS}>
                    {opt.text}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {chosen && (
            <div className={FIELD_CLASS}>
              <span className={LABEL_CLASS}>{t(`${PREFIX}.step4.choose_label`)}</span>
              <p className={VALUE_CLASS}>{chosen.text}</p>
            </div>
          )}
          {record.steps.length > 0 && (
            <div className={FIELD_CLASS}>
              <span className={LABEL_CLASS}>{t(`${PREFIX}.step4.steps_intro`)}</span>
              <ul className="flex flex-col gap-1">
                {record.steps.map(step => (
                  <li key={step.id} className={VALUE_CLASS}>
                    {step.done ? '✓ ' : '· '}
                    {step.text}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {record.outcome && (
            <div className={FIELD_CLASS}>
              <span className={LABEL_CLASS}>{t(`${PREFIX}.step5.title`)}</span>
              <p className={VALUE_CLASS}>{record.outcome}</p>
            </div>
          )}
        </div>
      )}
    </li>
  );
};

export default ProblemSolvingItem;
```

- [ ] **Step 4: Create the list / entry point**

Create `src/components/practices/tools/problem-solving/ProblemSolving.tsx`:

```tsx
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLifeCompassStore } from '@/store/lifeCompassStore';
import { useConfirmDialog } from '@components/ui/hooks/useConfirmDialog';
import Button from '@components/ui/Button';
import ProblemSolvingFlow from './ProblemSolvingFlow';
import ProblemSolvingItem from './ProblemSolvingItem';

const PREFIX = 'practices.tools.problem_solving';

const ProblemSolving: React.FC = () => {
  const { t } = useTranslation();
  const records = useLifeCompassStore(s => s.problemSolvings);
  const addRecord = useLifeCompassStore(s => s.addProblemSolving);
  const { confirm, ConfirmationDialog } = useConfirmDialog();

  const [openId, setOpenId] = useState<string | null>(null);

  const handleNew = () => {
    addRecord();
    const id = useLifeCompassStore.getState().problemSolvings.at(-1)!.id;
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
        <ProblemSolvingFlow record={record} onClose={() => setOpenId(null)} />
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
        <p className="mt-6 rounded-lg border border-dashed border-border bg-surface-sunken px-4 py-6 text-center text-sm text-text-muted">
          {t(`${PREFIX}.empty_state`)}
        </p>
      ) : (
        <ul className="mt-5 flex flex-col gap-3">
          {[...records].reverse().map(record => (
            <ProblemSolvingItem
              key={record.id}
              record={record}
              onEdit={() => setOpenId(record.id)}
              onRequestDelete={() =>
                requestDelete(record.problem.trim() || t(`${PREFIX}.untitled`))
              }
            />
          ))}
        </ul>
      )}

      {ConfirmationDialog}
    </div>
  );
};

export default ProblemSolving;
```

- [ ] **Step 5: Create the ToolDef registration**

Create `src/components/practices/tools/problem-solving/index.ts`:

```ts
import { lazy } from 'react';
import { PuzzlePieceIcon } from '@heroicons/react/24/outline';
import { TOOLS, type ToolDef } from '@/practices/toolRegistry';

const problemSolvingTool: ToolDef = {
  id: 'problem-solving',
  labelKey: 'practices.tools.problem_solving.label',
  descriptionKey: 'practices.tools.problem_solving.description',
  icon: PuzzlePieceIcon,
  attachesToArea: true,
  component: lazy(() => import('./ProblemSolving')),
};

TOOLS.push(problemSolvingTool);
```

- [ ] **Step 6: Register the side-effect import**

In `src/practices/index.ts`, add after the thought-record import:

```ts
import '@components/practices/tools/problem-solving';
```

- [ ] **Step 7: Write the component smoke test**

Create `src/tests/problemSolving.test.tsx`:

```tsx
import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import i18n from '@tests/test-i18n';
import { useLifeCompassStore } from '@/store/lifeCompassStore';
import ProblemSolving from '@components/practices/tools/problem-solving/ProblemSolving';

// Inject problem_solving keys into the sv bundle used by test-i18n.
// Keep in sync with public/locales/en/translation.json.
i18n.addResourceBundle(
  'sv',
  'translation',
  {
    practices: {
      crisis: {
        trigger: 'If things feel overwhelming right now',
        intro: "You don't have to sit with this alone.",
        resources: ['Emergency: call 112'],
      },
      tools: {
        problem_solving: {
          label: 'Problem solving',
          description:
            'Work a knot loose: name it, find options, weigh them, plan a small step.',
          empty_state:
            'No problems worked through yet. Start one when something feels stuck.',
          new: 'New problem to work through',
          step_label: 'Step {{current}} of {{total}}',
          back: 'Back',
          next: 'Next',
          done: 'Done',
          delete: 'Delete',
          edit: 'Edit',
          untitled: 'Untitled problem',
          expand: 'Expand',
          collapse: 'Collapse',
          delete_confirm: 'Delete "{{title}}"? This can\'t be undone.',
          step1: {
            title: "What's the knot?",
            prompt: 'Name the problem as concretely as you can.',
            problem_label: 'The problem',
            placeholder: 'e.g. I keep running out of time in the evenings.',
            area_label: 'Relates to (optional)',
            area_none: 'Not linked to an area',
          },
          step2: {
            title: 'Brainstorm options',
            prompt: 'Add a few. All ideas welcome, even the unlikely ones.',
            add_option: 'Add option',
            add_option_placeholder: 'An option worth jotting down',
            delete_option: 'Remove option',
            empty: 'No options yet. Add the first idea that comes to mind.',
          },
          step3: {
            title: 'Weigh each option',
            prompt:
              "For each one, notice what's good and what's hard. No need to score anything.",
            pros_label: "What's good about this?",
            pros_placeholder: 'What draws you to it?',
            cons_label: "What's hard about this?",
            cons_placeholder: 'What gives you pause?',
            empty: 'Add some options first, then come back here to weigh them.',
          },
          step4: {
            title: 'Choose and plan',
            prompt: 'Pick one to try, then break it into small steps.',
            choose_label: 'Which will you try?',
            choose_none: 'Not chosen yet',
            steps_intro: 'Small steps for the option you chose',
            add_step: 'Add step',
            add_step_placeholder: 'One small step',
            delete_step: 'Remove step',
            choose_first: 'Choose an option above to start planning.',
          },
          step5: {
            title: 'How did it go?',
            prompt:
              "After you've tried it, notice what actually happened. There's no right answer.",
            outcome_placeholder: 'What happened when you tried it?',
          },
        },
      },
    },
  },
  true,
  true,
);

beforeEach(() => {
  useLifeCompassStore.setState({
    lifeAreas: [],
    history: [],
    goals: [],
    behavioralExperiments: [],
    thoughtRecords: [],
    problemSolvings: [],
  });
});

const renderTool = () =>
  render(
    <MemoryRouter>
      <ProblemSolving />
    </MemoryRouter>,
  );

describe('ProblemSolving tool', () => {
  it('shows the empty state when there are no records', () => {
    renderTool();
    expect(screen.getByText(/no problems worked through yet/i)).toBeTruthy();
  });

  it('creates a new record and opens the flow', () => {
    renderTool();
    fireEvent.click(
      screen.getByRole('button', { name: /new problem to work through/i }),
    );
    expect(screen.getByText("What's the knot?")).toBeTruthy();
    expect(useLifeCompassStore.getState().problemSolvings).toHaveLength(1);
  });

  it('saves the problem text and shows the card after the flow', async () => {
    renderTool();
    fireEvent.click(
      screen.getByRole('button', { name: /new problem to work through/i }),
    );

    const textarea = screen.getByPlaceholderText(
      /i keep running out of time/i,
    ) as HTMLTextAreaElement;
    fireEvent.change(textarea, {
      target: { value: 'Evenings disappear before I get to anything' },
    });

    const clickNext = () =>
      fireEvent.click(screen.getByRole('button', { name: /^next$/i }));
    clickNext(); // -> 2
    clickNext(); // -> 3
    clickNext(); // -> 4
    clickNext(); // -> 5
    fireEvent.click(screen.getByRole('button', { name: /^done$/i }));

    await waitFor(() => {
      expect(
        screen.getByText('Evenings disappear before I get to anything'),
      ).toBeTruthy();
    });

    const recs = useLifeCompassStore.getState().problemSolvings;
    expect(recs).toHaveLength(1);
    expect(recs[0].problem).toBe(
      'Evenings disappear before I get to anything',
    );
  });

  it('never renders a numeric score or progress bar', () => {
    useLifeCompassStore.getState().addProblemSolving();
    const { id } = useLifeCompassStore.getState().problemSolvings[0];
    useLifeCompassStore.getState().addProblemSolvingOption(id, 'option A');
    useLifeCompassStore.getState().addProblemSolvingOption(id, 'option B');
    useLifeCompassStore.getState().updateProblemSolving(id, {
      problem: 'a knot',
    });

    renderTool();
    // Expand the card
    fireEvent.click(screen.getByRole('button', { name: /expand/i }));

    expect(document.body.textContent).not.toMatch(/\d+\s*%/);
    expect(screen.queryByRole('progressbar')).toBeNull();
  });
});
```

- [ ] **Step 8: Run the component test to verify it passes**

Run: `npx vitest run src/tests/problemSolving.test.tsx`
Expected: PASS.

- [ ] **Step 9: Commit**

```bash
git add src/components/practices/tools/problem-solving src/practices/index.ts src/tests/problemSolving.test.tsx
git commit -m "feat(practices): add Structured Problem Solving tool UI"
```

---

## Task 6: Full verification

**Files:** none (verification only)

- [ ] **Step 1: Type-check + production build**

Run: `npm run build`
Expected: succeeds with no TypeScript errors.

- [ ] **Step 2: Full unit suite**

Run: `npm run test-verbose`
Expected: all tests pass, including the four new files.

- [ ] **Step 3: Lint**

Run: `npm run lint`
Expected: no errors.

- [ ] **Step 4: Format**

Run: `npm run format`
Expected: files formatted; re-stage and amend the last commit if anything changed:

```bash
git add -A && git commit -m "style: prettier" || true
```

- [ ] **Step 5: Unused-code check**

Run: `npm run check:knip`
Expected: no NEW unused files/exports for the problem-solving tool. (The tool is reached via the registry side-effect import, like the other tools, so it should not be flagged.)

- [ ] **Step 6: Manual smoke (optional but recommended)**

Run: `npm run dev`, open `/practices`, confirm the "Problem solving" card appears, open it, create a record stepping through all five steps (add two options, weigh them, choose one, add a plan step, write an outcome), click Done, reopen the card, confirm everything persisted. Reload the page to confirm localStorage round-trips. Export JSON from the guide actions and confirm `problemSolvings` is present and re-imports cleanly.

---

## Self-Review notes (already reconciled)

- **Spec coverage:** every spec section maps to a task -- data model (T1), persistence/migrate (T1+T2), export/import + schema (T3), tool registration + flow + card + crisis line (T5), i18n en+sv (T4), tests (T1/T2/T3/T5), full verification (T6).
- **Type consistency:** action names are identical across the store interface, implementations, tests, and components (`addProblemSolving`, `updateProblemSolving`, `removeProblemSolving`, `addProblemSolvingOption`, `updateProblemSolvingOption`, `removeProblemSolvingOption`, `addProblemSolvingStep`, `toggleProblemSolvingStep`, `removeProblemSolvingStep`). The `ProblemSolving` / `SolutionOption` field names match the spec, the schema, and the importExport interface.
- **Ethos guards:** no scores/percentages/ranks anywhere; the component test asserts no `%` and no `progressbar`; pros/cons are free text; the chosen option is a plain selection, never a winner computed from counts.
- **Dangling reference safety:** `removeProblemSolvingOption` clears `chosenOptionId` when it points at the removed option (covered by a store test).
```
