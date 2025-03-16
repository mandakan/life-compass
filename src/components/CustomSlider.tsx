import React, { useRef, useState, useEffect } from 'react';

interface CustomSliderProps {
  value: number;
  min?: number;
  max?: number;
  step?: number;
  onChange: (value: number) => void;
  width?: number | string;
  height?: number;
}

const CustomSlider: React.FC<CustomSliderProps> = ({
  value,
  min = 1,
  max = 10,
  step = 1,
  onChange,
  width = '100%',
  height = 50,
}) => {
  const trackRef = useRef<HTMLDivElement>(null);
  const [dragging, setDragging] = useState(false);

  useEffect(() => {
    // Autofocus the slider handle when component mounts so that keyboard events get captured.
    if (trackRef.current) {
      // Find the slider handle (the child that renders the value) and focus it.
      const handle = trackRef.current.querySelector('[role="slider"]') as HTMLElement;
      handle?.focus();
    }
  }, []);

  const getPercentage = () => {
    return (value - min) / (max - min);
  };

  const calculateValue = (clientX: number) => {
    if (!trackRef.current) return value;
    const { left, width: trackWidth } = trackRef.current.getBoundingClientRect();
    let percent = (clientX - left) / trackWidth;
    percent = Math.max(0, Math.min(1, percent));
    const range = max - min;
    let newValue = min + percent * range;
    newValue = Math.round(newValue / step) * step;
    return newValue;
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    setDragging(true);
    const newValue = calculateValue(e.clientX);
    onChange(newValue);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (dragging) {
      const newValue = calculateValue(e.clientX);
      onChange(newValue);
    }
  };

  const handleMouseUp = () => {
    if (dragging) {
      setDragging(false);
    }
  };

  useEffect(() => {
    if (dragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    } else {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [dragging]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLElement>) => {
    switch (e.key) {
      case 'ArrowLeft':
      case 'ArrowDown':
        e.preventDefault();
        onChange(Math.max(min, value - step));
        break;
      case 'ArrowRight':
      case 'ArrowUp':
        e.preventDefault();
        onChange(Math.min(max, value + step));
        break;
      case 'Home':
        e.preventDefault();
        onChange(min);
        break;
      case 'End':
        e.preventDefault();
        onChange(max);
        break;
      default:
        break;
    }
  };

  const percentage = getPercentage();
  const handleSize = 30;

  return (
    <div
      ref={trackRef}
      style={{ width: width, height: height }}
      className="relative mx-auto"
      onMouseDown={handleMouseDown}
    >
      <div
        aria-hidden="true"
        className="absolute w-full h-1 bg-[var(--slider-track)]"
        style={{ top: height / 2 - 2 }}
      />
      <div
        tabIndex={0}
        role="slider"
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuenow={value}
        aria-label="Custom slider"
        onKeyDown={handleKeyDown}
        className="absolute flex justify-center items-center text-white font-bold cursor-pointer select-none transition-colors bg-[var(--slider-handle)] rounded-full"
        style={{
          width: handleSize,
          height: handleSize,
          top: (height - handleSize) / 2,
          left: `calc(${percentage * 100}% - ${handleSize / 2}px)`,
        }}
      >
        {value}
      </div>
    </div>
  );
};

export default CustomSlider;
