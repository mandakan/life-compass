import React from 'react';
import { useTranslation } from 'react-i18next';

interface CalloutProps {
  children?: React.ReactNode;
  onDismiss?: () => void;
}

const Callout: React.FC<CalloutProps> = ({ children, onDismiss }) => {
  const { t } = useTranslation();
  return (
    <div className="mt-4 mb-4 flex items-center justify-between rounded-sm border border-l-6 border-[var(--border)] bg-[var(--color-bg)] p-2 font-sans text-[var(--color-text)]">
      <span>
        {children || t("recommend_max_ten_life_areas")}
      </span>
      {onDismiss && (
        <button
          onClick={onDismiss}
          className="cursor-pointer border-none bg-transparent font-sans text-base"
          aria-label={t("dismiss_callout")}
        >
          {t("close_symbol")}
        </button>
      )}
    </div>
  );
};

export default Callout;
