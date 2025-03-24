import React from 'react';
import clsx from 'clsx';
import type { ButtonVariant } from './Button';

interface LinkButtonProps
  extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  variant?: ButtonVariant;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary: 'bg-[var(--color-primary)] text-[var(--on-primary)]',
  accent: 'bg-[var(--color-accent)] text-[var(--on-accent)]',
  secondary: 'bg-[var(--details-bg)] text-[var(--color-text)]',
  ghost: 'bg-transparent text-[var(--color-text)] hover:bg-[var(--hover-bg)]',
};

const LinkButton: React.FC<LinkButtonProps> = ({
  variant = 'primary',
  className,
  children,
  ...props
}) => {
  return (
    <a
      className={clsx(
        'inline-block cursor-pointer rounded-sm px-3 py-1 transition-colors duration-150',
        variantClasses[variant],
        className,
      )}
      {...props}
    >
      {children}
    </a>
  );
};

export default LinkButton;
