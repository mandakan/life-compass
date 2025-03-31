import * as TooltipPrimitive from '@radix-ui/react-tooltip';
import React from 'react';
import { tooltip, transitions, borderRadius, spacing } from '../designTokens';

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
  delayDuration = 300
}) => {
  return (
    <TooltipPrimitive.Provider delayDuration={delayDuration}>
      <TooltipPrimitive.Root>
        <TooltipPrimitive.Trigger asChild>
          {children}
        </TooltipPrimitive.Trigger>
        <TooltipPrimitive.Portal>
          <TooltipPrimitive.Content
            className={`
              max-w-[${tooltip.width}] 
              rounded-[${borderRadius.small}] 
              bg-[${tooltip.background}] 
              p-[${spacing.small}] 
              text-[${tooltip.color}] 
              shadow-lg 
              border border-[var(--color-primary)] 
              text-sm
              font-medium
              z-50
              animate-fadeIn
              transition-opacity
              duration-[${transitions.medium}]
            `}
            side={side}
            align={align}
            sideOffset={sideOffset}
          >
            {content}
            <TooltipPrimitive.Arrow 
              className="fill-[var(--color-primary)]" 
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
