import React, { useLayoutEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { LifeArea } from '@models/LifeArea';
import type { Snapshot } from '@models/LifeCompassDocument';
import { drift } from '@utils/compassModel';
import { Figure } from './primitives';

export interface MapViewProps {
  areas: LifeArea[];
  /**
   * Snapshot history. Part of the shared view contract; the map derives drift
   * from each area's current values, so it does not read history directly.
   */
  history: Snapshot[];
  onOpen: (id: string) => void;
  onAdd: () => void;
}

/**
 * The radial map: you at the centre, the things that matter around you.
 *
 * The canvas is a square sized to the container via ResizeObserver
 * (SIZE = clamp(248, width, 380)). Area nodes sit on a circle of radius
 * SIZE * 0.33, evenly spaced by angle starting at -90deg. Drift pushes a node
 * outward (R + drift*6) and fades it (opacity 1 - drift*0.1). An empty store
 * shows 8 dashed "+" add-slots; a populated store shows areas.length + 2 slots,
 * where the extra slots are "+" add buttons.
 *
 * Node positions and opacity are computed, so they use inline style; static
 * chrome uses Tailwind utilities mapped to the design tokens.
 */
const MapView: React.FC<MapViewProps> = ({ areas, onOpen, onAdd }) => {
  const { t } = useTranslation();

  const containerRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);

  // Measure synchronously before paint so the square is never rendered at a
  // fixed fallback width. A fixed width wider than the column would inflate the
  // flex shell's min-content and cause horizontal overflow on narrow screens.
  useLayoutEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const update = () => setWidth(el.clientWidth);
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Until measured (width 0), render at 0 so the square cannot stretch the
  // layout; the layout effect fills in the real width before the browser paints.
  const SIZE = width > 0 ? Math.max(248, Math.min(420, width)) : 0;
  const cx = SIZE / 2;
  const cy = SIZE / 2;

  const empty = areas.length === 0;
  const slots = empty ? 8 : areas.length + 2;

  // Fit the ring inside the square while keeping neighbouring cards from
  // colliding. `gap` is the half-chord between adjacent nodes per unit radius;
  // we pick the largest card that stays within that gap, then place the ring so
  // a card never spills past the square's edge (R + box/2 + PAD = SIZE/2). On a
  // narrow phone this yields small cards -- long names truncate (2-line clamp)
  // rather than overlap. The figure scales gently with the canvas.
  const PAD = 6;
  const gap = Math.sin(Math.PI / slots);
  const maxBox = (2 * gap * (SIZE / 2 - PAD)) / (1 + gap);
  const box = Math.max(56, Math.min(108, Math.floor(maxBox)));
  const R = SIZE / 2 - box / 2 - PAD;
  const figure = Math.round(Math.min(64, Math.max(48, SIZE * 0.16)));

  const nodes = Array.from({ length: slots }, (_, i) => {
    const ang = ((-90 + (i * 360) / slots) * Math.PI) / 180;
    const area = areas[i];
    const r = R + (area ? drift(area) * 6 : 0);
    return {
      area,
      i,
      x: cx + r * Math.cos(ang),
      y: cy + r * Math.sin(ang),
    };
  });

  return (
    <div>
      <div ref={containerRef} className="flex w-full justify-center">
        <div className="relative" style={{ width: SIZE, height: SIZE }}>
          <svg
            width={SIZE}
            height={SIZE}
            className="absolute inset-0"
            aria-hidden="true"
          >
            {nodes.map(
              p =>
                p.area && (
                  <line
                    key={p.i}
                    x1={cx}
                    y1={cy}
                    x2={p.x}
                    y2={p.y}
                    stroke="var(--color-border)"
                    strokeWidth={1.5}
                  />
                ),
            )}
          </svg>

          <div
            className="absolute flex items-center justify-center rounded-full border-2 border-primary bg-surface shadow-warm-sm"
            style={{
              left: cx,
              top: cy,
              transform: 'translate(-50%, -50%)',
              width: figure,
              height: figure,
            }}
          >
            <Figure />
          </div>

          {nodes.map(p => {
            if (!p.area) {
              return (
                <button
                  key={p.i}
                  type="button"
                  onClick={onAdd}
                  aria-label={t('your_compass.map.add_aria')}
                  className="absolute flex items-center justify-center rounded-full border-[1.5px] border-dashed border-border bg-transparent text-2xl text-text transition-[border-color,background-color] duration-base ease-out-soft hover:bg-surface-sunken focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
                  style={{
                    left: p.x,
                    top: p.y,
                    transform: 'translate(-50%, -50%)',
                    width: 48,
                    height: 48,
                  }}
                >
                  +
                </button>
              );
            }

            const area = p.area;
            const name = area.name || t('your_compass.map.untitled');
            return (
              <button
                key={p.i}
                type="button"
                onClick={() => onOpen(area.id)}
                aria-label={t('your_compass.map.open_aria', { name })}
                className="absolute flex items-center justify-center rounded-md border-[1.5px] border-border bg-surface px-1.5 py-2 text-center font-semibold text-text shadow-warm-sm transition-[border-color,background-color] duration-base ease-out-soft focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
                style={{
                  left: p.x,
                  top: p.y,
                  transform: 'translate(-50%, -50%)',
                  width: box,
                  minHeight: 44,
                  opacity: 1 - drift(area) * 0.1,
                }}
              >
                {/* Clamp on a span: a <button> ignores display:-webkit-box,
                    so line-clamp must live on a child element. */}
                <span
                  className="line-clamp-2 break-words leading-tight"
                  style={{ fontSize: box < 76 ? 11 : 12 }}
                >
                  {name}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <p className="mt-3.5 text-center text-sm leading-normal text-text-muted">
        {empty
          ? t('your_compass.map.helper_empty')
          : t('your_compass.map.helper_populated')}
      </p>
    </div>
  );
};

export default MapView;
