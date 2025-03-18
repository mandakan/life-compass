import { describe, test, expect, beforeEach, beforeAll } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import CreateLifeCompass from '../pages/CreateLifeCompass';
import { ThemeProvider } from '../context/ThemeContext';
import i18n from 'i18next';
import { I18nextProvider } from 'react-i18next';

beforeAll(() => {
  // Initialize i18next with minimal configuration for tests
  i18n.init({
    lng: 'en',
    fallbackLng: 'en',
    resources: {
      en: {
        translation: {
          new_life_area: 'New Life Area',
          enter_life_area_name: 'Enter life area name',
          duplicate_name_not_allowed: 'Duplicate name not allowed',
          plus_add_new_life_area: 'Add New Life Area',
          save: 'Save',
          cancel: 'Cancel',
          edit: 'Edit',
          local_storage_not_available: 'Local storage is not available',
          unsaved_changes_warning: 'You have unsaved changes, continue?',
          remove_life_area_warning: 'Are you sure you want to remove this life area?',
          reset_life_compass_warning: 'Reset life compass to predefined life areas?',
          remove_all_life_areas_warning: 'Are you sure you want to remove all life areas?',
          import_error: 'Import error: ',
          import_successful: 'Import successful',
          close: 'Close',
          '+ Lägg till nytt livsområde': 'Add New Life Area',
        },
      },
    },
  });
});

describe('CreateLifeCompass Integration and Unit Tests', () => {
  beforeEach(() => {
    // Reset localStorage before each test
    localStorage.clear();
    // Set window.innerWidth to simulate desktop view
    window.innerWidth = 1024;
    window.dispatchEvent(new Event('resize'));
  });

  test('renders without crashing', () => {
    render(
      <I18nextProvider i18n={i18n}>
        <ThemeProvider>
          <CreateLifeCompass />
        </ThemeProvider>
      </I18nextProvider>
    );
    // Check if the default "New Life Area" text is present
    expect(screen.getByText(/New Life Area/i)).toBeInTheDocument();
  });

  test('allows adding a new life area', async () => {
    render(
      <I18nextProvider i18n={i18n}>
        <ThemeProvider>
          <CreateLifeCompass />
        </ThemeProvider>
      </I18nextProvider>
    );
    // Find the add new life area card by text
    const addButton = screen.getByText(/Add New Life Area/i);
    fireEvent.click(addButton);
    // Expect an input field with placeholder "Enter life area name" to be rendered
    await waitFor(() => {
      const nameInput = screen.getByPlaceholderText(/Enter life area name/i);
      expect(nameInput).toBeInTheDocument();
    });
  });

  test('allows editing a life area name', async () => {
    render(
      <I18nextProvider i18n={i18n}>
        <ThemeProvider>
          <CreateLifeCompass />
        </ThemeProvider>
      </I18nextProvider>
    );
    // Add a new life area
    const addButton = screen.getByText(/Add New Life Area/i);
    fireEvent.click(addButton);
    const nameInput = await screen.findByPlaceholderText(/Enter life area name/i);
    // Change the name to a custom value
    fireEvent.change(nameInput, { target: { value: 'Custom Life Area' } });
    const saveButton = screen.getByText(/Save/i);
    fireEvent.click(saveButton);
    // Verify the updated name is displayed
    await waitFor(() => {
      expect(screen.getByText('Custom Life Area')).toBeInTheDocument();
    });
  });

  test('prevents duplicate life area names when editing', async () => {
    render(
      <I18nextProvider i18n={i18n}>
        <ThemeProvider>
          <CreateLifeCompass />
        </ThemeProvider>
      </I18nextProvider>
    );
    // Add the first life area
    const addButton = screen.getByText(/Add New Life Area/i);
    fireEvent.click(addButton);
    let nameInput = await screen.findByPlaceholderText(/Enter life area name/i);
    fireEvent.change(nameInput, { target: { value: 'Life Area One' } });
    const saveButton = screen.getByText(/Save/i);
    fireEvent.click(saveButton);
    // Add a second life area
    fireEvent.click(addButton);
    nameInput = await screen.findByPlaceholderText(/Enter life area name/i);
    // Attempt to set a duplicate name
    fireEvent.change(nameInput, { target: { value: 'Life Area One' } });
    // Duplicate warning should appear
    await waitFor(() => {
      expect(screen.getByText(/Duplicate name not allowed/i)).toBeInTheDocument();
    });
    // Attempt to save with duplicate name
    fireEvent.click(saveButton);
    // Verify that the duplicate warning persists
    await waitFor(() => {
      expect(screen.getByText(/Duplicate name not allowed/i)).toBeInTheDocument();
    });
  });
});
