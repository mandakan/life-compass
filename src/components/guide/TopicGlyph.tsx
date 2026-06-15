import React from 'react';
import {
  CheckCircleIcon,
  CheckIcon,
  InformationCircleIcon,
  ArrowDownTrayIcon,
} from '@heroicons/react/24/outline';
import { CompassMark } from '@components/your-compass/primitives';
import type { TopicIcon } from './topics';

// A topic's glyph in a soft tinted tile. 'compass' uses the bespoke clay-ring
// mark; every other name is a Heroicons-outline glyph tinted with `tone`.

const ICONS: Record<
  Exclude<TopicIcon, 'compass'>,
  React.ComponentType<React.SVGProps<SVGSVGElement>>
> = {
  'check-circle': CheckCircleIcon,
  check: CheckIcon,
  'information-circle': InformationCircleIcon,
  'arrow-down-tray': ArrowDownTrayIcon,
};

export interface TopicGlyphProps {
  icon: TopicIcon;
  tone: string;
  /** Outer tile size in px. */
  size?: number;
}

const TopicGlyph: React.FC<TopicGlyphProps> = ({ icon, tone, size = 52 }) => {
  const inner = Math.round(size * 0.46);
  const Icon = icon === 'compass' ? null : ICONS[icon];

  return (
    <span
      aria-hidden="true"
      className="inline-flex flex-none items-center justify-center rounded-lg"
      style={{
        width: size,
        height: size,
        background: `color-mix(in srgb, ${tone} 12%, var(--color-surface))`,
        color: tone,
      }}
    >
      {icon === 'compass' || !Icon ? (
        <CompassMark size={inner} />
      ) : (
        <Icon style={{ width: inner, height: inner }} />
      )}
    </span>
  );
};

export default TopicGlyph;
