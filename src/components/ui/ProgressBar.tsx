import React from 'react';
import { cn } from '@/lib/utils';

export interface ProgressBarProps {
  value: number;
  max: number;
  /** Accessible label describing what the progress represents. */
  label?: string;
  className?: string;
}

/**
 * Small accessible progress bar. Exposes ARIA progressbar semantics and renders
 * a filled track using existing tokens. `max` of 0 reads as an empty bar.
 */
const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  max,
  label,
  className,
}) => {
  const safeMax = max > 0 ? max : 0;
  const clamped = safeMax === 0 ? 0 : Math.min(Math.max(value, 0), safeMax);
  const pct = safeMax === 0 ? 0 : (clamped / safeMax) * 100;

  return (
    <div
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={safeMax}
      aria-valuenow={clamped}
      aria-label={label}
      className={cn(
        'h-2 w-full overflow-hidden rounded-full bg-surface-sunken',
        className,
      )}
    >
      <div
        className="h-full rounded-full bg-primary transition-[width] duration-base ease-out-soft"
        style={{ width: `${pct}%` }}
      />
    </div>
  );
};

export default ProgressBar;
