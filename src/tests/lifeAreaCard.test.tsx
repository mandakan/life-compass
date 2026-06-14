// src/components/LifeAreaCard.test.tsx
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import LifeAreaCard from '@components/LifeAreaCard';
import type { LifeArea } from '@models/LifeArea';

const sampleArea: LifeArea = {
  id: '1',
  name: 'Health',
  description: 'Physical and mental wellbeing',
  importance: 8,
  satisfaction: 6,
  details: 'I’ve been exercising regularly.',
};

const defaultProps = {
  area: sampleArea,
  isEditing: false,
  onEdit: vi.fn(),
  onRemove: vi.fn(),
  onSave: vi.fn(),
  onCancel: vi.fn(),
  existingNames: [],
};

describe('LifeAreaCard', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('renders the name and description icon', () => {
    render(<LifeAreaCard {...defaultProps} />);
    expect(screen.getByText(sampleArea.name)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /edit/i })).toBeInTheDocument();
  });

  it('calls onEdit when edit button is clicked (mobile fallback)', () => {
    // Simulate mobile
    vi.stubGlobal('window', Object.assign(window, { innerWidth: 320 }));
    render(<LifeAreaCard {...defaultProps} />);
    const editButton = screen.getByLabelText(/edit/i);
    fireEvent.click(editButton);
    expect(defaultProps.onEdit).toHaveBeenCalledWith(sampleArea);
  });

  it('calls onRemove with correct id', () => {
    render(<LifeAreaCard {...defaultProps} />);
    const removeBtn = screen.getByLabelText(`Ta bort ${sampleArea.name}`);
    fireEvent.click(removeBtn);
    expect(defaultProps.onRemove).toHaveBeenCalledWith(sampleArea.id);
  });

  it('renders inline details text by default', () => {
    render(<LifeAreaCard {...defaultProps} />);
    expect(screen.getByText(sampleArea.details)).toBeInTheDocument();
  });

  it('enters inline editing mode when details are clicked', () => {
    render(<LifeAreaCard {...defaultProps} />);
    const detailsBox = screen.getByRole('button', {
      name: /klicka för att redigera detaljer/i,
    });
    fireEvent.click(detailsBox);
    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });

  it('renders edit form inline on mobile', () => {
    // Simulate mobile
    vi.stubGlobal('window', Object.assign(window, { innerWidth: 320 }));
    render(<LifeAreaCard {...defaultProps} isEditing />);
    expect(screen.getByText(/spara/i)).toBeInTheDocument();
    expect(screen.getByText(/cancel/i)).toBeInTheDocument();
  });

  it('saves the edited draft as a full area on mobile save', () => {
    // Simulate mobile so the inline edit form renders.
    vi.stubGlobal('window', Object.assign(window, { innerWidth: 320 }));
    const onSave = vi.fn();
    render(<LifeAreaCard {...defaultProps} onSave={onSave} isEditing />);
    fireEvent.click(screen.getByText(/spara/i));
    expect(onSave).toHaveBeenCalledTimes(1);
    expect(onSave).toHaveBeenCalledWith(
      expect.objectContaining({ id: sampleArea.id, name: sampleArea.name }),
    );
  });
});
