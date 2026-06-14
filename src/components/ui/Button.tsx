import React from 'react';
import { cn } from '@/lib/utils';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';

export type ButtonSize = 'sm' | 'md' | 'lg' | 'icon';

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  /** Shows a spinner and marks the button busy + disabled. */
  loading?: boolean;
}

/** Canonical token-driven variant styles. */
const variantClasses: Record<ButtonVariant, string> = {
  primary:
    'bg-primary text-on-primary border border-transparent hover:opacity-90 active:opacity-100',
  secondary:
    'bg-surface text-text border border-border hover:bg-surface-sunken',
  ghost:
    'bg-transparent text-text border border-transparent hover:bg-surface-sunken',
  danger:
    'bg-danger text-on-primary border border-transparent hover:opacity-90 active:opacity-100',
};

/** Sizes keep a >=44px touch target on md/lg; sm stays compact but tappable. */
const sizeClasses: Record<ButtonSize, string> = {
  sm: 'min-h-[36px] px-3 py-1.5 text-sm gap-1.5',
  md: 'min-h-[44px] px-4 py-2 text-base gap-2',
  lg: 'min-h-[52px] px-6 py-3 text-lg gap-2',
  // Square, padding-free target for icon/emoji-only buttons.
  icon: 'min-h-[44px] min-w-[44px] px-0 py-0 text-base',
};

const Spinner: React.FC = () => (
  <svg
    className="h-4 w-4 animate-spin"
    viewBox="0 0 24 24"
    fill="none"
    aria-hidden="true"
  >
    <circle
      className="opacity-25"
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="4"
    />
    <path
      className="opacity-90"
      fill="currentColor"
      d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
    />
  </svg>
);

const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled,
  className,
  children,
  ...props
}) => {
  const isDisabled = disabled || loading;

  return (
    <button
      disabled={isDisabled}
      aria-busy={loading || undefined}
      className={cn(
        'inline-flex cursor-pointer items-center justify-center rounded-md font-medium',
        'transition-[background-color,color,opacity,box-shadow] duration-base ease-out-soft',
        'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus',
        'disabled:cursor-not-allowed disabled:opacity-60',
        variantClasses[variant],
        sizeClasses[size],
        className,
      )}
      {...props}
    >
      {loading && <Spinner />}
      {children}
    </button>
  );
};

export default Button;
