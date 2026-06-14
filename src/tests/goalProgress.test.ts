import { describe, it, expect } from 'vitest';
import { goalProgress } from '../utils/goalProgress';
import { Goal } from '../types/LifeCompassDocument';

function makeGoal(dones: boolean[]): Goal {
  return {
    id: 'g',
    areaId: 'a',
    title: 'G',
    createdAt: new Date().toISOString(),
    steps: dones.map((done, i) => ({ id: `s${i}`, text: `step ${i}`, done })),
  };
}

describe('goalProgress', () => {
  it('reports 0% for a goal with no steps', () => {
    expect(goalProgress(makeGoal([]))).toEqual({
      done: 0,
      total: 0,
      ratio: 0,
    });
  });

  it('reports 0% when no step is done', () => {
    expect(goalProgress(makeGoal([false, false]))).toEqual({
      done: 0,
      total: 2,
      ratio: 0,
    });
  });

  it('reports a partial ratio', () => {
    expect(goalProgress(makeGoal([true, false, false, false]))).toEqual({
      done: 1,
      total: 4,
      ratio: 0.25,
    });
  });

  it('reports 100% when all steps are done', () => {
    expect(goalProgress(makeGoal([true, true]))).toEqual({
      done: 2,
      total: 2,
      ratio: 1,
    });
  });
});
