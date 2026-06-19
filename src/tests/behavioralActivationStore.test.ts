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
    expect(useLifeCompassStore.getState().behavioralActivations[0].areaId).toBe(
      'area-1',
    );
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
    expect(useLifeCompassStore.getState().behavioralActivations).toHaveLength(
      0,
    );
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
    expect(useLifeCompassStore.getState().behavioralActivations).toHaveLength(
      0,
    );
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
    expect(useLifeCompassStore.getState().behavioralActivations).toHaveLength(
      1,
    );
  });
});
