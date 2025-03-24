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
        <label className="text-sm font-medium text-[var(--color-text)]">
          {label}
        </label>
      )}
      <Switch.Root
        checked={checked}
        onCheckedChange={onChange}
        className="relative h-6 w-11 rounded-full bg-[var(--details-bg)] transition-colors outline-none data-[state=checked]:bg-[var(--color-primary)]"
      >
        <Switch.Thumb className="block h-5 w-5 translate-x-0.5 rounded-full bg-[var(--color-text)] transition-transform duration-200 will-change-transform data-[state=checked]:translate-x-[1.375rem] data-[state=checked]:bg-[var(--color-bg)]" />
      </Switch.Root>
    </div>
  );
};

export default ToggleSwitch;
