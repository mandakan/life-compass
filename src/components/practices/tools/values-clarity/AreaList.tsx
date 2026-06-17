import React from 'react';
import { LifeArea } from '@models/LifeArea';

export interface AreaListProps {
  areas: LifeArea[];
  /** A short, already-translated word or phrase shown quietly beside each area. */
  noteFor: (area: LifeArea) => string;
}

/**
 * A calm read-only list of life areas, each with a quiet note beside it. The
 * Clarity session reuses this for "what matters", "how it's lived", and "where
 * the gap is" -- only the note changes. No scores, no bars, just words.
 */
const AreaList: React.FC<AreaListProps> = ({ areas, noteFor }) => (
  <ul className="flex flex-col gap-2">
    {areas.map(area => (
      <li
        key={area.id}
        className="border-border bg-surface flex min-w-0 items-center justify-between gap-3 rounded-lg border px-4 py-3"
      >
        <span className="text-text min-w-0 truncate">{area.name}</span>
        <span className="text-text-muted shrink-0 text-sm">
          {noteFor(area)}
        </span>
      </li>
    ))}
  </ul>
);

export default AreaList;
