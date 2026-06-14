import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { TrashIcon } from '@heroicons/react/24/outline';
import type { ActionStep } from '@models/LifeCompassDocument';
import { useLifeCompassStore } from '@/store/lifeCompassStore';
import Checkbox from '@components/ui/Checkbox';
import Input from '@components/ui/Input';
import Button from '@components/ui/Button';

export interface GoalStepListProps {
  goalId: string;
  steps: ActionStep[];
}

/**
 * The list of action steps inside a single goal. Each step is a checkbox + text
 * with a delete control, plus an "add step" input. All mutations go straight to
 * the store, so toggling a step updates the goal's derived progress immediately.
 */
const GoalStepList: React.FC<GoalStepListProps> = ({ goalId, steps }) => {
  const { t } = useTranslation();
  const toggleStep = useLifeCompassStore(s => s.toggleStep);
  const removeStep = useLifeCompassStore(s => s.removeStep);
  const addStep = useLifeCompassStore(s => s.addStep);

  const [newStep, setNewStep] = useState('');

  const handleAddStep = () => {
    if (newStep.trim() === '') {
      return;
    }
    addStep(goalId, newStep);
    setNewStep('');
  };

  return (
    <div className="mt-2 flex flex-col gap-2">
      <ul className="flex flex-col gap-1">
        {steps.map(step => (
          <li key={step.id} className="flex items-center justify-between gap-2">
            <Checkbox
              checked={step.done}
              onChange={() => toggleStep(goalId, step.id)}
              label={step.text}
              className="min-w-0 flex-1"
            />
            <button
              type="button"
              onClick={() => removeStep(goalId, step.id)}
              title={t('goals.delete_step')}
              aria-label={`${t('goals.delete_step')}: ${step.text}`}
              className="flex-none cursor-pointer border-none bg-transparent text-text hover:opacity-70"
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
          placeholder={t('goals.add_step_placeholder')}
          aria-label={t('goals.add_step')}
        />
        <Button
          type="submit"
          variant="secondary"
          className="flex-none"
          disabled={newStep.trim() === ''}
        >
          {t('goals.add_step')}
        </Button>
      </form>
    </div>
  );
};

export default GoalStepList;
