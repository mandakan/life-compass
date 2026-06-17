import { lazy } from 'react';
import { MapIcon } from '@heroicons/react/24/outline';
import { TOOLS, type ToolDef } from '@/practices/toolRegistry';

const valuesClarityTool: ToolDef = {
  id: 'values-clarity',
  labelKey: 'practices.tools.values_clarity.label',
  descriptionKey: 'practices.tools.values_clarity.description',
  icon: MapIcon,
  component: lazy(() => import('./ValuesClarity')),
};

TOOLS.push(valuesClarityTool);
