import React from 'react';
import { cn } from '@/lib/utils';

// This Textarea allows line breaks on Enter, suitable for inline editing scenarios.
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
          'h-full min-h-[60px] w-full rounded-md border border-border bg-surface px-3 py-2 text-base text-text shadow-warm-sm',
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
Textarea.displayName = 'Textarea';

export default Textarea;
