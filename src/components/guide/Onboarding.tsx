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
    <div className="flex min-h-screen flex-col">
      <style dangerouslySetInnerHTML={{ __html: MOTION_CSS }} />
      <FlowBar onSkip={onFinish} />

      <div className="flex w-full flex-1 flex-col items-center justify-center px-6 pt-2 pb-10">
        <div
          key={i}
          className="wg-anim w-full max-w-[540px] text-center"
        >
          {step.kind === 'welcome' && (
            <>
              <div className="mb-[26px] flex justify-center">
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
              <div className="mb-[22px] flex justify-center">
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
              <div className="mb-[22px] flex justify-center">
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
        <div className="mx-auto flex max-w-[540px] items-center justify-between gap-3 px-6">
          <div className="min-w-[80px]">
            {i > 0 && (
              <Button variant="ghost" onClick={back}>
                {t('guide.onboarding.back')}
              </Button>
            )}
          </div>
          {last ? (
            <Button size="lg" onClick={onFinish}>
              {t('guide.onboarding.finish')}
            </Button>
          ) : (
            <Button size="lg" onClick={next}>
              {t('guide.onboarding.continue')}
            </Button>
          )}
          <div className="min-w-[80px]" />
        </div>
        <p className="mx-auto mt-5 max-w-[540px] px-6 pb-7 text-center text-sm text-text-muted">
          {t('guide.onboarding.footer')}
        </p>
      </div>
    </div>
  );
};

const eyebrowClass =
  'm-0 text-xs font-semibold uppercase tracking-[0.08em] text-text-muted';
const titleClass =
  'mt-3 font-display text-4xl font-semibold leading-tight tracking-[-0.015em] text-text [text-wrap:pretty]';
const supportClass =
  'mx-auto mt-4 max-w-[460px] text-lg leading-relaxed text-text-muted [text-wrap:pretty]';

export default Onboarding;
