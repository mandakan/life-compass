import React from 'react';

export type ScaleAccent = 'clay' | 'sage';

export interface ScaleChooserProps {
  /** The five word labels, lowest to highest. */
  labels: string[];
  /** The currently selected bucket (1-5), or null/0 when nothing is chosen. */
  value: number | null;
  /** Called with the tapped bucket (1-5). */
  onChange: (n: number) => void;
  /** Pill tint: clay (primary) for "matters", sage (secondary) for "lived". */
  accent?: ScaleAccent;
}

// Map the accent name to its theme color variable. Used for the selected
// border and the color-mix tint -- both computed, so they stay inline.
const ACCENT_VAR: Record<ScaleAccent, string> = {
  clay: 'var(--color-primary)',
  sage: 'var(--color-secondary)',
};

/**
 * AAA-safe word-pill scale. Every pill keeps a 2px border so selecting one
 * never shifts layout. Unselected pills read as quiet surface chips; the
 * selected pill gains the accent border, a soft accent tint, dark text, and
 * heavier weight, plus aria-pressed for assistive tech.
 */
const ScaleChooser: React.FC<ScaleChooserProps> = ({
  labels,
  value,
  onChange,
  accent = 'clay',
}) => {
  const accentVar = ACCENT_VAR[accent];

  return (
    <div className="flex flex-wrap gap-2">
      {labels.map((label, i) => {
        const n = i + 1;
        const on = value === n;
        return (
          <button
            key={n}
            type="button"
            onClick={() => onChange(n)}
            aria-pressed={on}
            className="bg-surface font-body text-text duration-base ease-out-soft focus-visible:outline-focus box-border inline-flex min-h-[44px] cursor-pointer items-center rounded-full border-2 px-[15px] py-[9px] text-sm transition-[border-color,background-color] focus-visible:outline-2 focus-visible:outline-offset-2"
            style={{
              borderColor: on ? accentVar : 'var(--color-border)',
              background: on
                ? `color-mix(in srgb, ${accentVar} 14%, var(--color-surface))`
                : undefined,
              fontWeight: on ? 700 : 500,
            }}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
};

export default ScaleChooser;
