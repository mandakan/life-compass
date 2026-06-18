import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { LifeArea } from '../types/LifeArea';
import {
  ActionStep,
  BehavioralExperiment,
  CURRENT_SCHEMA_VERSION,
  Goal,
  LifeCompassDocument,
  ProblemSolving,
  Snapshot,
  SnapshotArea,
  SolutionOption,
  ThoughtRecord,
} from '../types/LifeCompassDocument';
import { migrateLegacyData, clearLegacyData } from './migrateLegacyData';

/**
 * The persist middleware key holding the single versioned document. This is the
 * NEW key; the legacy bare-array key was `lifeCompass`.
 */
export const STORE_KEY = 'life-compass';

/**
 * Bump this when the persisted shape changes and add a branch to `migrate`.
 */
export const PERSIST_VERSION = 4;

export interface LifeCompassState {
  lifeAreas: LifeArea[];
  history: Snapshot[];
  goals: Goal[];
  behavioralExperiments: BehavioralExperiment[];
  thoughtRecords: ThoughtRecord[];
  problemSolvings: ProblemSolving[];

  addArea: (area: LifeArea) => void;
  updateArea: (id: string, changes: Partial<LifeArea>) => void;
  removeArea: (id: string) => void;
  reorderAreas: (fromIndex: number, toIndex: number) => void;
  removeAllAreas: () => void;
  importDocument: (doc: LifeCompassDocument) => void;
  saveSnapshot: (label?: string) => void;
  deleteSnapshot: (id: string) => void;

  addGoal: (areaId: string, title: string) => void;
  updateGoal: (goalId: string, changes: Partial<Goal>) => void;
  removeGoal: (goalId: string) => void;
  addStep: (goalId: string, text: string) => void;
  updateStep: (
    goalId: string,
    stepId: string,
    changes: Partial<ActionStep>,
  ) => void;
  toggleStep: (goalId: string, stepId: string) => void;
  removeStep: (goalId: string, stepId: string) => void;

  addExperiment: (title: string, areaId?: string) => void;
  updateExperiment: (
    experimentId: string,
    changes: Partial<BehavioralExperiment>,
  ) => void;
  removeExperiment: (experimentId: string) => void;
  addExperimentStep: (experimentId: string, text: string) => void;
  updateExperimentStep: (
    experimentId: string,
    stepId: string,
    changes: Partial<ActionStep>,
  ) => void;
  toggleExperimentStep: (experimentId: string, stepId: string) => void;
  removeExperimentStep: (experimentId: string, stepId: string) => void;
  setExperimentOutcome: (experimentId: string, outcome: string) => void;

  addThoughtRecord: (areaId?: string) => void;
  updateThoughtRecord: (recordId: string, changes: Partial<ThoughtRecord>) => void;
  removeThoughtRecord: (recordId: string) => void;

  addProblemSolving: (areaId?: string) => void;
  updateProblemSolving: (
    recordId: string,
    changes: Partial<ProblemSolving>,
  ) => void;
  removeProblemSolving: (recordId: string) => void;
  addProblemSolvingOption: (recordId: string, text: string) => void;
  updateProblemSolvingOption: (
    recordId: string,
    optionId: string,
    changes: Partial<SolutionOption>,
  ) => void;
  removeProblemSolvingOption: (recordId: string, optionId: string) => void;
  addProblemSolvingStep: (recordId: string, text: string) => void;
  toggleProblemSolvingStep: (recordId: string, stepId: string) => void;
  removeProblemSolvingStep: (recordId: string, stepId: string) => void;
}

function toSnapshotAreas(areas: LifeArea[]): SnapshotArea[] {
  return areas.map(area => ({
    id: area.id,
    name: area.name,
    importance: area.importance,
    satisfaction: area.satisfaction,
  }));
}

export const useLifeCompassStore = create<LifeCompassState>()(
  persist(
    set => ({
      lifeAreas: [],
      history: [],
      goals: [],
      behavioralExperiments: [],
      thoughtRecords: [],
      problemSolvings: [],

      addArea: area =>
        set(state => ({ lifeAreas: [...state.lifeAreas, area] })),

      updateArea: (id, changes) =>
        set(state => ({
          lifeAreas: state.lifeAreas.map(area =>
            area.id === id ? { ...area, ...changes, id: area.id } : area,
          ),
        })),

      removeArea: id =>
        set(state => ({
          lifeAreas: state.lifeAreas.filter(area => area.id !== id),
          // Cascade-delete: a goal must never dangle against a deleted area.
          goals: state.goals.filter(goal => goal.areaId !== id),
          // Same for experiments that opted into this area.
          behavioralExperiments: state.behavioralExperiments.filter(
            exp => exp.areaId !== id,
          ),
          thoughtRecords: state.thoughtRecords.filter(rec => rec.areaId !== id),
          problemSolvings: state.problemSolvings.filter(
            rec => rec.areaId !== id,
          ),
        })),

      reorderAreas: (fromIndex, toIndex) =>
        set(state => {
          const areas = [...state.lifeAreas];
          if (
            fromIndex < 0 ||
            fromIndex >= areas.length ||
            toIndex < 0 ||
            toIndex >= areas.length
          ) {
            return {};
          }
          const [moved] = areas.splice(fromIndex, 1);
          areas.splice(toIndex, 0, moved);
          return { lifeAreas: areas };
        }),

      removeAllAreas: () =>
        set({
          lifeAreas: [],
          goals: [],
          behavioralExperiments: [],
          thoughtRecords: [],
          problemSolvings: [],
        }),

      importDocument: doc =>
        set({
          lifeAreas: doc.lifeAreas ?? [],
          history: doc.history ?? [],
          goals: doc.goals ?? [],
          behavioralExperiments: doc.behavioralExperiments ?? [],
          thoughtRecords: doc.thoughtRecords ?? [],
          problemSolvings: doc.problemSolvings ?? [],
        }),

      saveSnapshot: label =>
        set(state => {
          const snapshot: Snapshot = {
            id: crypto.randomUUID(),
            createdAt: new Date().toISOString(),
            areas: toSnapshotAreas(state.lifeAreas),
          };
          if (label !== undefined) {
            snapshot.label = label;
          }
          return { history: [...state.history, snapshot] };
        }),

      deleteSnapshot: id =>
        set(state => ({
          history: state.history.filter(snapshot => snapshot.id !== id),
        })),

      addGoal: (areaId, title) =>
        set(state => {
          const trimmed = title.trim();
          if (trimmed === '') {
            return {};
          }
          const goal: Goal = {
            id: crypto.randomUUID(),
            areaId,
            title: trimmed,
            steps: [],
            createdAt: new Date().toISOString(),
          };
          return { goals: [...state.goals, goal] };
        }),

      updateGoal: (goalId, changes) =>
        set(state => ({
          goals: state.goals.map(goal =>
            goal.id === goalId
              ? { ...goal, ...changes, id: goal.id }
              : goal,
          ),
        })),

      removeGoal: goalId =>
        set(state => ({
          goals: state.goals.filter(goal => goal.id !== goalId),
        })),

      addStep: (goalId, text) =>
        set(state => {
          const trimmed = text.trim();
          if (trimmed === '') {
            return {};
          }
          const step: ActionStep = {
            id: crypto.randomUUID(),
            text: trimmed,
            done: false,
          };
          return {
            goals: state.goals.map(goal =>
              goal.id === goalId
                ? { ...goal, steps: [...goal.steps, step] }
                : goal,
            ),
          };
        }),

      updateStep: (goalId, stepId, changes) =>
        set(state => ({
          goals: state.goals.map(goal =>
            goal.id === goalId
              ? {
                  ...goal,
                  steps: goal.steps.map(step =>
                    step.id === stepId
                      ? { ...step, ...changes, id: step.id }
                      : step,
                  ),
                }
              : goal,
          ),
        })),

      toggleStep: (goalId, stepId) =>
        set(state => ({
          goals: state.goals.map(goal =>
            goal.id === goalId
              ? {
                  ...goal,
                  steps: goal.steps.map(step =>
                    step.id === stepId
                      ? { ...step, done: !step.done }
                      : step,
                  ),
                }
              : goal,
          ),
        })),

      removeStep: (goalId, stepId) =>
        set(state => ({
          goals: state.goals.map(goal =>
            goal.id === goalId
              ? {
                  ...goal,
                  steps: goal.steps.filter(step => step.id !== stepId),
                }
              : goal,
          ),
        })),

      addExperiment: (title, areaId) =>
        set(state => {
          const trimmed = title.trim();
          if (trimmed === '') {
            return {};
          }
          const experiment: BehavioralExperiment = {
            id: crypto.randomUUID(),
            title: trimmed,
            steps: [],
            outcome: '',
            createdAt: new Date().toISOString(),
            ...(areaId ? { areaId } : {}),
          };
          return {
            behavioralExperiments: [...state.behavioralExperiments, experiment],
          };
        }),

      updateExperiment: (experimentId, changes) =>
        set(state => ({
          behavioralExperiments: state.behavioralExperiments.map(exp =>
            exp.id === experimentId ? { ...exp, ...changes, id: exp.id } : exp,
          ),
        })),

      removeExperiment: experimentId =>
        set(state => ({
          behavioralExperiments: state.behavioralExperiments.filter(
            exp => exp.id !== experimentId,
          ),
        })),

      addExperimentStep: (experimentId, text) =>
        set(state => {
          const trimmed = text.trim();
          if (trimmed === '') {
            return {};
          }
          const step: ActionStep = {
            id: crypto.randomUUID(),
            text: trimmed,
            done: false,
          };
          return {
            behavioralExperiments: state.behavioralExperiments.map(exp =>
              exp.id === experimentId
                ? { ...exp, steps: [...exp.steps, step] }
                : exp,
            ),
          };
        }),

      updateExperimentStep: (experimentId, stepId, changes) =>
        set(state => ({
          behavioralExperiments: state.behavioralExperiments.map(exp =>
            exp.id === experimentId
              ? {
                  ...exp,
                  steps: exp.steps.map(step =>
                    step.id === stepId
                      ? { ...step, ...changes, id: step.id }
                      : step,
                  ),
                }
              : exp,
          ),
        })),

      toggleExperimentStep: (experimentId, stepId) =>
        set(state => ({
          behavioralExperiments: state.behavioralExperiments.map(exp =>
            exp.id === experimentId
              ? {
                  ...exp,
                  steps: exp.steps.map(step =>
                    step.id === stepId ? { ...step, done: !step.done } : step,
                  ),
                }
              : exp,
          ),
        })),

      removeExperimentStep: (experimentId, stepId) =>
        set(state => ({
          behavioralExperiments: state.behavioralExperiments.map(exp =>
            exp.id === experimentId
              ? {
                  ...exp,
                  steps: exp.steps.filter(step => step.id !== stepId),
                }
              : exp,
          ),
        })),

      setExperimentOutcome: (experimentId, outcome) =>
        set(state => ({
          behavioralExperiments: state.behavioralExperiments.map(exp =>
            exp.id === experimentId ? { ...exp, outcome: outcome.trim() } : exp,
          ),
        })),

      addThoughtRecord: areaId =>
        set(state => {
          const record: ThoughtRecord = {
            id: crypto.randomUUID(),
            situation: '',
            thought: '',
            feeling: '',
            supports: '',
            widerView: '',
            kinderView: '',
            createdAt: new Date().toISOString(),
            ...(areaId ? { areaId } : {}),
          };
          return { thoughtRecords: [...state.thoughtRecords, record] };
        }),

      updateThoughtRecord: (recordId, changes) =>
        set(state => ({
          thoughtRecords: state.thoughtRecords.map(rec =>
            rec.id === recordId ? { ...rec, ...changes, id: rec.id } : rec,
          ),
        })),

      removeThoughtRecord: recordId =>
        set(state => ({
          thoughtRecords: state.thoughtRecords.filter(rec => rec.id !== recordId),
        })),

      addProblemSolving: areaId =>
        set(state => {
          const record: ProblemSolving = {
            id: crypto.randomUUID(),
            problem: '',
            options: [],
            steps: [],
            outcome: '',
            createdAt: new Date().toISOString(),
            ...(areaId ? { areaId } : {}),
          };
          return { problemSolvings: [...state.problemSolvings, record] };
        }),

      updateProblemSolving: (recordId, changes) =>
        set(state => ({
          problemSolvings: state.problemSolvings.map(rec =>
            rec.id === recordId ? { ...rec, ...changes, id: rec.id } : rec,
          ),
        })),

      removeProblemSolving: recordId =>
        set(state => ({
          problemSolvings: state.problemSolvings.filter(
            rec => rec.id !== recordId,
          ),
        })),

      addProblemSolvingOption: (recordId, text) =>
        set(state => {
          const trimmed = text.trim();
          if (trimmed === '') {
            return {};
          }
          const option: SolutionOption = {
            id: crypto.randomUUID(),
            text: trimmed,
            pros: '',
            cons: '',
          };
          return {
            problemSolvings: state.problemSolvings.map(rec =>
              rec.id === recordId
                ? { ...rec, options: [...rec.options, option] }
                : rec,
            ),
          };
        }),

      updateProblemSolvingOption: (recordId, optionId, changes) =>
        set(state => ({
          problemSolvings: state.problemSolvings.map(rec =>
            rec.id === recordId
              ? {
                  ...rec,
                  options: rec.options.map(opt =>
                    opt.id === optionId
                      ? { ...opt, ...changes, id: opt.id }
                      : opt,
                  ),
                }
              : rec,
          ),
        })),

      removeProblemSolvingOption: (recordId, optionId) =>
        set(state => ({
          problemSolvings: state.problemSolvings.map(rec =>
            rec.id === recordId
              ? {
                  ...rec,
                  options: rec.options.filter(opt => opt.id !== optionId),
                  // Never let chosenOptionId dangle against a deleted option.
                  chosenOptionId:
                    rec.chosenOptionId === optionId
                      ? undefined
                      : rec.chosenOptionId,
                }
              : rec,
          ),
        })),

      addProblemSolvingStep: (recordId, text) =>
        set(state => {
          const trimmed = text.trim();
          if (trimmed === '') {
            return {};
          }
          const step: ActionStep = {
            id: crypto.randomUUID(),
            text: trimmed,
            done: false,
          };
          return {
            problemSolvings: state.problemSolvings.map(rec =>
              rec.id === recordId
                ? { ...rec, steps: [...rec.steps, step] }
                : rec,
            ),
          };
        }),

      toggleProblemSolvingStep: (recordId, stepId) =>
        set(state => ({
          problemSolvings: state.problemSolvings.map(rec =>
            rec.id === recordId
              ? {
                  ...rec,
                  steps: rec.steps.map(step =>
                    step.id === stepId
                      ? { ...step, done: !step.done }
                      : step,
                  ),
                }
              : rec,
          ),
        })),

      removeProblemSolvingStep: (recordId, stepId) =>
        set(state => ({
          problemSolvings: state.problemSolvings.map(rec =>
            rec.id === recordId
              ? {
                  ...rec,
                  steps: rec.steps.filter(step => step.id !== stepId),
                }
              : rec,
          ),
        })),
    }),
    {
      name: STORE_KEY,
      version: PERSIST_VERSION,

      // Only `lifeAreas`, `history`, `goals`, `behavioralExperiments`,
      // `thoughtRecords`, and `problemSolvings` are persisted; actions are recreated.
      partialize: state => ({
        lifeAreas: state.lifeAreas,
        history: state.history,
        goals: state.goals,
        behavioralExperiments: state.behavioralExperiments,
        thoughtRecords: state.thoughtRecords,
        problemSolvings: state.problemSolvings,
      }),

      // Owns schema evolution of the persisted document. Add branches as
      // PERSIST_VERSION grows.
      migrate: (persistedState, version) => {
        const state = persistedState as Partial<
          Pick<
            LifeCompassState,
            | 'lifeAreas'
            | 'history'
            | 'goals'
            | 'behavioralExperiments'
            | 'thoughtRecords'
            | 'problemSolvings'
          >
        >;
        // v0 -> v1: goals did not exist; seed an empty array.
        if (version < 1) {
          return {
            ...state,
            goals: state.goals ?? [],
            behavioralExperiments: state.behavioralExperiments ?? [],
          } as Pick<
            LifeCompassState,
            | 'lifeAreas'
            | 'history'
            | 'goals'
            | 'behavioralExperiments'
            | 'thoughtRecords'
            | 'problemSolvings'
          >;
        }
        // v1 -> v2: behavioralExperiments did not exist; seed an empty array.
        if (version < 2) {
          return {
            ...state,
            behavioralExperiments: state.behavioralExperiments ?? [],
          } as Pick<
            LifeCompassState,
            | 'lifeAreas'
            | 'history'
            | 'goals'
            | 'behavioralExperiments'
            | 'thoughtRecords'
            | 'problemSolvings'
          >;
        }
        // v2 -> v3: thoughtRecords did not exist; seed an empty array.
        if (version < 3) {
          return {
            ...state,
            thoughtRecords: state.thoughtRecords ?? [],
          } as Pick<
            LifeCompassState,
            | 'lifeAreas'
            | 'history'
            | 'goals'
            | 'behavioralExperiments'
            | 'thoughtRecords'
            | 'problemSolvings'
          >;
        }
        // v3 -> v4: problemSolvings did not exist; seed an empty array.
        if (version < 4) {
          return {
            ...state,
            problemSolvings: state.problemSolvings ?? [],
          } as Pick<
            LifeCompassState,
            | 'lifeAreas'
            | 'history'
            | 'goals'
            | 'behavioralExperiments'
            | 'thoughtRecords'
            | 'problemSolvings'
          >;
        }
        return state as Pick<
          LifeCompassState,
          | 'lifeAreas'
          | 'history'
          | 'goals'
          | 'behavioralExperiments'
          | 'thoughtRecords'
          | 'problemSolvings'
        >;
      },

      // After rehydration, seed from the legacy bare-array key if it exists and
      // the store is otherwise empty, then drop the legacy key. Guarantees
      // existing users never see an empty app.
      onRehydrateStorage: () => state => {
        if (!state) {
          return;
        }
        // Defend against any persisted shape that predates goals (or a
        // migration that returned without it).
        if (!Array.isArray(state.goals)) {
          state.goals = [];
        }
        if (!Array.isArray(state.behavioralExperiments)) {
          state.behavioralExperiments = [];
        }
        if (!Array.isArray(state.thoughtRecords)) {
          state.thoughtRecords = [];
        }
        if (!Array.isArray(state.problemSolvings)) {
          state.problemSolvings = [];
        }
        const seeded = migrateLegacyData();
        if (seeded && state.lifeAreas.length === 0) {
          state.lifeAreas = seeded.lifeAreas;
          if (state.history.length === 0) {
            state.history = seeded.history;
          }
        }
        // Only drop the legacy key once we have either applied its data or
        // confirmed the store already holds newer data. Never before.
        clearLegacyData();
      },
    },
  ),
);

export { CURRENT_SCHEMA_VERSION };
