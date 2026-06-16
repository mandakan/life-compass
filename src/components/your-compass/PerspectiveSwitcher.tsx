import React from 'react';
import { useTranslation } from 'react-i18next';
import { VIEWS, type ViewId } from './views';

export interface PerspectiveSwitcherProps {
  view: ViewId;
  onChange: (view: ViewId) => void;
}

const PerspectiveSwitcher: React.FC<PerspectiveSwitcherProps> = ({
  view,
  onChange,
}) => {
  const { t } = useTranslation();

  return (
    <div
      role="tablist"
      aria-label={t('your_compass.heading.eyebrow')}
      className="flex gap-1 overflow-x-auto rounded-xl border border-border bg-surface-sunken p-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
    >
      {VIEWS.map(v => {
        const active = v.id === view;
        return (
          <button
            key={v.id}
            role="tab"
            aria-selected={active}
            aria-pressed={active}
            onClick={() => onChange(v.id)}
            className="shrink-0 cursor-pointer rounded-lg px-3 py-2 min-h-[44px] font-body text-sm whitespace-nowrap transition-[background-color,color,box-shadow] duration-base ease-out-soft focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus sm:px-4"
            style={{
              background: active ? 'var(--color-surface)' : 'transparent',
              color: active ? 'var(--color-text)' : 'var(--color-text-muted)',
              fontWeight: active ? 600 : 400,
              boxShadow: active ? 'var(--shadow-warm-sm)' : 'none',
              border: 'none',
            }}
          >
            {t(v.labelKey)}
          </button>
        );
      })}
    </div>
  );
};

export default PerspectiveSwitcher;
