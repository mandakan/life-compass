import * as TooltipPrimitive from '@radix-ui/react-tooltip';
import React from 'react';

interface TooltipProps {
  children: React.ReactNode;
  content: React.ReactNode;
  side?: 'top' | 'right' | 'bottom' | 'left';
  align?: 'start' | 'center' | 'end';
  sideOffset?: number;
  delayDuration?: number;
}

const Tooltip: React.FC<TooltipProps> = ({
  children,
  content,
  side = 'top',
  align = 'center',
  sideOffset = 5,
  delayDuration = 300,
}) => {
  return (
    <TooltipPrimitive.Provider delayDuration={delayDuration}>
      <TooltipPrimitive.Root>
        <TooltipPrimitive.Trigger asChild>{children}</TooltipPrimitive.Trigger>
        <TooltipPrimitive.Portal>
          <TooltipPrimitive.Content
            className="animate-fadeIn z-[9999] max-w-[200px] rounded-[4px] border border-primary bg-surface p-[0.5rem] text-sm font-medium text-text shadow-lg transition-opacity duration-300"
            side={side}
            align={align}
            sideOffset={sideOffset}
            data-testid="tooltip-content"
          >
            {content}
            <TooltipPrimitive.Arrow
              className="fill-primary"
              width={10}
              height={5}
            />
          </TooltipPrimitive.Content>
        </TooltipPrimitive.Portal>
      </TooltipPrimitive.Root>
    </TooltipPrimitive.Provider>
  );
};

export default Tooltip;
