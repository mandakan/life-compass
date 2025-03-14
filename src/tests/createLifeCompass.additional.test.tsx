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
      </ThemeProvider>
    );
    expect(screen.getByText('Skapa Livskompass')).toBeInTheDocument();
    // Select buttons by role to avoid duplicate text from non-button elements.
    expect(screen.getByRole('button', { name: 'Lägg till livsområde' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Lägg till fördefinierade områden' })).toBeInTheDocument();
  });

  test('adds a new life area when clicking "Lägg till livsområde"', async () => {
    render(
      <ThemeProvider>
        <CreateLifeCompass />
      </ThemeProvider>
    );
    const addButton = screen.getByRole('button', { name: 'Lägg till livsområde' });
    fireEvent.click(addButton);

    await waitFor(() => {
      // The default new life area should appear in the editing form.
      expect(screen.getByDisplayValue(/Nytt livsområde/i)).toBeInTheDocument();
    });
  });

  test('shows error when saving with empty name', async () => {
    render(
      <ThemeProvider>
        <CreateLifeCompass />
      </ThemeProvider>
    );
    const addButton = screen.getByRole('button', { name: 'Lägg till livsområde' });
    fireEvent.click(addButton);

    // Clear the name input in the editing form
    const nameInput = screen.getByLabelText(/Namn:/i);
    fireEvent.change(nameInput, { target: { value: '' } });

    // Click the save button ("Spara") within the editing form
    const saveButton = screen.getByRole('button', { name: /Spara/i });
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(screen.getByText('Namn är obligatoriskt.')).toBeInTheDocument();
    });
  });

  test('prevents adding duplicate names', async () => {
    render(
      <ThemeProvider>
        <CreateLifeCompass />
      </ThemeProvider>
    );
    const addButton = screen.getByRole('button', { name: 'Lägg till livsområde' });

    // Add first life area (with default name "Nytt livsområde")
    fireEvent.click(addButton);
    const saveButton = screen.getByRole('button', { name: /Spara/i });
    fireEvent.click(saveButton);

    // Add new life area again
    fireEvent.click(addButton);
    const nameInput = screen.getByLabelText(/Namn:/i);
    fireEvent.change(nameInput, { target: { value: 'Nytt livsområde' } });
    fireEvent.click(screen.getByRole('button', { name: /Spara/i }));

    await waitFor(() => {
      expect(screen.getByText('Dubblett: Samma namn får inte användas.')).toBeInTheDocument();
    });
  });

  test('updates local storage when a new life area is added', async () => {
    render(
      <ThemeProvider>
        <CreateLifeCompass />
      </ThemeProvider>
    );
    const addButton = screen.getByRole('button', { name: 'Lägg till livsområde' });
    fireEvent.click(addButton);

    await waitFor(() => {
      const storedData = localStorage.getItem('lifeCompass');
      expect(storedData).toBeTruthy();
      expect(storedData).toContain('Nytt livsområde');
    });
  });
});
