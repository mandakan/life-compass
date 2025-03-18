import React from 'react';
import { vi, describe, test, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import LifeAreaCard, { LifeAreaCardProps } from '../components/LifeAreaCard';

// Mock react-i18next to simply return the key as translation
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

// Create a dummy CustomSlider component since it is used by LifeAreaCard
vi.mock('../components/CustomSlider', () => {
  return {
    default: (props: any) => {
      const { value, onChange, min, max, step } = props;
      return (
        <input
          data-testid="custom-slider"
          type="range"
          value={value}
          min={min}
          max={max}
          step={step}
          onChange={(e) => onChange(Number(e.target.value))}
        />
      );
    },
  };
});

// Create a dummy CustomButton component since it is used by LifeAreaCard
vi.mock('../components/CustomButton', () => {
  return {
    default: (props: any) => {
      return (
        <button data-testid="custom-button" onClick={props.onClick}>
          {props.children}
        </button>
      );
    },
  };
});

// Create a dummy WarningMessage component for testing purposes
vi.mock('../components/WarningMessage', () => {
  return {
    default: (props: any) => {
      return (
        <div data-testid="warning-message">
          {props.title}: {props.message}
        </div>
      );
    },
  };
});

const sampleArea = {
  id: '1',
  name: 'Finance',
  description: 'Manage your money',
  details: 'Detailed description of finances',
  importance: 5,
  satisfaction: 5,
};

const defaultProps: LifeAreaCardProps = {
  area: sampleArea,
  isEditing: false,
  editName: sampleArea.name,
  editDescription: sampleArea.description,
  editDetails: sampleArea.details,
  editImportance: sampleArea.importance,
  editSatisfaction: sampleArea.satisfaction,
  onChangeEditName: vi.fn(),
  onChangeEditDescription: vi.fn(),
  onChangeEditDetails: vi.fn(),
  onChangeEditImportance: vi.fn(),
  onChangeEditSatisfaction: vi.fn(),
  onSaveEdit: vi.fn(),
  onCancelEdit: vi.fn(),
  onEdit: vi.fn(),
  onRemove: vi.fn(),
  existingNames: [sampleArea.name],
  dragHandle: {},
  onAutoUpdateRating: vi.fn(),
  onInlineDetailsChange: vi.fn(),
};

describe('LifeAreaCard Component', () => {
  test('renders in non-edit mode with provided area name and shows edit and delete buttons', () => {
    render(<LifeAreaCard {...defaultProps} />);
    
    // Check if the area name is rendered
    expect(screen.getByText(sampleArea.name)).toBeInTheDocument();

    // Check for edit button by its aria-label 'edit'
    const editButton = screen.getByLabelText('edit');
    expect(editButton).toBeInTheDocument();

    // Check for delete button by aria-label containing 'delete'
    const deleteButton = screen.getByLabelText(`delete ${sampleArea.name}`);
    expect(deleteButton).toBeInTheDocument();
  });

  test('displays description popup when show description button is clicked and closes on blur', () => {
    render(<LifeAreaCard {...defaultProps} />);
    
    // Click the button that shows the description (aria-label: show_description)
    const showDescriptionButton = screen.getByLabelText('show_description');
    fireEvent.click(showDescriptionButton);

    // Check if description is rendered in popup
    expect(screen.getByText(sampleArea.description)).toBeInTheDocument();
    
    // Simulate blur event on the popup to close it
    const popup = screen.getByText(sampleArea.description).parentElement;
    if (popup) {
      fireEvent.blur(popup);
    }
  });

  test('calls onEdit when edit button is clicked in non-edit mode', () => {
    const onEditMock = vi.fn();
    render(<LifeAreaCard {...defaultProps} onEdit={onEditMock} />);
    
    const editButton = screen.getByLabelText('edit');
    fireEvent.click(editButton);
    expect(onEditMock).toHaveBeenCalledWith(sampleArea);
  });

  test('renders in edit mode and calls onChangeEditName when name input changes', () => {
    const onChangeEditNameMock = vi.fn();
    render(
      <LifeAreaCard
        {...defaultProps}
        isEditing
        editName="Finance"
        onChangeEditName={onChangeEditNameMock}
      />
    );

    // The input field for the name should be rendered as it is in edit mode
    const nameInput = screen.getByPlaceholderText('enter_life_area_name');
    expect(nameInput).toBeInTheDocument();
    
    // Change the input value and verify onChangeEditName is called
    fireEvent.change(nameInput, { target: { value: 'New Finance' } });
    expect(onChangeEditNameMock).toHaveBeenCalledWith('New Finance');
  });

  test('shows warning message when duplicate name is detected in edit mode', () => {
    // Pass an existing duplicate name via the editName prop that is different from area.name
    render(
      <LifeAreaCard
        {...defaultProps}
        isEditing
        editName="DuplicateName"
        existingNames={['Finance', 'DuplicateName']}
      />
    );
    
    // WarningMessage component should be rendered since duplicate is detected
    expect(screen.getByTestId('warning-message')).toBeInTheDocument();
    expect(screen.getByText(/duplicate_name_not_allowed/)).toBeInTheDocument();
  });

  test('calls onRemove when delete button is clicked in non-edit mode', () => {
    const onRemoveMock = vi.fn();
    render(<LifeAreaCard {...defaultProps} onRemove={onRemoveMock} />);
    
    const deleteButton = screen.getByLabelText(`delete ${sampleArea.name}`);
    fireEvent.click(deleteButton);
    expect(onRemoveMock).toHaveBeenCalledWith(sampleArea.id);
  });
});
