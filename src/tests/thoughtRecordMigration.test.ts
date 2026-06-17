import { describe, it, expect } from 'vitest';
import {
  useLifeCompassStore,
  PERSIST_VERSION,
} from '../store/lifeCompassStore';

describe('thoughtRecords persist migration', () => {
  it('PERSIST_VERSION is at least 3', () => {
    expect(PERSIST_VERSION).toBeGreaterThanOrEqual(3);
  });

  it('migrate seeds thoughtRecords:[] for a v2 state', () => {
    const migrate = useLifeCompassStore.persist.getOptions().migrate!;
    const v2 = {
      lifeAreas: [],
      history: [],
      goals: [],
      behavioralExperiments: [],
    };
    const result = migrate(v2, 2) as { thoughtRecords: unknown[] };
    expect(result.thoughtRecords).toEqual([]);
  });
});
