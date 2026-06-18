import { lazy } from 'react';
import { CalendarDaysIcon } from '@heroicons/react/24/outline';
import { TOOLS, type ToolDef } from '@/practices/toolRegistry';

const behavioralActivationTool: ToolDef = {
  id: 'behavioral-activation',
  labelKey: 'practices.tools.behavioral_activation.label',
  descriptionKey: 'practices.tools.behavioral_activation.description',
  icon: CalendarDaysIcon,
  attachesToArea: true,
  component: lazy(() => import('./BehavioralActivation')),
};

TOOLS.push(behavioralActivationTool);
