import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent, within } from '@testing-library/react';
import i18n from './test-i18n';
import GoalsDialog from '@components/goals/GoalsDialog';
import { useLifeCompassStore } from '@/store/lifeCompassStore';
import type { LifeArea } from '@models/LifeArea';

// The shared test-i18n bundle is intentionally tiny; add only the keys the
// goals UI needs so t() resolves to readable English in this suite.
i18n.addResourceBundle(
  'sv',
  'translation',
  {
    save: 'Save',
    cancel: 'Cancel',
    edit: 'Edit',
    delete: 'Delete',
    continue: 'Continue',
    goals: {
      open_goals: 'Goals',
      dialog_title: 'Goals for {{area}}',
      dialog_description: 'Set goals for this life area.',
      add_goal: 'Add goal',
      add_goal_placeholder: 'What do you want to achieve?',
      empty_state: 'No goals yet.',
      goal_title: 'Goal title',
      expand_goal: 'Show steps',
      collapse_goal: 'Hide steps',
      progress_count: '{{done}}/{{total}}',
      progress_label: 'Progress for {{title}}',
      delete_goal_title: 'Delete goal',
      delete_goal_warning: 'Delete "{{title}}"?',
      add_step: 'Add step',
      add_step_placeholder: 'Add an action step',
      delete_step: 'Delete step',
    },
  },
  true,
  true,
);

const area: LifeArea = {
  id: 'area-1',
  name: 'Health',
  description: 'desc',
  details: 'details',
  importance: 8,
  satisfaction: 5,
};

function resetStore(): void {
  useLifeCompassStore.setState({ lifeAreas: [area], history: [], goals: [] });
}

describe('GoalsDialog', () => {
  beforeEach(() => {
    localStorage.clear();
    resetStore();
  });

  it('shows the empty state when the area has no goals', () => {
    render(<GoalsDialog area={area} open onOpenChange={() => {}} />);
    expect(screen.getByText('No goals yet.')).toBeInTheDocument();
  });

  it('rejects an empty goal title', () => {
    render(<GoalsDialog area={area} open onOpenChange={() => {}} />);
    const addButton = screen.getByRole('button', { name: 'Add goal' });
    // Button is disabled while empty, and submitting whitespace adds nothing.
    expect(addButton).toBeDisabled();

    const input = screen.getByLabelText('Add goal');
    fireEvent.change(input, { target: { value: '   ' } });
    fireEvent.submit(input.closest('form')!);

    expect(
      useLifeCompassStore.getState().goals.filter(g => g.areaId === area.id),
    ).toHaveLength(0);
  });

  it('adds a goal, adds a step, and updates derived progress on toggle', () => {
    render(<GoalsDialog area={area} open onOpenChange={() => {}} />);

    // Add a goal.
    const goalInput = screen.getByLabelText('Add goal');
    fireEvent.change(goalInput, { target: { value: 'Run a 5k' } });
    fireEvent.click(screen.getByRole('button', { name: 'Add goal' }));

    expect(screen.getByText('Run a 5k')).toBeInTheDocument();

    // Expand the goal to reveal its step list.
    fireEvent.click(screen.getByRole('button', { name: 'Show steps' }));

    // Add a step.
    const stepInput = screen.getByLabelText('Add step');
    fireEvent.change(stepInput, { target: { value: 'Buy shoes' } });
    fireEvent.click(screen.getByRole('button', { name: 'Add step' }));

    // Progress starts at 0/1.
    expect(screen.getByText('0/1')).toBeInTheDocument();
    const progressbar = screen.getByRole('progressbar');
    expect(progressbar).toHaveAttribute('aria-valuenow', '0');
    expect(progressbar).toHaveAttribute('aria-valuemax', '1');

    // Toggle the step done; derived progress updates immediately.
    const stepCheckbox = screen.getByRole('checkbox', { name: 'Buy shoes' });
    fireEvent.click(stepCheckbox);

    expect(screen.getByText('1/1')).toBeInTheDocument();
    expect(screen.getByRole('progressbar')).toHaveAttribute(
      'aria-valuenow',
      '1',
    );

    // The store reflects the same.
    const goal = useLifeCompassStore
      .getState()
      .goals.find(g => g.areaId === area.id);
    expect(goal?.steps).toHaveLength(1);
    expect(goal?.steps[0].done).toBe(true);
  });

  it('rejects an empty step text', () => {
    render(<GoalsDialog area={area} open onOpenChange={() => {}} />);

    const goalInput = screen.getByLabelText('Add goal');
    fireEvent.change(goalInput, { target: { value: 'Goal A' } });
    fireEvent.click(screen.getByRole('button', { name: 'Add goal' }));
    fireEvent.click(screen.getByRole('button', { name: 'Show steps' }));

    const addStep = screen.getByRole('button', { name: 'Add step' });
    expect(addStep).toBeDisabled();

    const goal = useLifeCompassStore
      .getState()
      .goals.find(g => g.areaId === area.id);
    expect(goal?.steps).toHaveLength(0);
  });

  it('shows the goal count via list items', () => {
    render(<GoalsDialog area={area} open onOpenChange={() => {}} />);
    const goalInput = screen.getByLabelText('Add goal');
    fireEvent.change(goalInput, { target: { value: 'First' } });
    fireEvent.click(screen.getByRole('button', { name: 'Add goal' }));
    fireEvent.change(goalInput, { target: { value: 'Second' } });
    fireEvent.click(screen.getByRole('button', { name: 'Add goal' }));

    const list = screen.getByRole('list');
    expect(within(list).getAllByRole('listitem')).toHaveLength(2);
  });
});
