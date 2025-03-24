import React from 'react';
import clsx from 'clsx';

export type ButtonVariant = 'primary' | 'accent' | 'secondary' | 'ghost';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary: 'bg-[var(--color-primary)] text-[var(--on-primary)]',
  accent: 'bg-[var(--color-accent)] text-[var(--on-accent)]',
  secondary: 'bg-[var(--details-bg)] text-[var(--color-text)]',
  ghost: 'bg-transparent text-[var(--color-text)] hover:bg-[var(--hover-bg)]',
};

const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  className,
  children,
  ...props
}) => {
  return (
    <button
      className={clsx(
        'rounded-sm px-3 py-1 transition-colors duration-150',
        variantClasses[variant],
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
