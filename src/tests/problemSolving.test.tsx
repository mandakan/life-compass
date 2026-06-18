import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import i18n from '@tests/test-i18n';
import { useLifeCompassStore } from '@/store/lifeCompassStore';
import ProblemSolving from '@components/practices/tools/problem-solving/ProblemSolving';

// Inject problem_solving keys into the sv bundle used by test-i18n.
// Keep in sync with public/locales/en/translation.json.
i18n.addResourceBundle(
  'sv',
  'translation',
  {
    practices: {
      crisis: {
        trigger: 'If things feel overwhelming right now',
        intro: "You don't have to sit with this alone.",
        resources: ['Emergency: call 112'],
      },
      tools: {
        problem_solving: {
          label: 'Problem solving',
          description:
            'Work a knot loose: name it, find options, weigh them, plan a small step.',
          empty_state:
            'No problems worked through yet. Start one when something feels stuck.',
          new: 'New problem to work through',
          step_label: 'Step {{current}} of {{total}}',
          back: 'Back',
          next: 'Next',
          done: 'Done',
          delete: 'Delete',
          edit: 'Edit',
          untitled: 'Untitled problem',
          expand: 'Expand',
          collapse: 'Collapse',
          delete_confirm: 'Delete "{{title}}"? This can\'t be undone.',
          step1: {
            title: "What's the knot?",
            prompt: 'Name the problem as concretely as you can.',
            problem_label: 'The problem',
            placeholder: 'e.g. I keep running out of time in the evenings.',
            area_label: 'Relates to (optional)',
            area_none: 'Not linked to an area',
          },
          step2: {
            title: 'Brainstorm options',
            prompt: 'Add a few. All ideas welcome, even the unlikely ones.',
            add_option: 'Add option',
            add_option_placeholder: 'An option worth jotting down',
            delete_option: 'Remove option',
            empty: 'No options yet. Add the first idea that comes to mind.',
          },
          step3: {
            title: 'Weigh each option',
            prompt:
              "For each one, notice what's good and what's hard. No need to score anything.",
            pros_label: "What's good about this?",
            pros_placeholder: 'What draws you to it?',
            cons_label: "What's hard about this?",
            cons_placeholder: 'What gives you pause?',
            empty: 'Add some options first, then come back here to weigh them.',
          },
          step4: {
            title: 'Choose and plan',
            prompt: 'Pick one to try, then break it into small steps.',
            choose_label: 'Which will you try?',
            choose_none: 'Not chosen yet',
            steps_intro: 'Small steps for the option you chose',
            add_step: 'Add step',
            add_step_placeholder: 'One small step',
            delete_step: 'Remove step',
            choose_first: 'Choose an option above to start planning.',
          },
          step5: {
            title: 'How did it go?',
            prompt:
              "After you've tried it, notice what actually happened. There's no right answer.",
            outcome_placeholder: 'What happened when you tried it?',
          },
        },
      },
    },
  },
  true,
  true,
);

beforeEach(() => {
  useLifeCompassStore.setState({
    lifeAreas: [],
    history: [],
    goals: [],
    behavioralExperiments: [],
    thoughtRecords: [],
    problemSolvings: [],
  });
});

const renderTool = () =>
  render(
    <MemoryRouter>
      <ProblemSolving />
    </MemoryRouter>,
  );

describe('ProblemSolving tool', () => {
  it('shows the empty state when there are no records', () => {
    renderTool();
    expect(screen.getByText(/no problems worked through yet/i)).toBeTruthy();
  });

  it('creates a new record and opens the flow', () => {
    renderTool();
    fireEvent.click(
      screen.getByRole('button', { name: /new problem to work through/i }),
    );
    expect(screen.getByText("What's the knot?")).toBeTruthy();
    expect(useLifeCompassStore.getState().problemSolvings).toHaveLength(1);
  });

  it('saves the problem text and shows the card after the flow', async () => {
    renderTool();
    fireEvent.click(
      screen.getByRole('button', { name: /new problem to work through/i }),
    );

    const textarea = screen.getByPlaceholderText(
      /i keep running out of time/i,
    ) as HTMLTextAreaElement;
    fireEvent.change(textarea, {
      target: { value: 'Evenings disappear before I get to anything' },
    });

    const clickNext = () =>
      fireEvent.click(screen.getByRole('button', { name: /^next$/i }));
    clickNext(); // -> 2
    clickNext(); // -> 3
    clickNext(); // -> 4
    clickNext(); // -> 5
    fireEvent.click(screen.getByRole('button', { name: /^done$/i }));

    await waitFor(() => {
      expect(
        screen.getByText('Evenings disappear before I get to anything'),
      ).toBeTruthy();
    });

    const recs = useLifeCompassStore.getState().problemSolvings;
    expect(recs).toHaveLength(1);
    expect(recs[0].problem).toBe('Evenings disappear before I get to anything');
  });

  it('never renders a numeric score or progress bar', () => {
    useLifeCompassStore.getState().addProblemSolving();
    const { id } = useLifeCompassStore.getState().problemSolvings[0];
    useLifeCompassStore.getState().addProblemSolvingOption(id, 'option A');
    useLifeCompassStore.getState().addProblemSolvingOption(id, 'option B');
    useLifeCompassStore.getState().updateProblemSolving(id, {
      problem: 'a knot',
    });

    renderTool();
    // Expand the card
    fireEvent.click(screen.getByRole('button', { name: /expand/i }));

    expect(document.body.textContent).not.toMatch(/\d+\s*%/);
    expect(screen.queryByRole('progressbar')).toBeNull();
  });
});
