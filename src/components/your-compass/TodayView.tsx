import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { LifeArea } from '@models/LifeArea';
import type { Snapshot } from '@models/LifeCompassDocument';
import { drift, LIVED_KEY } from '@utils/compassModel';
import Button from '@components/ui/Button';

export interface TodayViewProps {
  areas: LifeArea[];
  history: Snapshot[];
  onOpen: (id: string) => void;
}

// The five 1-5 scale buckets for the lived word scale.
const SCALE_BUCKETS = [1, 2, 3, 4, 5] as const;

export function TodayView({ areas, onOpen }: TodayViewProps) {
  const { t } = useTranslation();

  // Pick the largest-drift area first; fall back to first area when all tied.
  // Lazy initializer so the sort runs only once on mount.
  const [pickId, setPickId] = useState<string>(
    () => areas.slice().sort((x, y) => drift(y) - drift(x))[0]?.id ?? '',
  );
  const [selected, setSelected] = useState<number | null>(null);

  const area = areas.find((a) => a.id === pickId) ?? areas[0];

  const handleShowAnother = () => {
    const idx = areas.findIndex((a) => a.id === pickId);
    const next = areas[(idx + 1) % areas.length];
    setPickId(next.id);
    setSelected(null);
  };

  if (!area) return null;

  return (
    <div className="mx-auto w-full max-w-[460px]">
      {/* Eyebrow */}
      <p className="m-0 text-sm tracking-[0.02em] text-text-muted">
        {t('your_compass.today.eyebrow')}
      </p>

      {/* Area name */}
      <h3 className="mb-0.5 mt-2 font-display text-2xl font-semibold leading-snug text-text">
        {area.name}
      </h3>

      {/* Area description */}
      {area.description && (
        <p className="mb-[18px] mt-0 text-base text-text-muted">
          {area.description}
        </p>
      )}

      {/* Scale prompt */}
      <div className="mb-3 text-base text-text">
        {t('your_compass.today.question')}
      </div>

      {/* Vertical 5-option word scale */}
      <div className="flex flex-col gap-2">
        {SCALE_BUCKETS.map((n) => {
          const isOn = selected === n;
          return (
            <button
              key={n}
              onClick={() => setSelected(n)}
              aria-pressed={isOn}
              className="flex w-full cursor-pointer items-center gap-3 rounded-lg py-[13px] px-4 text-left text-lg text-text focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
              style={{
                minHeight: 44,
                border: `1.5px solid ${isOn ? 'var(--color-primary)' : 'var(--color-border)'}`,
                background: isOn
                  ? 'color-mix(in srgb, var(--color-primary) 12%, var(--color-surface))'
                  : 'var(--color-surface)',
                fontFamily: 'var(--font-body)',
                transition:
                  'border-color var(--duration-base) var(--ease-out-soft), background-color var(--duration-base) var(--ease-out-soft)',
              }}
            >
              {/* Radio dot */}
              <span
                aria-hidden="true"
                style={{
                  width: 18,
                  height: 18,
                  borderRadius: '50%',
                  flexShrink: 0,
                  display: 'inline-flex',
                  border: `1.5px solid ${isOn ? 'var(--color-primary)' : 'var(--color-border)'}`,
                  background: isOn ? 'var(--color-primary)' : 'transparent',
                }}
              />
              {t(LIVED_KEY(n))}
            </button>
          );
        })}
      </div>

      {/* Footer actions */}
      <div className="mt-[18px] flex flex-wrap items-center gap-[14px]">
        <Button variant="primary" onClick={() => onOpen(area.id)}>
          {t('your_compass.today.open_save')}
        </Button>
        <button
          onClick={handleShowAnother}
          className="cursor-pointer whitespace-nowrap bg-transparent text-base text-text underline underline-offset-[3px] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
          style={{
            minHeight: 44,
            border: 'none',
            fontFamily: 'var(--font-body)',
          }}
        >
          {t('your_compass.today.show_another')}
        </button>
      </div>
    </div>
  );
}

export default TodayView;
