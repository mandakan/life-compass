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
  collisionPadding?:
    | number
    | Partial<Record<'top' | 'right' | 'bottom' | 'left', number>>;
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
            'border-border bg-surface text-text shadow-warm-md z-[9999] max-h-[80vh] w-[200px] max-w-[90vw] overflow-y-auto rounded-lg border p-4 focus:outline-none sm:w-[280px] md:w-[350px]',
            contentClassName,
          )}
        >
          {closeButton && (
            <RadixPopover.Close asChild>
              <button
                className="text-text duration-base ease-out-soft hover:text-primary focus-visible:outline-focus absolute top-2 right-2 inline-flex min-h-[44px] min-w-[44px] cursor-pointer items-center justify-center rounded-md transition-colors focus-visible:outline-2 focus-visible:outline-offset-2"
                aria-label="Close"
              >
                <XMarkIcon className="h-4 w-4" />
              </button>
            </RadixPopover.Close>
          )}
          {children}
          <RadixPopover.Arrow className={cn('fill-border', arrowClassName)} />
        </RadixPopover.Content>
      </RadixPopover.Portal>
    </RadixPopover.Root>
  );
};

export default Popover;
