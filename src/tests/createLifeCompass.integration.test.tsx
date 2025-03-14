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
    expect(screen.getByText(/Skapa Livskompass/i)).toBeDefined();
    // Use getByRole to ensure only actual buttons are selected.
    expect(screen.getByRole('button', { name: /Lägg till livsområde/i })).toBeDefined();
    expect(screen.getByRole('button', { name: /Lägg till fördefinierade områden/i })).toBeDefined();
  });

  test('displays validation error when trying to add a life area without a name', async () => {
    renderComponent();
    const addButton = screen.getByRole('button', { name: 'Lägg till livsområde' });
    fireEvent.click(addButton);

    const nameInput = screen.getByLabelText(/Namn:/i);
    // Clear the field to force a validation error.
    fireEvent.change(nameInput, { target: { value: '' } });
    const saveButton = screen.getByRole('button', { name: /Spara/i });
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(screen.getByText(/Namn är obligatoriskt/i)).toBeDefined();
    });
  });

  test('adds a life area successfully and persists it in local storage', async () => {
    renderComponent();
    // Click the add button to reveal the editing form.
    const addButton = screen.getByRole('button', { name: 'Lägg till livsområde' });
    fireEvent.click(addButton);

    // Now get the input fields
    const nameInput = screen.getByLabelText(/Namn:/i);
    const descriptionInput = screen.getByLabelText(/Beskrivning:/i);
    const detailsInput = screen.getByLabelText(/Detaljer:/i);
    const importanceInput = screen.getByLabelText(/Viktighet \(1-10\):/i);
    const satisfactionInput = screen.getByLabelText(/Tillfredsställelse \(1-10\):/i);

    fireEvent.change(nameInput, { target: { value: 'Health' } });
    fireEvent.change(descriptionInput, {
      target: { value: 'Maintain fitness and well-being' },
    });
    fireEvent.change(detailsInput, {
      target: { value: 'Regular exercise and balanced diet' },
    });
    fireEvent.change(importanceInput, { target: { value: '8' } });
    fireEvent.change(satisfactionInput, { target: { value: '6' } });
    const saveButton = screen.getByRole('button', { name: /Spara/i });
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(screen.getByText(/Health/i)).toBeDefined();
    });

    const savedData = JSON.parse(localStorage.getItem('lifeCompass') || '[]');
    expect(savedData.length).toEqual(1);
    expect(savedData[0].name).toEqual('Health');
  });

  test('prevents duplicate life area names', async () => {
    renderComponent();
    const addButton = screen.getByRole('button', { name: 'Lägg till livsområde' });

    // Add first life area (with default name "Nytt livsområde")
    fireEvent.click(addButton);
    let saveButton = screen.getByRole('button', { name: /Spara/i });
    fireEvent.click(saveButton);
    await waitFor(() => {
      expect(screen.getByText(/Nytt livsområde/i)).toBeDefined();
    });

    // Add a second life area
    fireEvent.click(addButton);
    const nameInput = screen.getByLabelText(/Namn:/i);
    fireEvent.change(nameInput, { target: { value: 'Nytt livsområde' } });
    saveButton = screen.getByRole('button', { name: /Spara/i });
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(screen.getByText(/Dubblett: Samma namn får inte användas/i)).toBeDefined();
    });
  });

  test('adds predefined life areas when button is clicked', () => {
    renderComponent();
    const predefinedButton = screen.getByRole('button', { name: 'Lägg till fördefinierade områden' });
    fireEvent.click(predefinedButton);
    expect(
      screen.getByText(/Intima relationer \/ nära relationer \/ parrelationer/i),
    ).toBeDefined();
  });

  test('displays a warning when localStorage is not available', () => {
    vi.spyOn(window, 'localStorage', 'get').mockImplementation(() => {
      throw new Error('Local Storage not available');
    });

    renderComponent();
    expect(screen.getByText(/Local Storage är inte tillgängligt/i)).toBeDefined();
  });
});
