import React from 'react';
import { cn } from '@/lib/utils';
import type { ButtonVariant, ButtonSize } from './Button';

interface LinkButtonProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    'bg-primary text-on-primary border border-transparent hover:opacity-90',
  secondary:
    'bg-surface text-text border border-border hover:bg-surface-sunken',
  ghost:
    'bg-transparent text-text border border-transparent hover:bg-surface-sunken',
  danger:
    'bg-danger text-on-primary border border-transparent hover:opacity-90',
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'min-h-[36px] px-3 py-1.5 text-sm',
  md: 'min-h-[44px] px-4 py-2 text-base',
  lg: 'min-h-[52px] px-6 py-3 text-lg',
};

const LinkButton: React.FC<LinkButtonProps> = ({
  variant = 'primary',
  size = 'md',
  className,
  children,
  ...props
}) => {
  return (
    <a
      className={cn(
        'inline-flex cursor-pointer items-center justify-center rounded-md font-medium no-underline',
        'duration-base ease-out-soft transition-[background-color,color,opacity]',
        'focus-visible:outline-focus focus-visible:outline-2 focus-visible:outline-offset-2',
        variantClasses[variant],
        sizeClasses[size],
        className,
      )}
      {...props}
    >
      {children}
    </a>
  );
};

export default LinkButton;
