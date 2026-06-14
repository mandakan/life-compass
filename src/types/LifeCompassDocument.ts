import { LifeArea } from './LifeArea';

/**
 * A denormalized copy of a single life area's name and ratings at the moment a
 * snapshot was taken. Stored independently of the live LifeArea so that history
 * stays truthful after an area is renamed or deleted.
 */
export interface SnapshotArea {
  id: string; // links back to a LifeArea
  name: string; // denormalized on purpose
  importance: number;
  satisfaction: number;
}

/**
 * A dated, frozen copy of the life areas at a point in time. This is the unit
 * of "progress over time" history.
 */
export interface Snapshot {
  id: string;
  createdAt: string; // ISO 8601
  label?: string; // optional user note, e.g. "after summer"
  areas: SnapshotArea[];
}

/**
 * A single checkable action step belonging to a goal. Step completion is the
 * sole source of truth for goal progress; progress is never stored.
 */
export interface ActionStep {
  id: string;
  text: string;
  done: boolean;
}

/**
 * A goal attached to a life area via `areaId`. Goals live as a top-level array
 * on the document (not nested in LifeArea) so they stay independently queryable
 * and keep LifeArea unchanged.
 */
export interface Goal {
  id: string;
  areaId: string; // -> LifeArea.id
  title: string;
  steps: ActionStep[];
  createdAt: string; // ISO 8601
}

/**
 * The single persisted document. Versioned so the schema can evolve via the
 * store's persist `migrate` hook.
 */
export interface LifeCompassDocument {
  schemaVersion: 2;
  lifeAreas: LifeArea[];
  history: Snapshot[];
  goals: Goal[];
}

export const CURRENT_SCHEMA_VERSION = 2 as const;
