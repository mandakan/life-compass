import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import i18n from './test-i18n';
import AreaDetail from '@components/your-compass/AreaDetail';
import { fromBucket } from '@utils/compassModel';
import type { LifeArea } from '@models/LifeArea';

// The shared test-i18n bundle is intentionally tiny; add only the keys the
// area editor needs so t() resolves to readable English in this suite.
i18n.addResourceBundle(
  'sv',
  'translation',
  {
    your_compass: {
      detail: {
        close: 'Close',
        name_aria: 'Name this area',
        name_placeholder: 'Name this area',
        prompt_aria: 'A few words for what this means',
        prompt_placeholder: 'a few words for what this means to you',
        value_label: 'What you value here',
        value_help: "In your own words. There's no right answer.",
        value_placeholder:
          'What does living well in this area look like for you?',
        matters_label: 'How much does this matter to you?',
        matters_help: 'Your compass needle.',
        lived_label: 'How close did you live to it this past week?',
        lived_help: 'Just this week.',
        remove: 'Remove',
        done: 'Done',
        goals: 'Goals',
        new_area_aria: 'New area',
      },
      reflection: {
        far_off: 'Far off.',
        close: 'Close.',
        aligned: 'Aligned.',
        small_distance: 'A small distance.',
      },
      scale: {
        matters: {
          1: 'A little',
          2: 'Somewhat',
          3: 'Quite a bit',
          4: 'A lot',
          5: 'Deeply',
        },
        lived: {
          1: 'Far from it',
          2: 'A little',
          3: 'Some of the time',
          4: 'Mostly',
          5: 'Fully',
        },
      },
    },
  },
  true,
  true,
);

const sampleArea: LifeArea = {
  id: 'area-1',
  name: 'Health',
  description: 'Physical and mental wellbeing',
  details: 'Move every day.',
  importance: 6,
  satisfaction: 6,
};

const defaultProps = {
  area: sampleArea,
  isNew: false,
  history: [],
  onClose: vi.fn(),
  onChange: vi.fn(),
  onRemove: vi.fn(),
};

describe('AreaDetail', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('renders the editable name and value field', () => {
    render(<AreaDetail {...defaultProps} />);
    expect(screen.getByLabelText('Name this area')).toHaveValue('Health');
    expect(screen.getByText('What you value here')).toBeInTheDocument();
  });

  it('calls onChange with { importance } when a matters pill is tapped', () => {
    const onChange = vi.fn();
    render(<AreaDetail {...defaultProps} onChange={onChange} />);
    // "Deeply" is unique to the matters scale (bucket 5).
    fireEvent.click(screen.getByRole('button', { name: 'Deeply' }));
    expect(onChange).toHaveBeenCalledWith({ importance: fromBucket(5) });
  });

  it('calls onChange with { satisfaction } when a lived pill is tapped', () => {
    const onChange = vi.fn();
    render(<AreaDetail {...defaultProps} onChange={onChange} />);
    // "Fully" is unique to the lived scale (bucket 5).
    fireEvent.click(screen.getByRole('button', { name: 'Fully' }));
    expect(onChange).toHaveBeenCalledWith({ satisfaction: fromBucket(5) });
  });

  it('calls onRemove with the area id when Remove is clicked', () => {
    const onRemove = vi.fn();
    render(<AreaDetail {...defaultProps} onRemove={onRemove} />);
    fireEvent.click(screen.getByRole('button', { name: 'Remove' }));
    expect(onRemove).toHaveBeenCalledWith(sampleArea.id);
  });
});
