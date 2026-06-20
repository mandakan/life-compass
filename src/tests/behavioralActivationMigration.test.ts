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
