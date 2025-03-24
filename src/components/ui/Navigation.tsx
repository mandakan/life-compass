import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AppSettingsContext } from '@context/AppSettingsContext';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from '../LanguageSwitcher';
import SettingsMenu from '../SettingsMenu';

// Heroicons
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { Cog6ToothIcon } from '@heroicons/react/24/outline';

const HeaderNavigation: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { showDevTools } = useContext(AppSettingsContext);
  const [mobileOpen, setMobileOpen] = useState(false);

  const toggleMobile = () => setMobileOpen(prev => !prev);


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
            onClick={() => navigate('/settings')}
            aria-label={t('go_to_settings_menu')}
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