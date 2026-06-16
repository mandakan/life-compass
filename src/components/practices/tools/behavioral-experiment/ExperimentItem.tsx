import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  ChevronDownIcon,
  ChevronRightIcon,
  PencilIcon,
  TrashIcon,
} from '@heroicons/react/24/outline';
import type { BehavioralExperiment } from '@models/LifeCompassDocument';
import { useLifeCompassStore } from '@/store/lifeCompassStore';
import Input from '@components/ui/Input';
import Button from '@components/ui/Button';
import ExperimentStepList from './ExperimentStepList';
import OutcomeField from './OutcomeField';

export interface ExperimentItemProps {
  experiment: BehavioralExperiment;
  /** Confirms removal; resolves true when the user accepts. */
  onRequestDelete: () => Promise<boolean>;
}

const PREFIX = 'practices.tools.behavioral_experiment';

const ExperimentItem: React.FC<ExperimentItemProps> = ({
  experiment,
  onRequestDelete,
}) => {
  const { t } = useTranslation();
  const updateExperiment = useLifeCompassStore(s => s.updateExperiment);
  const removeExperiment = useLifeCompassStore(s => s.removeExperiment);
  const setOutcome = useLifeCompassStore(s => s.setExperimentOutcome);

  const [expanded, setExpanded] = useState(false);
  const [editing, setEditing] = useState(false);
  const [draftTitle, setDraftTitle] = useState(experiment.title);

  const total = experiment.steps.length;
  const done = experiment.steps.filter(step => step.done).length;

  const handleSaveTitle = () => {
    if (draftTitle.trim() === '') {
      return;
    }
    updateExperiment(experiment.id, { title: draftTitle.trim() });
    setEditing(false);
  };

  const handleDelete = async () => {
    const ok = await onRequestDelete();
    if (ok) {
      removeExperiment(experiment.id);
    }
  };

  return (
    <li className="rounded-lg border border-border bg-surface p-4 shadow-warm-sm">
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => setExpanded(prev => !prev)}
          aria-expanded={expanded}
          aria-label={expanded ? t(`${PREFIX}.collapse`) : t(`${PREFIX}.expand`)}
          className="-m-1 flex-none cursor-pointer rounded-md border-none bg-transparent p-1 text-text-muted transition-colors duration-base ease-out-soft hover:text-text focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
        >
          {expanded ? (
            <ChevronDownIcon className="size-5" />
          ) : (
            <ChevronRightIcon className="size-5" />
          )}
        </button>

        {editing ? (
          <form
            className="flex min-w-0 flex-1 items-center gap-2"
            onSubmit={e => {
              e.preventDefault();
              handleSaveTitle();
            }}
          >
            <Input
              autoFocus
              value={draftTitle}
              onChange={e => setDraftTitle(e.target.value)}
              aria-label={t(`${PREFIX}.experiment_title`)}
            />
            <Button
              type="submit"
              variant="primary"
              className="flex-none"
              disabled={draftTitle.trim() === ''}
            >
              {t('save')}
            </Button>
            <Button
              type="button"
              variant="ghost"
              className="flex-none"
              onClick={() => {
                setDraftTitle(experiment.title);
                setEditing(false);
              }}
            >
              {t('cancel')}
            </Button>
          </form>
        ) : (
          <button
            type="button"
            onClick={() => setExpanded(prev => !prev)}
            className="min-w-0 flex-1 cursor-pointer truncate border-none bg-transparent text-left font-medium text-text"
            title={experiment.title}
          >
            {experiment.title}
          </button>
        )}

        {!editing && (
          <div className="flex flex-none items-center gap-1">
            {total > 0 && (
              <span className="rounded-full bg-surface-sunken px-2 py-0.5 text-xs font-medium whitespace-nowrap text-text-muted">
                {t(`${PREFIX}.step_count`, { done, total })}
              </span>
            )}
            <button
              type="button"
              onClick={() => {
                setDraftTitle(experiment.title);
                setEditing(true);
              }}
              title={t('edit')}
              aria-label={`${t('edit')}: ${experiment.title}`}
              className="cursor-pointer rounded-md border-none bg-transparent p-1.5 text-text-muted transition-colors duration-base ease-out-soft hover:text-text focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
            >
              <PencilIcon className="size-4" />
            </button>
            <button
              type="button"
              onClick={handleDelete}
              title={t('delete')}
              aria-label={`${t('delete')}: ${experiment.title}`}
              className="cursor-pointer rounded-md border-none bg-transparent p-1.5 text-text-muted transition-colors duration-base ease-out-soft hover:text-danger focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
            >
              <TrashIcon className="size-4" />
            </button>
          </div>
        )}
      </div>

      {expanded && (
        <>
          <ExperimentStepList
            experimentId={experiment.id}
            steps={experiment.steps}
          />
          <OutcomeField
            value={experiment.outcome}
            onCommit={next => setOutcome(experiment.id, next)}
          />
        </>
      )}
    </li>
  );
};

export default ExperimentItem;
