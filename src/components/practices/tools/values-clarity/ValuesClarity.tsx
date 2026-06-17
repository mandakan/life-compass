import React, { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useLifeCompassStore } from '@/store/lifeCompassStore';
import Button from '@components/ui/Button';
import {
  matters,
  lived,
  drift,
  MATTERS_KEY,
  LIVED_KEY,
} from '@utils/compassModel';
import { LifeArea } from '@models/LifeArea';
import AreaList from './AreaList';

const PREFIX = 'practices.tools.values_clarity';
const TOTAL_STEPS = 4;

// The quiet underline link style ToolShell uses for its "back" link; reused
// here for the gentle links out to the compass so the tool stays consistent.
const LINK_CLASS =
  'inline-flex items-center gap-1 text-sm text-text-muted underline-offset-4 transition-colors duration-base ease-out-soft hover:text-text hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus';

const StepFrame: React.FC<{
  title: string;
  prompt: string;
  children?: React.ReactNode;
}> = ({ title, prompt, children }) => (
  <div className="flex flex-col gap-4">
    <div>
      <h2 className="font-display text-text text-xl">{title}</h2>
      <p className="text-text-muted mt-1">{prompt}</p>
    </div>
    {children}
  </div>
);

/**
 * Values "Clarity session": a short, paced walk over the data the app already
 * holds -- what matters, how it's lived, where the two drift apart, and one
 * small step toward the widest gap. It edits nothing; to change anything it
 * links gently back to the compass. No new store slice, no persistence.
 */
const ValuesClarity: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const lifeAreas = useLifeCompassStore(s => s.lifeAreas);
  const [step, setStep] = useState(1);

  // The area furthest from what matters leads the gap step and becomes the
  // focus of the closing step; importance breaks ties so a deeply-held area
  // wins over a lightly-held one at the same drift.
  const byDrift = useMemo(
    () =>
      [...lifeAreas].sort(
        (a, b) => drift(b) - drift(a) || matters(b) - matters(a),
      ),
    [lifeAreas],
  );
  const focus = byDrift[0];
  const hasGap = focus ? drift(focus) > 0 : false;

  if (lifeAreas.length === 0) {
    return (
      <div className="flex flex-col items-start gap-4">
        <p className="border-border bg-surface-sunken text-text-muted rounded-lg border border-dashed px-4 py-6 text-sm">
          {t(`${PREFIX}.empty_state`)}
        </p>
        <Link to="/" className={LINK_CLASS}>
          {t(`${PREFIX}.empty_cta`)}
        </Link>
      </div>
    );
  }

  const gapNote = (a: LifeArea): string => {
    const d = drift(a);
    if (d === 0) return t(`${PREFIX}.step3.gap_aligned`);
    if (d === 1) return t(`${PREFIX}.step3.gap_near`);
    return t(`${PREFIX}.step3.gap_far`);
  };

  return (
    <div className="flex flex-col gap-6">
      <p className="text-text-muted text-sm">
        {t(`${PREFIX}.step_label`, { current: step, total: TOTAL_STEPS })}
      </p>

      {step === 1 && (
        <StepFrame
          title={t(`${PREFIX}.step1.title`)}
          prompt={t(`${PREFIX}.step1.prompt`)}
        >
          <AreaList
            areas={lifeAreas}
            noteFor={a => t(MATTERS_KEY(matters(a)))}
          />
        </StepFrame>
      )}

      {step === 2 && (
        <StepFrame
          title={t(`${PREFIX}.step2.title`)}
          prompt={t(`${PREFIX}.step2.prompt`)}
        >
          <AreaList areas={lifeAreas} noteFor={a => t(LIVED_KEY(lived(a)))} />
        </StepFrame>
      )}

      {step === 3 && (
        <StepFrame
          title={t(`${PREFIX}.step3.title`)}
          prompt={t(`${PREFIX}.step3.prompt`)}
        >
          {hasGap ? (
            <AreaList areas={byDrift} noteFor={gapNote} />
          ) : (
            <p className="border-border bg-surface-sunken text-text-muted rounded-lg border border-dashed px-4 py-6 text-sm">
              {t(`${PREFIX}.step3.all_aligned`)}
            </p>
          )}
        </StepFrame>
      )}

      {step === 4 && (
        <StepFrame
          title={t(`${PREFIX}.step4.title`)}
          prompt={
            hasGap
              ? t(`${PREFIX}.step4.prompt_focus`, { area: focus.name })
              : t(`${PREFIX}.step4.prompt_aligned`)
          }
        >
          <Link to="/" className={LINK_CLASS}>
            {t(`${PREFIX}.step4.cta`)}
          </Link>
        </StepFrame>
      )}

      <div className="flex items-center justify-between gap-3">
        <Button
          variant="ghost"
          onClick={() => setStep(s => Math.max(1, s - 1))}
          disabled={step === 1}
        >
          {t(`${PREFIX}.back`)}
        </Button>
        {step < TOTAL_STEPS ? (
          <Button
            variant="primary"
            onClick={() => setStep(s => Math.min(TOTAL_STEPS, s + 1))}
          >
            {t(`${PREFIX}.next`)}
          </Button>
        ) : (
          <Button variant="primary" onClick={() => navigate('/practices')}>
            {t(`${PREFIX}.done`)}
          </Button>
        )}
      </div>
    </div>
  );
};

export default ValuesClarity;
