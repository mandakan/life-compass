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
