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
    <details className="border-border bg-surface-sunken w-full min-w-0 rounded-lg border px-4 py-3">
      <summary className="text-text-muted cursor-pointer text-sm">
        {t('practices.crisis.trigger')}
      </summary>
      <div className="mt-2 flex flex-col gap-1">
        <p className="text-text text-sm">{t('practices.crisis.intro')}</p>
        <ul className="text-text-muted list-none text-sm">
          {(Array.isArray(resources) ? resources : []).map(line => (
            <li key={line}>{line}</li>
          ))}
        </ul>
      </div>
    </details>
  );
};

export default CrisisResources;
