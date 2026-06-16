import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Button from '@components/ui/Button';
import { CompassMark } from '@components/your-compass/primitives';
import TopicGlyph from './TopicGlyph';
import { ONBOARDING_TOPICS, type GuideTopic } from './topics';

// The gentle welcome tour: a warm hello, a few soft topic cards, then a calm
// close. Every step is skippable at any point, and reassures rather than
// pushes. Motion is opt-in - it collapses under prefers-reduced-motion.

const MOTION_CSS = `
@keyframes wg-rise { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: none; } }
.wg-anim { opacity: 1; }
@media (prefers-reduced-motion: no-preference) {
  .wg-anim { animation: wg-rise .5s cubic-bezier(0.22,0.61,0.36,1) both; }
}
`;

// Tiny progress dots - the current one stretches into a clay pill.
const StepDots: React.FC<{ count: number; index: number }> = ({
  count,
  index,
}) => (
  <div className="flex items-center gap-1.5" aria-hidden="true">
    {Array.from({ length: count }).map((_, i) => (
      <span
        key={i}
        className="h-1.5 rounded-full transition-[width,background-color] duration-base ease-out-soft"
        style={{
          width: i === index ? 22 : 6,
          background:
            i === index ? 'var(--color-primary)' : 'var(--color-border)',
        }}
      />
    ))}
  </div>
);

// A bare top bar for the immersive flow: wordmark + Skip.
const FlowBar: React.FC<{ onSkip: () => void }> = ({ onSkip }) => {
  const { t } = useTranslation();
  return (
    <div className="mx-auto flex w-full max-w-[760px] items-center justify-between px-6 py-5">
      <span className="inline-flex items-center gap-2.5">
        <CompassMark size={24} />
        <span className="font-display text-lg font-semibold text-primary">
          {t('life_compass')}
        </span>
      </span>
      <Button variant="ghost" size="sm" onClick={onSkip}>
        {t('guide.onboarding.skip')}
      </Button>
    </div>
  );
};

type Step =
  | { kind: 'welcome' }
  | { kind: 'topic'; topic: GuideTopic }
  | { kind: 'ready' };

export interface OnboardingProps {
  /** Called when the visitor reaches the end, or skips. */
  onFinish: () => void;
}

const Onboarding: React.FC<OnboardingProps> = ({ onFinish }) => {
  const { t } = useTranslation();

  const steps = useMemo<Step[]>(
    () => [
      { kind: 'welcome' },
      ...ONBOARDING_TOPICS.map(topic => ({ kind: 'topic' as const, topic })),
      { kind: 'ready' },
    ],
    [],
  );

  const [i, setI] = useState(0);
  const step = steps[i];
  const last = i === steps.length - 1;
  const next = () => setI(n => Math.min(steps.length - 1, n + 1));
  const back = () => setI(n => Math.max(0, n - 1));

  return (
    <div className="flex min-h-[100svh] flex-col">
      <style dangerouslySetInnerHTML={{ __html: MOTION_CSS }} />
      <FlowBar onSkip={onFinish} />

      <div className="flex w-full flex-1 flex-col items-center justify-center overflow-y-auto px-6 pt-2 pb-6 sm:pb-10">
        <div
          key={i}
          className="wg-anim w-full max-w-[540px] text-center"
        >
          {step.kind === 'welcome' && (
            <>
              <div className="mb-5 flex justify-center sm:mb-[26px]">
                <CompassMark size={64} />
              </div>
              <p className={eyebrowClass}>{t('guide.onboarding.welcome.eyebrow')}</p>
              <h1 className={titleClass}>
                {t('guide.onboarding.welcome.title')}
              </h1>
              <p className={supportClass}>
                {t('guide.onboarding.welcome.body')}
              </p>
            </>
          )}

          {step.kind === 'topic' && (
            <>
              <div className="mb-4 flex justify-center sm:mb-[22px]">
                <TopicGlyph icon={step.topic.icon} tone={step.topic.tone} size={62} />
              </div>
              <p className={eyebrowClass}>
                {t(`guide.topics.${step.topic.id}.eyebrow`)}
              </p>
              <h1 className={titleClass}>
                {t(`guide.topics.${step.topic.id}.pull`)}
              </h1>
              <p className={supportClass}>
                {t(`guide.topics.${step.topic.id}.lede`)}
              </p>
            </>
          )}

          {step.kind === 'ready' && (
            <>
              <div className="mb-4 flex justify-center sm:mb-[22px]">
                <TopicGlyph icon="check-circle" tone="var(--color-secondary)" size={62} />
              </div>
              <p className={eyebrowClass}>{t('guide.onboarding.ready.eyebrow')}</p>
              <h1 className={titleClass}>{t('guide.onboarding.ready.title')}</h1>
              <p className={supportClass}>{t('guide.onboarding.ready.body')}</p>
            </>
          )}
        </div>
      </div>

      <div className="w-full">
        <div className="mx-auto flex max-w-[540px] items-center justify-center px-6 pb-[18px]">
          <StepDots count={steps.length} index={i} />
        </div>
        {/* Mobile: a full-width primary CTA on top, Back stacked below. From sm
            up: a centred CTA with Back to its left (1fr | auto | 1fr grid). The
            CTA stays on one line so long localisations don't wrap awkwardly. */}
        <div className="mx-auto flex max-w-[540px] flex-col gap-2 px-6 sm:grid sm:grid-cols-[1fr_auto_1fr] sm:items-center sm:gap-3">
          <div className="order-2 max-sm:empty:hidden sm:order-none sm:justify-self-start">
            {i > 0 && (
              <Button
                variant="ghost"
                onClick={back}
                className="w-full sm:w-auto"
              >
                {t('guide.onboarding.back')}
              </Button>
            )}
          </div>
          <Button
            size="lg"
            onClick={last ? onFinish : next}
            className="order-1 w-full whitespace-nowrap sm:order-none sm:w-auto"
          >
            {t(last ? 'guide.onboarding.finish' : 'guide.onboarding.continue')}
          </Button>
        </div>
        <p className="mx-auto mt-4 max-w-[540px] px-6 pb-5 text-center text-sm text-text-muted sm:mt-5 sm:pb-7">
          {t('guide.onboarding.footer')}
        </p>
      </div>
    </div>
  );
};

const eyebrowClass =
  'm-0 text-xs font-semibold uppercase tracking-[0.08em] text-text-muted';
const titleClass =
  'mt-3 font-display text-2xl font-semibold leading-tight tracking-[-0.015em] text-text [text-wrap:balance] sm:text-3xl md:text-4xl';
const supportClass =
  'mx-auto mt-3 max-w-[460px] text-base leading-relaxed text-text-muted [text-wrap:pretty] sm:mt-4 sm:text-lg';

export default Onboarding;
