import React from 'react';
import { useTranslation } from 'react-i18next';

const Introduction = () => {
  const { t } = useTranslation();

  return (
    <div className="max-w-4xl mx-auto py-4 px-4 bg-[var(--color-bg)] text-[var(--color-text)]">
      <h2 className="text-3xl font-bold mb-4 text-[var(--color-primary)]">{t('introduction.what_is_title')}</h2>
      <p className="mb-6">{t('introduction.what_is_description')}</p>

      <h3 className="text-2xl font-semibold mb-3 text-[var(--color-secondary)]">{t('introduction.why_title')}</h3>
      <p className="mb-6">{t('introduction.why_description')}</p>

      <h3 className="text-2xl font-semibold mb-3 text-[var(--color-secondary)]">{t('introduction.how_title')}</h3>
      <p className="mb-6">{t('introduction.how_description')}</p>
      <ul className="list-disc pl-6 mb-6">
        <li>{t('introduction.how_family')}</li>
        <li>{t('introduction.how_work')}</li>
        <li>{t('introduction.how_health')}</li>
        <li>{t('introduction.how_leisure')}</li>
      </ul>

      <h3 className="text-2xl font-semibold mb-3 text-[var(--color-secondary)]">{t('introduction.examples_title')}</h3>
      <p className="mb-6">{t('introduction.examples_description')}</p>
      <ul className="list-disc pl-6 mb-6">
        <li>{t('introduction.examples_family')}</li>
        <li>{t('introduction.examples_work')}</li>
        <li>{t('introduction.examples_health')}</li>
      </ul>

      <h3 className="text-2xl font-semibold mb-3 text-[var(--color-secondary)]">{t('introduction.next_steps_title')}</h3>
      <p>{t('introduction.next_steps_description')}</p>
    </div>
  );
};

export default Introduction;
