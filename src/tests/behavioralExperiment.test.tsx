import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import '@tests/test-i18n';
import PracticesPage from '@pages/PracticesPage';

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
