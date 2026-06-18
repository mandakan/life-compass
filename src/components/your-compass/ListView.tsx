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
            className="focus-visible:outline-focus flex w-full cursor-pointer items-center gap-3 bg-transparent px-1 py-[15px] text-left focus-visible:outline-2 focus-visible:outline-offset-2"
            style={{
              border: 'none',
              borderBottom: isLast ? 'none' : '1px solid var(--color-border)',
            }}
          >
            {/* Left: name + description */}
            <div className="min-w-0 flex-1">
              <div className="text-text text-base font-semibold">
                {area.name}
              </div>
              {area.description && (
                <div className="text-text-muted mt-px text-sm">
                  {area.description}
                </div>
              )}
            </div>

            {/* Right: lived word colored by tone */}
            <span
              className="flex-none pl-3 text-sm whitespace-nowrap"
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
