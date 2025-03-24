import * as RadixPopover from '@radix-ui/react-popover';
import { cn } from '@/lib/utils';
import { XMarkIcon } from '@heroicons/react/20/solid';
import React from 'react';

interface PopoverProps {
  trigger: React.ReactNode;
  children: React.ReactNode;
  align?: 'start' | 'center' | 'end';
  side?: 'top' | 'right' | 'bottom' | 'left';
  className?: string;
  closeButton?: boolean;
  onOpenChange?: (open: boolean) => void;
}

const Popover: React.FC<PopoverProps> = ({
  trigger,
  children,
  align = 'center',
  side = 'top',
  className,
  closeButton = false,
  onOpenChange,
}) => {
  return (
    <RadixPopover.Root onOpenChange={onOpenChange}>
      <RadixPopover.Trigger asChild>{trigger}</RadixPopover.Trigger>
      <RadixPopover.Portal>
        <RadixPopover.Content
          align={align}
          side={side}
          sideOffset={8}
          className={cn(
            'z-50 rounded-md border border-[var(--border)] bg-[var(--color-bg)] p-4 text-[var(--color-text)] shadow-lg focus:outline-none',
            className,
          )}
        >
          {closeButton && (
            <RadixPopover.Close asChild>
              <button
                className="absolute top-2 right-2 rounded-sm text-[var(--color-text)] hover:text-[var(--color-primary)] focus:outline-none"
                aria-label="Close"
              >
                <XMarkIcon className="h-4 w-4" />
              </button>
            </RadixPopover.Close>
          )}
          {children}
          <RadixPopover.Arrow className="fill-[var(--border)]" />
        </RadixPopover.Content>
      </RadixPopover.Portal>
    </RadixPopover.Root>
  );
};

export default Popover;
