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
