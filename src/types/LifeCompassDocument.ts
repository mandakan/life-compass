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
 * The single persisted document. Versioned so the schema can evolve via the
 * store's persist `migrate` hook.
 */
export interface LifeCompassDocument {
  schemaVersion: 1;
  lifeAreas: LifeArea[];
  history: Snapshot[];
}

export const CURRENT_SCHEMA_VERSION = 1 as const;
