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
    expect(useLifeCompassStore.getState().problemSolvings[0].areaId).toBe(
      'area-1',
    );
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
    expect(
      useLifeCompassStore.getState().problemSolvings[0].chosenOptionId,
    ).toBe(optionId);
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
