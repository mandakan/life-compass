import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { LifeArea } from '../types/LifeArea';
import {
  CURRENT_SCHEMA_VERSION,
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
export const PERSIST_VERSION = 0;

export interface LifeCompassState {
  lifeAreas: LifeArea[];
  history: Snapshot[];

  addArea: (area: LifeArea) => void;
  updateArea: (id: string, changes: Partial<LifeArea>) => void;
  removeArea: (id: string) => void;
  reorderAreas: (fromIndex: number, toIndex: number) => void;
  removeAllAreas: () => void;
  importDocument: (doc: LifeCompassDocument) => void;
  saveSnapshot: (label?: string) => void;
  deleteSnapshot: (id: string) => void;
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

      removeAllAreas: () => set({ lifeAreas: [] }),

      importDocument: doc =>
        set({
          lifeAreas: doc.lifeAreas ?? [],
          history: doc.history ?? [],
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
    }),
    {
      name: STORE_KEY,
      version: PERSIST_VERSION,

      // Only `lifeAreas` and `history` are persisted; actions are recreated.
      partialize: state => ({
        lifeAreas: state.lifeAreas,
        history: state.history,
      }),

      // Owns schema evolution of the persisted document. Add branches as
      // PERSIST_VERSION grows.
      migrate: (persistedState, _version) => {
        return persistedState as Pick<
          LifeCompassState,
          'lifeAreas' | 'history'
        >;
      },

      // After rehydration, seed from the legacy bare-array key if it exists and
      // the store is otherwise empty, then drop the legacy key. Guarantees
      // existing users never see an empty app.
      onRehydrateStorage: () => state => {
        if (!state) {
          return;
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
