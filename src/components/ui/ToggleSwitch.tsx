import * as Switch from '@radix-ui/react-switch';
import React from 'react';

interface ToggleSwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
}

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({
  checked,
  onChange,
  label,
}) => {
  return (
    <div className="flex items-center space-x-3">
      {label && (
        <label className="text-base font-medium text-text">{label}</label>
      )}
      <Switch.Root
        checked={checked}
        onCheckedChange={onChange}
        className={[
          'relative h-6 w-11 rounded-full bg-surface-sunken outline-none',
          'border border-border',
          'transition-colors duration-base ease-out-soft',
          'data-[state=checked]:bg-primary data-[state=checked]:border-primary',
          'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus',
        ].join(' ')}
      >
        <Switch.Thumb className="block h-5 w-5 translate-x-0.5 rounded-full bg-text transition-transform duration-base ease-out-soft will-change-transform data-[state=checked]:translate-x-[1.375rem] data-[state=checked]:bg-on-primary" />
      </Switch.Root>
    </div>
  );
};

export default ToggleSwitch;
