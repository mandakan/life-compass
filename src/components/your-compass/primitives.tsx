import React from 'react';

// Inline SVG primitives for the Your Compass feature.
// All components are aria-hidden -- they are decorative only.
// Geometry ported faithfully from docs/your-compass/Compass.prototype.jsx.

// ---- CompassMark ----
// A clay ring with a sage needle rotated 35 degrees.
// Size controls the outer diameter; needle height is 40% of size.

export interface CompassMarkProps {
  size?: number;
}

export function CompassMark({ size = 56 }: CompassMarkProps) {
  const needleH = size * 0.4;
  return (
    <span
      aria-hidden="true"
      style={{
        display: 'inline-flex',
        width: size,
        height: size,
        borderRadius: '50%',
        border: '2.5px solid var(--color-primary)',
        position: 'relative',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
      }}
    >
      <span
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          width: 3,
          height: needleH,
          background: 'var(--color-secondary)',
          transform: 'translate(-50%, -50%) rotate(35deg)',
          borderRadius: 3,
        }}
      />
    </span>
  );
}

// ---- Figure ----
// Stick figure representing the user ("you") at the center of the compass.
// Aspect ratio is 24:30 (width:height) as in the prototype viewBox.

export interface FigureProps {
  size?: number;
  className?: string;
}

export function Figure({ size = 44, className }: FigureProps) {
  return (
    <svg
      viewBox="0 0 24 30"
      width={size}
      height={(size * 30) / 24}
      fill="none"
      stroke="var(--color-primary)"
      strokeWidth={1.7}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      <circle cx={12} cy={5} r={3.2} />
      <path d="M12 8.5v9" />
      <path d="M12 11l-5 3M12 11l5 3" />
      <path d="M12 17.5l-4 7M12 17.5l4 7" />
    </svg>
  );
}

// ---- Spark ----
// Tiny sparkline for the week view. Returns null when fewer than 2 data points.
// Line color: border token. End dot fill: clay (primary token).
// Domain: 1-5 (bucket scale). Canvas: 64x22px.

export interface SparkProps {
  weeks: number[];
}

export function Spark({ weeks }: SparkProps) {
  if (weeks.length < 2) return null;

  const W = 64;
  const H = 22;
  const MIN = 1;
  const MAX = 5;
  const step = W / (weeks.length - 1);

  const y = (v: number) => H - 3 - ((v - MIN) / (MAX - MIN)) * (H - 6);

  const d = weeks
    .map((v, i) => `${i === 0 ? 'M' : 'L'} ${i * step} ${y(v)}`)
    .join(' ');

  const lastX = (weeks.length - 1) * step;
  const lastY = y(weeks[weeks.length - 1]);

  return (
    <svg
      width={W}
      height={H}
      aria-hidden="true"
      style={{ flex: 'none' }}
    >
      <path
        d={d}
        fill="none"
        stroke="var(--color-border)"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx={lastX} cy={lastY} r={3} fill="var(--color-primary)" />
    </svg>
  );
}
