import React from 'react';
import { cn } from '@/lib/utils';
import { CheckIcon } from '@heroicons/react/24/outline';

export interface CheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
  /** When true, the label is exposed only to assistive tech, not shown visually. */
  hideLabel?: boolean;
  id?: string;
  disabled?: boolean;
  className?: string;
}

/**
 * Minimal accessible checkbox. Renders a native input (visually hidden) so it
 * stays keyboard-operable and screen-reader friendly, with a styled box on top.
 * Plain styling using existing tokens; no new visual language.
 */
const Checkbox: React.FC<CheckboxProps> = ({
  checked,
  onChange,
  label,
  hideLabel,
  id,
  disabled,
  className,
}) => {
  return (
    <label
      className={cn(
        'inline-flex cursor-pointer items-center gap-2 select-none',
        disabled && 'cursor-not-allowed opacity-60',
        className,
      )}
    >
      <span className="relative inline-flex h-11 w-11 flex-none items-center justify-center">
        <input
          id={id}
          type="checkbox"
          checked={checked}
          disabled={disabled}
          aria-label={label}
          onChange={e => onChange(e.target.checked)}
          className="peer absolute inset-0 m-0 h-full w-full cursor-pointer opacity-0"
        />
        <span
          aria-hidden="true"
          className={cn(
            'border-border bg-surface text-on-primary pointer-events-none flex h-5 w-5 items-center justify-center rounded-sm border',
            'duration-base ease-out-soft transition-colors',
            'peer-focus-visible:outline-focus peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2',
            checked && 'border-primary bg-primary',
          )}
        >
          {checked && <CheckIcon className="h-4 w-4" strokeWidth={3} />}
        </span>
      </span>
      {!hideLabel && <span className="text-text text-base">{label}</span>}
    </label>
  );
};

export default Checkbox;
