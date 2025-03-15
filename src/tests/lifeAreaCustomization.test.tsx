import React from 'react';
import { describe, test, expect, beforeEach } from 'vitest';
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
    const addButton = screen.getByText(/Lägg till livsområde/i);
    fireEvent.click(addButton);
    expect(screen.getByText(/Nytt livsområde/i)).toBeInTheDocument();
  });

  test('adds predefined life areas when "Lägg till fördefinierade områden" is clicked', async () => {
    renderComponent();
    const addPredefButton = screen.getByText(/Lägg till fördefinierade områden/i);
    fireEvent.click(addPredefButton);
    expect(await screen.findByText(/Area 1/i)).toBeInTheDocument();
    expect(await screen.findByText(/Area 2/i)).toBeInTheDocument();
  });

  test('renames a life area and prevents duplicate names', async () => {
    renderComponent();
    // Add first area and rename it to "Unique Area"
    fireEvent.click(screen.getByText(/Lägg till livsområde/i));
    const firstNameInput = screen.getByPlaceholderText(/Ange livsområdesnamn/i);
    fireEvent.change(firstNameInput, { target: { value: 'Unique Area' } });
    fireEvent.click(screen.getByText(/Spara/i));
    expect(screen.getByText(/Unique Area/i)).toBeInTheDocument();

    // Add a second area and try to rename to the same "Unique Area"
    fireEvent.click(screen.getByText(/Lägg till livsområde/i));
    const allNameInputs = screen.getAllByPlaceholderText(/Ange livsområdesnamn/i);
    // The active edit input is the first in the list for the new area
    const secondNameInput = allNameInputs[0];
    fireEvent.change(secondNameInput, { target: { value: 'Unique Area' } });
    const saveButtons = screen.getAllByText(/Spara/i);
    // Since the duplicate check disables the save button, expect it to be disabled
    expect(saveButtons[0]).toBeDisabled();
  });

  test('removes a life area after confirmation in the deletion modal', async () => {
    renderComponent();
    fireEvent.click(screen.getByText(/Lägg till livsområde/i));
    expect(screen.getByText(/Nytt livsområde/i)).toBeInTheDocument();

    // Click the "Ta bort" button to request deletion
    const removeButton = screen.getByText(/Ta bort/i);
    fireEvent.click(removeButton);

    // Check that the warning modal for deletion appears
    expect(
      screen.getByText(/Är du säker på att du vill ta bort detta livsområde/i)
    ).toBeInTheDocument();

    // Confirm deletion by clicking "Fortsätt"
    fireEvent.click(screen.getByText(/Fortsätt/i));

    await waitFor(() => {
      expect(screen.queryByText(/Nytt livsområde/i)).not.toBeInTheDocument();
    });
  });

  test('resets life areas to predefined ones after confirmation in the reset modal', async () => {
    renderComponent();
    // Add a custom life area
    fireEvent.click(screen.getByText(/Lägg till livsområde/i));
    expect(screen.getByText(/Nytt livsområde/i)).toBeInTheDocument();

    // Click the "Återställ till standard" button
    fireEvent.click(screen.getByText(/Återställ till standard/i));

    // Check that the reset modal appears
    expect(
      screen.getByText(/Är du säker på att du vill återställa livsområden till standard/i)
    ).toBeInTheDocument();

    // Confirm reset by clicking "Fortsätt"
    fireEvent.click(screen.getByText(/Fortsätt/i));

    // Ensure predefined areas are now displayed and custom area is removed
    expect(await screen.findByText(/Area 1/i)).toBeInTheDocument();
    expect(await screen.findByText(/Area 2/i)).toBeInTheDocument();
    expect(screen.queryByText(/Nytt livsområde/i)).not.toBeInTheDocument();
  });

  test('reorders life areas using drag and drop simulation', async () => {
    renderComponent();
    // Add two life areas
    fireEvent.click(screen.getByText(/Lägg till livsområde/i));
    fireEvent.click(screen.getByText(/Lägg till livsområde/i));

    // Get headings of life areas (rendered as h4 in LifeAreaCard)
    const headings = screen.getAllByRole('heading', { level: 4 });
    expect(headings.length).toBeGreaterThanOrEqual(2);

    const firstAreaName = headings[0].textContent;
    const secondAreaName = headings[1].textContent;

    // Retrieve draggable container elements (the parent div with draggable attribute)
    const draggableItems = screen.getAllByRole('button', { name: /Redigera/i });
    const firstDraggable = draggableItems[0].closest('div[draggable="true"]');
    const secondDraggable = draggableItems[1].closest('div[draggable="true"]');
    expect(firstDraggable).not.toBeNull();
    expect(secondDraggable).not.toBeNull();

    // Simulate drag start on the first draggable element and drop on the second one
    if (firstDraggable && secondDraggable) {
      fireEvent.dragStart(firstDraggable);
      fireEvent.dragOver(secondDraggable);
      fireEvent.drop(secondDraggable);
      fireEvent.dragEnd(firstDraggable);
    }

    // Verify that the order has changed (we check that the first heading text is different)
    const updatedHeadings = screen.getAllByRole('heading', { level: 4 });
    const updatedFirstAreaName = updatedHeadings[0].textContent;
    expect(updatedFirstAreaName).not.toBe(firstAreaName);
  });
});
