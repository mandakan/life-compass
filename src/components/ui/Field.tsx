import React from 'react';
import { cn } from '@/lib/utils';

export interface FieldProps {
  /** Visible label text. */
  label: React.ReactNode;
  /** The control. Receives `id`, `aria-describedby` and `aria-invalid`. */
  children: React.ReactElement;
  /** Optional helper text shown under the label. */
  description?: React.ReactNode;
  /** Error message; when present the control is marked `aria-invalid`. */
  error?: React.ReactNode;
  /** Marks the field as required (adds a visual asterisk). */
  required?: boolean;
  /**
   * Id for the control. Auto-generated if omitted so the label `htmlFor`,
   * `aria-describedby` and the control stay wired together.
   */
  htmlFor?: string;
  className?: string;
  /** Visually hide the label while keeping it available to screen readers. */
  hideLabel?: boolean;
}

/**
 * Accessible label + description + error wrapper. Clones the single child
 * control and injects `id`, `aria-describedby` (description and/or error) and
 * `aria-invalid` so the relationships are correct without per-call-site wiring.
 */
const Field: React.FC<FieldProps> = ({
  label,
  children,
  description,
  error,
  required,
  htmlFor,
  className,
  hideLabel,
}) => {
  const generatedId = React.useId();
  const fieldId = htmlFor ?? generatedId;
  const descriptionId = description ? `${fieldId}-description` : undefined;
  const errorId = error ? `${fieldId}-error` : undefined;

  const describedBy =
    [descriptionId, errorId].filter(Boolean).join(' ') || undefined;

  const child = children as React.ReactElement<{
    id?: string;
    'aria-describedby'?: string;
    'aria-invalid'?: boolean | 'true' | 'false';
  }>;

  const control = React.cloneElement(child, {
    id: child.props.id ?? fieldId,
    'aria-describedby':
      [child.props['aria-describedby'], describedBy]
        .filter(Boolean)
        .join(' ') || undefined,
    'aria-invalid': error ? true : child.props['aria-invalid'],
  });

  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      <label
        htmlFor={fieldId}
        className={cn('text-text text-sm font-medium', hideLabel && 'sr-only')}
      >
        {label}
        {required && (
          <span aria-hidden="true" className="text-danger ml-0.5">
            *
          </span>
        )}
      </label>

      {description && (
        <p id={descriptionId} className="text-text-muted text-sm">
          {description}
        </p>
      )}

      {control}

      {error && (
        <p id={errorId} role="alert" className="text-danger text-sm">
          {error}
        </p>
      )}
    </div>
  );
};

export default Field;
