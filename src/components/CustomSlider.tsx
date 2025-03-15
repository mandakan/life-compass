import React, { useRef, useState, useEffect } from 'react';
import { colors, typography, spacing, borderRadius, transitions } from '../designTokens';

interface CustomSliderProps {
  value: number;
  min?: number;
  max?: number;
  step?: number;
  onChange: (value: number) => void;
  trackColor?: string;
  handleColor?: string;
  width?: number | string;
  height?: number;
}

const CustomSlider: React.FC<CustomSliderProps> = ({
  value,
  min = 1,
  max = 10,
  step = 1,
  onChange,
  trackColor = colors.neutral[300],
  handleColor = colors.primary,
  width = '100%',
  height = 50,
}) => {
  const trackRef = useRef<HTMLDivElement>(null);
  const [dragging, setDragging] = useState(false);

  useEffect(() => {
    // Autofocus the slider container on mount so that keyboard events get captured.
    trackRef.current?.focus();
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

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
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

  const containerStyle: React.CSSProperties = {
    position: 'relative',
    width: width,
    height: height,
    margin: '0 auto'
  };

  const trackStyle: React.CSSProperties = {
    position: 'absolute',
    width: '100%',
    height: 4,
    backgroundColor: trackColor,
    top: height / 2 - 2,
  };

  const handleStyle: React.CSSProperties = {
    position: 'absolute',
    top: (height - handleSize) / 2,
    left: `calc(${percentage * 100}% - ${handleSize / 2}px)`,
    width: handleSize,
    height: handleSize,
    borderRadius: '50%',
    backgroundColor: handleColor,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    color: '#fff',
    fontWeight: 'bold',
    cursor: 'pointer',
    userSelect: 'none',
    fontFamily: typography.primaryFont,
    transition: `background-color ${transitions.fast}`,
  };

  return (
    <div
      style={containerStyle}
      ref={trackRef}
      onMouseDown={handleMouseDown}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="slider"
      aria-valuemin={min}
      aria-valuemax={max}
      aria-valuenow={value}
      aria-label="Custom slider"
    >
      <div style={trackStyle} aria-hidden="true" />
      <div style={handleStyle} aria-hidden="true">
        {value}
      </div>
    </div>
  );
};

export default CustomSlider;
