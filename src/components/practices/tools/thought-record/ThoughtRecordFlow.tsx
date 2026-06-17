import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { ThoughtRecord } from '@models/LifeCompassDocument';
import { useLifeCompassStore } from '@/store/lifeCompassStore';
import Button from '@components/ui/Button';
import ScaleChooser from '@components/your-compass/ScaleChooser';
import CrisisResources from '../../CrisisResources';

const PREFIX = 'practices.tools.thought_record';
const TOTAL_STEPS = 5;

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

const TEXTAREA_CLASS =
  'w-full min-w-0 rounded-md border border-border bg-surface px-3 py-2 text-text placeholder:text-text-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus resize-none';

const LABEL_CLASS = 'flex min-w-0 flex-col gap-1 text-sm text-text-muted';

interface ThoughtRecordFlowProps {
  record: ThoughtRecord;
  onClose: () => void;
}

const ThoughtRecordFlow: React.FC<ThoughtRecordFlowProps> = ({
  record,
  onClose,
}) => {
  const { t } = useTranslation();
  const updateThoughtRecord = useLifeCompassStore(s => s.updateThoughtRecord);
  const lifeAreas = useLifeCompassStore(s => s.lifeAreas);
  const [step, setStep] = useState(1);

  const feelingLabels = [1, 2, 3, 4, 5].map(n =>
    t(`${PREFIX}.feeling_scale.${n}`),
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
                updateThoughtRecord(record.id, {
                  areaId: e.target.value || undefined,
                })
              }
              className="min-h-[44px] w-full min-w-0 max-w-full truncate rounded-md border border-border bg-surface px-3 text-text focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
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
            <textarea
              rows={4}
              value={record.situation}
              onChange={e =>
                updateThoughtRecord(record.id, { situation: e.target.value })
              }
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
            <textarea
              rows={4}
              value={record.thought}
              onChange={e =>
                updateThoughtRecord(record.id, { thought: e.target.value })
              }
              placeholder={t(`${PREFIX}.step2.placeholder`)}
              className={TEXTAREA_CLASS}
            />
          </label>
        </StepFrame>
      )}

      {step === 3 && (
        <StepFrame
          title={t(`${PREFIX}.step3.title`)}
          prompt={t(`${PREFIX}.step3.prompt`)}
        >
          <label className={LABEL_CLASS}>
            <input
              type="text"
              value={record.feeling}
              onChange={e =>
                updateThoughtRecord(record.id, { feeling: e.target.value })
              }
              placeholder={t(`${PREFIX}.step3.feeling_placeholder`)}
              className="min-h-[44px] w-full min-w-0 rounded-md border border-border bg-surface px-3 text-text placeholder:text-text-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
            />
          </label>
          <div className="flex flex-col gap-2">
            <p className="text-sm text-text-muted">
              {t(`${PREFIX}.step3.strength_label`)}
            </p>
            <ScaleChooser
              labels={feelingLabels}
              value={record.feelingBefore ?? null}
              accent="clay"
              onChange={n => updateThoughtRecord(record.id, { feelingBefore: n })}
            />
          </div>
        </StepFrame>
      )}

      {step === 4 && (
        <StepFrame
          title={t(`${PREFIX}.step4.title`)}
          prompt={t(`${PREFIX}.step4.prompt`)}
        >
          <label className={LABEL_CLASS}>
            {t(`${PREFIX}.step4.supports_label`)}
            <textarea
              rows={3}
              value={record.supports}
              onChange={e =>
                updateThoughtRecord(record.id, { supports: e.target.value })
              }
              placeholder={t(`${PREFIX}.step4.supports_placeholder`)}
              className={TEXTAREA_CLASS}
            />
          </label>
          <label className={LABEL_CLASS}>
            {t(`${PREFIX}.step4.wider_label`)}
            <textarea
              rows={3}
              value={record.widerView}
              onChange={e =>
                updateThoughtRecord(record.id, { widerView: e.target.value })
              }
              placeholder={t(`${PREFIX}.step4.wider_placeholder`)}
              className={TEXTAREA_CLASS}
            />
          </label>
          <label className={LABEL_CLASS}>
            {t(`${PREFIX}.step4.kinder_label`)}
            <textarea
              rows={3}
              value={record.kinderView}
              onChange={e =>
                updateThoughtRecord(record.id, { kinderView: e.target.value })
              }
              placeholder={t(`${PREFIX}.step4.kinder_placeholder`)}
              className={TEXTAREA_CLASS}
            />
          </label>
        </StepFrame>
      )}

      {step === 5 && (
        <StepFrame
          title={t(`${PREFIX}.step5.title`)}
          prompt={t(`${PREFIX}.step5.prompt`)}
        >
          <div className="flex flex-col gap-2">
            <p className="text-sm text-text-muted">
              {t(`${PREFIX}.step5.strength_label`)}
            </p>
            <ScaleChooser
              labels={feelingLabels}
              value={record.feelingAfter ?? null}
              accent="clay"
              onChange={n => updateThoughtRecord(record.id, { feelingAfter: n })}
            />
          </div>
          {(record.feelingBefore != null || record.feelingAfter != null) && (
            <div className="flex gap-4 text-sm text-text-muted">
              {record.feelingBefore != null && (
                <span>{t(`${PREFIX}.feeling_scale.${record.feelingBefore}`)}</span>
              )}
              {record.feelingAfter != null && (
                <span>{t(`${PREFIX}.feeling_scale.${record.feelingAfter}`)}</span>
              )}
            </div>
          )}
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

export default ThoughtRecordFlow;
