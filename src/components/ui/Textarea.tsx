import React from 'react';
import { cn } from '@/lib/utils';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        ref={ref}
        className={cn(
          'min-h-[60px] w-full rounded-sm border border-[var(--border)] bg-transparent px-2 py-1 text-sm text-[var(--color-text)] placeholder:text-[var(--muted-text)] shadow-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:ring-offset-2',
          className,
        )}
        {...props}
      />
    );
  },
);
Textarea.displayName = 'Textarea';

export default Textarea;