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
      className="border-border bg-surface shadow-warm-sm duration-base ease-out-soft hover:bg-surface-sunken focus-visible:outline-focus flex items-start gap-3 rounded-xl border p-4 transition-[background-color,box-shadow] focus-visible:outline-2 focus-visible:outline-offset-2"
    >
      {Icon && (
        <span className="text-text-muted mt-0.5 flex-none">
          <Icon className="size-6" />
        </span>
      )}
      <span className="min-w-0">
        <span className="text-text block font-medium">{t(tool.labelKey)}</span>
        <span className="text-text-muted mt-1 block text-sm">
          {t(tool.descriptionKey)}
        </span>
      </span>
    </Link>
  );
};

export default ToolCard;
