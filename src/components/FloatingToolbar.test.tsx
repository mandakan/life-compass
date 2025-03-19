import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import FloatingToolbar from './FloatingToolbar';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

vi.mock('./DesktopToolbar', () => ({
  default: (props: any) => (
    <div data-testid="desktop-toolbar">
      <button onClick={props.onAddNewLifeArea}>Add New Life Area</button>
      <button onClick={props.onAddPredefinedAreas}>Add Predefined Areas</button>
      <button onClick={() => props.onImportFile('dummy data')}>Import File</button>
      <button onClick={props.onRemoveAll}>Remove All</button>
    </div>
  ),
}));

describe('FloatingToolbar', () => {
  const setup = (overrides = {}) => {
    const props = {
      onAddNewLifeArea: vi.fn(),
      onAddPredefinedAreas: vi.fn(),
      onToggleRadar: vi.fn(),
      onImportFile: vi.fn(),
      onRemoveAll: vi.fn(),
      showRadar: false,
      footerVisible: false,
      ...overrides,
    };

    render(<FloatingToolbar {...props} />);
    return props;
  };

  it('renders quick actions button and toggles expanded state', () => {
    setup();
    const quickActionsButton = screen.getByLabelText('quick_actions');
    expect(quickActionsButton).toBeDefined();
    fireEvent.click(quickActionsButton);
    expect(screen.getByTestId('desktop-toolbar')).toBeDefined();
  });

  it('toggles modal when modal button is clicked', () => {
    setup();
    const modalButton = screen.getByLabelText('brief_life_compass_intruction');
    expect(modalButton).toBeDefined();
    // Initially, the modal should not be visible
    expect(screen.queryByText('brief_life_compass_intruction')).toBeNull();
    fireEvent.click(modalButton);
    // After clicking, the modal should be visible
    expect(screen.getByText('brief_life_compass_intruction')).toBeDefined();
  });

  it('calls onToggleRadar when view toggle button is clicked', () => {
    const props = setup({ showRadar: false });
    const viewToggleButton = screen.getByLabelText('show_radar_view');
    expect(viewToggleButton).toBeDefined();
    fireEvent.click(viewToggleButton);
    expect(props.onToggleRadar).toHaveBeenCalled();
  });

  it('calls onAddNewLifeArea when "Add New Life Area" button is clicked in DesktopToolbar', () => {
    const props = setup();
    const quickActionsButton = screen.getByLabelText('quick_actions');
    fireEvent.click(quickActionsButton);
    const addNewButton = screen.getByText('Add New Life Area');
    fireEvent.click(addNewButton);
    expect(props.onAddNewLifeArea).toHaveBeenCalled();
  });

  it('calls onAddPredefinedAreas when "Add Predefined Areas" button is clicked in DesktopToolbar', () => {
    const props = setup();
    const quickActionsButton = screen.getByLabelText('quick_actions');
    fireEvent.click(quickActionsButton);
    const addPredefinedButton = screen.getByText('Add Predefined Areas');
    fireEvent.click(addPredefinedButton);
    expect(props.onAddPredefinedAreas).toHaveBeenCalled();
  });

  it('calls onImportFile when "Import File" button is clicked in DesktopToolbar', () => {
    const props = setup();
    const quickActionsButton = screen.getByLabelText('quick_actions');
    fireEvent.click(quickActionsButton);
    const importButton = screen.getByText('Import File');
    fireEvent.click(importButton);
    expect(props.onImportFile).toHaveBeenCalledWith('dummy data');
  });

  it('calls onRemoveAll when "Remove All" button is clicked in DesktopToolbar', () => {
    const props = setup();
    const quickActionsButton = screen.getByLabelText('quick_actions');
    fireEvent.click(quickActionsButton);
    const removeButton = screen.getByText('Remove All');
    fireEvent.click(removeButton);
    expect(props.onRemoveAll).toHaveBeenCalled();
  });
});
