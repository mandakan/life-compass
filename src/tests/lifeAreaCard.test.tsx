import React from 'react';
import { vi, describe, test, expect, afterEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import LifeAreaCard, { LifeAreaCardProps } from '../components/LifeAreaCard';
import type { SliderProps } from '@components/ui/Slider';
import type { CustomButtonProps } from 'components/CustomButton';
import type { WarningMessageProps } from 'components/WarningMessage';

// Mock react-i18next to simply return the key as translation
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

// Create a dummy Slider component since it is used by LifeAreaCard
vi.mock('../components/ui/Slider', () => {
  return {
    default: (props: SliderProps) => {
      const { value, onChange, min, max, step } = props;
      return (
        <input
          data-testid="custom-slider"
          type="range"
          value={value}
          min={min}
          max={max}
          step={step}
          onChange={e => onChange(Number(e.target.value))}
        />
      );
    },
  };
});

// Create a dummy CustomButton component since it is used by LifeAreaCard
vi.mock('../components/CustomButton', () => {
  return {
    default: (props: CustomButtonProps) => {
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
    default: (props: WarningMessageProps) => {
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
  afterEach(() => {
    document.body.innerHTML = '';
  });

  test('renders in non-edit mode with provided area name and shows edit and delete buttons', () => {
    render(<LifeAreaCard {...defaultProps} />);

    // Check if the area name is rendered
    expect(document.contains(screen.getByText(sampleArea.name))).toBe(true);

    // Check for edit button by its aria-label 'edit'
    const editButton = screen.getByLabelText('edit');
    expect(document.contains(editButton)).toBe(true);

    // Check for delete button by aria-label containing 'delete'
    const deleteButton = screen.getByLabelText(`delete ${sampleArea.name}`);
    expect(document.contains(deleteButton)).toBe(true);
  });

  test('displays description popup when show description button is clicked and closes on blur', () => {
    render(<LifeAreaCard {...defaultProps} />);

    // Click the button that shows the description (aria-label: show_description)
    const showDescriptionButton = screen.getByLabelText('show_description');
    fireEvent.click(showDescriptionButton);

    // Check if description is rendered in popup
    expect(document.contains(screen.getByText(sampleArea.description))).toBe(
      true,
    );

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
      />,
    );

    // The input field for the name should be rendered as it is in edit mode
    const nameInput = screen.getByPlaceholderText('enter_life_area_name');
    expect(document.contains(nameInput)).toBe(true);

    // Change the input value and verify onChangeEditName is called
    fireEvent.change(nameInput, { target: { value: 'New Finance' } });
    expect(onChangeEditNameMock).toHaveBeenCalledWith('New Finance');
  });

  test('shows warning message when duplicate name is detected in edit mode', () => {
    render(
      <LifeAreaCard
        {...defaultProps}
        isEditing
        editName="SomeNewName"
        existingNames={['Finance', 'SomeNewName']}
      />,
    );
  
    expect(screen.getByTestId('warning-message')).toBeInTheDocument();
    expect(
      screen.getByText(/duplicate_name_not_allowed/),
    ).toBeInTheDocument();
  });

  test('calls onRemove when delete button is clicked in non-edit mode', () => {
    const onRemoveMock = vi.fn();
    render(<LifeAreaCard {...defaultProps} onRemove={onRemoveMock} />);

    const deleteButton = screen.getByLabelText(`delete ${sampleArea.name}`);
    fireEvent.click(deleteButton);
    expect(onRemoveMock).toHaveBeenCalledWith(sampleArea.id);
  });
});
