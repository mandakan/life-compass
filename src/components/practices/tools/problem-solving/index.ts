import { lazy } from 'react';
import { PuzzlePieceIcon } from '@heroicons/react/24/outline';
import { TOOLS, type ToolDef } from '@/practices/toolRegistry';

const problemSolvingTool: ToolDef = {
  id: 'problem-solving',
  labelKey: 'practices.tools.problem_solving.label',
  descriptionKey: 'practices.tools.problem_solving.description',
  icon: PuzzlePieceIcon,
  attachesToArea: true,
  component: lazy(() => import('./ProblemSolving')),
};

TOOLS.push(problemSolvingTool);
