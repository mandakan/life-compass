import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import type { ToolDef } from '@/practices/toolRegistry';

export interface ToolCardProps {
  tool: ToolDef;
}

/**
 * A single shelf card. Quiet, inviting, no numbers. Links to the tool's own
 * route so it can be bookmarked.
 */
const ToolCard: React.FC<ToolCardProps> = ({ tool }) => {
  const { t } = useTranslation();
  const Icon = tool.icon;

  return (
    <Link
      to={`/practices/${tool.id}`}
      className="flex items-start gap-3 rounded-xl border border-border bg-surface p-4 shadow-warm-sm transition-[background-color,box-shadow] duration-base ease-out-soft hover:bg-surface-sunken focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
    >
      {Icon && (
        <span className="mt-0.5 flex-none text-text-muted">
          <Icon className="size-6" />
        </span>
      )}
      <span className="min-w-0">
        <span className="block font-medium text-text">{t(tool.labelKey)}</span>
        <span className="mt-1 block text-sm text-text-muted">
          {t(tool.descriptionKey)}
        </span>
      </span>
    </Link>
  );
};

export default ToolCard;
