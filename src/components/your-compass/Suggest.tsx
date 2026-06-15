import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { LifeArea } from '@models/LifeArea';
import Button from '@components/ui/Button';

export interface SuggestProps {
  suggestions: LifeArea[];
  onContinue: (chosen: LifeArea[]) => void;
  onOwn: () => void;
}

const Suggest: React.FC<SuggestProps> = ({ suggestions, onContinue, onOwn }) => {
  const { t } = useTranslation();
  const [picked, setPicked] = useState<Record<string, boolean>>({});

  const count = Object.values(picked).filter(Boolean).length;

  const toggle = (id: string) =>
    setPicked(prev => ({ ...prev, [id]: !prev[id] }));

  const handleContinue = () => {
    const chosen = suggestions.filter(s => picked[s.id]);
    onContinue(chosen);
  };

  return (
    <div
      className="mx-auto w-full max-w-[560px]"
      style={{ padding: 'clamp(32px, 7vw, 56px) clamp(16px, 5vw, 24px) 80px' }}
    >
      <h1 className="font-display text-2xl font-semibold leading-tight text-text">
        {t('your_compass.suggest.title')}
      </h1>

      <p className="mt-[10px] mb-[22px] text-base leading-relaxed text-text-muted">
        {t('your_compass.suggest.body')}
      </p>

      {/* Pill multi-select */}
      <div className="flex flex-wrap gap-[10px]">
        {suggestions.map(s => {
          const on = !!picked[s.id];
          return (
            <button
              key={s.id}
              onClick={() => toggle(s.id)}
              aria-pressed={on}
              className="cursor-pointer min-h-[44px] rounded-full px-4 py-[10px] box-border font-body text-base text-text transition-[border-color,background-color] duration-base ease-out-soft focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
              style={{
                border: `2px solid ${on ? 'var(--color-primary)' : 'var(--color-border)'}`,
                background: on
                  ? 'color-mix(in srgb, var(--color-primary) 14%, var(--color-surface))'
                  : 'var(--color-surface)',
                fontWeight: on ? 700 : 500,
              }}
            >
              {on && (
                <span aria-hidden="true" className="mr-1.5">
                  ✓
                </span>
              )}
              {s.name}
            </button>
          );
        })}
      </div>

      <div className="mt-[30px] flex flex-wrap items-center gap-4">
        <Button
          variant="primary"
          size="lg"
          disabled={count === 0}
          onClick={handleContinue}
        >
          {count === 0
            ? t('your_compass.suggest.cta_zero')
            : t('your_compass.suggest.cta_n', { count })}
        </Button>

        <button
          onClick={onOwn}
          className="min-h-[44px] cursor-pointer border-none bg-transparent font-body text-base text-text underline [text-underline-offset:3px] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
        >
          {t('your_compass.suggest.cta_own')}
        </button>
      </div>
    </div>
  );
};

export default Suggest;
