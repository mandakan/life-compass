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
      className="border-border bg-surface-sunken flex [scrollbar-width:none] gap-1 overflow-x-auto rounded-xl border p-1 [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
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
            className="font-body duration-base ease-out-soft focus-visible:outline-focus min-h-[44px] shrink-0 cursor-pointer rounded-lg px-3 py-2 text-sm whitespace-nowrap transition-[background-color,color,box-shadow] focus-visible:outline-2 focus-visible:outline-offset-2 sm:px-4"
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
