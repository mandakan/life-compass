import { LifeArea } from '../types/LifeArea';
import { Snapshot } from '../types/LifeCompassDocument';

/**
 * The legacy localStorage key. Older versions of the app wrote a bare
 * `LifeArea[]` JSON array directly to this key via an inline useEffect.
 */
export const LEGACY_STORAGE_KEY = 'lifeCompass';

/**
 * The shape returned to the store when legacy data is found and migrated.
 */
export interface MigratedLegacyState {
  lifeAreas: LifeArea[];
  history: Snapshot[];
}

function isLifeAreaArray(value: unknown): value is LifeArea[] {
  return (
    Array.isArray(value) &&
    value.every(
      item =>
        item != null &&
        typeof item === 'object' &&
        typeof (item as LifeArea).id === 'string' &&
        typeof (item as LifeArea).name === 'string',
    )
  );
}

/**
 * Reads the legacy bare-array `lifeCompass` key, if present, and returns it as
 * seed state. When the key is absent, malformed, or not a life-area array,
 * `null` is returned.
 *
 * This is a pure read: it never removes the legacy key. Removal is the caller's
 * responsibility (see `clearLegacyData`) and must happen only AFTER the seed has
 * been applied, so valid data is never dropped before the store reads it.
 */
export function migrateLegacyData(): MigratedLegacyState | null {
  const raw = localStorage.getItem(LEGACY_STORAGE_KEY);
  if (raw === null) {
    return null;
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return null;
  }

  if (!isLifeAreaArray(parsed)) {
    return null;
  }

  return { lifeAreas: parsed, history: [] };
}

/**
 * Removes the legacy `lifeCompass` key. Call this only after the store has
 * applied the migrated seed (or deliberately decided to keep its newer data),
 * so the migration runs exactly once without ever discarding unread data.
 */
export function clearLegacyData(): void {
  localStorage.removeItem(LEGACY_STORAGE_KEY);
}
