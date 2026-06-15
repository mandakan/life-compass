// One content model, two presentations. The onboarding tour and the help guide
// both render from GUIDE_TOPICS, so "the welcome that lives on as help" is
// literally the same content - never a fork that drifts out of sync.
//
// Only the structural metadata lives here (id, icon, tone, whether the topic
// shows data actions). All copy is in i18n under `guide.topics.<id>.*` so it
// translates and stays in the voice the rest of the app uses.

/** Topic glyphs map to a Heroicons-outline name, or the bespoke compass mark. */
export type TopicIcon =
  | 'compass'
  | 'check-circle'
  | 'check'
  | 'information-circle'
  | 'arrow-down-tray';

export interface GuideTopic {
  /** Stable id; also the i18n key segment (`guide.topics.<id>`). */
  id: 'what' | 'weekly' | 'pressure' | 'method' | 'data';
  /** Glyph shown in the tinted tile. */
  icon: TopicIcon;
  /** CSS custom property that tints the glyph tile. */
  tone: string;
  /** When true, the guide renders live data actions (export / import / delete). */
  dataActions?: boolean;
}

export const GUIDE_TOPICS: GuideTopic[] = [
  { id: 'what', icon: 'compass', tone: 'var(--color-primary)' },
  { id: 'weekly', icon: 'check-circle', tone: 'var(--color-secondary)' },
  { id: 'pressure', icon: 'check', tone: 'var(--color-secondary)' },
  { id: 'method', icon: 'information-circle', tone: 'var(--color-warning)' },
  {
    id: 'data',
    icon: 'arrow-down-tray',
    tone: 'var(--color-primary)',
    dataActions: true,
  },
];

// The onboarding tour is a short, curated sequence - a warm welcome, a few
// topics, then a calm close. It deliberately leaves the deeper reference (the
// method's origin, managing your data) to the full guide.
export const ONBOARDING_STEP_IDS: GuideTopic['id'][] = [
  'what',
  'weekly',
  'pressure',
];

export const ONBOARDING_TOPICS: GuideTopic[] = ONBOARDING_STEP_IDS.map(
  id => GUIDE_TOPICS.find(t => t.id === id) as GuideTopic,
);
