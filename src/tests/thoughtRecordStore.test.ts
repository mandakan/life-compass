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

describe('thoughtRecords store slice', () => {
  beforeEach(() => {
    useLifeCompassStore.setState({
      lifeAreas: [],
      history: [],
      goals: [],
      behavioralExperiments: [],
      thoughtRecords: [],
    });
  });

  it('adds a thought record with defaults and a generated id', () => {
    useLifeCompassStore.getState().addThoughtRecord();
    const records = useLifeCompassStore.getState().thoughtRecords;
    expect(records).toHaveLength(1);
    expect(records[0].id).toBeTruthy();
    expect(records[0].situation).toBe('');
    expect(records[0].feeling).toBe('');
    expect(records[0].feelingBefore).toBeUndefined();
    expect(records[0].createdAt).toBeTruthy();
  });

  it('adds a thought record linked to an area', () => {
    useLifeCompassStore.getState().addThoughtRecord('area-1');
    expect(useLifeCompassStore.getState().thoughtRecords[0].areaId).toBe(
      'area-1',
    );
  });

  it('updates a thought record but never changes its id', () => {
    useLifeCompassStore.getState().addThoughtRecord();
    const { id } = useLifeCompassStore.getState().thoughtRecords[0];
    useLifeCompassStore
      .getState()
      .updateThoughtRecord(id, { situation: 'at work', feelingAfter: 2 });
    const rec = useLifeCompassStore.getState().thoughtRecords[0];
    expect(rec.id).toBe(id);
    expect(rec.situation).toBe('at work');
    expect(rec.feelingAfter).toBe(2);
  });

  it('removes a thought record', () => {
    useLifeCompassStore.getState().addThoughtRecord();
    const { id } = useLifeCompassStore.getState().thoughtRecords[0];
    useLifeCompassStore.getState().removeThoughtRecord(id);
    expect(useLifeCompassStore.getState().thoughtRecords).toHaveLength(0);
  });

  it('cascade-deletes thought records when their linked area is removed', () => {
    useLifeCompassStore.setState({ lifeAreas: [area('a'), area('b')] });
    useLifeCompassStore.getState().addThoughtRecord('a');
    useLifeCompassStore.getState().addThoughtRecord('b');
    useLifeCompassStore.getState().removeArea('a');
    const records = useLifeCompassStore.getState().thoughtRecords;
    expect(records).toHaveLength(1);
    expect(records[0].areaId).toBe('b');
  });

  it('clears thought records on removeAllAreas', () => {
    useLifeCompassStore.getState().addThoughtRecord();
    useLifeCompassStore.getState().removeAllAreas();
    expect(useLifeCompassStore.getState().thoughtRecords).toHaveLength(0);
  });

  it('imports thought records from a document', () => {
    useLifeCompassStore.getState().importDocument({
      schemaVersion: 6,
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
      behavioralActivations: [],
    });
    expect(useLifeCompassStore.getState().thoughtRecords).toHaveLength(1);
  });
});
