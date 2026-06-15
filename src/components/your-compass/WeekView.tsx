import React from 'react';
import { useTranslation } from 'react-i18next';
import type { LifeArea } from '@models/LifeArea';
import type { Snapshot } from '@models/LifeCompassDocument';
import { isTender, weekDeltaKey, weeksFor } from '@utils/compassModel';
import { Spark } from './primitives';

export interface WeekViewProps {
  areas: LifeArea[];
  history: Snapshot[];
  onOpen: (id: string) => void;
}

export function WeekView({ areas, history, onOpen }: WeekViewProps) {
  const { t } = useTranslation();

  return (
    <div className="mx-auto w-full max-w-[520px]">
      {/* Affirming opening line */}
      <p className="mb-[18px] mt-0 text-lg leading-relaxed text-text">
        {t('your_compass.week.affirm')}
      </p>

      {/* One row per area */}
      {areas.map((area, i) => {
        const isLast = i === areas.length - 1;
        const deltaKey = weekDeltaKey(area, history);
        const tender = isTender(area);
        const weeks = weeksFor(area, history);

        return (
          <button
            key={area.id}
            onClick={() => onOpen(area.id)}
            aria-label={t('your_compass.map.open_aria', { name: area.name })}
            className="flex w-full cursor-pointer items-center gap-3 bg-transparent py-[13px] px-1 text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
            style={{
              border: 'none',
              borderBottom: isLast ? 'none' : '1px solid var(--color-border)',
            }}
          >
            {/* Left: name + delta line + optional tender note */}
            <div className="min-w-0 flex-1">
              <div className="text-base font-semibold text-text">
                {area.name}
              </div>
              <div className="mt-px text-sm text-text-muted">
                {t(`your_compass.week.delta.${deltaKey}`)}
              </div>
              {tender && (
                <div className="mt-[3px] text-sm font-semibold text-text">
                  {t('your_compass.week.tender')}
                </div>
              )}
            </div>

            {/* Right: sparkline */}
            <Spark weeks={weeks} />
          </button>
        );
      })}
    </div>
  );
}

export default WeekView;
