import * as RadixPopover from '@radix-ui/react-popover';
import { cn } from '@/lib/utils';
import { XMarkIcon } from '@heroicons/react/20/solid';
import React from 'react';

interface PopoverProps {
  trigger: React.ReactNode;
  children: React.ReactNode;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  modal?: boolean;
  
  // Content positioning
  align?: 'start' | 'center' | 'end';
  side?: 'top' | 'right' | 'bottom' | 'left';
  sideOffset?: number;
  alignOffset?: number;
  avoidCollisions?: boolean;
  collisionBoundary?: Element | null | Array<Element | null>;
  collisionPadding?: number | Partial<Record<'top' | 'right' | 'bottom' | 'left', number>>;
  arrowPadding?: number;
  sticky?: 'partial' | 'always';
  hideWhenDetached?: boolean;
  
  // Styling
  className?: string;
  contentClassName?: string;
  arrowClassName?: string;
  closeButton?: boolean;
  
  // Animation
  forceMount?: boolean;
}

const Popover: React.FC<PopoverProps> = ({
  trigger,
  children,
  open,
  defaultOpen,
  onOpenChange,
  modal,
  
  // Content positioning
  align = 'center',
  side = 'top',
  sideOffset = 8,
  alignOffset,
  avoidCollisions = true,
  collisionBoundary,
  collisionPadding,
  arrowPadding,
  sticky = 'partial',
  hideWhenDetached,
  
  // Styling
  className,
  contentClassName,
  arrowClassName,
  closeButton = false,
  
  // Animation
  forceMount,
}) => {
  return (
    <RadixPopover.Root 
      open={open}
      defaultOpen={defaultOpen}
      onOpenChange={onOpenChange}
      modal={modal}
    >
      <RadixPopover.Trigger asChild className={className}>
        {trigger}
      </RadixPopover.Trigger>
      <RadixPopover.Portal forceMount={forceMount}>
        <RadixPopover.Content
          align={align}
          side={side}
          sideOffset={sideOffset}
          alignOffset={alignOffset}
          avoidCollisions={avoidCollisions}
          collisionBoundary={collisionBoundary}
          collisionPadding={collisionPadding}
          arrowPadding={arrowPadding}
          sticky={sticky}
          hideWhenDetached={hideWhenDetached}
          className={cn(
            'z-[9999] w-[200px] max-w-[320px] max-h-[80vh] overflow-y-auto rounded-md border border-[var(--border)] bg-[var(--color-bg)] p-4 text-[var(--color-text)] shadow-lg focus:outline-none',
            contentClassName,
          )}
        >
          {closeButton && (
            <RadixPopover.Close asChild>
              <button
                className="absolute top-2 right-2 rounded-sm text-[var(--color-text)] hover:text-[var(--color-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--focus-ring)]"
                aria-label="Close"
              >
                <XMarkIcon className="h-4 w-4" />
              </button>
            </RadixPopover.Close>
          )}
          {children}
          <RadixPopover.Arrow className={cn("fill-[var(--border)]", arrowClassName)} />
        </RadixPopover.Content>
      </RadixPopover.Portal>
    </RadixPopover.Root>
  );
};

export default Popover;
