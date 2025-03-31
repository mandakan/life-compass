import * as TooltipPrimitive from '@radix-ui/react-tooltip';
import React from 'react';

interface TooltipProps {
  children: React.ReactNode;
  content: React.ReactNode;
}

const Tooltip: React.FC<TooltipProps> = ({ children, content }) => {
  return (
    <TooltipPrimitive.Provider>
      <TooltipPrimitive.Root>
        <TooltipPrimitive.Trigger asChild>
          {children}
        </TooltipPrimitive.Trigger>
        <TooltipPrimitive.Portal>
          <TooltipPrimitive.Content
            className="rounded bg-[var(--callout-bg)] p-3 text-[var(--color-text)] shadow-lg border-2 border-[var(--border)]"
            side="top"
            align="center"
            sideOffset={5}
          >
            {content}
            <TooltipPrimitive.Arrow className="fill-[var(--callout-bg)] stroke-[var(--border)]" />
          </TooltipPrimitive.Content>
        </TooltipPrimitive.Portal>
      </TooltipPrimitive.Root>
    </TooltipPrimitive.Provider>
  );
};

export default Tooltip;
