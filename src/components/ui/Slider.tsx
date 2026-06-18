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
      className={`relative flex touch-none select-none ${isVertical ? 'h-full flex-col items-center' : 'w-full items-center'}`}
      value={[value]}
      onValueChange={([val]) => onChange(val)}
      min={min}
      max={max}
      step={step}
      aria-label={t('custom_slider')}
      orientation={orientation}
      style={{ width, height }}
    >
      <RadixSlider.Track
        className={`bg-surface-sunken relative mx-auto rounded-full ${isVertical ? 'h-full w-1' : 'h-1 w-full'}`}
      >
        <RadixSlider.Range
          className={`bg-primary absolute rounded-full ${isVertical ? 'w-full' : 'h-full'}`}
        />
      </RadixSlider.Track>
      <RadixSlider.Thumb className="bg-primary text-on-primary shadow-warm-md duration-base ease-out-soft focus-visible:outline-focus flex h-[44px] w-[44px] cursor-pointer items-center justify-center rounded-full font-bold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2">
        {showValueInThumb && value}
      </RadixSlider.Thumb>
    </RadixSlider.Root>
  );
};

export default Slider;
