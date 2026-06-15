import React, { useContext, useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AppSettingsContext } from '@context/AppSettingsContext';
import { useTheme } from '@context/ThemeContext';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from '../LanguageSwitcher';

// Heroicons
import {
  Bars3Icon,
  XMarkIcon,
  Cog6ToothIcon,
  MoonIcon,
  SunIcon,
} from '@heroicons/react/24/outline';

const HeaderNavigation: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { showDevTools } = useContext(AppSettingsContext);
  const { theme, setTheme } = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);

  const toggleButtonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const isDark = theme === 'dark';
  const toggleTheme = () => setTheme(isDark ? 'light' : 'dark');

  const closeMobile = () => setMobileOpen(false);
  const toggleMobile = () => setMobileOpen(prev => !prev);

  // Focus management: move focus into the menu when it opens, restore it to the
  // toggle when it closes, and close on Escape.
  useEffect(() => {
    if (!mobileOpen) return;

    const firstLink = menuRef.current?.querySelector<HTMLElement>('a, button');
    firstLink?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setMobileOpen(false);
        toggleButtonRef.current?.focus();
      }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [mobileOpen]);

  const desktopLinkClass =
    'rounded-md px-2 py-1 text-text-muted no-underline transition-colors duration-base ease-out-soft hover:text-text focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus';

  // No `display` here on purpose: `cn` is plain clsx (no tailwind-merge), so a
  // base `inline-flex` would override a responsive `hidden`/`md:hidden`. Each
  // button sets its own display so the responsive visibility actually applies.
  const iconButtonClass =
    'min-h-[44px] min-w-[44px] items-center justify-center rounded-md border border-transparent bg-transparent text-text transition-colors duration-base ease-out-soft hover:bg-surface-sunken focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus';

  const mobileLinkClass =
    'block rounded-md px-3 py-3 text-base text-text no-underline transition-colors duration-base ease-out-soft hover:bg-surface-sunken focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus';

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-surface/85 backdrop-blur supports-[backdrop-filter]:bg-surface/75">
      <nav
        aria-label={t('primary_navigation', 'Primary')}
        className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-3 py-3 sm:gap-4 sm:px-4"
      >
        {/* Left: wordmark + desktop links */}
        <div className="flex min-w-0 items-center gap-6">
          <Link
            to="/"
            className="min-w-0 truncate font-display text-lg font-semibold text-primary no-underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus sm:text-xl"
          >
            {t('life_compass')}
          </Link>
          <div className="hidden items-center gap-1 md:flex">
            <Link to="/" className={desktopLinkClass}>
              {t('nav.compass', 'Compass')}
            </Link>
            <Link to="/help" className={desktopLinkClass}>
              {t('nav.help', 'Help')}
            </Link>
            <Link to="/about" className={desktopLinkClass}>
              {t('nav.about', 'About')}
            </Link>
            {showDevTools && (
              <Link to="/design-principles" className={desktopLinkClass}>
                {t('design_principles')}
              </Link>
            )}
          </div>
        </div>

        {/* Right: language switcher, theme toggle, settings, mobile menu */}
        <div className="flex shrink-0 items-center gap-2">
          <LanguageSwitcher compact />
          <button
            type="button"
            onClick={toggleTheme}
            aria-label={t('toggle_theme', 'Toggle light and dark theme')}
            aria-pressed={isDark}
            className={`inline-flex ${iconButtonClass}`}
          >
            {isDark ? (
              <SunIcon className="h-6 w-6" />
            ) : (
              <MoonIcon className="h-6 w-6" />
            )}
          </button>
          <button
            type="button"
            onClick={() => navigate('/settings')}
            aria-label={t('go_to_settings_menu')}
            className={`hidden md:inline-flex ${iconButtonClass}`}
          >
            <Cog6ToothIcon className="h-6 w-6" />
          </button>
          <button
            ref={toggleButtonRef}
            type="button"
            className={`inline-flex md:hidden ${iconButtonClass}`}
            aria-label={t('toggle_mobile_navigation')}
            aria-expanded={mobileOpen}
            aria-controls="mobile-navigation-menu"
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
        <div
          id="mobile-navigation-menu"
          ref={menuRef}
          className="border-t border-border bg-surface px-4 py-2 md:hidden"
        >
          <Link to="/" onClick={closeMobile} className={mobileLinkClass}>
            {t('home')}
          </Link>
          <Link to="/" onClick={closeMobile} className={mobileLinkClass}>
            {t('nav.compass', 'Compass')}
          </Link>
          <Link to="/help" onClick={closeMobile} className={mobileLinkClass}>
            {t('nav.help', 'Help')}
          </Link>
          <Link to="/about" onClick={closeMobile} className={mobileLinkClass}>
            {t('nav.about', 'About')}
          </Link>
          {showDevTools && (
            <Link
              to="/design-principles"
              onClick={closeMobile}
              className={mobileLinkClass}
            >
              {t('design_principles')}
            </Link>
          )}
          <Link
            to="/settings"
            onClick={closeMobile}
            className={mobileLinkClass}
          >
            {t('settings')}
          </Link>
        </div>
      )}
    </header>
  );
};

export default HeaderNavigation;
