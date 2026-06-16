# Incremental Implementation Plan: Practices/Tools Shelf + Behavioral Experiment (Phase 1)

This plan delivers two sequenced milestones. **Milestone A** builds a modular tool registry and a calm "Practices" shelf that the user visits deliberately; the balance-wheel compass at `/` stays the home view and is never touched. **Milestone B** registers the first tool, **Behavioral Experiment**, which copies the Goals/ActionStep slice almost verbatim and adds one free-text outcome field, with gentle ACT-tone copy.

Each task is TDD-shaped: write a failing test, run it and watch it fail, write the minimal implementation, run it green, then commit. Every commit is self-contained.

## Goal

- A registry-driven Practices shelf (`/practices`) where self-contained tools live. Tools register into a static `TOOLS` array, exactly like `VIEWS` in `src/components/your-compass/views.ts`. No tool requires or unlocks another.
- Behavioral Experiment as the first registered tool: a worry to test (-> `title`), steps to test it (-> `ActionStep[]`), an optional life-area link (`areaId?`), and one free-text `outcome`. No streaks, no numeric scores shown, local-only persistence, gentle non-clinical tone, full i18n.

## Architecture

- **State**: one new top-level persisted array `behavioralExperiments: BehavioralExperiment[]` on the existing Zustand store (`src/store/lifeCompassStore.ts`), mirroring the `goals` slice 1:1 plus a `setExperimentOutcome` convenience action. `PERSIST_VERSION` bumps `1 -> 2` with a `version < 2` migrate branch seeding `[]`, plus a defensive `onRehydrateStorage` guard.
- **Document/IO**: `LifeCompassDocument` gains `behavioralExperiments`; `CURRENT_SCHEMA_VERSION` and the `schemaVersion` literal bump `2 -> 3`; `exportImportSchema.json`, `exportService.ts`, `importExport.ts`, and both `importDocument` call sites gain the array with `?? []` back-compat.
- **Registry**: `src/practices/toolRegistry.ts` exports `ToolDef` + a static `TOOLS` array. The shelf renders cards from `TOOLS`; the registry and the renderer are decoupled, matching the `VIEWS` / `PerspectiveSwitcher` / `YourCompass.renderBody` split.
- **Routing**: new sibling routes `/practices` and `/practices/:toolId` in `src/App.tsx`. The compass stays mapped to `/`. Navigation gains a `Practices` link in both desktop and mobile blocks. These routes are NOT immersive, so they get the standard `Navigation` + `Footer`.
- **Components**: the tool reuses existing primitives without modification -- `Input`, `Button`, `Checkbox`, `useConfirmDialog`, and `@heroicons/react/24/outline` icons. `ScaleChooser` and `ProgressBar` are deliberately NOT used (no ratings, no completion bar) to keep experiments from feeling like tasks. A quiet step-count pill is the only count surfaced, and it is hidden until at least one step exists. `OutcomeField` reuses the auto-grow textarea pattern from `AreaDetail.tsx`.

## Tech Stack

React 18 + TypeScript, Zustand (`persist` middleware), Tailwind 4 (`@theme` tokens in `src/index.css`), React Router (`basename={import.meta.env.BASE_URL}`), i18next + react-i18next (HTTP backend, files under `public/locales/{lng}/translation.json`, version-gated on `"1.0.0"`), Ajv for import validation, Vitest for unit/component tests.

Commands used throughout:
- `npx vitest run <path>` -- run one test file once.
- `npx vitest run -t "name"` -- filter by test name.
- `npm run extract` -- i18next-parser pulls keys from source.
- `npm run lint` -- eslint over src.
- `npm run build` -- type-checks via tsconfig + Vite.
- `npm run test-verbose` -- one-shot full unit run.

Node 22 is required (`.nvmrc`).

## File Structure

New files:
```
src/practices/toolRegistry.ts
src/practices/index.ts
src/components/practices/ToolCard.tsx
src/components/practices/ToolShell.tsx
src/pages/PracticesPage.tsx
src/components/practices/tools/behavioral-experiment/index.ts
src/components/practices/tools/behavioral-experiment/BehavioralExperiment.tsx
src/components/practices/tools/behavioral-experiment/ExperimentItem.tsx
src/components/practices/tools/behavioral-experiment/ExperimentStepList.tsx
src/components/practices/tools/behavioral-experiment/OutcomeField.tsx
src/tests/toolRegistry.test.ts
src/tests/behavioralExperimentStore.test.ts
src/tests/behavioralExperimentMigration.test.ts
src/tests/behavioralExperiment.test.tsx
```

Modified files:
```
src/types/LifeCompassDocument.ts
src/store/lifeCompassStore.ts
src/types/importExport.ts
src/schemas/exportImportSchema.json
src/utils/exportService.ts
src/pages/YourCompass.tsx
src/components/guide/GuideDataActions.tsx
src/App.tsx
src/components/ui/Navigation.tsx
src/tests/lifeCompassMigration.test.ts
public/locales/{en,sv,de,da,nl,nb,fi,is,fr,tlh}/translation.json
```

> Note on languages: the prompt mentions 6 languages, but `src/i18n.ts` `supportedLngs` and `public/locales/` both list 10 (en, sv, de, da, nl, nb, fi, is, fr, tlh). This plan adds keys to English (source of truth) and to all 10 locale files so no key is missing. Hand-translate the languages you have; the rest may carry English copy temporarily since missing keys fall back to English anyway. See Open Questions.

---

# MILESTONE A -- Tool registry + Practices shelf

The compass home view is untouched. This milestone ships the empty-but-working shelf so a tool can register into it in Milestone B.

## A1. Tool registry module (failing test first)

- [ ] Create the failing test `src/tests/toolRegistry.test.ts`:

```ts
import { describe, it, expect } from 'vitest';
import { TOOLS, type ToolDef } from '../practices/toolRegistry';

describe('tool registry', () => {
  it('exposes a TOOLS array', () => {
    expect(Array.isArray(TOOLS)).toBe(true);
  });

  it('every tool has a unique id and the required ToolDef fields', () => {
    const ids = new Set<string>();
    TOOLS.forEach((tool: ToolDef) => {
      expect(tool.id).toBeTruthy();
      expect(ids.has(tool.id)).toBe(false);
      ids.add(tool.id);
      expect(tool.labelKey).toMatch(/^practices\.tools\./);
      expect(tool.descriptionKey).toMatch(/^practices\.tools\./);
      expect(tool.component).toBeDefined();
    });
  });
});
```

- [ ] Run it and watch it fail (module does not exist yet):

```bash
npx vitest run src/tests/toolRegistry.test.ts
```

- [ ] Create `src/practices/toolRegistry.ts`:

```ts
import type { ComponentType, LazyExoticComponent } from 'react';

export type ToolId = string;

export interface ToolDef {
  /** Stable id, also the URL segment, e.g. 'behavioral-experiment'. */
  id: ToolId;
  /** i18n key for the display name shown on the shelf card and in ToolShell. */
  labelKey: string;
  /** i18n key for the one-sentence description shown on the shelf card. */
  descriptionKey: string;
  /** Heroicons-style icon for the shelf card. */
  icon?: ComponentType<{ className?: string }>;
  /** True when the tool may optionally link to a LifeArea (like Goal.areaId). */
  attachesToArea?: boolean;
  /** The full tool UI. Lazy so each tool is code-split. */
  component: LazyExoticComponent<ComponentType> | ComponentType;
}

/**
 * Static registry: each tool appends its ToolDef here. This is the single
 * source of truth for what the Practices shelf renders, mirroring VIEWS in
 * src/components/your-compass/views.ts. No tool depends on another.
 */
export const TOOLS: ToolDef[] = [];
```

- [ ] Create `src/practices/index.ts` (the side-effect tool import is added in B9; for now only re-exports):

```ts
export { TOOLS } from './toolRegistry';
export type { ToolDef, ToolId } from './toolRegistry';
```

- [ ] Run green (the unique-id case passes vacuously on the empty array -- fine; it gains teeth in B9):

```bash
npx vitest run src/tests/toolRegistry.test.ts
```

- [ ] `npm run lint`, then commit: `feat(practices): add tool registry (ToolDef + TOOLS)`.

## A2. Shelf primitives + first i18n keys

- [ ] In `public/locales/en/translation.json`, add `practices` to the existing `nav` block (currently `compass`, `help`, `about`):

```json
"nav": {
  "compass": "Compass",
  "help": "Help",
  "about": "About",
  "practices": "Practices"
}
```

- [ ] In the same file, add a top-level `practices` block (place it near `goals`):

```json
"practices": {
  "heading": "Practices",
  "intro": "A small, calm library. Open something when you feel ready -- there is nothing to finish here.",
  "back": "Back to practices",
  "empty": "No practices yet."
}
```

- [ ] Create `src/components/practices/ToolCard.tsx`:

```tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import type { ToolDef } from '@/practices/toolRegistry';

export interface ToolCardProps {
  tool: ToolDef;
}

/**
 * A single shelf card. Quiet, inviting, no numbers. Links to the tool's own
 * route so it can be bookmarked.
 */
const ToolCard: React.FC<ToolCardProps> = ({ tool }) => {
  const { t } = useTranslation();
  const Icon = tool.icon;

  return (
    <Link
      to={`/practices/${tool.id}`}
      className="flex items-start gap-3 rounded-xl border border-border bg-surface p-4 shadow-warm-sm transition-[background-color,box-shadow] duration-base ease-out-soft hover:bg-surface-sunken focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
    >
      {Icon && (
        <span className="mt-0.5 flex-none text-text-muted">
          <Icon className="size-6" />
        </span>
      )}
      <span className="min-w-0">
        <span className="block font-medium text-text">{t(tool.labelKey)}</span>
        <span className="mt-1 block text-sm text-text-muted">
          {t(tool.descriptionKey)}
        </span>
      </span>
    </Link>
  );
};

export default ToolCard;
```

- [ ] Create `src/components/practices/ToolShell.tsx`:

```tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

export interface ToolShellProps {
  titleKey: string;
  descriptionKey: string;
  children: React.ReactNode;
}

/**
 * Wraps an open tool with a gentle title and a quiet way back to the shelf.
 */
const ToolShell: React.FC<ToolShellProps> = ({
  titleKey,
  descriptionKey,
  children,
}) => {
  const { t } = useTranslation();

  return (
    <section className="mx-auto w-full max-w-2xl px-4 py-8">
      <Link
        to="/practices"
        className="mb-6 inline-flex items-center gap-1 text-sm text-text-muted underline-offset-4 transition-colors duration-base ease-out-soft hover:text-text hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
      >
        <ArrowLeftIcon className="size-4" />
        {t('practices.back')}
      </Link>
      <h1 className="font-display text-2xl text-text">{t(titleKey)}</h1>
      <p className="mt-2 text-text-muted">{t(descriptionKey)}</p>
      <div className="mt-6">{children}</div>
    </section>
  );
};

export default ToolShell;
```

- [ ] `npm run lint`. Commit: `feat(practices): add ToolCard and ToolShell + practices i18n keys (en)`.

## A3. PracticesPage with route param (failing test first)

- [ ] Create `src/tests/behavioralExperiment.test.tsx` with the shelf case only for now (extended in B10):

```tsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import '@tests/test-i18n';
import PracticesPage from '@pages/PracticesPage';

describe('PracticesPage shelf', () => {
  it('renders the shelf heading when no toolId is selected', () => {
    render(
      <MemoryRouter initialEntries={['/practices']}>
        <PracticesPage />
      </MemoryRouter>,
    );
    expect(screen.getByRole('heading', { level: 1 })).toBeTruthy();
  });
});
```

> `@tests/test-i18n` is the shared test i18n bootstrap (default lng/fallback `sv`, tiny bundle). This A3 assertion matches the `<h1>` by role, so it passes whether or not `practices.heading` resolves. Tests that match by visible text/label (see B10) must inject the needed keys as English via `i18n.addResourceBundle('sv', 'translation', {...}, true, true)`, exactly as `goalsDialog.test.tsx` does.

- [ ] Run and watch it fail (page does not exist):

```bash
npx vitest run src/tests/behavioralExperiment.test.tsx
```

- [ ] Create `src/pages/PracticesPage.tsx`:

```tsx
import React, { Suspense } from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { TOOLS } from '@/practices';
import ToolCard from '@components/practices/ToolCard';
import ToolShell from '@components/practices/ToolShell';

/**
 * The Practices shelf. With no :toolId it lists TOOLS as cards. With a matching
 * :toolId it renders that tool inside ToolShell. The compass at "/" remains the
 * home view; this is a separate, deliberately-visited space.
 */
const PracticesPage: React.FC = () => {
  const { t } = useTranslation();
  const { toolId } = useParams<{ toolId?: string }>();

  const active = toolId ? TOOLS.find(tool => tool.id === toolId) : undefined;

  if (active) {
    const Tool = active.component;
    return (
      <ToolShell
        titleKey={active.labelKey}
        descriptionKey={active.descriptionKey}
      >
        <Suspense fallback={null}>
          <Tool />
        </Suspense>
      </ToolShell>
    );
  }

  return (
    <section className="mx-auto w-full max-w-2xl px-4 py-8">
      <h1 className="font-display text-2xl text-text">
        {t('practices.heading')}
      </h1>
      <p className="mt-2 text-text-muted">{t('practices.intro')}</p>

      {TOOLS.length === 0 ? (
        <p className="mt-6 rounded-lg border border-dashed border-border bg-surface-sunken px-4 py-6 text-center text-sm text-text-muted">
          {t('practices.empty')}
        </p>
      ) : (
        <ul className="mt-6 flex flex-col gap-3">
          {TOOLS.map(tool => (
            <li key={tool.id}>
              <ToolCard tool={tool} />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
};

export default PracticesPage;
```

> `PracticesPage` imports `TOOLS` from `@/practices` (the barrel), not `@/practices/toolRegistry`, so the side-effect tool import added in B9 runs before the page reads the array.

- [ ] Run green:

```bash
npx vitest run src/tests/behavioralExperiment.test.tsx
```

- [ ] `npm run lint`. Commit: `feat(practices): add PracticesPage shelf (route-driven)`.

## A4. Wire routes and navigation

- [ ] In `src/App.tsx`, add the import near the other page imports (around line 17):

```tsx
import PracticesPage from './pages/PracticesPage';
```

- [ ] In `src/App.tsx`, add the two routes inside `<Routes>`, after the `/help` route and before `/design-principles`:

```tsx
<Route path="/practices" element={<PracticesPage />} />
<Route path="/practices/:toolId" element={<PracticesPage />} />
```

These are siblings; `/` still renders `YourCompass`. They are not `/welcome`, so `Navigation` and `Footer` render normally.

- [ ] Read `src/components/ui/Navigation.tsx` to confirm the exact `desktopLinkClass` / `mobileLinkClass` identifiers and whether mobile links carry an `onClick` that closes the menu. Then add the desktop link inside the `hidden md:flex` block, after the Help link:

```tsx
<Link to="/practices" className={desktopLinkClass}>
  {t('nav.practices', 'Practices')}
</Link>
```

- [ ] Add the matching mobile link inside the mobile menu block, after the Help link, copying whatever `onClick`/close behavior the sibling Help link uses:

```tsx
<Link to="/practices" className={mobileLinkClass}>
  {t('nav.practices', 'Practices')}
</Link>
```

- [ ] Type-check and lint:

```bash
npm run build
npm run lint
```

- [ ] Commit: `feat(practices): route /practices and add nav link`.

> End of Milestone A: a working, empty shelf reachable from the nav. The compass home is unchanged.

---

# MILESTONE B -- Behavioral Experiment (first registered tool)

Data model first (store + IO), then UI, then registration, then i18n, then full test sweep.

## B1. BehavioralExperiment type

- [ ] In `src/types/LifeCompassDocument.ts`, add the interface after the `Goal` interface (after line 47):

```ts
/**
 * A behavioral experiment: a worry the user wants to test, the steps they try
 * in order to test it, and a free-text reflection on what actually happened.
 * It mirrors Goal (steps reuse ActionStep) but the area link is optional and
 * it carries an outcome. There are no scores: completing steps means "I ran
 * the experiment", never "I achieved a goal".
 */
export interface BehavioralExperiment {
  id: string;
  areaId?: string; // optional link to LifeArea.id (unlike Goal, which requires it)
  title: string; // the answer to "what I was worried might happen"
  steps: ActionStep[]; // reuse ActionStep verbatim
  outcome: string; // free-text reflection; starts empty
  createdAt: string; // ISO 8601
}
```

- [ ] In the same file, update `LifeCompassDocument` and the version constant:

```ts
export interface LifeCompassDocument {
  schemaVersion: 3;
  lifeAreas: LifeArea[];
  history: Snapshot[];
  goals: Goal[];
  behavioralExperiments: BehavioralExperiment[];
}

export const CURRENT_SCHEMA_VERSION = 3 as const;
```

> `npm run build` will now fail at the two `importDocument` call sites (they do not pass `behavioralExperiments`). Expected; fixed in B4. Do not commit yet.

## B2. Store slice + actions + migration (failing tests first)

- [ ] Create `src/tests/behavioralExperimentStore.test.ts`:

```ts
import { describe, it, expect, beforeEach } from 'vitest';
import { useLifeCompassStore } from '../store/lifeCompassStore';
import { LifeArea } from '../types/LifeArea';

function resetStore(): void {
  useLifeCompassStore.setState({
    lifeAreas: [],
    history: [],
    goals: [],
    behavioralExperiments: [],
  });
}

function makeArea(name: string): LifeArea {
  return {
    id: crypto.randomUUID(),
    name,
    description: 'd',
    details: 'd',
    importance: 5,
    satisfaction: 3,
  };
}

describe('behavioralExperiments slice', () => {
  beforeEach(() => {
    localStorage.clear();
    resetStore();
  });

  it('addExperiment trims the title and ignores empty input', () => {
    const s = useLifeCompassStore.getState();
    s.addExperiment('   ');
    expect(useLifeCompassStore.getState().behavioralExperiments).toHaveLength(0);
    s.addExperiment('  I will be judged  ');
    const exps = useLifeCompassStore.getState().behavioralExperiments;
    expect(exps).toHaveLength(1);
    expect(exps[0].title).toBe('I will be judged');
    expect(exps[0].outcome).toBe('');
    expect(exps[0].steps).toEqual([]);
    expect(exps[0].areaId).toBeUndefined();
  });

  it('addExperiment can attach to an area', () => {
    const area = makeArea('Friends');
    useLifeCompassStore.getState().addArea(area);
    useLifeCompassStore.getState().addExperiment('Call a friend', area.id);
    expect(
      useLifeCompassStore.getState().behavioralExperiments[0].areaId,
    ).toBe(area.id);
  });

  it('updateExperiment merges changes but preserves id', () => {
    const s = useLifeCompassStore.getState();
    s.addExperiment('x');
    const id = useLifeCompassStore.getState().behavioralExperiments[0].id;
    s.updateExperiment(id, { title: 'y', id: 'hacked' as unknown as string });
    const exp = useLifeCompassStore.getState().behavioralExperiments[0];
    expect(exp.id).toBe(id);
    expect(exp.title).toBe('y');
  });

  it('removeExperiment removes only the matching id', () => {
    const s = useLifeCompassStore.getState();
    s.addExperiment('a');
    s.addExperiment('b');
    const [first] = useLifeCompassStore.getState().behavioralExperiments;
    s.removeExperiment(first.id);
    const left = useLifeCompassStore.getState().behavioralExperiments;
    expect(left).toHaveLength(1);
    expect(left[0].title).toBe('b');
  });

  it('step actions add, toggle, update, and remove steps', () => {
    const s = useLifeCompassStore.getState();
    s.addExperiment('worry');
    const id = useLifeCompassStore.getState().behavioralExperiments[0].id;

    s.addExperimentStep(id, '  try a small thing  ');
    let step = useLifeCompassStore.getState().behavioralExperiments[0].steps[0];
    expect(step.text).toBe('try a small thing');
    expect(step.done).toBe(false);

    s.toggleExperimentStep(id, step.id);
    step = useLifeCompassStore.getState().behavioralExperiments[0].steps[0];
    expect(step.done).toBe(true);

    s.updateExperimentStep(id, step.id, { text: 'edited' });
    step = useLifeCompassStore.getState().behavioralExperiments[0].steps[0];
    expect(step.text).toBe('edited');

    s.removeExperimentStep(id, step.id);
    expect(
      useLifeCompassStore.getState().behavioralExperiments[0].steps,
    ).toHaveLength(0);
  });

  it('setExperimentOutcome stores trimmed text and empties to ""', () => {
    const s = useLifeCompassStore.getState();
    s.addExperiment('worry');
    const id = useLifeCompassStore.getState().behavioralExperiments[0].id;
    s.setExperimentOutcome(id, '  it was fine  ');
    expect(
      useLifeCompassStore.getState().behavioralExperiments[0].outcome,
    ).toBe('it was fine');
    s.setExperimentOutcome(id, '   ');
    expect(
      useLifeCompassStore.getState().behavioralExperiments[0].outcome,
    ).toBe('');
  });

  it('removeArea cascade-deletes experiments attached to that area', () => {
    const area = makeArea('Work');
    const s = useLifeCompassStore.getState();
    s.addArea(area);
    s.addExperiment('attached', area.id);
    s.addExperiment('floating'); // no areaId
    s.removeArea(area.id);
    const left = useLifeCompassStore.getState().behavioralExperiments;
    expect(left).toHaveLength(1);
    expect(left[0].title).toBe('floating');
  });

  it('removeAllAreas clears experiments too', () => {
    const s = useLifeCompassStore.getState();
    s.addExperiment('a');
    s.removeAllAreas();
    expect(useLifeCompassStore.getState().behavioralExperiments).toEqual([]);
  });

  it('importDocument defaults missing behavioralExperiments to []', () => {
    useLifeCompassStore.getState().importDocument({
      schemaVersion: 3,
      lifeAreas: [],
      history: [],
      goals: [],
    } as unknown as Parameters<
      ReturnType<typeof useLifeCompassStore.getState>['importDocument']
    >[0]);
    expect(useLifeCompassStore.getState().behavioralExperiments).toEqual([]);
  });
});
```

- [ ] Create `src/tests/behavioralExperimentMigration.test.ts`:

```ts
import { describe, it, expect } from 'vitest';
import {
  useLifeCompassStore,
  PERSIST_VERSION,
} from '../store/lifeCompassStore';

describe('behavioralExperiments persist migration', () => {
  it('PERSIST_VERSION is bumped to 2', () => {
    expect(PERSIST_VERSION).toBe(2);
  });

  it('migrate seeds behavioralExperiments:[] for a v1 state', () => {
    const migrate = useLifeCompassStore.persist.getOptions().migrate!;
    const v1 = { lifeAreas: [], history: [], goals: [] };
    const result = migrate(v1, 1) as { behavioralExperiments: unknown[] };
    expect(result.behavioralExperiments).toEqual([]);
  });
});
```

- [ ] Run both and watch them fail:

```bash
npx vitest run src/tests/behavioralExperimentStore.test.ts src/tests/behavioralExperimentMigration.test.ts
```

- [ ] In `src/store/lifeCompassStore.ts`, bump the version constant (line 23):

```ts
export const PERSIST_VERSION = 2;
```

- [ ] Update the import from `../types/LifeCompassDocument` to include `BehavioralExperiment`:

```ts
import {
  ActionStep,
  BehavioralExperiment,
  CURRENT_SCHEMA_VERSION,
  Goal,
  LifeCompassDocument,
  Snapshot,
  SnapshotArea,
} from '../types/LifeCompassDocument';
```

- [ ] In the `LifeCompassState` interface, add the field after `goals: Goal[];` (line 28):

```ts
  behavioralExperiments: BehavioralExperiment[];
```

- [ ] In the same interface, add the 8 action signatures after `removeStep` (after line 49):

```ts
  addExperiment: (title: string, areaId?: string) => void;
  updateExperiment: (
    experimentId: string,
    changes: Partial<BehavioralExperiment>,
  ) => void;
  removeExperiment: (experimentId: string) => void;
  addExperimentStep: (experimentId: string, text: string) => void;
  updateExperimentStep: (
    experimentId: string,
    stepId: string,
    changes: Partial<ActionStep>,
  ) => void;
  toggleExperimentStep: (experimentId: string, stepId: string) => void;
  removeExperimentStep: (experimentId: string, stepId: string) => void;
  setExperimentOutcome: (experimentId: string, outcome: string) => void;
```

- [ ] In the store initializer, add the empty array after `goals: [],` (line 66):

```ts
      behavioralExperiments: [],
```

- [ ] Update `removeArea` (lines 78-83) to cascade:

```ts
      removeArea: id =>
        set(state => ({
          lifeAreas: state.lifeAreas.filter(area => area.id !== id),
          // Cascade-delete: a goal must never dangle against a deleted area.
          goals: state.goals.filter(goal => goal.areaId !== id),
          // Same for experiments that opted into this area.
          behavioralExperiments: state.behavioralExperiments.filter(
            exp => exp.areaId !== id,
          ),
        })),
```

- [ ] Update `removeAllAreas` (line 101):

```ts
      removeAllAreas: () =>
        set({ lifeAreas: [], goals: [], behavioralExperiments: [] }),
```

- [ ] Update `importDocument` (lines 103-108):

```ts
      importDocument: doc =>
        set({
          lifeAreas: doc.lifeAreas ?? [],
          history: doc.history ?? [],
          goals: doc.goals ?? [],
          behavioralExperiments: doc.behavioralExperiments ?? [],
        }),
```

- [ ] Add the 8 actions immediately after `removeStep` (after line 220), inside the initializer object:

```ts
      addExperiment: (title, areaId) =>
        set(state => {
          const trimmed = title.trim();
          if (trimmed === '') {
            return {};
          }
          const experiment: BehavioralExperiment = {
            id: crypto.randomUUID(),
            title: trimmed,
            steps: [],
            outcome: '',
            createdAt: new Date().toISOString(),
            ...(areaId ? { areaId } : {}),
          };
          return {
            behavioralExperiments: [...state.behavioralExperiments, experiment],
          };
        }),

      updateExperiment: (experimentId, changes) =>
        set(state => ({
          behavioralExperiments: state.behavioralExperiments.map(exp =>
            exp.id === experimentId ? { ...exp, ...changes, id: exp.id } : exp,
          ),
        })),

      removeExperiment: experimentId =>
        set(state => ({
          behavioralExperiments: state.behavioralExperiments.filter(
            exp => exp.id !== experimentId,
          ),
        })),

      addExperimentStep: (experimentId, text) =>
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
            behavioralExperiments: state.behavioralExperiments.map(exp =>
              exp.id === experimentId
                ? { ...exp, steps: [...exp.steps, step] }
                : exp,
            ),
          };
        }),

      updateExperimentStep: (experimentId, stepId, changes) =>
        set(state => ({
          behavioralExperiments: state.behavioralExperiments.map(exp =>
            exp.id === experimentId
              ? {
                  ...exp,
                  steps: exp.steps.map(step =>
                    step.id === stepId
                      ? { ...step, ...changes, id: step.id }
                      : step,
                  ),
                }
              : exp,
          ),
        })),

      toggleExperimentStep: (experimentId, stepId) =>
        set(state => ({
          behavioralExperiments: state.behavioralExperiments.map(exp =>
            exp.id === experimentId
              ? {
                  ...exp,
                  steps: exp.steps.map(step =>
                    step.id === stepId ? { ...step, done: !step.done } : step,
                  ),
                }
              : exp,
          ),
        })),

      removeExperimentStep: (experimentId, stepId) =>
        set(state => ({
          behavioralExperiments: state.behavioralExperiments.map(exp =>
            exp.id === experimentId
              ? {
                  ...exp,
                  steps: exp.steps.filter(step => step.id !== stepId),
                }
              : exp,
          ),
        })),

      setExperimentOutcome: (experimentId, outcome) =>
        set(state => ({
          behavioralExperiments: state.behavioralExperiments.map(exp =>
            exp.id === experimentId ? { ...exp, outcome: outcome.trim() } : exp,
          ),
        })),
```

- [ ] Update `partialize` (lines 228-232):

```ts
      partialize: state => ({
        lifeAreas: state.lifeAreas,
        history: state.history,
        goals: state.goals,
        behavioralExperiments: state.behavioralExperiments,
      }),
```

- [ ] Update `migrate` (lines 236-252): widen the `Pick` and add the `version < 2` branch:

```ts
      migrate: (persistedState, version) => {
        const state = persistedState as Partial<
          Pick<
            LifeCompassState,
            'lifeAreas' | 'history' | 'goals' | 'behavioralExperiments'
          >
        >;
        // v0 -> v1: goals did not exist; seed an empty array.
        if (version < 1) {
          return {
            ...state,
            goals: state.goals ?? [],
            behavioralExperiments: state.behavioralExperiments ?? [],
          } as Pick<
            LifeCompassState,
            'lifeAreas' | 'history' | 'goals' | 'behavioralExperiments'
          >;
        }
        // v1 -> v2: behavioralExperiments did not exist; seed an empty array.
        if (version < 2) {
          return {
            ...state,
            behavioralExperiments: state.behavioralExperiments ?? [],
          } as Pick<
            LifeCompassState,
            'lifeAreas' | 'history' | 'goals' | 'behavioralExperiments'
          >;
        }
        return state as Pick<
          LifeCompassState,
          'lifeAreas' | 'history' | 'goals' | 'behavioralExperiments'
        >;
      },
```

- [ ] Update `onRehydrateStorage` (lines 257-276): add the defensive guard after the existing `goals` guard (after line 265):

```ts
        if (!Array.isArray(state.behavioralExperiments)) {
          state.behavioralExperiments = [];
        }
```

- [ ] Run the two store/migration tests green:

```bash
npx vitest run src/tests/behavioralExperimentStore.test.ts src/tests/behavioralExperimentMigration.test.ts
```

- [ ] Do NOT commit yet -- `npm run build` still fails at the import call sites. Fix IO first (B3, B4), then commit the data layer together.

## B3. Export/import schema + services

- [ ] In `src/schemas/exportImportSchema.json`, add a `behavioralExperiments` block inside `data.properties`, right after the `goals` block. (`data` has `"additionalProperties": false`, so it must be declared, but it stays OUT of `data.required` to keep older exports valid.)

```json
"behavioralExperiments": {
  "type": "array",
  "items": {
    "type": "object",
    "properties": {
      "id": { "type": "string" },
      "areaId": { "type": "string" },
      "title": { "type": "string" },
      "createdAt": { "type": "string" },
      "outcome": { "type": "string" },
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
    "required": ["id", "title", "createdAt", "steps"],
    "additionalProperties": true
  }
}
```

> `areaId` and `outcome` are intentionally absent from `required`: the area link is optional and outcome may be empty.

- [ ] In `src/utils/exportService.ts`, import the type and extend `ExportInput`:

```ts
import { BehavioralExperiment, Goal, Snapshot } from '../types/LifeCompassDocument';

export interface ExportInput {
  lifeAreas: LifeArea[];
  history: Snapshot[];
  goals?: Goal[];
  behavioralExperiments?: BehavioralExperiment[];
}
```

- [ ] In the same file, declare `behavioralExperiments` in BOTH branches of the `if (input) { ... } else { ... }` block (mirroring the existing `goals` declarations): in the `if` branch `const behavioralExperiments = input.behavioralExperiments ?? [];`, in the `else` branch `const behavioralExperiments: BehavioralExperiment[] = [];`. Then include it in the assembled `data`:

```ts
    data: {
      userSettings,
      lifeAreas,
      history,
      goals,
      behavioralExperiments,
    },
```

> Read the current `exportService.ts` branch bodies first so both code paths define `behavioralExperiments` before `exportJsonObj` is built.

- [ ] In `src/types/importExport.ts`, add the optional array to `data` after `goals`:

```ts
    behavioralExperiments?: {
      id: string;
      areaId?: string;
      title: string;
      createdAt: string;
      outcome: string;
      steps: {
        id: string;
        text: string;
        done: boolean;
        [key: string]: unknown;
      }[];
      [key: string]: unknown;
    }[];
```

- [ ] `npm run lint`. (Build still fails at the call sites -- next task.)

## B4. Both import/export call sites

- [ ] In `src/pages/YourCompass.tsx`, add `BehavioralExperiment` to the existing `@models/LifeCompassDocument` import. Update the `importDocument` call (lines 152-157):

```ts
    importDocument({
      schemaVersion: CURRENT_SCHEMA_VERSION,
      lifeAreas: payload.data.lifeAreas as LifeArea[],
      history: payload.data.history as unknown as Snapshot[],
      goals: (payload.data.goals ?? []) as Goal[],
      behavioralExperiments: (payload.data.behavioralExperiments ??
        []) as BehavioralExperiment[],
    });
```

- [ ] In `src/pages/YourCompass.tsx`, find the existing `goals` selector and the `exportData({ lifeAreas, history, goals })` call (read the export handler first). Add `const behavioralExperiments = useLifeCompassStore(state => state.behavioralExperiments);` alongside the `goals` selector and include `behavioralExperiments` in the `exportData(...)` argument object.

- [ ] In `src/components/guide/GuideDataActions.tsx`, mirror both edits. Add `BehavioralExperiment` to its `@models/LifeCompassDocument` import. Update the `importDocument` call (lines 57-62):

```ts
    importDocument({
      schemaVersion: CURRENT_SCHEMA_VERSION,
      lifeAreas: payload.data.lifeAreas as LifeArea[],
      history: payload.data.history as unknown as Snapshot[],
      goals: (payload.data.goals ?? []) as Goal[],
      behavioralExperiments: (payload.data.behavioralExperiments ??
        []) as BehavioralExperiment[],
    });
```

- [ ] In `GuideDataActions.tsx`, add `const behavioralExperiments = useLifeCompassStore(state => state.behavioralExperiments);` and include it in the `exportData({ lifeAreas, history, goals })` argument (line 38).

- [ ] Confirm existing IO tests still pass (the new field is optional, so fixtures remain valid):

```bash
npx vitest run src/tests/exportService.test.ts src/tests/importService.test.ts
```

- [ ] In `src/tests/lifeCompassMigration.test.ts`, update the existing `PERSIST_VERSION` assertion from `1` to `2` and its test name accordingly (the bump is intentional).

- [ ] Type-check, lint, and run the full unit suite:

```bash
npm run build
npm run lint
npm run test-verbose
```

- [ ] Commit the data layer: `feat(experiments): add behavioralExperiments slice, actions, migration, and IO`.

## B5. Behavioral experiment i18n keys (en)

Add the full tool key block now so subsequent components compile and tests can match strings.

- [ ] In `public/locales/en/translation.json`, extend the `practices` block with a nested `tools.behavioral_experiment`:

```json
"practices": {
  "heading": "Practices",
  "intro": "A small, calm library. Open something when you feel ready -- there is nothing to finish here.",
  "back": "Back to practices",
  "empty": "No practices yet.",
  "tools": {
    "behavioral_experiment": {
      "label": "Try a small experiment",
      "description": "Gently test a worry by trying something and noticing what actually happens.",
      "add_experiment": "Add experiment",
      "add_experiment_placeholder": "What I was worried might happen...",
      "empty_state": "Nothing here yet. When you are ready, name a worry you would like to test.",
      "experiment_title": "What I was worried might happen",
      "expand": "Show steps",
      "collapse": "Hide steps",
      "step_count": "{{done}}/{{total}} steps tried",
      "delete_experiment_title": "Remove experiment",
      "delete_experiment_warning": "This will remove \"{{title}}\" and everything noted with it. Do you want to continue?",
      "add_step": "Add something to try",
      "add_step_placeholder": "A small thing I could try...",
      "delete_step": "Remove step",
      "area_label": "Attach to a life area (optional)",
      "area_none": "Not attached to an area",
      "outcome_label": "What actually happened",
      "outcome_help": "There are no right answers. Just notice what you noticed."
    }
  }
}
```

- [ ] Commit: `i18n(experiments): add behavioral experiment keys (en)`.

## B6. ExperimentStepList component

Modeled on `GoalStepList`, wired to the experiment-step actions; copy softened.

- [ ] Create `src/components/practices/tools/behavioral-experiment/ExperimentStepList.tsx`:

```tsx
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { TrashIcon } from '@heroicons/react/24/outline';
import type { ActionStep } from '@models/LifeCompassDocument';
import { useLifeCompassStore } from '@/store/lifeCompassStore';
import Checkbox from '@components/ui/Checkbox';
import Input from '@components/ui/Input';
import Button from '@components/ui/Button';

export interface ExperimentStepListProps {
  experimentId: string;
  steps: ActionStep[];
}

const PREFIX = 'practices.tools.behavioral_experiment';

/**
 * The "things to try" list inside one experiment. Toggling a step is just
 * noticing what was tried -- it is never framed as progress toward a target.
 */
const ExperimentStepList: React.FC<ExperimentStepListProps> = ({
  experimentId,
  steps,
}) => {
  const { t } = useTranslation();
  const toggleStep = useLifeCompassStore(s => s.toggleExperimentStep);
  const removeStep = useLifeCompassStore(s => s.removeExperimentStep);
  const addStep = useLifeCompassStore(s => s.addExperimentStep);

  const [newStep, setNewStep] = useState('');

  const handleAddStep = () => {
    if (newStep.trim() === '') {
      return;
    }
    addStep(experimentId, newStep);
    setNewStep('');
  };

  return (
    <div className="mt-3 flex flex-col gap-3 border-t border-border pt-3">
      <ul className="flex flex-col gap-1">
        {steps.map(step => (
          <li
            key={step.id}
            className="flex items-center justify-between gap-2 rounded-md px-1 py-1 hover:bg-surface-sunken"
          >
            <Checkbox
              checked={step.done}
              onChange={() => toggleStep(experimentId, step.id)}
              label={step.text}
              className="min-w-0 flex-1"
            />
            <button
              type="button"
              onClick={() => removeStep(experimentId, step.id)}
              title={t(`${PREFIX}.delete_step`)}
              aria-label={`${t(`${PREFIX}.delete_step`)}: ${step.text}`}
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
          placeholder={t(`${PREFIX}.add_step_placeholder`)}
          aria-label={t(`${PREFIX}.add_step`)}
        />
        <Button
          type="submit"
          variant="secondary"
          className="flex-none"
          disabled={newStep.trim() === ''}
        >
          {t(`${PREFIX}.add_step`)}
        </Button>
      </form>
    </div>
  );
};

export default ExperimentStepList;
```

- [ ] `npm run lint`.

## B7. OutcomeField component

New, no Goals analog. Auto-grows using the `AreaDetail` pattern; writes to the store on blur.

- [ ] Create `src/components/practices/tools/behavioral-experiment/OutcomeField.tsx`:

```tsx
import React from 'react';
import { useTranslation } from 'react-i18next';

export interface OutcomeFieldProps {
  /** Current stored outcome. */
  value: string;
  /** Persist the outcome (called on blur). */
  onCommit: (next: string) => void;
}

const PREFIX = 'practices.tools.behavioral_experiment';

/**
 * A gentle, auto-growing reflection field. Local state keeps typing smooth; the
 * store is written on blur so we do not churn on every keystroke.
 */
const OutcomeField: React.FC<OutcomeFieldProps> = ({ value, onCommit }) => {
  const { t } = useTranslation();
  const ref = React.useRef<HTMLTextAreaElement>(null);
  const [draft, setDraft] = React.useState(value);

  // Keep the draft in sync if the stored value changes underneath us.
  React.useEffect(() => {
    setDraft(value);
  }, [value]);

  const autosize = React.useCallback(() => {
    const el = ref.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${el.scrollHeight}px`;
  }, []);

  React.useLayoutEffect(() => {
    autosize();
  }, [draft, autosize]);

  return (
    <div className="mt-3 border-t border-border pt-3">
      <label htmlFor="experiment-outcome" className="block text-sm font-medium text-text">
        {t(`${PREFIX}.outcome_label`)}
      </label>
      <textarea
        id="experiment-outcome"
        ref={ref}
        rows={1}
        value={draft}
        onInput={autosize}
        onChange={e => setDraft(e.target.value)}
        onBlur={() => onCommit(draft)}
        className="mt-2 min-h-[60px] w-full resize-none overflow-hidden rounded-md border border-border bg-surface px-3 py-2 text-text focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
      />
      <p className="mt-1 text-xs text-text-muted">{t(`${PREFIX}.outcome_help`)}</p>
    </div>
  );
};

export default OutcomeField;
```

> The auto-grow `useRef` + `scrollHeight` pattern is copied from `AreaDetail.tsx`. The styling tokens (`min-h-[60px]`, border/focus classes) mirror the `Textarea` UI component. If two `OutcomeField`s could ever mount at once, derive a unique `htmlFor`/`id` from the experiment id; with one expanded item at a time the static id is fine.

- [ ] `npm run lint`.

## B8. ExperimentItem component

Modeled on `GoalItem`, but with NO ProgressBar -- only a quiet step-count pill, hidden until a step exists. Expanded body adds `OutcomeField`.

- [ ] Create `src/components/practices/tools/behavioral-experiment/ExperimentItem.tsx`:

```tsx
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  ChevronDownIcon,
  ChevronRightIcon,
  PencilIcon,
  TrashIcon,
} from '@heroicons/react/24/outline';
import type { BehavioralExperiment } from '@models/LifeCompassDocument';
import { useLifeCompassStore } from '@/store/lifeCompassStore';
import Input from '@components/ui/Input';
import Button from '@components/ui/Button';
import ExperimentStepList from './ExperimentStepList';
import OutcomeField from './OutcomeField';

export interface ExperimentItemProps {
  experiment: BehavioralExperiment;
  /** Confirms removal; resolves true when the user accepts. */
  onRequestDelete: () => Promise<boolean>;
}

const PREFIX = 'practices.tools.behavioral_experiment';

const ExperimentItem: React.FC<ExperimentItemProps> = ({
  experiment,
  onRequestDelete,
}) => {
  const { t } = useTranslation();
  const updateExperiment = useLifeCompassStore(s => s.updateExperiment);
  const removeExperiment = useLifeCompassStore(s => s.removeExperiment);
  const setOutcome = useLifeCompassStore(s => s.setExperimentOutcome);

  const [expanded, setExpanded] = useState(false);
  const [editing, setEditing] = useState(false);
  const [draftTitle, setDraftTitle] = useState(experiment.title);

  const total = experiment.steps.length;
  const done = experiment.steps.filter(step => step.done).length;

  const handleSaveTitle = () => {
    if (draftTitle.trim() === '') {
      return;
    }
    updateExperiment(experiment.id, { title: draftTitle.trim() });
    setEditing(false);
  };

  const handleDelete = async () => {
    const ok = await onRequestDelete();
    if (ok) {
      removeExperiment(experiment.id);
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

        {editing ? (
          <form
            className="flex min-w-0 flex-1 items-center gap-2"
            onSubmit={e => {
              e.preventDefault();
              handleSaveTitle();
            }}
          >
            <Input
              autoFocus
              value={draftTitle}
              onChange={e => setDraftTitle(e.target.value)}
              aria-label={t(`${PREFIX}.experiment_title`)}
            />
            <Button
              type="submit"
              variant="primary"
              className="flex-none"
              disabled={draftTitle.trim() === ''}
            >
              {t('save')}
            </Button>
            <Button
              type="button"
              variant="ghost"
              className="flex-none"
              onClick={() => {
                setDraftTitle(experiment.title);
                setEditing(false);
              }}
            >
              {t('cancel')}
            </Button>
          </form>
        ) : (
          <button
            type="button"
            onClick={() => setExpanded(prev => !prev)}
            className="min-w-0 flex-1 cursor-pointer truncate border-none bg-transparent text-left font-medium text-text"
            title={experiment.title}
          >
            {experiment.title}
          </button>
        )}

        {!editing && (
          <div className="flex flex-none items-center gap-1">
            {total > 0 && (
              <span className="rounded-full bg-surface-sunken px-2 py-0.5 text-xs font-medium whitespace-nowrap text-text-muted">
                {t(`${PREFIX}.step_count`, { done, total })}
              </span>
            )}
            <button
              type="button"
              onClick={() => {
                setDraftTitle(experiment.title);
                setEditing(true);
              }}
              title={t('edit')}
              aria-label={`${t('edit')}: ${experiment.title}`}
              className="cursor-pointer rounded-md border-none bg-transparent p-1.5 text-text-muted transition-colors duration-base ease-out-soft hover:text-text focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
            >
              <PencilIcon className="size-4" />
            </button>
            <button
              type="button"
              onClick={handleDelete}
              title={t('delete')}
              aria-label={`${t('delete')}: ${experiment.title}`}
              className="cursor-pointer rounded-md border-none bg-transparent p-1.5 text-text-muted transition-colors duration-base ease-out-soft hover:text-danger focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
            >
              <TrashIcon className="size-4" />
            </button>
          </div>
        )}
      </div>

      {expanded && (
        <>
          <ExperimentStepList
            experimentId={experiment.id}
            steps={experiment.steps}
          />
          <OutcomeField
            value={experiment.outcome}
            onCommit={next => setOutcome(experiment.id, next)}
          />
        </>
      )}
    </li>
  );
};

export default ExperimentItem;
```

> Deliberately no `ProgressBar` and no percentage. The step pill is hidden until a step exists.

- [ ] `npm run lint`.

## B9. BehavioralExperiment tool body + registration

- [ ] Create `src/components/practices/tools/behavioral-experiment/BehavioralExperiment.tsx`:

```tsx
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLifeCompassStore } from '@/store/lifeCompassStore';
import { useConfirmDialog } from '@components/ui/hooks/useConfirmDialog';
import Input from '@components/ui/Input';
import Button from '@components/ui/Button';
import ExperimentItem from './ExperimentItem';

const PREFIX = 'practices.tools.behavioral_experiment';

const BehavioralExperiment: React.FC = () => {
  const { t } = useTranslation();
  const experiments = useLifeCompassStore(s => s.behavioralExperiments);
  const lifeAreas = useLifeCompassStore(s => s.lifeAreas);
  const addExperiment = useLifeCompassStore(s => s.addExperiment);
  const { confirm, ConfirmationDialog } = useConfirmDialog();

  const [newTitle, setNewTitle] = useState('');
  const [areaId, setAreaId] = useState<string>('');

  const handleAdd = () => {
    if (newTitle.trim() === '') {
      return;
    }
    addExperiment(newTitle, areaId || undefined);
    setNewTitle('');
    setAreaId('');
  };

  const requestDelete = (title: string) =>
    confirm({
      title: t(`${PREFIX}.delete_experiment_title`),
      message: t(`${PREFIX}.delete_experiment_warning`, { title }),
      type: 'warning',
    });

  return (
    <div>
      <form
        className="flex flex-col gap-3"
        onSubmit={e => {
          e.preventDefault();
          handleAdd();
        }}
      >
        <Input
          value={newTitle}
          onChange={e => setNewTitle(e.target.value)}
          placeholder={t(`${PREFIX}.add_experiment_placeholder`)}
          aria-label={t(`${PREFIX}.add_experiment`)}
        />

        {lifeAreas.length > 0 && (
          <label className="flex flex-col gap-1 text-sm text-text-muted">
            {t(`${PREFIX}.area_label`)}
            <select
              value={areaId}
              onChange={e => setAreaId(e.target.value)}
              className="min-h-[44px] rounded-md border border-border bg-surface px-3 text-text focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
            >
              <option value="">{t(`${PREFIX}.area_none`)}</option>
              {lifeAreas.map(area => (
                <option key={area.id} value={area.id}>
                  {area.name}
                </option>
              ))}
            </select>
          </label>
        )}

        <Button
          type="submit"
          variant="primary"
          className="self-start"
          disabled={newTitle.trim() === ''}
        >
          {t(`${PREFIX}.add_experiment`)}
        </Button>
      </form>

      {experiments.length === 0 ? (
        <p className="mt-6 rounded-lg border border-dashed border-border bg-surface-sunken px-4 py-6 text-center text-sm text-text-muted">
          {t(`${PREFIX}.empty_state`)}
        </p>
      ) : (
        <ul className="mt-5 flex flex-col gap-3">
          {experiments.map(experiment => (
            <ExperimentItem
              key={experiment.id}
              experiment={experiment}
              onRequestDelete={() => requestDelete(experiment.title)}
            />
          ))}
        </ul>
      )}

      {ConfirmationDialog}
    </div>
  );
};

export default BehavioralExperiment;
```

> The store subscription on `behavioralExperiments` is the whole array (stable reference), matching the `GoalsDialog` note about not selecting a freshly-filtered array each render.

- [ ] Create `src/components/practices/tools/behavioral-experiment/index.ts`:

```ts
import { lazy } from 'react';
import { BeakerIcon } from '@heroicons/react/24/outline';
import { TOOLS, type ToolDef } from '@/practices/toolRegistry';

const behavioralExperimentTool: ToolDef = {
  id: 'behavioral-experiment',
  labelKey: 'practices.tools.behavioral_experiment.label',
  descriptionKey: 'practices.tools.behavioral_experiment.description',
  icon: BeakerIcon,
  attachesToArea: true,
  component: lazy(() => import('./BehavioralExperiment')),
};

TOOLS.push(behavioralExperimentTool);

export default behavioralExperimentTool;
```

- [ ] In `src/practices/index.ts`, add the side-effect import at the bottom so loading the barrel registers the tool:

```ts
// Side-effect import: each tool registers itself into TOOLS on load.
import '@components/practices/tools/behavioral-experiment';
```

- [ ] Add the registration case to `src/tests/toolRegistry.test.ts`:

```ts
it('registers the behavioral-experiment tool', async () => {
  await import('../practices'); // triggers side-effect registration
  const { TOOLS: registered } = await import('../practices/toolRegistry');
  const tool = registered.find(x => x.id === 'behavioral-experiment');
  expect(tool).toBeDefined();
  expect(tool?.labelKey).toBe('practices.tools.behavioral_experiment.label');
  expect(tool?.component).toBeDefined();
});
```

- [ ] Run the registry test green:

```bash
npx vitest run src/tests/toolRegistry.test.ts
```

- [ ] `npm run build`, `npm run lint`. Commit: `feat(experiments): register Behavioral Experiment tool + components`.

## B10. Component test for the tool flow (no scores assertion)

- [ ] Extend `src/tests/behavioralExperiment.test.tsx` with the flow + no-score cases (rendering the tool body directly to stay synchronous):

```tsx
import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import i18n from '@tests/test-i18n';
import { useLifeCompassStore } from '@/store/lifeCompassStore';
import BehavioralExperiment from '@components/practices/tools/behavioral-experiment/BehavioralExperiment';

// test-i18n defaults to lng/fallback 'sv' with a tiny bundle, so inject this
// tool's keys as English here (same pattern as goalsDialog.test.tsx) so that
// getByLabelText / getByText resolve to readable strings. Keep in sync with B5.
i18n.addResourceBundle(
  'sv',
  'translation',
  {
    practices: {
      tools: {
        behavioral_experiment: {
          label: 'Try a small experiment',
          add_experiment: 'Add experiment',
          add_experiment_placeholder: 'What I was worried might happen...',
          empty_state:
            'Nothing here yet. When you are ready, name a worry you would like to test.',
          experiment_title: 'What I was worried might happen',
          expand: 'Show steps',
          collapse: 'Hide steps',
          step_count: '{{done}}/{{total}} steps tried',
          add_step: 'Add something to try',
          add_step_placeholder: 'A small thing I could try...',
          delete_step: 'Remove step',
          area_label: 'Attach to a life area (optional)',
          area_none: 'Not attached to an area',
          outcome_label: 'What actually happened',
          outcome_help:
            'There are no right answers. Just notice what you noticed.',
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
  });
});

describe('Behavioral Experiment tool', () => {
  it('adds an experiment from the gentle prompt', () => {
    render(
      <MemoryRouter>
        <BehavioralExperiment />
      </MemoryRouter>,
    );
    const input = screen.getByLabelText(/add experiment/i);
    fireEvent.change(input, { target: { value: 'People will laugh' } });
    fireEvent.submit(input.closest('form')!);
    expect(useLifeCompassStore.getState().behavioralExperiments).toHaveLength(1);
    expect(screen.getByText('People will laugh')).toBeTruthy();
  });

  it('never renders a percentage or a progressbar', () => {
    useLifeCompassStore.getState().addExperiment('test worry');
    const id = useLifeCompassStore.getState().behavioralExperiments[0].id;
    useLifeCompassStore.getState().addExperimentStep(id, 'try it');
    useLifeCompassStore
      .getState()
      .toggleExperimentStep(
        id,
        useLifeCompassStore.getState().behavioralExperiments[0].steps[0].id,
      );
    render(
      <MemoryRouter>
        <BehavioralExperiment />
      </MemoryRouter>,
    );
    expect(document.body.textContent).not.toContain('%');
    expect(screen.queryByRole('progressbar')).toBeNull();
  });
});
```

> The `addResourceBundle` call above mirrors `goalsDialog.test.tsx`, which injects its `goals.*` keys the same way. Keep these keys in sync with the en block in task B5.

- [ ] Run green:

```bash
npx vitest run src/tests/behavioralExperiment.test.tsx
```

- [ ] Commit: `test(experiments): cover add/step/no-score behaviour`.

## B11. i18n extraction + all locales

- [ ] Run the extractor to confirm the new keys are picked up from source and no orphan keys remain:

```bash
npm run extract
```

- [ ] Add the `nav.practices`, `practices.*`, and `practices.tools.behavioral_experiment.*` keys (identical structure to `en`) to every other locale file, translating per language (or carrying English temporarily -- see Open Questions):

```
public/locales/sv/translation.json
public/locales/de/translation.json
public/locales/da/translation.json
public/locales/nl/translation.json
public/locales/nb/translation.json
public/locales/fi/translation.json
public/locales/is/translation.json
public/locales/fr/translation.json
public/locales/tlh/translation.json
```

Keep each file's `"version": "1.0.0"` field intact -- a mismatch makes i18next drop the whole file and fall back to English.

- [ ] Sanity-check every locale parses:

```bash
for f in public/locales/*/translation.json; do node -e "JSON.parse(require('fs').readFileSync('$f','utf8'))" && echo "ok $f"; done
```

- [ ] Commit: `i18n(practices): add nav + behavioral experiment keys (all locales)`.

## B12. Final verification

- [ ] Full type-check and lint:

```bash
npm run build
npm run lint
```

- [ ] Full unit suite (the `lifeCompassMigration.test.ts` assertion is now `2`):

```bash
npm run test-verbose
```

- [ ] Unused-code checks (the registry side-effect import and lazy component can trip knip; whitelist per the existing knip config if needed):

```bash
npm run check:knip
npm run check:ts-prune
```

- [ ] Manual smoke (optional): `npm run dev`, navigate to `/practices`, open the tool, add a worry, add a step, toggle it, type an outcome and blur, refresh, confirm persistence and that no number/percentage shows anywhere.

- [ ] Final commit if config/whitelist tweaks were needed: `chore(experiments): satisfy knip/ts-prune for the new tool`.

---

## Ethos checklist (apply to every UI/copy task)

- No streaks, no completion percentages, no progress bar -- only a quiet, optional `done/total steps tried` pill, hidden when there are no steps.
- "Feared prediction" is never shown; the visible prompt is "what I was worried might happen" and the add placeholder is gentle.
- All persistence is local (`localStorage` via the store); no network calls are introduced.
- Copy stays ACT-gentle: "there is nothing to finish here", "no right answers", "notice what you noticed".
- Tools are independent: the registry imposes no ordering, no locks, no prerequisites.
