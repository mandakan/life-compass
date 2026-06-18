import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import i18n from '@tests/test-i18n';
import PracticesPage from '@pages/PracticesPage';
import { useLifeCompassStore } from '@/store/lifeCompassStore';
import BehavioralExperiment from '@components/practices/tools/behavioral-experiment/BehavioralExperiment';

// test-i18n defaults to lng/fallback 'sv' with a tiny bundle, so inject this
// tool's keys as English here (same pattern as goalsDialog.test.tsx) so that
// getByLabelText / getByText resolve to readable strings. Keep in sync with B5.
i18n.addResourceBundle(
  'sv',
  'translation',
  {
    practices: {
      tools: {
        behavioral_experiment: {
          label: 'Try a small experiment',
          add_experiment: 'Add experiment',
          add_experiment_placeholder: 'What I was worried might happen...',
          empty_state:
            'Nothing here yet. When you are ready, name a worry you would like to test.',
          experiment_title: 'What I was worried might happen',
          expand: 'Show steps',
          collapse: 'Hide steps',
          step_count: '{{done}}/{{total}} steps tried',
          add_step: 'Add something to try',
          add_step_placeholder: 'A small thing I could try...',
          delete_step: 'Remove step',
          area_label: 'Attach to a life area (optional)',
          area_none: 'Not attached to an area',
          outcome_label: 'What actually happened',
          outcome_help:
            'There are no right answers. Just notice what you noticed.',
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
  });
});

describe('PracticesPage shelf', () => {
  it('renders the shelf heading when no toolId is selected', () => {
    render(
      <MemoryRouter initialEntries={['/practices']}>
        <PracticesPage />
      </MemoryRouter>,
    );
    expect(screen.getByRole('heading', { level: 1 })).toBeTruthy();
  });
});

describe('Behavioral Experiment tool', () => {
  it('adds an experiment from the gentle prompt', () => {
    render(
      <MemoryRouter>
        <BehavioralExperiment />
      </MemoryRouter>,
    );
    const input = screen.getByLabelText(/add experiment/i);
    fireEvent.change(input, { target: { value: 'People will laugh' } });
    fireEvent.submit(input.closest('form')!);
    expect(useLifeCompassStore.getState().behavioralExperiments).toHaveLength(
      1,
    );
    expect(screen.getByText('People will laugh')).toBeTruthy();
  });

  it('never renders a percentage or a progressbar', () => {
    useLifeCompassStore.getState().addExperiment('test worry');
    const id = useLifeCompassStore.getState().behavioralExperiments[0].id;
    useLifeCompassStore.getState().addExperimentStep(id, 'try it');
    useLifeCompassStore
      .getState()
      .toggleExperimentStep(
        id,
        useLifeCompassStore.getState().behavioralExperiments[0].steps[0].id,
      );
    render(
      <MemoryRouter>
        <BehavioralExperiment />
      </MemoryRouter>,
    );
    expect(document.body.textContent).not.toContain('%');
    expect(screen.queryByRole('progressbar')).toBeNull();
  });
});
