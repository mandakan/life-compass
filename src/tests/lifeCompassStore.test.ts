import { describe, it, expect, beforeEach } from 'vitest';
import { useLifeCompassStore } from '../store/lifeCompassStore';
import { migrateLegacyData, clearLegacyData } from '../store/migrateLegacyData';
import { LifeArea } from '../types/LifeArea';
import { LifeCompassDocument } from '../types/LifeCompassDocument';

const STORE_KEY = 'life-compass';
const LEGACY_KEY = 'lifeCompass';

function resetStore(): void {
  useLifeCompassStore.setState({ lifeAreas: [], history: [], goals: [] });
}

function makeArea(overrides: Partial<LifeArea> = {}): LifeArea {
  return {
    id: overrides.id ?? crypto.randomUUID(),
    name: overrides.name ?? 'Health',
    description: overrides.description ?? 'desc',
    details: overrides.details ?? 'details',
    importance: overrides.importance ?? 5,
    satisfaction: overrides.satisfaction ?? 3,
  };
}

describe('lifeCompassStore actions', () => {
  beforeEach(() => {
    localStorage.clear();
    resetStore();
  });

  it('addArea appends an area', () => {
    const area = makeArea({ name: 'Career' });
    useLifeCompassStore.getState().addArea(area);
    const { lifeAreas } = useLifeCompassStore.getState();
    expect(lifeAreas).toHaveLength(1);
    expect(lifeAreas[0]).toEqual(area);
  });

  it('updateArea merges changes by id and leaves others untouched', () => {
    const a = makeArea({ name: 'A' });
    const b = makeArea({ name: 'B' });
    const store = useLifeCompassStore.getState();
    store.addArea(a);
    store.addArea(b);

    store.updateArea(a.id, { satisfaction: 9, name: 'A2' });

    const areas = useLifeCompassStore.getState().lifeAreas;
    const updated = areas.find(x => x.id === a.id)!;
    const other = areas.find(x => x.id === b.id)!;
    expect(updated.satisfaction).toBe(9);
    expect(updated.name).toBe('A2');
    expect(updated.importance).toBe(a.importance);
    expect(other).toEqual(b);
  });

  it('removeArea removes only the matching id', () => {
    const a = makeArea({ name: 'A' });
    const b = makeArea({ name: 'B' });
    const store = useLifeCompassStore.getState();
    store.addArea(a);
    store.addArea(b);

    store.removeArea(a.id);

    const areas = useLifeCompassStore.getState().lifeAreas;
    expect(areas).toHaveLength(1);
    expect(areas[0].id).toBe(b.id);
  });

  it('reorderAreas moves an area from one index to another', () => {
    const a = makeArea({ name: 'A' });
    const b = makeArea({ name: 'B' });
    const c = makeArea({ name: 'C' });
    const store = useLifeCompassStore.getState();
    store.addArea(a);
    store.addArea(b);
    store.addArea(c);

    // move first to last
    store.reorderAreas(0, 2);

    const names = useLifeCompassStore.getState().lifeAreas.map(x => x.name);
    expect(names).toEqual(['B', 'C', 'A']);
  });

  it('removeAllAreas clears areas but leaves history intact', () => {
    const store = useLifeCompassStore.getState();
    store.addArea(makeArea({ name: 'A' }));
    store.saveSnapshot();
    store.removeAllAreas();

    const state = useLifeCompassStore.getState();
    expect(state.lifeAreas).toHaveLength(0);
    expect(state.history).toHaveLength(1);
  });

  it('importDocument replaces both lifeAreas and history', () => {
    const store = useLifeCompassStore.getState();
    store.addArea(makeArea({ name: 'Old' }));

    const doc: LifeCompassDocument = {
      schemaVersion: 2,
      lifeAreas: [makeArea({ name: 'Imported' })],
      history: [
        {
          id: crypto.randomUUID(),
          createdAt: new Date().toISOString(),
          areas: [
            { id: 'x', name: 'Imported', importance: 1, satisfaction: 2 },
          ],
        },
      ],
      goals: [],
    };
    store.importDocument(doc);

    const state = useLifeCompassStore.getState();
    expect(state.lifeAreas).toHaveLength(1);
    expect(state.lifeAreas[0].name).toBe('Imported');
    expect(state.history).toHaveLength(1);
  });
});

describe('lifeCompassStore snapshots', () => {
  beforeEach(() => {
    localStorage.clear();
    resetStore();
  });

  it('saveSnapshot freezes current areas into a denormalized snapshot', () => {
    const store = useLifeCompassStore.getState();
    const a = makeArea({ name: 'Health', importance: 8, satisfaction: 4 });
    store.addArea(a);

    store.saveSnapshot('after summer');

    const { history } = useLifeCompassStore.getState();
    expect(history).toHaveLength(1);
    const snap = history[0];
    expect(typeof snap.id).toBe('string');
    expect(snap.id.length).toBeGreaterThan(0);
    expect(snap.label).toBe('after summer');
    expect(() => new Date(snap.createdAt).toISOString()).not.toThrow();
    expect(snap.createdAt).toBe(new Date(snap.createdAt).toISOString());
    expect(snap.areas).toEqual([
      { id: a.id, name: 'Health', importance: 8, satisfaction: 4 },
    ]);
  });

  it('saveSnapshot omits label when not provided', () => {
    const store = useLifeCompassStore.getState();
    store.addArea(makeArea());
    store.saveSnapshot();
    const snap = useLifeCompassStore.getState().history[0];
    expect(snap.label).toBeUndefined();
  });

  it('a snapshot is independent of later area edits and deletes', () => {
    const store = useLifeCompassStore.getState();
    const a = makeArea({ name: 'Health', importance: 8, satisfaction: 4 });
    store.addArea(a);
    store.saveSnapshot();

    // mutate and delete the live area afterwards
    store.updateArea(a.id, { name: 'Renamed', importance: 1, satisfaction: 1 });
    store.removeArea(a.id);

    const snap = useLifeCompassStore.getState().history[0];
    expect(snap.areas).toEqual([
      { id: a.id, name: 'Health', importance: 8, satisfaction: 4 },
    ]);
    expect(useLifeCompassStore.getState().lifeAreas).toHaveLength(0);
  });

  it('deleteSnapshot removes only the matching snapshot', () => {
    const store = useLifeCompassStore.getState();
    store.addArea(makeArea({ name: 'A' }));
    store.saveSnapshot('first');
    store.saveSnapshot('second');

    const before = useLifeCompassStore.getState().history;
    expect(before).toHaveLength(2);
    const firstId = before.find(s => s.label === 'first')!.id;

    store.deleteSnapshot(firstId);

    const after = useLifeCompassStore.getState().history;
    expect(after).toHaveLength(1);
    expect(after[0].label).toBe('second');
  });
});

describe('lifeCompassStore goals and steps', () => {
  beforeEach(() => {
    localStorage.clear();
    resetStore();
  });

  function firstGoalId(): string {
    return useLifeCompassStore.getState().goals[0].id;
  }

  it('addGoal appends a goal with a uuid, ISO createdAt, empty steps', () => {
    const store = useLifeCompassStore.getState();
    store.addGoal('area-1', 'Run a marathon');

    const goals = useLifeCompassStore.getState().goals;
    expect(goals).toHaveLength(1);
    const goal = goals[0];
    expect(typeof goal.id).toBe('string');
    expect(goal.id.length).toBeGreaterThan(0);
    expect(goal.areaId).toBe('area-1');
    expect(goal.title).toBe('Run a marathon');
    expect(goal.steps).toEqual([]);
    expect(goal.createdAt).toBe(new Date(goal.createdAt).toISOString());
  });

  it('addGoal trims the title', () => {
    useLifeCompassStore.getState().addGoal('a', '  Hydrate  ');
    expect(useLifeCompassStore.getState().goals[0].title).toBe('Hydrate');
  });

  it('addGoal rejects an empty or whitespace-only title', () => {
    const store = useLifeCompassStore.getState();
    store.addGoal('a', '');
    store.addGoal('a', '   ');
    expect(useLifeCompassStore.getState().goals).toHaveLength(0);
  });

  it('updateGoal merges changes and preserves the id', () => {
    const store = useLifeCompassStore.getState();
    store.addGoal('a', 'Old');
    const id = firstGoalId();
    store.updateGoal(id, { title: 'New' });

    const goal = useLifeCompassStore.getState().goals[0];
    expect(goal.id).toBe(id);
    expect(goal.title).toBe('New');
  });

  it('updateGoal cannot overwrite the id', () => {
    const store = useLifeCompassStore.getState();
    store.addGoal('a', 'G');
    const id = firstGoalId();
    store.updateGoal(id, { id: 'hacked' } as Partial<
      ReturnType<typeof useLifeCompassStore.getState>['goals'][number]
    >);
    expect(useLifeCompassStore.getState().goals[0].id).toBe(id);
  });

  it('removeGoal removes only the matching goal', () => {
    const store = useLifeCompassStore.getState();
    store.addGoal('a', 'A');
    store.addGoal('a', 'B');
    const goals = useLifeCompassStore.getState().goals;
    store.removeGoal(goals[0].id);

    const after = useLifeCompassStore.getState().goals;
    expect(after).toHaveLength(1);
    expect(after[0].title).toBe('B');
  });

  it('addStep appends a step with a uuid, done=false', () => {
    const store = useLifeCompassStore.getState();
    store.addGoal('a', 'G');
    const id = firstGoalId();
    store.addStep(id, 'Buy shoes');

    const step = useLifeCompassStore.getState().goals[0].steps[0];
    expect(typeof step.id).toBe('string');
    expect(step.id.length).toBeGreaterThan(0);
    expect(step.text).toBe('Buy shoes');
    expect(step.done).toBe(false);
  });

  it('addStep trims and rejects empty step text', () => {
    const store = useLifeCompassStore.getState();
    store.addGoal('a', 'G');
    const id = firstGoalId();
    store.addStep(id, '  Stretch  ');
    store.addStep(id, '');
    store.addStep(id, '   ');

    const steps = useLifeCompassStore.getState().goals[0].steps;
    expect(steps).toHaveLength(1);
    expect(steps[0].text).toBe('Stretch');
  });

  it('updateStep merges changes and preserves the step id', () => {
    const store = useLifeCompassStore.getState();
    store.addGoal('a', 'G');
    const gid = firstGoalId();
    store.addStep(gid, 'Step');
    const sid = useLifeCompassStore.getState().goals[0].steps[0].id;

    store.updateStep(gid, sid, { text: 'Step edited', done: true });
    const step = useLifeCompassStore.getState().goals[0].steps[0];
    expect(step.id).toBe(sid);
    expect(step.text).toBe('Step edited');
    expect(step.done).toBe(true);
  });

  it('toggleStep flips done back and forth', () => {
    const store = useLifeCompassStore.getState();
    store.addGoal('a', 'G');
    const gid = firstGoalId();
    store.addStep(gid, 'Step');
    const sid = useLifeCompassStore.getState().goals[0].steps[0].id;

    store.toggleStep(gid, sid);
    expect(useLifeCompassStore.getState().goals[0].steps[0].done).toBe(true);
    store.toggleStep(gid, sid);
    expect(useLifeCompassStore.getState().goals[0].steps[0].done).toBe(false);
  });

  it('removeStep removes only the matching step', () => {
    const store = useLifeCompassStore.getState();
    store.addGoal('a', 'G');
    const gid = firstGoalId();
    store.addStep(gid, 'One');
    store.addStep(gid, 'Two');
    const sid = useLifeCompassStore.getState().goals[0].steps[0].id;

    store.removeStep(gid, sid);
    const steps = useLifeCompassStore.getState().goals[0].steps;
    expect(steps).toHaveLength(1);
    expect(steps[0].text).toBe('Two');
  });
});

describe('lifeCompassStore goal cascade rules', () => {
  beforeEach(() => {
    localStorage.clear();
    resetStore();
  });

  it('removeArea drops goals whose areaId matches and keeps the rest', () => {
    const store = useLifeCompassStore.getState();
    const a = makeArea({ name: 'A' });
    const b = makeArea({ name: 'B' });
    store.addArea(a);
    store.addArea(b);
    store.addGoal(a.id, 'Goal A');
    store.addGoal(b.id, 'Goal B');

    store.removeArea(a.id);

    const goals = useLifeCompassStore.getState().goals;
    expect(goals).toHaveLength(1);
    expect(goals[0].areaId).toBe(b.id);
    expect(goals[0].title).toBe('Goal B');
  });

  it('removeAllAreas clears goals too', () => {
    const store = useLifeCompassStore.getState();
    const a = makeArea({ name: 'A' });
    store.addArea(a);
    store.addGoal(a.id, 'Goal');
    store.saveSnapshot();

    store.removeAllAreas();

    const state = useLifeCompassStore.getState();
    expect(state.lifeAreas).toHaveLength(0);
    expect(state.goals).toHaveLength(0);
    // history is unaffected by the area/goal clear
    expect(state.history).toHaveLength(1);
  });

  it('importDocument replaces goals wholesale', () => {
    const store = useLifeCompassStore.getState();
    store.addGoal('old-area', 'Old goal');

    const doc: LifeCompassDocument = {
      schemaVersion: 2,
      lifeAreas: [makeArea({ name: 'Imported' })],
      history: [],
      goals: [
        {
          id: 'g1',
          areaId: 'imported-area',
          title: 'Imported goal',
          steps: [{ id: 's1', text: 'Step', done: true }],
          createdAt: new Date().toISOString(),
        },
      ],
    };
    store.importDocument(doc);

    const goals = useLifeCompassStore.getState().goals;
    expect(goals).toHaveLength(1);
    expect(goals[0].title).toBe('Imported goal');
    expect(goals[0].steps[0].done).toBe(true);
  });

  it('importDocument defaults goals to [] when the key is absent', () => {
    const store = useLifeCompassStore.getState();
    store.addGoal('a', 'Will be replaced');

    const doc = {
      schemaVersion: 2,
      lifeAreas: [],
      history: [],
    } as unknown as LifeCompassDocument;
    store.importDocument(doc);

    expect(useLifeCompassStore.getState().goals).toEqual([]);
  });
});

describe('migrateLegacyData', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('returns null when no legacy key exists', () => {
    expect(migrateLegacyData()).toBeNull();
  });

  it('reads the legacy bare array and returns seeded areas without deleting the key', () => {
    const legacyAreas: LifeArea[] = [
      makeArea({ name: 'Legacy A' }),
      makeArea({ name: 'Legacy B' }),
    ];
    localStorage.setItem(LEGACY_KEY, JSON.stringify(legacyAreas));

    const seeded = migrateLegacyData();

    expect(seeded).not.toBeNull();
    expect(seeded!.lifeAreas).toEqual(legacyAreas);
    expect(seeded!.history).toEqual([]);
    // Hardening: the key is preserved until the store has applied the seed, so
    // valid data can never be dropped before it is read into the store.
    expect(localStorage.getItem(LEGACY_KEY)).not.toBeNull();
  });

  it('returns null when legacy value is not an array', () => {
    localStorage.setItem(LEGACY_KEY, JSON.stringify({ not: 'an array' }));
    expect(migrateLegacyData()).toBeNull();
  });

  it('returns null when legacy value is invalid JSON', () => {
    localStorage.setItem(LEGACY_KEY, '{not valid json');
    expect(migrateLegacyData()).toBeNull();
  });

  it('clearLegacyData removes the legacy key', () => {
    localStorage.setItem(LEGACY_KEY, JSON.stringify([makeArea({ name: 'X' })]));
    clearLegacyData();
    expect(localStorage.getItem(LEGACY_KEY)).toBeNull();
  });

  it('store seeding flow applies legacy data then clears the key', () => {
    const legacyAreas: LifeArea[] = [makeArea({ name: 'Legacy' })];
    localStorage.setItem(LEGACY_KEY, JSON.stringify(legacyAreas));
    resetStore();

    // Mirror the store's onRehydrate logic: read, apply if empty, then clear.
    const seeded = migrateLegacyData();
    if (seeded && useLifeCompassStore.getState().lifeAreas.length === 0) {
      useLifeCompassStore.setState(seeded);
    }
    clearLegacyData();

    expect(useLifeCompassStore.getState().lifeAreas[0].name).toBe('Legacy');
    expect(localStorage.getItem(LEGACY_KEY)).toBeNull();
    expect(localStorage.getItem(STORE_KEY)).not.toBeNull();
  });

  it('does not overwrite existing store data, and still clears the legacy key', () => {
    resetStore();
    useLifeCompassStore.getState().addArea(makeArea({ name: 'Current' }));
    localStorage.setItem(
      LEGACY_KEY,
      JSON.stringify([makeArea({ name: 'Legacy' })]),
    );

    const seeded = migrateLegacyData();
    if (seeded && useLifeCompassStore.getState().lifeAreas.length === 0) {
      useLifeCompassStore.setState(seeded);
    }
    clearLegacyData();

    // Newer store data wins; the redundant legacy key is dropped, not applied.
    expect(useLifeCompassStore.getState().lifeAreas.map(a => a.name)).toEqual([
      'Current',
    ]);
    expect(localStorage.getItem(LEGACY_KEY)).toBeNull();
  });
});
