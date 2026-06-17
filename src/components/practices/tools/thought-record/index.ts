import { lazy } from 'react';
import { ChatBubbleLeftEllipsisIcon } from '@heroicons/react/24/outline';
import { TOOLS, type ToolDef } from '@/practices/toolRegistry';

const thoughtRecordTool: ToolDef = {
  id: 'thought-record',
  labelKey: 'practices.tools.thought_record.label',
  descriptionKey: 'practices.tools.thought_record.description',
  icon: ChatBubbleLeftEllipsisIcon,
  attachesToArea: true,
  component: lazy(() => import('./ThoughtRecord')),
};

TOOLS.push(thoughtRecordTool);
