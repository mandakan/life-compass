import React from 'react';
import { vi, describe, test, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import CreateLifeCompass from '../pages/CreateLifeCompass';
import { ThemeProvider } from '../context/ThemeContext';
import i18n from 'i18next';
import { initReactI18next, I18nextProvider } from 'react-i18next';

const testI18n = i18n.createInstance();
testI18n.use(initReactI18next).init({
  lng: 'sv',
  fallbackLng: 'en',
  resources: {
    en: {
      translation: {
        "dismiss_callout": "Dismiss Callout",
        "Lägg till": "Lägg till",
        "Lägg till fördefinierade": "Lägg till fördefinierade",
        "Nytt livsområde": "Nytt livsområde",
        "Spara": "Spara",
        "Ta bort Nytt livsområde": "Ta bort Nytt livsområde",
        "Är du säker på att du vill ta bort detta livsområde?": "Är du säker på att du vill ta bort detta livsområde?",
        "Fortsätt": "Fortsätt",
        "Återställ": "Återställ",
        "Är du säker på att du vill återställa livsområden till standard?": "Är du säker på att du vill återställa livsområden till standard?",
        "Drag to reorder life area": "Drag to reorder life area"
      }
    },
    sv: {
      translation: {
        "dismiss_callout": "Stäng avisering",
        "Lägg till": "Lägg till",
        "Lägg till fördefinierade": "Lägg till fördefinierade",
        "Nytt livsområde": "Nytt livsområde",
        "Spara": "Spara",
        "Ta bort Nytt livsområde": "Ta bort Nytt livsområde",
        "Är du säker på att du vill ta bort detta livsområde?": "Är du säker på att du vill ta bort detta livsområde?",
        "Fortsätt": "Fortsätt",
        "Återställ": "Återställ",
        "Är du säker på att du vill återställa livsområden till standard?": "Är du säker på att du vill återställa livsområden till standard?",
        "Drag to reorder life area": "Drag to reorder life area"
      }
    }
  },
  interpolation: {
    escapeValue: false,
  },
});

describe('CreateLifeCompass Integration and Unit Tests', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  const renderComponent = () =>
    render(
      <I18nextProvider i18n={testI18n}>
        <ThemeProvider>
          <CreateLifeCompass />
        </ThemeProvider>
      </I18nextProvider>
    );

  test('adds a new life area when "Lägg till" is clicked', () => {
    renderComponent();
    const addButtons = screen.getAllByRole('button', {
      name: /^Lägg till$/i,
    });
    // Choose the first matching add new life area button
    const addButton = addButtons[0];
    fireEvent.click(addButton);
    // The new life area card is in edit mode so we expect the input with default value "Nytt livsområde"
    expect(screen.getByDisplayValue(/Nytt livsområde/i)).toBeTruthy();
  });

  test('adds predefined life areas when "Lägg till fördefinierade" is clicked', async () => {
    renderComponent();
    const predefButtons = screen.getAllByRole('button', {
      name: /^Lägg till fördefinierade$/i,
    });
    const addPredefButton = predefButtons[0];
    fireEvent.click(addPredefButton);
    expect(await screen.findByText(/Area 1/i)).toBeTruthy();
    expect(await screen.findByText(/Area 2/i)).toBeTruthy();
  });

  test('renames a life area and prevents duplicate names', async () => {
    renderComponent();
    // Add first life area and rename it to "Unique Area"
    const addButtons = screen.getAllByRole('button', {
      name: /^Lägg till$/i,
    });
    fireEvent.click(addButtons[0]);
    const firstNameInput = screen.getByPlaceholderText(/Ange livsområdesnamn/i);
    fireEvent.change(firstNameInput, { target: { value: 'Unique Area' } });
    const saveButtons = screen.getAllByRole('button', { name: /Spara/i });
    fireEvent.click(saveButtons[0]);
    expect(
      screen.getByRole('heading', { level: 4, name: /Unique Area/i }),
    ).toBeTruthy();

    // Add a second life area and try to rename to the same "Unique Area"
    fireEvent.click(addButtons[0]);
    const allNameInputs = screen.getAllByPlaceholderText(/Ange livsområdesnamn/i);
    const secondNameInput = allNameInputs[0]; // assuming the newly added area's input
    fireEvent.change(secondNameInput, { target: { value: 'Unique Area' } });
    const secondSaveButtons = screen.getAllByRole('button', { name: /Spara/i });
    // Since the duplicate check should disable saving, expect the button to be disabled
    expect((secondSaveButtons[0] as HTMLButtonElement).disabled).toBe(true);
  });

  test('removes a life area after confirmation in the deletion modal', async () => {
    renderComponent();
    const addButtons = screen.getAllByRole('button', {
      name: /^Lägg till$/i,
    });
    fireEvent.click(addButtons[0]);
    expect(screen.getByDisplayValue(/Nytt livsområde/i)).toBeTruthy();

    // Save the new life area so it exits edit mode.
    const saveButtons = screen.getAllByRole('button', { name: /Spara/i });
    fireEvent.click(saveButtons[0]);

    // Now, click the "Ta bort" button with an aria-label that exactly matches the area name.
    const removeButton = screen.getByRole('button', {
      name: 'Ta bort Nytt livsområde',
    });
    fireEvent.click(removeButton);

    // Check that the warning modal for deletion appears.
    expect(
      screen.getByText(/Är du säker på att du vill ta bort detta livsområde/i),
    ).toBeTruthy();

    // Confirm deletion by clicking "Fortsätt"
    const confirmButton = screen.getByRole('button', { name: /Fortsätt/i });
    fireEvent.click(confirmButton);

    await waitFor(() => {
      expect(screen.queryByDisplayValue(/Nytt livsområde/i)).toBeNull();
    });
  });

  test('resets life areas to predefined ones after confirmation in the reset modal', async () => {
    renderComponent();
    const addButtons = screen.getAllByRole('button', {
      name: /^Lägg till$/i,
    });
    fireEvent.click(addButtons[0]);
    expect(screen.getByDisplayValue(/Nytt livsområde/i)).toBeTruthy();

    // Click "Återställ" using button role.
    const resetButtons = screen.getAllByRole('button', {
      name: /^Återställ$/i,
    });
    fireEvent.click(resetButtons[0]);

    // Check that the reset modal appears.
    expect(
      screen.getByText(
        /Är du säker på att du vill återställa livsområden till standard/i,
      ),
    ).toBeTruthy();

    // Confirm reset by clicking "Fortsätt"
    const confirmResetButton = screen.getByRole('button', {
      name: /Fortsätt/i,
    });
    fireEvent.click(confirmResetButton);

    expect(await screen.findByText(/Area 1/i)).toBeTruthy();
    expect(await screen.findByText(/Area 2/i)).toBeTruthy();
    // Ensure the custom unsaved life area is removed
    expect(screen.queryByDisplayValue(/Nytt livsområde/i)).toBeNull();
  });

  test('reorders life areas using drag and drop simulation', async () => {
    renderComponent();
    const addButtons = screen.getAllByRole('button', {
      name: /^Lägg till$/i,
    });
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

    // Retrieve the drag handle elements using their role "img" with the aria-label.
    const dragHandles = screen.getAllByRole('img', {
      name: 'Drag to reorder life area',
    });
    expect(dragHandles.length).toBeGreaterThanOrEqual(2);
    const firstDraggable = dragHandles[0].closest('div[draggable="true"]');
    const secondDraggable = dragHandles[1].closest('div[draggable="true"]');
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
