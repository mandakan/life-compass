import React, { useContext } from 'react';
import { ThemeContext } from '../context/ThemeContext';

const SettingsMenu: React.FC = () => {
  const { theme, toggleTheme, systemTheme, followSystem, setFollowSystem } = useContext(ThemeContext);

  const handleToggle = () => {
    toggleTheme();
  };

  const handleFollowSystemChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFollowSystem(event.target.checked);
  };

  return (
    <div className="p-4 bg-bg text-text">
      <h2 className="text-lg font-bold mb-4">Inställningar</h2>
      <div className="mb-4">
        <label className="flex items-center text-text">
          <span className="mr-2">Växla tema (Nuvarande: {theme})</span>
          <button
            onClick={handleToggle}
            className="px-3 py-2 bg-primary text-white rounded"
          >
            Växla tema
          </button>
        </label>
      </div>
      <div>
        <label className="flex items-center text-text">
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
