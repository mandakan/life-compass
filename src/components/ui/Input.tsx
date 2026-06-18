// components/ui/Input.tsx
import * as React from 'react';
import { cn } from '@/lib/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={cn(
          'border-border bg-surface text-text shadow-warm-sm min-h-[44px] w-full rounded-md border px-3 py-2 text-base',
          'placeholder:text-text-muted',
          'duration-base ease-out-soft transition-[border-color,box-shadow]',
          'focus-visible:border-primary focus-visible:outline-focus focus-visible:outline-2 focus-visible:outline-offset-1',
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
