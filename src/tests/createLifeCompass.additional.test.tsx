import React from 'react';
import { describe, test, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import CreateLifeCompass from '../pages/CreateLifeCompass';
import { ThemeProvider } from '../context/ThemeContext';

describe('CreateLifeCompass additional tests for User Story 1', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  test('renders CreateLifeCompass component', () => {
    render(
      <ThemeProvider>
        <CreateLifeCompass />
      </ThemeProvider>,
    );
    // Select buttons by role to avoid duplicate text from non-button elements.
    const addButtons = screen.getAllByRole('button', {
      name: 'Lägg till',
    });
    expect(addButtons[0]).toBeTruthy();
    const predefinedButtons = screen.getAllByRole('button', {
      name: 'Lägg till fördefinierade',
    });
    expect(predefinedButtons[0]).toBeTruthy();
  });

  test('adds a new life area when clicking "Lägg till"', async () => {
    render(
      <ThemeProvider>
        <CreateLifeCompass />
      </ThemeProvider>,
    );
    const addButtons = screen.getAllByRole('button', {
      name: 'Lägg till',
    });
    const addButton = addButtons[0];
    fireEvent.click(addButton);

    await waitFor(() => {
      // The default new life area should appear in the editing form.
      expect(screen.getByDisplayValue(/Nytt livsområde/i)).toBeTruthy();
    });
  });

  test('shows error when saving with empty name', async () => {
    render(
      <ThemeProvider>
        <CreateLifeCompass />
      </ThemeProvider>,
    );
    const addButtons = screen.getAllByRole('button', {
      name: 'Lägg till',
    });
    const addButton = addButtons[0];
    fireEvent.click(addButton);

    // Clear the name input in the editing form
    const nameInput = screen.getByLabelText(/Namn/i);
    fireEvent.change(nameInput, { target: { value: '' } });

    // Click the save button ("Spara") within the editing form
    const saveButton = screen.getByRole('button', { name: /Spara/i });
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(screen.getByText('Namn är obligatoriskt.')).toBeTruthy();
    });
  });

  test('prevents adding duplicate names', async () => {
    render(
      <ThemeProvider>
        <CreateLifeCompass />
      </ThemeProvider>,
    );
    const addButtons = screen.getAllByRole('button', {
      name: 'Lägg till',
    });

    // Add first life area (with default name "Nytt livsområde")
    fireEvent.click(addButtons[0]);
    const saveButton = screen.getByRole('button', { name: /Spara/i });
    fireEvent.click(saveButton);

    // Add new life area again
    fireEvent.click(addButtons[0]);
    const nameInput = screen.getByLabelText(/Namn/i);
    fireEvent.change(nameInput, { target: { value: 'Nytt livsområde' } });
    fireEvent.click(screen.getByRole('button', { name: /Spara/i }));

    await waitFor(() => {
      expect(screen.getByText('Samma namn får inte användas.')).toBeTruthy();
    });
  });

  test('updates local storage when a new life area is added', async () => {
    render(
      <ThemeProvider>
        <CreateLifeCompass />
      </ThemeProvider>,
    );
    const addButtons = screen.getAllByRole('button', {
      name: 'Lägg till',
    });
    const addButton = addButtons[0];
    fireEvent.click(addButton);

    await waitFor(() => {
      const storedData = localStorage.getItem('lifeCompass');
      expect(storedData).toBeTruthy();
      expect(storedData).toContain('Nytt livsområde');
    });
  });
});
