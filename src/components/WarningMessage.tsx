import React from 'react';
import { useTranslation } from 'react-i18next';

export interface WarningMessageProps {
  message?: string;
  title?: string;
}

const WarningMessage: React.FC<WarningMessageProps> = ({ message, title }) => {
  const { t } = useTranslation();
  return (
    <div className="my-4 border-l-4 border-[var(--color-accent)] bg-[var(--color-bg)] p-4 text-[var(--color-text)]">
      <h3 className="mb-2 text-lg font-semibold">
        {title ? title : t('warning')}
      </h3>
      <p>{message ? message : t('default_warning_message')}</p>
    </div>
  );
};

export default WarningMessage;
