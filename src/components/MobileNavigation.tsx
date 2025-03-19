import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { AppSettingsContext } from '../context/AppSettingsContext';

const MobileNavigation: React.FC = () => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const { showDevTools } = useContext(AppSettingsContext);

  return (
    <nav className="fixed top-0 left-0 z-50 w-full bg-[var(--menu-bg)] p-4 text-[var(--menu-text)]">
      <div className="flex items-center justify-between">
        <div className="text-lg font-bold">
          <Link to="/" className="mobile-nav-link text-[var(--menu-text)] no-underline">
            {t('life_compass')}
          </Link>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setOpen(!open)}
            className="cursor-pointer border-0 bg-transparent p-0"
            aria-label={t('toggle_mobile_navigation')}
          >
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              {open ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>
      </div>
      {open && (
        <div className="mt-2 flex flex-col gap-2">
          <Link to="/" onClick={() => setOpen(false)} className="mobile-nav-link text-[var(--menu-text)] underline">
            {t('home')}
          </Link>
          <Link to="/create-life-compass" onClick={() => setOpen(false)} className="mobile-nav-link text-[var(--menu-text)] underline">
            {t('create_life_compass')}
          </Link>
          {showDevTools && (
            <Link
              to="/design-principles"
              onClick={() => setOpen(false)}
              className="mobile-nav-link text-[var(--menu-text)] underline"
            >
              {t('design_principles')}
            </Link>
          )}
          <Link to="/settings" onClick={() => setOpen(false)} className="mobile-nav-link text-[var(--menu-text)] underline">
            {t('settings')}
          </Link>
        </div>
      )}
    </nav>
  );
};

export default MobileNavigation;
