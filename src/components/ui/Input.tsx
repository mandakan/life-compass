// components/ui/Input.tsx
import * as React from 'react';
import { cn } from '@/lib/utils';

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={cn(
          'placeholder:text-muted-foreground w-full rounded border border-[var(--border)] bg-[var(--input-bg)] px-3 py-2 text-sm text-[var(--color-text)] shadow-sm focus:ring-2 focus:ring-[var(--color-primary)] focus:outline-none',
          className,
        )}
        {...props}
      />
    );
  },
);

Input.displayName = 'Input';

export default Input;
