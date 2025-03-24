import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import SettingsMenu from './SettingsMenu';
import { AppSettingsContext } from '@context/AppSettingsContext';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from './LanguageSwitcher';

const DesktopNavigation: React.FC = () => {
  const { t } = useTranslation();
  const { showDevTools } = useContext(AppSettingsContext);
  const [showSettings, setShowSettings] = useState(false);

  const toggleSettings = () => {
    setShowSettings(prev => !prev);
  };

  const settingsIcon = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth="1.5"
      stroke="currentColor"
      className="size-6"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M10.5 6h9.75M10.5 6a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-9.75 0h9.75"
      />
    </svg>
  );

  return (
    <nav className="relative flex w-full items-center justify-between bg-[var(--menu-bg)] px-4 py-4">
      <div className="flex items-center gap-4">
        <Link to="/" className="!text-[var(--menu-text)] no-underline">
          <h1 className="text-xl font-bold">{t('life_compass')}</h1>
        </Link>
        <Link
          to="/create-life-compass"
          className="!text-[var(--menu-text)] no-underline"
        >
          {t('create_life_compass')}
        </Link>
        {showDevTools && (
          <Link
            to="/design-principles"
            className="!text-[var(--menu-text)] no-underline"
          >
            {t('design_principles')}
          </Link>
        )}
      </div>
      <div className="relative flex items-center gap-4">
        <LanguageSwitcher compact />
        <button
          onMouseDown={e => e.stopPropagation()}
          onClick={toggleSettings}
          className="cursor-pointer border-0 bg-transparent p-0"
          aria-label={t('toggle_settings_menu')}
        >
          {settingsIcon}
        </button>
        {showSettings && (
          <div className="absolute top-full right-0 z-50 w-72 rounded-lg border border-[var(--border)] bg-[var(--menu-bg)] p-2">
            <SettingsMenu onClose={() => setShowSettings(false)} />
          </div>
        )}
      </div>
    </nav>
  );
};

export default DesktopNavigation;
