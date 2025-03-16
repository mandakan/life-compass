import React, { useContext } from 'react';
import { ThemeContext } from '../context/ThemeContext';
import ToggleSwitch from './ToggleSwitch';

const SettingsMenu: React.FC = () => {
  const { theme, toggleTheme, systemTheme, followSystem, setFollowSystem } =
    useContext(ThemeContext);

  const handleThemeToggle = (checked: boolean) => {
    if (checked && theme !== 'dark') {
      toggleTheme();
    }
    if (!checked && theme !== 'light') {
      toggleTheme();
    }
  };

  const handleFollowSystemToggle = (checked: boolean) => {
    setFollowSystem(checked);
  };

  return (
    <div className="bg-[var(--color-bg)] p-4 text-[var(--color-text)]">
      <h2 className="mb-4 text-lg font-bold">Inställningar</h2>
      <div className="mb-4">
        <label className="flex items-center text-[var(--color-text)]">
          <span className="mr-2">Mörkt läge</span>
          <ToggleSwitch
            checked={theme === 'dark'}
            onChange={handleThemeToggle}
          />
        </label>
      </div>
      <div>
        <label className="flex items-center text-[var(--color-text)]">
          <ToggleSwitch
            checked={followSystem}
            onChange={handleFollowSystemToggle}
          />
          <span className="ml-2">Följ systemtema (System: {systemTheme})</span>
        </label>
      </div>
    </div>
  );
};

export default SettingsMenu;
