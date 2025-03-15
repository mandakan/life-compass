import React from 'react';
import { vi, describe, test, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import CreateLifeCompass from '../pages/CreateLifeCompass';
import { ThemeProvider } from '../context/ThemeContext';

// Mock getPredefinedLifeAreas for predictability using vi instead of jest
vi.mock('../utils/lifeAreaService', () => ({
  getPredefinedLifeAreas: vi.fn(() => [
    {
      id: 'predef1',
      name: 'Area 1',
      description: 'desc 1',
      details: 'details 1',
      importance: 5,
      satisfaction: 5,
    },
    {
      id: 'predef2',
      name: 'Area 2',
      description: 'desc 2',
      details: 'details 2',
      importance: 5,
      satisfaction: 5,
    },
  ]),
}));

describe('CreateLifeCompass Integration and Unit Tests', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  const renderComponent = () =>
    render(
      <ThemeProvider>
        <CreateLifeCompass />
      </ThemeProvider>
    );

  test('adds a new life area when "Lägg till livsområde" is clicked', () => {
    renderComponent();
    const addButtons = screen.getAllByRole('button', { name: /Lägg till livsområde/i });
    // Choose first button that matches
    const addButton = addButtons[0];
    fireEvent.click(addButton);
    // The new life area card is in edit mode so we expect the input with title "Nytt livsområde"
    expect(screen.getByDisplayValue(/Nytt livsområde/i)).toBeTruthy();
  });

  test('adds predefined life areas when "Lägg till fördefinierade områden" is clicked', async () => {
    renderComponent();
    const predefButtons = screen.getAllByRole('button', { name: /Lägg till fördefinierade områden/i });
    const addPredefButton = predefButtons[0];
    fireEvent.click(addPredefButton);
    expect(await screen.findByText(/Area 1/i)).toBeTruthy();
    expect(await screen.findByText(/Area 2/i)).toBeTruthy();
  });

  test('renames a life area and prevents duplicate names', async () => {
    renderComponent();
    // Add first life area and rename it to "Unique Area"
    const addButtons = screen.getAllByRole('button', { name: /Lägg till livsområde/i });
    fireEvent.click(addButtons[0]);
    const firstNameInput = screen.getByPlaceholderText(/Ange livsområdesnamn/i);
    fireEvent.change(firstNameInput, { target: { value: 'Unique Area' } });
    const saveButtons = screen.getAllByRole('button', { name: /Spara/i });
    fireEvent.click(saveButtons[0]);
    expect(screen.getByRole('heading', { level: 4, name: /Unique Area/i })).toBeTruthy();

    // Add a second life area and try to rename to the same "Unique Area"
    fireEvent.click(addButtons[0]);
    const allNameInputs = screen.getAllByPlaceholderText(/Ange livsområdesnamn/i);
    const secondNameInput = allNameInputs[0]; // assuming the newly added area's input
    fireEvent.change(secondNameInput, { target: { value: 'Unique Area' } });
    const secondSaveButtons = screen.getAllByRole('button', { name: /Spara/i });
    // Since the duplicate check should disable saving, expect the button to be disabled
    expect(secondSaveButtons[0].disabled).toBe(true);
  });

  test('removes a life area after confirmation in the deletion modal', async () => {
    renderComponent();
    const addButtons = screen.getAllByRole('button', { name: /Lägg till livsområde/i });
    fireEvent.click(addButtons[0]);
    expect(screen.getByDisplayValue(/Nytt livsområde/i)).toBeTruthy();

    // Save the new life area so it exits edit mode.
    const saveButtons = screen.getAllByRole('button', { name: /Spara/i });
    fireEvent.click(saveButtons[0]);

    // Now, click the "Ta bort" button with an aria-label that exactly matches the area name.
    const removeButton = screen.getByRole('button', { name: 'Ta bort Nytt livsområde' });
    fireEvent.click(removeButton);

    // Check that the warning modal for deletion appears.
    expect(screen.getByText(/Är du säker på att du vill ta bort detta livsområde/i)).toBeTruthy();

    // Confirm deletion by clicking "Fortsätt"
    const confirmButton = screen.getByRole('button', { name: /Fortsätt/i });
    fireEvent.click(confirmButton);

    await waitFor(() => {
      expect(screen.queryByDisplayValue(/Nytt livsområde/i)).toBeNull();
    });
  });

  test('resets life areas to predefined ones after confirmation in the reset modal', async () => {
    renderComponent();
    const addButtons = screen.getAllByRole('button', { name: /Lägg till livsområde/i });
    fireEvent.click(addButtons[0]);
    expect(screen.getByDisplayValue(/Nytt livsområde/i)).toBeTruthy();

    // Click "Återställ till standard" using button role.
    const resetButtons = screen.getAllByRole('button', { name: /Återställ till standard/i });
    fireEvent.click(resetButtons[0]);

    // Check that the reset modal appears.
    expect(screen.getByText(/Är du säker på att du vill återställa livsområden till standard/i)).toBeTruthy();

    // Confirm reset by clicking "Fortsätt"
    const confirmResetButton = screen.getByRole('button', { name: /Fortsätt/i });
    fireEvent.click(confirmResetButton);

    expect(await screen.findByText(/Area 1/i)).toBeTruthy();
    expect(await screen.findByText(/Area 2/i)).toBeTruthy();
    // Ensure the custom unsaved life area is removed
    expect(screen.queryByDisplayValue(/Nytt livsområde/i)).toBeNull();
  });

  test('reorders life areas using drag and drop simulation', async () => {
    renderComponent();
    const addButtons = screen.getAllByRole('button', { name: /Lägg till livsområde/i });
    // Add two life areas.
    fireEvent.click(addButtons[0]);
    // Save the first life area
    const saveButtons = screen.getAllByRole('button', { name: /Spara/i });
    fireEvent.click(saveButtons[0]);
    fireEvent.click(addButtons[0]);
    // Save the second life area
    const saveButtonsAfter = screen.getAllByRole('button', { name: /Spara/i });
    fireEvent.click(saveButtonsAfter[0]);

    // Get headings of life areas (assuming h4 elements).
    const headings = screen.getAllByRole('heading', { level: 4 });
    expect(headings.length).toBeGreaterThanOrEqual(2);

    const firstAreaName = headings[0].textContent;
    const secondAreaName = headings[1].textContent;

    // Retrieve draggable container elements by finding the "Redigera" buttons and then getting the closest draggable div.
    const editButtons = screen.getAllByRole('button', { name: /Redigera/i });
    const firstDraggable = editButtons[0].closest('div[draggable="true"]');
    const secondDraggable = editButtons[1].closest('div[draggable="true"]');
    expect(firstDraggable).toBeDefined();
    expect(secondDraggable).toBeDefined();

    if (firstDraggable && secondDraggable) {
      fireEvent.dragStart(firstDraggable);
      fireEvent.dragOver(secondDraggable);
      fireEvent.drop(secondDraggable);
      fireEvent.dragEnd(firstDraggable);
    }

    // Verify that the order has changed.
    const updatedHeadings = screen.getAllByRole('heading', { level: 4 });
    const updatedFirstAreaName = updatedHeadings[0].textContent;
    expect(updatedFirstAreaName).not.toBe(firstAreaName);
  });
});
