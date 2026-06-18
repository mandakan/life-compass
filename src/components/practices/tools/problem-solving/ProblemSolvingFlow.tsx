import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { TrashIcon } from '@heroicons/react/24/outline';
import type { ProblemSolving } from '@models/LifeCompassDocument';
import { useLifeCompassStore } from '@/store/lifeCompassStore';
import Button from '@components/ui/Button';
import Input from '@components/ui/Input';
import CrisisResources from '../../CrisisResources';
import ProblemSolvingStepList from './ProblemSolvingStepList';

const PREFIX = 'practices.tools.problem_solving';
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

interface ProblemSolvingFlowProps {
  record: ProblemSolving;
  onClose: () => void;
}

const ProblemSolvingFlow: React.FC<ProblemSolvingFlowProps> = ({
  record,
  onClose,
}) => {
  const { t } = useTranslation();
  const update = useLifeCompassStore(s => s.updateProblemSolving);
  const addOption = useLifeCompassStore(s => s.addProblemSolvingOption);
  const updateOption = useLifeCompassStore(s => s.updateProblemSolvingOption);
  const removeOption = useLifeCompassStore(s => s.removeProblemSolvingOption);
  const lifeAreas = useLifeCompassStore(s => s.lifeAreas);
  const [step, setStep] = useState(1);
  const [newOption, setNewOption] = useState('');

  const handleAddOption = () => {
    if (newOption.trim() === '') {
      return;
    }
    addOption(record.id, newOption);
    setNewOption('');
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
            {t(`${PREFIX}.step1.problem_label`)}
            <textarea
              rows={4}
              value={record.problem}
              onChange={e => update(record.id, { problem: e.target.value })}
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
          <ul className="flex flex-col gap-1">
            {record.options.map(opt => (
              <li
                key={opt.id}
                className="hover:bg-surface-sunken flex items-center justify-between gap-2 rounded-md px-1 py-1"
              >
                <span className="text-text min-w-0 flex-1 truncate text-sm">
                  {opt.text}
                </span>
                <button
                  type="button"
                  onClick={() => removeOption(record.id, opt.id)}
                  title={t(`${PREFIX}.step2.delete_option`)}
                  aria-label={`${t(`${PREFIX}.step2.delete_option`)}: ${opt.text}`}
                  className="text-text-muted duration-base ease-out-soft hover:text-danger focus-visible:outline-focus flex-none cursor-pointer rounded-md border-none bg-transparent p-1.5 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2"
                >
                  <TrashIcon className="size-4" />
                </button>
              </li>
            ))}
          </ul>
          {record.options.length === 0 && (
            <p className="text-text-muted text-sm">
              {t(`${PREFIX}.step2.empty`)}
            </p>
          )}
          <form
            className="flex items-center gap-2"
            onSubmit={e => {
              e.preventDefault();
              handleAddOption();
            }}
          >
            <Input
              value={newOption}
              onChange={e => setNewOption(e.target.value)}
              placeholder={t(`${PREFIX}.step2.add_option_placeholder`)}
              aria-label={t(`${PREFIX}.step2.add_option`)}
            />
            <Button
              type="submit"
              variant="secondary"
              className="flex-none"
              disabled={newOption.trim() === ''}
            >
              {t(`${PREFIX}.step2.add_option`)}
            </Button>
          </form>
        </StepFrame>
      )}

      {step === 3 && (
        <StepFrame
          title={t(`${PREFIX}.step3.title`)}
          prompt={t(`${PREFIX}.step3.prompt`)}
        >
          {record.options.length === 0 ? (
            <p className="text-text-muted text-sm">
              {t(`${PREFIX}.step3.empty`)}
            </p>
          ) : (
            <div className="flex flex-col gap-5">
              {record.options.map(opt => (
                <div
                  key={opt.id}
                  className="border-border flex flex-col gap-2 rounded-lg border p-3"
                >
                  <p className="text-text font-medium">{opt.text}</p>
                  <label className={LABEL_CLASS}>
                    {t(`${PREFIX}.step3.pros_label`)}
                    <textarea
                      rows={2}
                      value={opt.pros}
                      onChange={e =>
                        updateOption(record.id, opt.id, {
                          pros: e.target.value,
                        })
                      }
                      placeholder={t(`${PREFIX}.step3.pros_placeholder`)}
                      className={TEXTAREA_CLASS}
                    />
                  </label>
                  <label className={LABEL_CLASS}>
                    {t(`${PREFIX}.step3.cons_label`)}
                    <textarea
                      rows={2}
                      value={opt.cons}
                      onChange={e =>
                        updateOption(record.id, opt.id, {
                          cons: e.target.value,
                        })
                      }
                      placeholder={t(`${PREFIX}.step3.cons_placeholder`)}
                      className={TEXTAREA_CLASS}
                    />
                  </label>
                </div>
              ))}
            </div>
          )}
        </StepFrame>
      )}

      {step === 4 && (
        <StepFrame
          title={t(`${PREFIX}.step4.title`)}
          prompt={t(`${PREFIX}.step4.prompt`)}
        >
          <label className={LABEL_CLASS}>
            {t(`${PREFIX}.step4.choose_label`)}
            <select
              value={record.chosenOptionId ?? ''}
              onChange={e =>
                update(record.id, {
                  chosenOptionId: e.target.value || undefined,
                })
              }
              className="border-border bg-surface text-text focus-visible:outline-focus min-h-[44px] w-full max-w-full min-w-0 truncate rounded-md border px-3 focus-visible:outline-2 focus-visible:outline-offset-2"
            >
              <option value="">{t(`${PREFIX}.step4.choose_none`)}</option>
              {record.options.map(opt => (
                <option key={opt.id} value={opt.id}>
                  {opt.text}
                </option>
              ))}
            </select>
          </label>
          {record.chosenOptionId ? (
            <div className="flex flex-col gap-2">
              <p className="text-text-muted text-sm">
                {t(`${PREFIX}.step4.steps_intro`)}
              </p>
              <ProblemSolvingStepList
                recordId={record.id}
                steps={record.steps}
              />
            </div>
          ) : (
            <p className="text-text-muted text-sm">
              {t(`${PREFIX}.step4.choose_first`)}
            </p>
          )}
        </StepFrame>
      )}

      {step === 5 && (
        <StepFrame
          title={t(`${PREFIX}.step5.title`)}
          prompt={t(`${PREFIX}.step5.prompt`)}
        >
          <label className={LABEL_CLASS}>
            <textarea
              rows={4}
              value={record.outcome}
              onChange={e => update(record.id, { outcome: e.target.value })}
              placeholder={t(`${PREFIX}.step5.outcome_placeholder`)}
              className={TEXTAREA_CLASS}
            />
          </label>
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

export default ProblemSolvingFlow;
