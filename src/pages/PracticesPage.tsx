import React, { Suspense } from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { TOOLS } from '@/practices';
import ToolCard from '@components/practices/ToolCard';
import ToolShell from '@components/practices/ToolShell';

/**
 * The Practices shelf. With no :toolId it lists TOOLS as cards. With a matching
 * :toolId it renders that tool inside ToolShell. The compass at "/" remains the
 * home view; this is a separate, deliberately-visited space.
 */
const PracticesPage: React.FC = () => {
  const { t } = useTranslation();
  const { toolId } = useParams<{ toolId?: string }>();

  const active = toolId ? TOOLS.find(tool => tool.id === toolId) : undefined;

  if (active) {
    const Tool = active.component;
    return (
      <ToolShell
        titleKey={active.labelKey}
        descriptionKey={active.descriptionKey}
      >
        <Suspense fallback={null}>
          <Tool />
        </Suspense>
      </ToolShell>
    );
  }

  return (
    <section className="mx-auto w-full max-w-2xl px-4 py-8">
      <h1 className="font-display text-2xl text-text">
        {t('practices.heading')}
      </h1>
      <p className="mt-2 text-text-muted">{t('practices.intro')}</p>

      {TOOLS.length === 0 ? (
        <p className="mt-6 rounded-lg border border-dashed border-border bg-surface-sunken px-4 py-6 text-center text-sm text-text-muted">
          {t('practices.empty')}
        </p>
      ) : (
        <ul className="mt-6 flex flex-col gap-3">
          {TOOLS.map(tool => (
            <li key={tool.id}>
              <ToolCard tool={tool} />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
};

export default PracticesPage;
