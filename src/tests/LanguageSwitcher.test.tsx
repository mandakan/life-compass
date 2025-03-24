import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';

vi.mock('@/lib/i18n', () => ({
  default: {
    changeLanguage: vi.fn(),
    on: vi.fn(),
    off: vi.fn(),
    language: 'sv',
  },
}));

import i18next from '@/lib/i18n';
import LanguageSwitcher from '@components/LanguageSwitcher';

vi.mock('i18next', async () => {
  const actual = await vi.importActual<typeof import('i18next')>('i18next');
  return {
    ...actual,
    language: 'sv',
    changeLanguage: vi.fn(),
    on: vi.fn(),
    off: vi.fn(),
  };
});

describe('LanguageSwitcher', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('renders the selected language name by default', () => {
    render(<LanguageSwitcher />);
    expect(screen.getByRole('button')).toHaveTextContent('Svenska');
  });

  it('renders compact mode as flag or code', () => {
    render(<LanguageSwitcher compact />);
    expect(screen.getByRole('button').textContent).toMatch(/🇸🇪|SV/);
  });

  it('opens the popover on click and displays all languages', () => {
    render(<LanguageSwitcher />);
    fireEvent.click(screen.getByRole('button'));
    const items = screen.getAllByRole('option');
    // Expect at least as many buttons as languages (plus trigger button)
    expect(items.length).toBeGreaterThan(2);
    expect(screen.getByText(/English/)).toBeInTheDocument();
  });

  it('updates selected language on click', () => {
    render(<LanguageSwitcher />);
    fireEvent.click(screen.getByRole('button'));
    const langOption = screen.getByRole('option', { name: /english/i });
    fireEvent.click(langOption);
    expect(i18next.changeLanguage).toHaveBeenCalledWith('en');
  });
});