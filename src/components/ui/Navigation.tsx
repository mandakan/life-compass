import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { AppSettingsContext } from '@context/AppSettingsContext';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from '../LanguageSwitcher';
import SettingsMenu from '../SettingsMenu';

// Heroicons
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { Cog6ToothIcon } from '@heroicons/react/24/outline';

const HeaderNavigation: React.FC = () => {
  const { t } = useTranslation();
  const { showDevTools } = useContext(AppSettingsContext);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  const toggleMobile = () => setMobileOpen(prev => !prev);
  const toggleSettings = () => setShowSettings(prev => !prev);

  return (
    <header className="bg-primary text-[var(--on-primary)] border-b border-[var(--border)]">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
        {/* Left: Title + desktop links */}
        <div className="flex items-center gap-6">
          <Link to="/" className="text-xl font-bold no-underline">
            {t('life_compass')}
          </Link>
          <div className="hidden md:flex items-center gap-4">
            <Link to="/create-life-compass">{t('create_life_compass')}</Link>
            {showDevTools && (
              <Link to="/design-principles">{t('design_principles')}</Link>
            )}
          </div>
        </div>

        {/* Right: language switcher and settings */}
        <div className="flex items-center gap-4">
          <LanguageSwitcher compact />
          <button
            aria-label={t('toggle_settings_menu')}
            onClick={toggleSettings}
            className="border-0 bg-transparent p-0"
          >
            <Cog6ToothIcon className="h-6 w-6" />
          </button>
          <button
            className="md:hidden"
            aria-label={t('toggle_mobile_navigation')}
            onClick={toggleMobile}
          >
            {mobileOpen ? (
              <XMarkIcon className="h-6 w-6" />
            ) : (
              <Bars3Icon className="h-6 w-6" />
            )}
          </button>
        </div>
      </nav>

      {/* Settings Panel */}
      {showSettings && (
        <div className="absolute right-4 top-[70px] z-50 w-72 rounded-lg border border-[var(--border)] bg-[var(--menu-bg)] p-2 shadow-lg">
          <SettingsMenu onClose={() => setShowSettings(false)} />
        </div>
      )}

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-[var(--border)] px-4 pb-4">
          <Link
            to="/"
            onClick={() => setMobileOpen(false)}
            className="block py-2"
          >
            {t('home')}
          </Link>
          <Link
            to="/create-life-compass"
            onClick={() => setMobileOpen(false)}
            className="block py-2"
          >
            {t('create_life_compass')}
          </Link>
          {showDevTools && (
            <Link
              to="/design-principles"
              onClick={() => setMobileOpen(false)}
              className="block py-2"
            >
              {t('design_principles')}
            </Link>
          )}
          <Link
            to="/settings"
            onClick={() => setMobileOpen(false)}
            className="block py-2"
          >
            {t('settings')}
          </Link>
        </div>
      )}
    </header>
  );
};

export default HeaderNavigation;