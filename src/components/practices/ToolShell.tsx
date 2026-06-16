import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

export interface ToolShellProps {
  titleKey: string;
  descriptionKey: string;
  children: React.ReactNode;
}

/**
 * Wraps an open tool with a gentle title and a quiet way back to the shelf.
 */
const ToolShell: React.FC<ToolShellProps> = ({
  titleKey,
  descriptionKey,
  children,
}) => {
  const { t } = useTranslation();

  return (
    <section className="mx-auto w-full max-w-2xl px-4 py-8">
      <Link
        to="/practices"
        className="mb-6 inline-flex items-center gap-1 text-sm text-text-muted underline-offset-4 transition-colors duration-base ease-out-soft hover:text-text hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
      >
        <ArrowLeftIcon className="size-4" />
        {t('practices.back')}
      </Link>
      <h1 className="font-display text-2xl text-text">{t(titleKey)}</h1>
      <p className="mt-2 text-text-muted">{t(descriptionKey)}</p>
      <div className="mt-6">{children}</div>
    </section>
  );
};

export default ToolShell;
