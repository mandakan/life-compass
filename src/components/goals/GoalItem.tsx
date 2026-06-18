import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  ChevronDownIcon,
  ChevronRightIcon,
  PencilIcon,
  TrashIcon,
} from '@heroicons/react/24/outline';
import type { Goal } from '@models/LifeCompassDocument';
import { useLifeCompassStore } from '@/store/lifeCompassStore';
import { goalProgress } from '@utils/goalProgress';
import ProgressBar from '@components/ui/ProgressBar';
import Input from '@components/ui/Input';
import Button from '@components/ui/Button';
import GoalStepList from './GoalStepList';

export interface GoalItemProps {
  goal: Goal;
  /** Confirms deletion; resolves true when the user accepts. */
  onRequestDelete: () => Promise<boolean>;
}

/**
 * A single goal row: inline-editable title, a derived progress bar, and an
 * expandable step list with edit/delete actions. Reads and writes the store
 * directly so progress reflects step changes without prop plumbing.
 */
const GoalItem: React.FC<GoalItemProps> = ({ goal, onRequestDelete }) => {
  const { t } = useTranslation();
  const updateGoal = useLifeCompassStore(s => s.updateGoal);
  const removeGoal = useLifeCompassStore(s => s.removeGoal);

  const [expanded, setExpanded] = useState(false);
  const [editing, setEditing] = useState(false);
  const [draftTitle, setDraftTitle] = useState(goal.title);

  const progress = goalProgress(goal);

  const handleSaveTitle = () => {
    if (draftTitle.trim() === '') {
      return;
    }
    updateGoal(goal.id, { title: draftTitle.trim() });
    setEditing(false);
  };

  const handleDelete = async () => {
    const ok = await onRequestDelete();
    if (ok) {
      removeGoal(goal.id);
    }
  };

  return (
    <li className="border-border bg-surface shadow-warm-sm rounded-lg border p-4">
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => setExpanded(prev => !prev)}
          aria-expanded={expanded}
          aria-label={
            expanded ? t('goals.collapse_goal') : t('goals.expand_goal')
          }
          className="text-text-muted duration-base ease-out-soft hover:text-text focus-visible:outline-focus -m-1 flex-none cursor-pointer rounded-md border-none bg-transparent p-1 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2"
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
              aria-label={t('goals.goal_title')}
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
                setDraftTitle(goal.title);
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
            className="text-text min-w-0 flex-1 cursor-pointer truncate border-none bg-transparent text-left font-medium"
            title={goal.title}
          >
            {goal.title}
          </button>
        )}

        {!editing && (
          <div className="flex flex-none items-center gap-1">
            <span className="bg-surface-sunken text-text-muted rounded-full px-2 py-0.5 text-xs font-medium whitespace-nowrap">
              {t('goals.progress_count', {
                done: progress.done,
                total: progress.total,
              })}
            </span>
            <button
              type="button"
              onClick={() => {
                setDraftTitle(goal.title);
                setEditing(true);
              }}
              title={t('edit')}
              aria-label={`${t('edit')}: ${goal.title}`}
              className="text-text-muted duration-base ease-out-soft hover:text-text focus-visible:outline-focus cursor-pointer rounded-md border-none bg-transparent p-1.5 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2"
            >
              <PencilIcon className="size-4" />
            </button>
            <button
              type="button"
              onClick={handleDelete}
              title={t('delete')}
              aria-label={`${t('delete')}: ${goal.title}`}
              className="text-text-muted duration-base ease-out-soft hover:text-danger focus-visible:outline-focus cursor-pointer rounded-md border-none bg-transparent p-1.5 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2"
            >
              <TrashIcon className="size-4" />
            </button>
          </div>
        )}
      </div>

      <div className="mt-3">
        <ProgressBar
          value={progress.done}
          max={progress.total}
          label={t('goals.progress_label', { title: goal.title })}
          className="h-2.5"
        />
      </div>

      {expanded && <GoalStepList goalId={goal.id} steps={goal.steps} />}
    </li>
  );
};

export default GoalItem;
