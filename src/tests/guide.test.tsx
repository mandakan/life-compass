import { describe, it, expect, vi, beforeAll } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import i18n from './test-i18n';
import enTranslation from '../../public/locales/en/translation.json';
import Onboarding from '@components/guide/Onboarding';
import HelpGuide from '@pages/HelpGuide';

// Load the real English copy so t() resolves the actual guide keys - including
// the topic `body` arrays read via returnObjects.
beforeAll(() => {
  i18n.addResourceBundle('sv', 'translation', enTranslation, true, true);
});

describe('Onboarding (soft steps)', () => {
  it('opens on the welcome step and steps through to the finish', () => {
    const onFinish = vi.fn();
    render(<Onboarding onFinish={onFinish} />);

    // Welcome step.
    expect(
      screen.getByText('A quiet place to notice what matters.'),
    ).toBeInTheDocument();

    // welcome -> what -> weekly -> pressure -> ready (4 advances).
    for (let i = 0; i < 4; i++) {
      fireEvent.click(screen.getByRole('button', { name: 'Continue' }));
    }

    // The close lands on the "Open your compass" hand-off.
    const finish = screen.getByRole('button', { name: 'Open your compass' });
    expect(finish).toBeInTheDocument();
    fireEvent.click(finish);
    expect(onFinish).toHaveBeenCalledTimes(1);
  });

  it('skips straight to finish from any step', () => {
    const onFinish = vi.fn();
    render(<Onboarding onFinish={onFinish} />);
    fireEvent.click(screen.getByRole('button', { name: 'Skip' }));
    expect(onFinish).toHaveBeenCalledTimes(1);
  });
});

describe('HelpGuide', () => {
  const renderGuide = () =>
    render(
      <MemoryRouter>
        <HelpGuide />
      </MemoryRouter>,
    );

  it('lists every topic and offers a replay path', () => {
    renderGuide();
    expect(
      screen.getByText('A value is a direction, not a goal'),
    ).toBeInTheDocument();
    expect(
      screen.getByText('Once a week, one gentle question'),
    ).toBeInTheDocument();
    expect(
      screen.getByText('Everything stays on your device'),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Replay the welcome' }),
    ).toBeInTheDocument();
  });

  it('expands a topic to reveal its body paragraphs', () => {
    renderGuide();
    // "weekly" starts collapsed (only the first topic is open by default).
    const header = screen.getByRole('button', {
      name: /Once a week, one gentle question/,
    });
    fireEvent.click(header);
    expect(
      screen.getByText(/There are no ratings to give and no numbers to chase/),
    ).toBeInTheDocument();
  });
});
