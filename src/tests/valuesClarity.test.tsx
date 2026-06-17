import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import i18n from '@tests/test-i18n';
import { useLifeCompassStore } from '@/store/lifeCompassStore';
import ValuesClarity from '@components/practices/tools/values-clarity/ValuesClarity';
import { LifeArea } from '@models/LifeArea';

// test-i18n defaults to lng/fallback 'sv' with a tiny bundle, so inject this
// tool's keys (plus the shared scale words it reuses) as English here, matching
// the behavioralExperiment.test.tsx pattern.
i18n.addResourceBundle(
  'sv',
  'translation',
  {
    your_compass: {
      scale: {
        matters: { 1: 'A little', 4: 'A lot', 5: 'Deeply' },
        lived: { 1: 'Far from it', 4: 'Mostly', 5: 'Fully' },
      },
    },
    practices: {
      tools: {
        values_clarity: {
          label: 'A clarity session',
          step_label: 'Step {{current}} of {{total}}',
          back: 'Back',
          next: 'Next',
          done: 'Finish',
          empty_state: 'Name a few life areas first.',
          empty_cta: 'Go to your compass',
          step1: { title: 'What matters', prompt: 'Notice what pulls.' },
          step2: { title: "How it's lived", prompt: 'How close did it feel?' },
          step3: {
            title: 'Where the gap is',
            prompt: 'What drifts apart.',
            gap_far: 'feels far from what matters',
            gap_near: 'a small distance',
            gap_aligned: 'feels aligned',
            all_aligned: 'Nothing feels far off.',
          },
          step4: {
            title: 'One small step',
            prompt_focus: '{{area}} feels furthest from what matters.',
            prompt_aligned: 'Nothing feels far off right now.',
            cta: 'Open your compass to add a step',
          },
        },
      },
    },
  },
  true,
  true,
);

const area = (over: Partial<LifeArea>): LifeArea => ({
  id: Math.random().toString(36).slice(2),
  name: 'Area',
  description: '',
  details: '',
  importance: 10,
  satisfaction: 10,
  ...over,
});

beforeEach(() => {
  useLifeCompassStore.setState({
    lifeAreas: [],
    history: [],
    goals: [],
    behavioralExperiments: [],
  });
});

const renderTool = () =>
  render(
    <MemoryRouter>
      <ValuesClarity />
    </MemoryRouter>,
  );

describe('Values Clarity session', () => {
  it('shows a gentle empty state when there are no life areas', () => {
    renderTool();
    expect(screen.getByText(/name a few life areas first/i)).toBeTruthy();
  });

  it('walks from "what matters" to "how it\'s lived"', () => {
    useLifeCompassStore.setState({
      lifeAreas: [area({ name: 'Family', importance: 10, satisfaction: 2 })],
    });
    renderTool();
    expect(screen.getByText('What matters')).toBeTruthy();
    expect(screen.getByText('Family')).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: /next/i }));
    expect(screen.getByText("How it's lived")).toBeTruthy();
  });

  it('focuses the widest-gap area on the final step', () => {
    useLifeCompassStore.setState({
      lifeAreas: [
        area({ name: 'Health', importance: 10, satisfaction: 10 }),
        area({ name: 'Family', importance: 10, satisfaction: 2 }),
      ],
    });
    renderTool();
    const next = () =>
      fireEvent.click(screen.getByRole('button', { name: /next/i }));
    next();
    next();
    next();
    expect(screen.getByText('One small step')).toBeTruthy();
    expect(screen.getByText(/Family feels furthest/i)).toBeTruthy();
  });

  it('never renders a percentage or a progressbar', () => {
    useLifeCompassStore.setState({
      lifeAreas: [area({ name: 'Work', importance: 8, satisfaction: 4 })],
    });
    renderTool();
    expect(document.body.textContent).not.toContain('%');
    expect(screen.queryByRole('progressbar')).toBeNull();
  });
});
