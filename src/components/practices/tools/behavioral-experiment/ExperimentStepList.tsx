import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { TrashIcon } from '@heroicons/react/24/outline';
import type { ActionStep } from '@models/LifeCompassDocument';
import { useLifeCompassStore } from '@/store/lifeCompassStore';
import Checkbox from '@components/ui/Checkbox';
import Input from '@components/ui/Input';
import Button from '@components/ui/Button';

export interface ExperimentStepListProps {
  experimentId: string;
  steps: ActionStep[];
}

const PREFIX = 'practices.tools.behavioral_experiment';

/**
 * The "things to try" list inside one experiment. Toggling a step is just
 * noticing what was tried -- it is never framed as progress toward a target.
 */
const ExperimentStepList: React.FC<ExperimentStepListProps> = ({
  experimentId,
  steps,
}) => {
  const { t } = useTranslation();
  const toggleStep = useLifeCompassStore(s => s.toggleExperimentStep);
  const removeStep = useLifeCompassStore(s => s.removeExperimentStep);
  const addStep = useLifeCompassStore(s => s.addExperimentStep);

  const [newStep, setNewStep] = useState('');

  const handleAddStep = () => {
    if (newStep.trim() === '') {
      return;
    }
    addStep(experimentId, newStep);
    setNewStep('');
  };

  return (
    <div className="mt-3 flex flex-col gap-3 border-t border-border pt-3">
      <ul className="flex flex-col gap-1">
        {steps.map(step => (
          <li
            key={step.id}
            className="flex items-center justify-between gap-2 rounded-md px-1 py-1 hover:bg-surface-sunken"
          >
            <Checkbox
              checked={step.done}
              onChange={() => toggleStep(experimentId, step.id)}
              label={step.text}
              className="min-w-0 flex-1"
            />
            <button
              type="button"
              onClick={() => removeStep(experimentId, step.id)}
              title={t(`${PREFIX}.delete_step`)}
              aria-label={`${t(`${PREFIX}.delete_step`)}: ${step.text}`}
              className="flex-none cursor-pointer rounded-md border-none bg-transparent p-1.5 text-text-muted transition-colors duration-base ease-out-soft hover:text-danger focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
            >
              <TrashIcon className="size-4" />
            </button>
          </li>
        ))}
      </ul>

      <form
        className="flex items-center gap-2"
        onSubmit={e => {
          e.preventDefault();
          handleAddStep();
        }}
      >
        <Input
          value={newStep}
          onChange={e => setNewStep(e.target.value)}
          placeholder={t(`${PREFIX}.add_step_placeholder`)}
          aria-label={t(`${PREFIX}.add_step`)}
        />
        <Button
          type="submit"
          variant="secondary"
          className="flex-none"
          disabled={newStep.trim() === ''}
        >
          {t(`${PREFIX}.add_step`)}
        </Button>
      </form>
    </div>
  );
};

export default ExperimentStepList;
