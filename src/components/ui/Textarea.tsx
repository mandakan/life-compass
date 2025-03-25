import React from 'react';
import { cn } from '@/lib/utils';

interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  className?: string;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        ref={ref}
        className={cn(
          'h-full min-h-[60px] w-full rounded-sm border border-[var(--border)] bg-transparent px-2 py-1 text-[var(--color-text)] shadow-sm placeholder:text-[var(--muted-text)] focus:ring-2 focus:ring-[var(--color-primary)] focus:ring-offset-2 focus:outline-none text-sm',
          className,
        )}
        {...props}
      />
    );
  },
);
Textarea.displayName = 'Textarea';

export default Textarea;
