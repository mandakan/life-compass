import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { LifeArea } from '../types/LifeArea';
import {
  ActionStep,
  CURRENT_SCHEMA_VERSION,
  Goal,
  LifeCompassDocument,
  Snapshot,
  SnapshotArea,
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
export const PERSIST_VERSION = 1;

export interface LifeCompassState {
  lifeAreas: LifeArea[];
  history: Snapshot[];
  goals: Goal[];

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

      removeAllAreas: () => set({ lifeAreas: [], goals: [] }),

      importDocument: doc =>
        set({
          lifeAreas: doc.lifeAreas ?? [],
          history: doc.history ?? [],
          goals: doc.goals ?? [],
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
    }),
    {
      name: STORE_KEY,
      version: PERSIST_VERSION,

      // Only `lifeAreas`, `history`, and `goals` are persisted; actions are
      // recreated.
      partialize: state => ({
        lifeAreas: state.lifeAreas,
        history: state.history,
        goals: state.goals,
      }),

      // Owns schema evolution of the persisted document. Add branches as
      // PERSIST_VERSION grows.
      migrate: (persistedState, version) => {
        const state = persistedState as Partial<
          Pick<LifeCompassState, 'lifeAreas' | 'history' | 'goals'>
        >;
        // v0 -> v1: goals did not exist; seed an empty array so existing
        // users keep their areas/history and start with no goals.
        if (version < 1) {
          return { ...state, goals: state.goals ?? [] } as Pick<
            LifeCompassState,
            'lifeAreas' | 'history' | 'goals'
          >;
        }
        return state as Pick<
          LifeCompassState,
          'lifeAreas' | 'history' | 'goals'
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
