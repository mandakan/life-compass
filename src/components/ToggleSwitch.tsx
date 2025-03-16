import React from 'react';

interface ToggleSwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
}

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({ checked, onChange, label }) => {
  return (
    <label className="relative inline-flex items-center cursor-pointer">
      <input
        type="checkbox"
        checked={checked}
        onChange={e => onChange(e.target.checked)}
        className="sr-only peer"
      />
      <div className="w-11 h-6 bg-[var(--color-secondary)] rounded-full peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-[var(--color-primary)] transition-colors duration-200 ease-in-out peer-checked:bg-[var(--color-primary)] peer-checked:after:translate-x-full peer-checked:after:border-[var(--color-bg)] after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-[var(--color-text)] after:border-[var(--border)] after:rounded-full after:h-5 after:w-5 after:transition-all dark:peer-focus:ring-[var(--color-primary)]" />
      {label && (
        <span className="ml-3 text-sm font-medium text-[var(--color-text)]">
          {label}
        </span>
      )}
    </label>
  );
};

export default ToggleSwitch;
