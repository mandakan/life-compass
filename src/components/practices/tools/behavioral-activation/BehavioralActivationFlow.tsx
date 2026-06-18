import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { BehavioralActivation } from '@models/LifeCompassDocument';
import { useLifeCompassStore } from '@/store/lifeCompassStore';
import Button from '@components/ui/Button';
import ScaleChooser from '@components/your-compass/ScaleChooser';
import CrisisResources from '../../CrisisResources';

const PREFIX = 'practices.tools.behavioral_activation';
const TOTAL_STEPS = 4;

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

const INPUT_CLASS =
  'border-border bg-surface text-text placeholder:text-text-muted focus-visible:outline-focus min-h-[44px] w-full min-w-0 rounded-md border px-3 focus-visible:outline-2 focus-visible:outline-offset-2';
const TEXTAREA_CLASS =
  'w-full min-w-0 rounded-md border border-border bg-surface px-3 py-2 text-text placeholder:text-text-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus resize-none';
const LABEL_CLASS = 'flex min-w-0 flex-col gap-1 text-sm text-text-muted';

interface BehavioralActivationFlowProps {
  record: BehavioralActivation;
  onClose: () => void;
}

const BehavioralActivationFlow: React.FC<BehavioralActivationFlowProps> = ({
  record,
  onClose,
}) => {
  const { t } = useTranslation();
  const update = useLifeCompassStore(s => s.updateBehavioralActivation);
  const lifeAreas = useLifeCompassStore(s => s.lifeAreas);
  const [step, setStep] = useState(1);

  const pleasureLabels = [1, 2, 3, 4, 5].map(n =>
    t(`${PREFIX}.pleasure_scale.${n}`),
  );
  const meaningLabels = [1, 2, 3, 4, 5].map(n =>
    t(`${PREFIX}.meaning_scale.${n}`),
  );

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
          <label className={LABEL_CLASS}>
            {t(`${PREFIX}.step1.area_label`)}
            <select
              value={record.areaId ?? ''}
              onChange={e =>
                update(record.id, { areaId: e.target.value || undefined })
              }
              className="border-border bg-surface text-text focus-visible:outline-focus min-h-[44px] w-full max-w-full min-w-0 truncate rounded-md border px-3 focus-visible:outline-2 focus-visible:outline-offset-2"
            >
              <option value="">{t(`${PREFIX}.step1.area_none`)}</option>
              {lifeAreas.map(area => (
                <option key={area.id} value={area.id}>
                  {area.name}
                </option>
              ))}
            </select>
          </label>
          <label className={LABEL_CLASS}>
            {t(`${PREFIX}.step1.activity_label`)}
            <textarea
              rows={3}
              value={record.activity}
              onChange={e => update(record.id, { activity: e.target.value })}
              placeholder={t(`${PREFIX}.step1.placeholder`)}
              className={TEXTAREA_CLASS}
            />
          </label>
        </StepFrame>
      )}

      {step === 2 && (
        <StepFrame
          title={t(`${PREFIX}.step2.title`)}
          prompt={t(`${PREFIX}.step2.prompt`)}
        >
          <label className={LABEL_CLASS}>
            {t(`${PREFIX}.step2.date_label`)}
            <input
              type="date"
              value={record.plannedDate ?? ''}
              onChange={e =>
                update(record.id, { plannedDate: e.target.value || undefined })
              }
              className={INPUT_CLASS}
            />
          </label>
          <label className={LABEL_CLASS}>
            {t(`${PREFIX}.step2.time_label`)}
            <select
              value={record.timeOfDay ?? ''}
              onChange={e =>
                update(record.id, {
                  timeOfDay:
                    (e.target.value as BehavioralActivation['timeOfDay']) ||
                    undefined,
                })
              }
              className="border-border bg-surface text-text focus-visible:outline-focus min-h-[44px] w-full max-w-full min-w-0 truncate rounded-md border px-3 focus-visible:outline-2 focus-visible:outline-offset-2"
            >
              <option value="">{t(`${PREFIX}.step2.time_none`)}</option>
              <option value="morning">{t(`${PREFIX}.step2.time_morning`)}</option>
              <option value="afternoon">
                {t(`${PREFIX}.step2.time_afternoon`)}
              </option>
              <option value="evening">{t(`${PREFIX}.step2.time_evening`)}</option>
            </select>
          </label>
        </StepFrame>
      )}

      {step === 3 && (
        <StepFrame
          title={t(`${PREFIX}.step3.title`)}
          prompt={t(`${PREFIX}.step3.prompt`)}
        >
          <div className="flex flex-col gap-2">
            <p className="text-text-muted text-sm">
              {t(`${PREFIX}.step3.pleasure_label`)}
            </p>
            <ScaleChooser
              labels={pleasureLabels}
              value={record.pleasureExpected ?? null}
              accent="clay"
              onChange={n => update(record.id, { pleasureExpected: n })}
            />
          </div>
          <div className="flex flex-col gap-2">
            <p className="text-text-muted text-sm">
              {t(`${PREFIX}.step3.meaning_label`)}
            </p>
            <ScaleChooser
              labels={meaningLabels}
              value={record.masteryExpected ?? null}
              accent="sage"
              onChange={n => update(record.id, { masteryExpected: n })}
            />
          </div>
        </StepFrame>
      )}

      {step === 4 && (
        <StepFrame
          title={t(`${PREFIX}.step4.title`)}
          prompt={t(`${PREFIX}.step4.prompt`)}
        >
          <label className="text-text flex min-h-[44px] cursor-pointer items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={record.done}
              onChange={e => update(record.id, { done: e.target.checked })}
              className="size-5"
            />
            {t(`${PREFIX}.step4.done_label`)}
          </label>
          <label className={LABEL_CLASS}>
            {t(`${PREFIX}.step4.outcome_label`)}
            <textarea
              rows={3}
              value={record.outcome}
              onChange={e => update(record.id, { outcome: e.target.value })}
              placeholder={t(`${PREFIX}.step4.outcome_placeholder`)}
              className={TEXTAREA_CLASS}
            />
          </label>
          <div className="flex flex-col gap-2">
            <p className="text-text-muted text-sm">
              {t(`${PREFIX}.step4.pleasure_label`)}
            </p>
            <ScaleChooser
              labels={pleasureLabels}
              value={record.pleasureActual ?? null}
              accent="clay"
              onChange={n => update(record.id, { pleasureActual: n })}
            />
            {(record.pleasureExpected != null ||
              record.pleasureActual != null) && (
              <div className="text-text-muted flex flex-wrap gap-x-4 gap-y-1 text-sm">
                {record.pleasureExpected != null && (
                  <span>
                    {t(`${PREFIX}.step4.expected_tag`)}:{' '}
                    {t(`${PREFIX}.pleasure_scale.${record.pleasureExpected}`)}
                  </span>
                )}
                {record.pleasureActual != null && (
                  <span>
                    {t(`${PREFIX}.step4.actual_tag`)}:{' '}
                    {t(`${PREFIX}.pleasure_scale.${record.pleasureActual}`)}
                  </span>
                )}
              </div>
            )}
          </div>
          <div className="flex flex-col gap-2">
            <p className="text-text-muted text-sm">
              {t(`${PREFIX}.step4.meaning_label`)}
            </p>
            <ScaleChooser
              labels={meaningLabels}
              value={record.masteryActual ?? null}
              accent="sage"
              onChange={n => update(record.id, { masteryActual: n })}
            />
            {(record.masteryExpected != null ||
              record.masteryActual != null) && (
              <div className="text-text-muted flex flex-wrap gap-x-4 gap-y-1 text-sm">
                {record.masteryExpected != null && (
                  <span>
                    {t(`${PREFIX}.step4.expected_tag`)}:{' '}
                    {t(`${PREFIX}.meaning_scale.${record.masteryExpected}`)}
                  </span>
                )}
                {record.masteryActual != null && (
                  <span>
                    {t(`${PREFIX}.step4.actual_tag`)}:{' '}
                    {t(`${PREFIX}.meaning_scale.${record.masteryActual}`)}
                  </span>
                )}
              </div>
            )}
          </div>
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
          <Button variant="primary" onClick={onClose}>
            {t(`${PREFIX}.done`)}
          </Button>
        )}
      </div>

      <CrisisResources />
    </div>
  );
};

export default BehavioralActivationFlow;
