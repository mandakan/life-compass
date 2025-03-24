import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, test, expect, vi, afterEach } from 'vitest';
import Slider, { SliderProps } from '@components/ui/Slider';

// 🔁 Controlled wrapper for Slider
const ControlledSlider = ({
  value: initialValue,
  onChange: externalOnChange,
  ...props
}: Partial<SliderProps> & { value: number }) => {
  const [val, setVal] = React.useState(initialValue ?? 0);

  const handleChange = (newValue: number) => {
    setVal(newValue);
    externalOnChange?.(newValue); // spion-funktionen
  };

  return <Slider {...props} value={val} onChange={handleChange} />;
};

describe('Slider', () => {
  test('renders with initial value and proper aria attributes', () => {
    const { getByRole } = render(
      <ControlledSlider value={5} onChange={() => {}} />,
    );
    const slider = getByRole('slider');

    expect(slider).to.exist;
    expect(slider.getAttribute('aria-valuemin')).to.equal('1');
    expect(slider.getAttribute('aria-valuemax')).to.equal('10');
    expect(slider.getAttribute('aria-valuenow')).to.equal('5');
    expect(slider.textContent).to.contain('5');
  });

  test('updates value correctly using arrow keys and home/end keys', async () => {
    const handleChange = vi.fn();
    const { getByRole } = render(
      <ControlledSlider value={5} onChange={handleChange} />,
    );
    const sliders = screen.getAllByRole('slider');

    const slider = sliders[0];
    // Explicitly focus the slider handle before sending key events.
    slider.focus();
    expect(document.activeElement).toBe(slider);

    // Press ArrowRight: should increase by step (default step is 1)
    await userEvent.keyboard('{ArrowRight}');
    expect(handleChange).toHaveBeenCalledWith(6);

    // Press ArrowLeft: should decrease by step
    await userEvent.keyboard('{ArrowLeft}');
    expect(handleChange).toHaveBeenCalledWith(5);

    // Press End: should set value to max (10)
    await userEvent.keyboard('{End}');
    expect(handleChange).toHaveBeenCalledWith(10);

    // Press Home: should set value to min (1)
    await userEvent.keyboard('{Home}');
    expect(handleChange).toHaveBeenCalledWith(1);
  });

  test('respects custom min, max, and step values', async () => {
    const handleChange = vi.fn();
    const { getByRole } = render(
      <ControlledSlider
        value={4}
        onChange={handleChange}
        min={0}
        max={20}
        step={2}
      />,
    );
    const sliders = screen.getAllByRole('slider');
    const slider = sliders[0];

    // Explicitly focus the slider handle before sending key events.
    slider.focus();

    // ArrowUp should increase the value by step (2)
    await userEvent.keyboard('{ArrowRight}');
    expect(handleChange).toHaveBeenCalledWith(6);

    // ArrowDown should decrease the value by step (2)
    await userEvent.keyboard('{ArrowLeft}');
    expect(handleChange).toHaveBeenCalledWith(4);
  });
});
