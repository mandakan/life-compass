import { describe, it, expect } from 'vitest';
import {
  useLifeCompassStore,
  PERSIST_VERSION,
} from '../store/lifeCompassStore';
import { LifeArea } from '../types/LifeArea';

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

describe('lifeCompassStore persist migration', () => {
  it('PERSIST_VERSION is bumped to 2 for the behavioralExperiments migration', () => {
    expect(PERSIST_VERSION).toBe(2);
  });

  it('migrate adds goals:[] to a v0 persisted state without goals', () => {
    const migrate = useLifeCompassStore.persist.getOptions().migrate!;
    const v0 = {
      lifeAreas: [makeArea('Legacy')],
      history: [],
    };

    const result = migrate(v0, 0) as {
      lifeAreas: LifeArea[];
      history: unknown[];
      goals: unknown[];
    };

    expect(result.lifeAreas).toHaveLength(1);
    expect(result.lifeAreas[0].name).toBe('Legacy');
    expect(result.goals).toEqual([]);
  });

  it('migrate preserves existing goals on a v1 persisted state', () => {
    const migrate = useLifeCompassStore.persist.getOptions().migrate!;
    const goal = {
      id: 'g1',
      areaId: 'a1',
      title: 'Keep me',
      steps: [],
      createdAt: new Date().toISOString(),
    };
    const v1 = { lifeAreas: [], history: [], goals: [goal] };

    const result = migrate(v1, 1) as { goals: unknown[] };
    expect(result.goals).toEqual([goal]);
  });
});
