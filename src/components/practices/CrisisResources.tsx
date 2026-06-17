import React from 'react';
import { useTranslation } from 'react-i18next';

/**
 * A calm, always-available crisis line for distress-surfacing tools (Thought
 * Record today; reusable by Worry Postponement etc. later). Collapsed by
 * default so it never alarms. Copy + resources come from `practices.crisis`
 * per locale. No data, no persistence.
 */
const CrisisResources: React.FC = () => {
  const { t } = useTranslation();
  const resources = t('practices.crisis.resources', {
    returnObjects: true,
  }) as string[];

  return (
    <details className="w-full min-w-0 rounded-lg border border-border bg-surface-sunken px-4 py-3">
      <summary className="cursor-pointer text-sm text-text-muted">
        {t('practices.crisis.trigger')}
      </summary>
      <div className="mt-2 flex flex-col gap-1">
        <p className="text-sm text-text">{t('practices.crisis.intro')}</p>
        <ul className="list-none text-sm text-text-muted">
          {(Array.isArray(resources) ? resources : []).map(line => (
            <li key={line}>{line}</li>
          ))}
        </ul>
      </div>
    </details>
  );
};

export default CrisisResources;
