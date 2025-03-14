import { describe, beforeEach, afterEach, test, expect, vi } from 'vitest';
import React from 'react';
import {
  render,
  screen,
  fireEvent,
  waitFor,
  cleanup,
} from '@testing-library/react';
import CreateLifeCompass from '../pages/CreateLifeCompass';
import { ThemeProvider } from '../context/ThemeContext';
import { MemoryRouter } from 'react-router-dom';

describe('CreateLifeCompass Integration Tests', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });

  const renderComponent = () => {
    return render(
      <ThemeProvider>
        <MemoryRouter>
          <CreateLifeCompass />
        </MemoryRouter>
      </ThemeProvider>,
    );
  };

  test('renders the CreateLifeCompass form correctly', () => {
    renderComponent();
    expect(screen.getByText(/Skapa Livskompass/i)).to.exist;
    expect(screen.getByText(/Lägg till livsområde/i)).to.exist;
    expect(screen.getByText(/Lägg till fördefinierade områden/i)).to.exist;
  });

  test('displays validation error when trying to add a life area without a name', () => {
    renderComponent();
    const addButtons = screen.getAllByText(/Lägg till livsområde/i);
    fireEvent.click(addButtons[0]);
    expect(screen.getByText(/Namn är obligatoriskt/i)).to.exist;
  });

  test('adds a life area successfully and persists it in local storage', async () => {
    renderComponent();
    const nameInput = screen.getByLabelText(/Namn:/i);
    const descriptionInput = screen.getByLabelText(/Beskrivning:/i);
    const detailsInput = screen.getByLabelText(/Detaljer:/i);
    const importanceInput = screen.getByLabelText(/Viktighet \(1-10\):/i);
    const satisfactionInput = screen.getByLabelText(/Tillfredsställelse \(1-10\):/i);
    const addButtons = screen.getAllByText(/Lägg till livsområde/i);
    const addButton = addButtons[0];

    fireEvent.change(nameInput, { target: { value: 'Health' } });
    fireEvent.change(descriptionInput, {
      target: { value: 'Maintain fitness and well-being' },
    });
    fireEvent.change(detailsInput, {
      target: { value: 'Regular exercise and balanced diet' },
    });
    fireEvent.change(importanceInput, { target: { value: '8' } });
    fireEvent.change(satisfactionInput, { target: { value: '6' } });
    fireEvent.click(addButton);

    await waitFor(() => {
      expect(screen.getByText(/Health/i)).to.exist;
    });

    const savedData = JSON.parse(localStorage.getItem('lifeCompass') || '[]');
    expect(savedData.length).to.equal(1);
    expect(savedData[0].name).to.equal('Health');
  });

  test('prevents duplicate life area names', () => {
    renderComponent();
    const nameInput = screen.getByLabelText(/Namn:/i);
    const addButtons = screen.getAllByText(/Lägg till livsområde/i);
    const addButton = addButtons[0];

    fireEvent.change(nameInput, { target: { value: 'Career' } });
    fireEvent.click(addButton);
    expect(screen.getByText(/Career/i)).to.exist;

    fireEvent.change(nameInput, { target: { value: 'Career' } });
    fireEvent.click(addButton);
    expect(screen.getByText(/Dubblett: Samma namn får inte användas/i)).to.exist;
  });

  test('adds predefined life areas when button is clicked', () => {
    renderComponent();
    const predefinedButton = screen.getByText(/Lägg till fördefinierade områden/i);
    fireEvent.click(predefinedButton);
    expect(
      screen.getByText(/Intima relationer \/ nära relationer \/ parrelationer/i),
    ).to.exist;
  });

  test('displays a warning when localStorage is not available', () => {
    vi.spyOn(window, 'localStorage', 'get').mockImplementation(() => {
      throw new Error('Local Storage not available');
    });

    renderComponent();
    expect(screen.getByText(/Local Storage är inte tillgängligt/i)).to.exist;
  });
});
