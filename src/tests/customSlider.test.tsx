import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { describe, test, expect, vi } from 'vitest';
import CustomSlider from '../components/CustomSlider';

describe('CustomSlider', () => {
  test('renders with initial value and proper aria attributes', () => {
    const { getAllByRole } = render(<CustomSlider value={5} onChange={() => {}} />);
    const sliders = getAllByRole('slider');
    // Use the first slider element (ignoring the duplication from StrictMode)
    const slider = sliders[0];
    expect(slider).to.exist;
    expect(slider.getAttribute('aria-valuemin')).to.equal("1");
    expect(slider.getAttribute('aria-valuemax')).to.equal("10");
    expect(slider.getAttribute('aria-valuenow')).to.equal("5");
    expect(slider.textContent).to.contain("5");
  });

  test('updates value correctly using arrow keys and home/end keys', () => {
    let sliderValue = 5;
    const handleChange = vi.fn((newValue) => {
      sliderValue = newValue;
    });
    const { getAllByRole } = render(<CustomSlider value={sliderValue} onChange={handleChange} />);
    const sliders = getAllByRole('slider');
    const slider = sliders[0];

    // Explicitly focus the slider handle before sending key events.
    slider.focus();

    // Press ArrowRight: should increase by step (default step is 1)
    fireEvent.keyDown(slider, { key: 'ArrowRight', code: 'ArrowRight' });
    expect(handleChange).toHaveBeenCalledWith(6);

    // Press ArrowLeft: should decrease by step
    fireEvent.keyDown(slider, { key: 'ArrowLeft', code: 'ArrowLeft' });
    expect(handleChange).toHaveBeenCalledWith(4);

    // Press End: should set value to max (10)
    fireEvent.keyDown(slider, { key: 'End', code: 'End' });
    expect(handleChange).toHaveBeenCalledWith(10);

    // Press Home: should set value to min (1)
    fireEvent.keyDown(slider, { key: 'Home', code: 'Home' });
    expect(handleChange).toHaveBeenCalledWith(1);
  });

  test('respects custom min, max, and step values', () => {
    let sliderValue = 3;
    const handleChange = vi.fn((newValue) => {
      sliderValue = newValue;
    });
    const { getAllByRole } = render(
      <CustomSlider value={sliderValue} onChange={handleChange} min={0} max={20} step={2} />
    );
    const sliders = getAllByRole('slider');
    const slider = sliders[0];

    // Explicitly focus the slider handle before sending key events.
    slider.focus();

    // ArrowUp should increase the value by step (2)
    fireEvent.keyDown(slider, { key: 'ArrowUp', code: 'ArrowUp' });
    expect(handleChange).toHaveBeenCalledWith(5);

    // ArrowDown should decrease the value by step (2)
    fireEvent.keyDown(slider, { key: 'ArrowDown', code: 'ArrowDown' });
    expect(handleChange).toHaveBeenCalledWith(1);
  });
});
