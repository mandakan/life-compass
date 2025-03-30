import React from 'react';
import * as RadixSlider from '@radix-ui/react-slider';
import { useTranslation } from 'react-i18next';

export interface SliderProps {
  value: number;
  min?: number;
  max?: number;
  step?: number;
  onChange: (value: number) => void;
  width?: number | string;
  height?: number;
  showValueInThumb?: boolean;
  orientation?: 'horizontal' | 'vertical';
}

const Slider: React.FC<SliderProps> = ({
  value,
  min = 1,
  max = 10,
  step = 1,
  onChange,
  width = '100%',
  height = 50,
  showValueInThumb = true,
  orientation = 'horizontal',
}) => {
  const { t } = useTranslation();
  const isVertical = orientation === 'vertical';

  return (
    <RadixSlider.Root
      className={`relative touch-none select-none ${isVertical ? 'flex h-full flex-col' : 'flex w-full items-center'}`}
      value={[value]}
      onValueChange={([val]) => onChange(val)}
      min={min}
      max={max}
      step={step}
      aria-label={t('custom_slider')}
      orientation={orientation}
      style={{ width, height }}
    >
      <RadixSlider.Track className={`relative rounded-full bg-[var(--slider-track)] ${isVertical ? 'w-1 h-full' : 'h-1 w-full'}`}>
        <RadixSlider.Range className={`absolute rounded-full bg-[var(--slider-range)] ${isVertical ? 'w-full' : 'h-full'}`} />
      </RadixSlider.Track>
      <RadixSlider.Thumb className="block flex h-[30px] w-[30px] cursor-pointer items-center justify-center rounded-full bg-[var(--slider-handle)] font-bold text-[var(--on-primary)] shadow transition-colors">
        {showValueInThumb && value}
      </RadixSlider.Thumb>
    </RadixSlider.Root>
  );
};

export default Slider;
