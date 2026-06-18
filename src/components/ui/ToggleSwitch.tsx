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
        <label className="text-text text-base font-medium">{label}</label>
      )}
      <Switch.Root
        checked={checked}
        onCheckedChange={onChange}
        className={[
          'bg-surface-sunken relative h-6 w-11 rounded-full outline-none',
          'border-border border',
          'duration-base ease-out-soft transition-colors',
          'data-[state=checked]:bg-primary data-[state=checked]:border-primary',
          'focus-visible:outline-focus focus-visible:outline-2 focus-visible:outline-offset-2',
        ].join(' ')}
      >
        <Switch.Thumb className="bg-text duration-base ease-out-soft data-[state=checked]:bg-on-primary block h-5 w-5 translate-x-0.5 rounded-full transition-transform will-change-transform data-[state=checked]:translate-x-[1.375rem]" />
      </Switch.Root>
    </div>
  );
};

export default ToggleSwitch;
