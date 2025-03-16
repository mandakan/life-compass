import React, { useContext } from 'react';
import { ThemeContext } from '../context/ThemeContext';
import ToggleSwitch from './ToggleSwitch';
import { AppSettingsContext } from '../context/AppSettingsContext';

const SettingsMenu: React.FC = () => {
  const { theme, toggleTheme, systemTheme, followSystem, setFollowSystem } =
    useContext(ThemeContext);
  const { showDevTools, setShowDevTools } = useContext(AppSettingsContext);

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

  const handleDevToolsToggle = (checked: boolean) => {
    setShowDevTools(checked);
  };

  return (
    <div className="bg-[var(--color-bg)] p-4 text-[var(--color-text)]">
      <h2 className="mb-4 text-lg font-bold">Inställningar</h2>
      <div className="mb-4">
        <label className="flex items-center justify-between text-[var(--color-text)]">
          <span>Mörkt läge</span>
          <ToggleSwitch
            checked={theme === 'dark'}
            onChange={handleThemeToggle}
          />
        </label>
      </div>
      <div className="mb-4">
        <label className="flex items-center justify-between text-[var(--color-text)]">
          <span>Följ systemtema ({systemTheme})</span>
          <ToggleSwitch
            checked={followSystem}
            onChange={handleFollowSystemToggle}
          />
        </label>
      </div>
      <div>
        <label className="flex items-center justify-between text-[var(--color-text)]">
          <span>Visa utvecklingsverktyg</span>
          <ToggleSwitch
            checked={showDevTools}
            onChange={handleDevToolsToggle}
          />
        </label>
      </div>
    </div>
  );
};

export default SettingsMenu;
