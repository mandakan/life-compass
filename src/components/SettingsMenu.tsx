import React, { useContext } from 'react';
import { ThemeContext } from '../context/ThemeContext';
import ToggleSwitch from './ToggleSwitch';

const SettingsMenu: React.FC = () => {
  const { theme, toggleTheme, systemTheme, followSystem, setFollowSystem } = useContext(ThemeContext);

  const handleThemeToggle = (checked: boolean) => {
    if (checked && theme !== 'dark') {
      toggleTheme();
    }
    if (!checked && theme !== 'light') {
      toggleTheme();
    }
  };

  const handleFollowSystemChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFollowSystem(event.target.checked);
  };

  return (
    <div className="p-4 bg-[var(--color-bg)] text-[var(--color-text)]">
      <h2 className="text-lg font-bold mb-4">Inställningar</h2>
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
          <input
            type="checkbox"
            checked={followSystem}
            onChange={handleFollowSystemChange}
            className="mr-2"
          />
          <span>Följ systemtema (System: {systemTheme})</span>
        </label>
      </div>
    </div>
  );
};

export default SettingsMenu;
