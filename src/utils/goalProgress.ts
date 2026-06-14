import { Goal } from '../types/LifeCompassDocument';

/**
 * Derived progress for a goal. Never stored -- computed from step completion on
 * demand. A goal with zero steps has ratio 0 ("no steps yet").
 */
export interface GoalProgress {
  done: number;
  total: number;
  ratio: number; // 0..1
}

/**
 * Pure helper deriving a goal's progress from its steps. `ratio` is
 * `done / total`, or 0 when the goal has no steps.
 */
export function goalProgress(goal: Goal): GoalProgress {
  const total = goal.steps.length;
  const done = goal.steps.filter(step => step.done).length;
  const ratio = total === 0 ? 0 : done / total;
  return { done, total, ratio };
}
