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
    <label className="relative inline-flex cursor-pointer items-center">
      <input
        type="checkbox"
        checked={checked}
        onChange={e => onChange(e.target.checked)}
        className="peer sr-only"
      />
      <div className="h-6 w-11 rounded-full bg-[var(--details-bg)] transition-colors duration-200 ease-in-out peer-checked:bg-[var(--color-primary)] peer-focus:ring-2 peer-focus:ring-[var(--color-primary)] peer-focus:outline-none after:absolute after:top-0.5 after:left-[2px] after:h-5 after:w-5 after:rounded-full after:border-[var(--border)] after:bg-[var(--color-text)] after:transition-all after:content-[''] peer-checked:after:translate-x-full peer-checked:after:border-[var(--color-bg)] dark:peer-focus:ring-[var(--color-primary)]" />
      {label && (
        <span className="ml-3 text-sm font-medium text-[var(--color-text)]">
          {label}
        </span>
      )}
    </label>
  );
};

export default ToggleSwitch;
