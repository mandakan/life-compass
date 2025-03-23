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
}) => {
  const { t } = useTranslation();

  return (
    <RadixSlider.Root
      className="relative flex w-full touch-none items-center select-none"
      value={[value]}
      onValueChange={([val]) => onChange(val)}
      min={min}
      max={max}
      step={step}
      aria-label={t('custom_slider')}
      style={{ width, height }}
    >
      <RadixSlider.Track className="relative h-1 grow rounded-full bg-[var(--slider-track)]">
        <RadixSlider.Range className="absolute h-full rounded-full bg-[var(--slider-range)]" />
      </RadixSlider.Track>
      <RadixSlider.Thumb className="block flex h-[30px] w-[30px] cursor-pointer items-center justify-center rounded-full bg-[var(--slider-handle)] font-bold text-[var(--on-primary)] shadow transition-colors">
        {showValueInThumb && value}
      </RadixSlider.Thumb>
    </RadixSlider.Root>
  );
};

export default Slider;
