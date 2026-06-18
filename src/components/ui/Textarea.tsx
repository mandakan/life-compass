import React from 'react';
import { cn } from '@/lib/utils';

// This Textarea allows line breaks on Enter, suitable for inline editing scenarios.
interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  className?: string;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        ref={ref}
        className={cn(
          'border-border bg-surface text-text shadow-warm-sm h-full min-h-[60px] w-full rounded-md border px-3 py-2 text-base',
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
Textarea.displayName = 'Textarea';

export default Textarea;
