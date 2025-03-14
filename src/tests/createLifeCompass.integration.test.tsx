import { describe, beforeEach, test, expect } from 'vitest';
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import CreateLifeCompass from '../pages/CreateLifeCompass';
import { ThemeProvider } from '../context/ThemeContext';
import { MemoryRouter } from 'react-router-dom';

describe('CreateLifeCompass Integration Tests', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  const renderComponent = () => {
    return render(
      <ThemeProvider>
        <MemoryRouter>
          <CreateLifeCompass />
        </MemoryRouter>
      </ThemeProvider>
    );
  };

  test('renders the form with default "Custom" radio selected', () => {
    renderComponent();
    expect(screen.getByText(/Create Life Compass/i)).toBeInTheDocument();
    const customRadio = screen.getByLabelText(/Custom/i);
    const predefinedRadio = screen.getByLabelText(/Predefined/i);
    expect(customRadio).toBeChecked();
    expect(predefinedRadio).not.toBeChecked();
  });

  test('displays validation error when trying to add a life area without a name', () => {
    renderComponent();
    const addButton = screen.getByText(/Lägg till livsområde/i);
    fireEvent.click(addButton);
    expect(screen.getByText(/Namn är obligatoriskt/i)).toBeInTheDocument();
  });

  test('adds a life area successfully and persists it in local storage', async () => {
    renderComponent();
    const nameInput = screen.getByLabelText(/Namn:/i);
    const descriptionInput = screen.getByLabelText(/Beskrivning:/i);
    const detailsInput = screen.getByLabelText(/Detaljer:/i);
    const importanceInput = screen.getByLabelText(/Viktighet \(1-10\):/i);
    const satisfactionInput = screen.getByLabelText(/Tillfredsställelse \(1-10\):/i);
    const addButton = screen.getByText(/Lägg till livsområde/i);

    fireEvent.change(nameInput, { target: { value: 'Health' } });
    fireEvent.change(descriptionInput, { target: { value: 'Maintain fitness and well-being' } });
    fireEvent.change(detailsInput, { target: { value: 'Regular exercise and balanced diet' } });
    fireEvent.change(importanceInput, { target: { value: '8' } });
    fireEvent.change(satisfactionInput, { target: { value: '6' } });
    fireEvent.click(addButton);

    await waitFor(() => {
      expect(screen.getByText(/Health/)).toBeInTheDocument();
    });

    const savedData = JSON.parse(localStorage.getItem('lifeCompass') || '[]');
    expect(savedData.length).toBe(1);
    expect(savedData[0].name).toBe('Health');
  });

  test('prevents duplicate life area names', () => {
    renderComponent();
    const nameInput = screen.getByLabelText(/Namn:/i);
    const addButton = screen.getByText(/Lägg till livsområde/i);

    fireEvent.change(nameInput, { target: { value: 'Career' } });
    fireEvent.click(addButton);
    expect(screen.getByText(/Career/)).toBeInTheDocument();

    // Attempt to add a duplicate life area
    fireEvent.change(nameInput, { target: { value: 'Career' } });
    fireEvent.click(addButton);
    expect(screen.getByText(/Dubblett: Samma namn får inte användas/i)).toBeInTheDocument();
  });

  test('switches to predefined life areas when radio is changed', () => {
    renderComponent();
    const predefinedRadio = screen.getByLabelText(/Predefined/i);
    fireEvent.click(predefinedRadio);
    // Check for a known predefined life area from the JSON file.
    expect(screen.getByText(/Intima relationer \/ nära relationer \/ parrelationer/i)).toBeInTheDocument();
  });

  test('displays a warning when localStorage is not available', () => {
    // Simulate localStorage being unavailable
    jest.spyOn(window, 'localStorage', 'get').mockImplementation(() => {
      throw new Error('Local Storage not available');
    });

    renderComponent();
    expect(screen.getByText(/Local Storage är inte tillgängligt/i)).toBeInTheDocument();

    // Restore the original localStorage implementation.
    jest.restoreAllMocks();
  });
});
