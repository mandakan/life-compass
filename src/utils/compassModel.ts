import { LifeArea } from '@models/LifeArea';
import { Snapshot } from '@models/LifeCompassDocument';

// Scale adapter: store uses 1-10; UI speaks 1-5 word scales.

/** Map a 1-10 store value to a 1-5 display bucket. */
export function toBucket(v: number): number {
  return Math.min(5, Math.max(1, Math.round(v / 2)));
}

/** Map a 1-5 bucket back to a 1-10 store value. */
export function fromBucket(b: number): number {
  return b * 2;
}

/** How much this area matters (1-5 bucket of importance). */
export function matters(a: LifeArea): number {
  return toBucket(a.importance);
}

/** How well the area was lived this week (1-5 bucket of satisfaction). */
export function lived(a: LifeArea): number {
  return toBucket(a.satisfaction);
}

/**
 * The gap between what matters and how it was lived.
 * Always >= 0; zero means aligned or over-delivered.
 */
export function drift(a: LifeArea): number {
  return Math.max(0, matters(a) - lived(a));
}

/**
 * Build a weekly sparkline series for an area from snapshot history.
 *
 * For each snapshot (sorted oldest-first) that contains a SnapshotArea
 * with the same id as `a`, push the bucketed satisfaction value.
 * Always append the current lived(a) as the final data point.
 *
 * Returns [lived(a)] when no history entry matches the area.
 */
export function weeksFor(a: LifeArea, history: Snapshot[]): number[] {
  const sorted = history
    .slice()
    .sort((x, y) => x.createdAt.localeCompare(y.createdAt));

  const points: number[] = [];
  for (const snap of sorted) {
    const sa = snap.areas.find((sa) => sa.id === a.id);
    if (sa) {
      points.push(toBucket(sa.satisfaction));
    }
  }
  points.push(lived(a));
  return points;
}

/**
 * Emotional tone for an area based on how well it was lived.
 *
 * - sage: lived >= 4 (doing well)
 * - clay: lived <= 2 (struggling)
 * - muted: everything in between
 */
export function tone(a: LifeArea): 'sage' | 'clay' | 'muted' {
  const l = lived(a);
  if (l >= 4) return 'sage';
  if (l <= 2) return 'clay';
  return 'muted';
}

/**
 * True when an area is both deeply important and far from how the week felt.
 * Used to surface a gentle "be kind to yourself" note in the week view.
 */
export function isTender(a: LifeArea): boolean {
  return lived(a) <= 2 && matters(a) >= 4;
}

/**
 * Which reflection sentence to show in the area detail sheet.
 *
 * Priority order matches the spec:
 *   matters>=4 && lived<=2 -> far_off
 *   matters>=4 && lived>=4 -> close
 *   drift===0              -> aligned
 *   else                   -> small_distance
 */
export function reflectionKey(
  a: LifeArea,
): 'far_off' | 'close' | 'aligned' | 'small_distance' {
  const m = matters(a);
  const l = lived(a);
  if (m >= 4 && l <= 2) return 'far_off';
  if (m >= 4 && l >= 4) return 'close';
  if (drift(a) === 0) return 'aligned';
  return 'small_distance';
}

/**
 * Which week-delta sentence to show in the week view for this area.
 *
 * - new:     only one data point (no previous week)
 * - closer:  latest > previous
 * - same:    latest === previous
 * - further: latest < previous
 */
export function weekDeltaKey(
  a: LifeArea,
  history: Snapshot[],
): 'new' | 'closer' | 'same' | 'further' {
  const w = weeksFor(a, history);
  if (w.length < 2) return 'new';
  const prev = w.at(-2)!;
  const last = w.at(-1)!;
  if (last > prev) return 'closer';
  if (last === prev) return 'same';
  return 'further';
}

// -- i18n key helpers --

/**
 * Return the full i18n key for the lived bucket n (1-5).
 * Usage: t(LIVED_KEY(n))
 */
export function LIVED_KEY(n: number): string {
  return `your_compass.scale.lived.${n}`;
}

/**
 * Return the full i18n key for the matters bucket n (1-5).
 * Usage: t(MATTERS_KEY(n))
 */
export function MATTERS_KEY(n: number): string {
  return `your_compass.scale.matters.${n}`;
}
