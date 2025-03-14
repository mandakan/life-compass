import { describe, beforeEach, afterEach, test, expect, vi } from 'vitest';
import React from 'react';
import { render, screen, fireEvent, waitFor, cleanup } from '@testing-library/react';
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
      </ThemeProvider>
    );
  };

  test('renders the form with default "Custom" radio selected', () => {
    renderComponent();
    expect(screen.getByText(/Create Life Compass/i)).to.exist;
    const customRadio = screen.getByLabelText(/Custom/i);
    const predefinedRadio = screen.getByLabelText(/Predefined/i);
    expect(customRadio.checked).to.be.true;
    expect(predefinedRadio.checked).to.be.false;
  });

  test('displays validation error when trying to add a life area without a name', () => {
    renderComponent();
    // Use getAllByText because there are duplicate buttons in the document
    const addButtons = screen.getAllByText(/Lägg till livsområde/i);
    // Click the first button (the one associated with the form)
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
    // There are duplicate buttons so choose the first one.
    const addButtons = screen.getAllByText(/Lägg till livsområde/i);
    const addButton = addButtons[0];

    fireEvent.change(nameInput, { target: { value: 'Health' } });
    fireEvent.change(descriptionInput, { target: { value: 'Maintain fitness and well-being' } });
    fireEvent.change(detailsInput, { target: { value: 'Regular exercise and balanced diet' } });
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
    // Again, get the first add button.
    const addButtons = screen.getAllByText(/Lägg till livsområde/i);
    const addButton = addButtons[0];

    fireEvent.change(nameInput, { target: { value: 'Career' } });
    fireEvent.click(addButton);
    expect(screen.getByText(/Career/i)).to.exist;

    // Attempt to add a duplicate life area
    fireEvent.change(nameInput, { target: { value: 'Career' } });
    fireEvent.click(addButton);
    expect(screen.getByText(/Dubblett: Samma namn får inte användas/i)).to.exist;
  });

  test('switches to predefined life areas when radio is changed', () => {
    renderComponent();
    // There may be duplicate radio inputs so get the first match for the label
    const predefinedRadio = screen.getAllByLabelText(/Predefined/i)[0];
    fireEvent.click(predefinedRadio);
    // Check for a known predefined life area from the JSON file.
    expect(screen.getByText(/Intima relationer \/ nära relationer \/ parrelationer/i)).to.exist;
  });

  test('displays a warning when localStorage is not available', () => {
    // Simulate localStorage being unavailable using vi.spyOn
    vi.spyOn(window, 'localStorage', 'get').mockImplementation(() => {
      throw new Error('Local Storage not available');
    });

    renderComponent();
    expect(screen.getByText(/Local Storage är inte tillgängligt/i)).to.exist;
  });
});
