// components/ui/Input.tsx
import * as React from 'react';
import { cn } from '@/lib/utils';

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={cn(
          'min-h-[44px] w-full rounded-md border border-border bg-surface px-3 py-2 text-base text-text shadow-warm-sm',
          'placeholder:text-text-muted',
          'transition-[border-color,box-shadow] duration-base ease-out-soft',
          'focus-visible:border-primary focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-focus',
          'disabled:cursor-not-allowed disabled:opacity-60',
          className,
        )}
        {...props}
      />
    );
  },
);

Input.displayName = 'Input';

export default Input;
