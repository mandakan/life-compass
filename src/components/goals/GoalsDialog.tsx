import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { LifeArea } from '@models/LifeArea';
import { useLifeCompassStore } from '@/store/lifeCompassStore';
import { useConfirmDialog } from '@components/ui/hooks/useConfirmDialog';
import Dialog from '@components/ui/Dialog';
import Input from '@components/ui/Input';
import Button from '@components/ui/Button';
import GoalItem from './GoalItem';

export interface GoalsDialogProps {
  area: LifeArea;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

/**
 * Per-area goals dialog. Shows an "add goal" input, then the area's goals as a
 * thin list of GoalItem, with an inviting empty state. Goal deletion is
 * confirmed through the shared useConfirmDialog.
 */
const GoalsDialog: React.FC<GoalsDialogProps> = ({
  area,
  open,
  onOpenChange,
}) => {
  const { t } = useTranslation();
  // Select the stable goals array and filter in render; selecting a freshly
  // filtered array each render would loop the store subscription.
  const allGoals = useLifeCompassStore(s => s.goals);
  const goals = allGoals.filter(goal => goal.areaId === area.id);
  const addGoal = useLifeCompassStore(s => s.addGoal);
  const { confirm, ConfirmationDialog } = useConfirmDialog();

  const [newGoal, setNewGoal] = useState('');

  const handleAddGoal = () => {
    if (newGoal.trim() === '') {
      return;
    }
    addGoal(area.id, newGoal);
    setNewGoal('');
  };

  const requestDeleteGoal = (title: string) =>
    confirm({
      title: t('goals.delete_goal_title'),
      message: t('goals.delete_goal_warning', { title }),
      type: 'warning',
    });

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
      title={t('goals.dialog_title', { area: area.name })}
      description={t('goals.dialog_description')}
    >
      <form
        className="flex items-center gap-2"
        onSubmit={e => {
          e.preventDefault();
          handleAddGoal();
        }}
      >
        <Input
          value={newGoal}
          onChange={e => setNewGoal(e.target.value)}
          placeholder={t('goals.add_goal_placeholder')}
          aria-label={t('goals.add_goal')}
        />
        <Button
          type="submit"
          variant="primary"
          className="flex-none"
          disabled={newGoal.trim() === ''}
        >
          {t('goals.add_goal')}
        </Button>
      </form>

      {goals.length === 0 ? (
        <p className="border-border bg-surface-sunken text-text-muted mt-6 rounded-lg border border-dashed px-4 py-6 text-center text-sm">
          {t('goals.empty_state')}
        </p>
      ) : (
        <ul className="mt-5 flex max-h-[55vh] flex-col gap-3 overflow-y-auto pr-1">
          {goals.map(goal => (
            <GoalItem
              key={goal.id}
              goal={goal}
              onRequestDelete={() => requestDeleteGoal(goal.title)}
            />
          ))}
        </ul>
      )}

      {ConfirmationDialog}
    </Dialog>
  );
};

export default GoalsDialog;
