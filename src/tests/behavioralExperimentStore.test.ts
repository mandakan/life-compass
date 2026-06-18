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
    expect(useLifeCompassStore.getState().behavioralExperiments).toHaveLength(
      0,
    );
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
    expect(useLifeCompassStore.getState().behavioralExperiments[0].areaId).toBe(
      area.id,
    );
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
