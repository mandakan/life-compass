import React, { useRef, useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';

export interface CustomSliderProps {
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
  const { t } = useTranslation();
  const trackRef = useRef<HTMLDivElement>(null);
  const [dragging, setDragging] = useState(false);

  const calculateValue = useCallback(
    (clientX: number) => {
      if (!trackRef.current) return value;
      const { left, width: trackWidth } =
        trackRef.current.getBoundingClientRect();
      let percent = (clientX - left) / trackWidth;
      percent = Math.max(0, Math.min(1, percent));
      const range = max - min;
      let newValue = min + percent * range;
      newValue = Math.round(newValue / step) * step;
      return newValue;
    },
    [min, max, step, value],
  );

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (dragging) {
        const newValue = calculateValue(e.clientX);
        onChange(newValue);
      }
    },
    [dragging, calculateValue, onChange],
  );

  const handleMouseUp = useCallback(() => {
    if (dragging) {
      setDragging(false);
    }
  }, [dragging]);

  const handleTouchMove = useCallback(
    (e: TouchEvent) => {
      if (dragging) {
        const newValue = calculateValue(e.touches[0].clientX);
        onChange(newValue);
      }
    },
    [dragging, calculateValue, onChange],
  );

  const handleTouchEnd = useCallback(() => {
    if (dragging) {
      setDragging(false);
    }
  }, [dragging]);

  useEffect(() => {
    if (dragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      window.addEventListener('touchmove', handleTouchMove);
      window.addEventListener('touchend', handleTouchEnd);
    } else {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [
    dragging,
    handleMouseMove,
    handleMouseUp,
    handleTouchMove,
    handleTouchEnd,
  ]);

  useEffect(() => {
    if (trackRef.current) {
      const handle = trackRef.current.querySelector(
        '[role="slider"]',
      ) as HTMLElement;
      handle?.focus();
    }
  }, []);

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    setDragging(true);
    const newValue = calculateValue(e.clientX);
    onChange(newValue);
  };

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    setDragging(true);
    const newValue = calculateValue(e.touches[0].clientX);
    onChange(newValue);
  };

  const getPercentage = () => {
    return (value - min) / (max - min);
  };

  const percentage = getPercentage();
  const handleSize = 30;

  return (
    <div
      ref={trackRef}
      style={{ width: width, height: height }}
      className="relative mx-auto"
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
    >
      <div
        aria-hidden="true"
        className="absolute h-1 w-full bg-[var(--slider-track)]"
        style={{ top: height / 2 - 2 }}
      />
      <div
        tabIndex={0}
        role="slider"
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuenow={value}
        aria-label={t('custom_slider')}
        onKeyDown={e => {
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
        }}
        className="absolute flex cursor-pointer items-center justify-center rounded-full bg-[var(--slider-handle)] font-bold text-[var(--on-primary)] transition-colors select-none"
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
