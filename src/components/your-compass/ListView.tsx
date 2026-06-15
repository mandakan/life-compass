import React from 'react';
import { useTranslation } from 'react-i18next';
import type { LifeArea } from '@models/LifeArea';
import { lived, tone, LIVED_KEY } from '@utils/compassModel';

export interface ListViewProps {
  areas: LifeArea[];
  onOpen: (id: string) => void;
}

// Resolve the --color-* token for a given tone value.
// sage -> secondary token, clay -> primary token, muted -> text-muted token.
function toneColor(t: 'sage' | 'clay' | 'muted'): string {
  if (t === 'sage') return 'var(--color-secondary)';
  if (t === 'clay') return 'var(--color-primary)';
  return 'var(--color-text-muted)';
}

export function ListView({ areas, onOpen }: ListViewProps) {
  const { t } = useTranslation();

  return (
    <div className="mx-auto w-full max-w-[520px]">
      {areas.map((area, i) => {
        const livedBucket = lived(area);
        const areaTone = tone(area);
        const isLast = i === areas.length - 1;

        return (
          <button
            key={area.id}
            onClick={() => onOpen(area.id)}
            aria-label={t('your_compass.map.open_aria', { name: area.name })}
            className="flex w-full cursor-pointer items-center gap-3 bg-transparent py-[15px] px-1 text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
            style={{
              border: 'none',
              borderBottom: isLast ? 'none' : '1px solid var(--color-border)',
            }}
          >
            {/* Left: name + description */}
            <div className="min-w-0 flex-1">
              <div className="text-base font-semibold text-text">
                {area.name}
              </div>
              {area.description && (
                <div className="mt-px text-sm text-text-muted">
                  {area.description}
                </div>
              )}
            </div>

            {/* Right: lived word colored by tone */}
            <span
              className="flex-none whitespace-nowrap pl-3 text-sm"
              style={{ color: toneColor(areaTone) }}
            >
              {t(LIVED_KEY(livedBucket))}
            </span>
          </button>
        );
      })}
    </div>
  );
}

export default ListView;
