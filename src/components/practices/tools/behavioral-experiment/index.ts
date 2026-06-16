import { lazy } from 'react';
import { BeakerIcon } from '@heroicons/react/24/outline';
import { TOOLS, type ToolDef } from '@/practices/toolRegistry';

const behavioralExperimentTool: ToolDef = {
  id: 'behavioral-experiment',
  labelKey: 'practices.tools.behavioral_experiment.label',
  descriptionKey: 'practices.tools.behavioral_experiment.description',
  icon: BeakerIcon,
  attachesToArea: true,
  component: lazy(() => import('./BehavioralExperiment')),
};

TOOLS.push(behavioralExperimentTool);
