import { beforeEach, describe, expect, it } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import i18n from '@tests/test-i18n';
import { useLifeCompassStore } from '@/store/lifeCompassStore';
import BehavioralActivation from '@components/practices/tools/behavioral-activation/BehavioralActivation';

// Inject behavioral_activation + crisis keys into the sv bundle used by test-i18n.
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
        behavioral_activation: {
          label: 'Behavioral Activation',
          description:
            'Plan something that might feel good or meaningful, then notice how it actually went.',
          new: 'Plan an activity',
          empty_state:
            'Nothing planned yet. Plan one small activity -- something that might feel good or meaningful.',
          untitled: 'Untitled activity',
          step_label: 'Step {{current}} of {{total}}',
          back: 'Back',
          next: 'Next',
          done: 'Done',
          edit: 'Edit',
          delete: 'Delete',
          delete_confirm: 'Remove "{{title}}"? This can\'t be undone.',
          expand: 'Show details',
          collapse: 'Hide details',
          status_planned: 'Planned',
          status_done: 'Done',
          step1: {
            title: 'What will you do?',
            prompt: 'Plan something that might feel good or meaningful.',
            area_label: 'Life area (optional)',
            area_none: 'No particular area',
            activity_label: 'The activity',
            placeholder: 'e.g. a short walk, call a friend, tidy one drawer',
          },
          step2: {
            title: 'When?',
            prompt: 'Pick a rough time, if it helps. Both are optional.',
            date_label: 'Day (optional)',
            time_label: 'Time of day (optional)',
            time_none: 'No particular time',
            time_morning: 'Morning',
            time_afternoon: 'Afternoon',
            time_evening: 'Evening',
          },
          step3: {
            title: 'How do you expect it to feel?',
            prompt: "Just a guess -- there's no right answer.",
            pleasure_label: 'How good do you expect it to feel?',
            meaning_label: 'Do you expect it to feel meaningful?',
          },
          step4: {
            title: 'Afterwards',
            prompt: "Come back to this once you've done it.",
            done_label: 'I did this',
            outcome_label: 'How did it go?',
            outcome_placeholder: 'A few words on how it actually went',
            pleasure_label: 'How good did it feel?',
            meaning_label: 'Did it feel meaningful?',
            expected_tag: 'Expected',
            actual_tag: 'Actual',
          },
          pleasure_scale: {
            1: 'Not good',
            2: 'A little good',
            3: 'Okay',
            4: 'Good',
            5: 'Really good',
          },
          meaning_scale: {
            1: 'Not really',
            2: 'A little',
            3: 'Somewhat',
            4: 'Quite',
            5: 'Very meaningful',
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
    behavioralActivations: [],
  });
});

const renderTool = () =>
  render(
    <MemoryRouter>
      <BehavioralActivation />
    </MemoryRouter>,
  );

describe('BehavioralActivation tool', () => {
  it('renders the empty state', () => {
    renderTool();
    expect(
      screen.getByText(
        'Nothing planned yet. Plan one small activity -- something that might feel good or meaningful.',
      ),
    ).toBeInTheDocument();
  });

  it('creates a new activity and opens the flow', () => {
    renderTool();
    fireEvent.click(
      screen.getByRole('button', {
        name: 'Plan an activity',
      }),
    );
    expect(useLifeCompassStore.getState().behavioralActivations).toHaveLength(
      1,
    );
    // The flow shows step 1's title.
    expect(screen.getByText('What will you do?')).toBeInTheDocument();
  });
});
