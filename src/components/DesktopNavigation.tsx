import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import SettingsMenu from './SettingsMenu';

const DesktopNavigation: React.FC = () => {
  const { theme } = useTheme();
  const [showSettings, setShowSettings] = useState(false);

  const toggleSettings = () => {
    setShowSettings(prev => !prev);
  };

  const githubIcon = (
    <svg
      className="mr-2 h-6 w-6"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      fill="currentColor"
    >
      <path d="M12 0.297c-6.63 0-12 5.373-12 12 0 5.302 3.438 9.8 8.205 11.387 0.6 0.113 0.82-0.258 0.82-0.577v-2.234c-3.338 0.726-4.033-1.416-4.033-1.416-0.546-1.387-1.333-1.756-1.333-1.756-1.089-0.744 0.084-0.729 0.084-0.729 1.205 0.084 1.838 1.234 1.838 1.234 1.07 1.834 2.809 1.304 3.495 0.997 0.108-0.776 0.418-1.304 0.762-1.604-2.665-0.304-5.467-1.332-5.467-5.93 0-1.31 0.468-2.381 1.236-3.221-0.124-0.303-0.536-1.524 0.117-3.176 0 0 1.008-0.322 3.3 1.23 0.957-0.266 1.983-0.399 3.003-0.404 1.02 0.005 2.047 0.138 3.006 0.404 2.29-1.552 3.296-1.23 3.296-1.23 0.655 1.653 0.243 2.874 0.12 3.176 0.77 0.84 1.234 1.911 1.234 3.221 0 4.61-2.807 5.624-5.481 5.921 0.43 0.372 0.823 1.102 0.823 2.222v3.293c0 0.321 0.218 0.694 0.825 0.576 4.765-1.589 8.2-6.085 8.2-11.386 0-6.627-5.373-12-12-12z" />
    </svg>
  );

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
          <h1 className="text-xl font-bold">Livskompass</h1>
        </Link>
        <Link
          to="/create-life-compass"
          className="!text-[var(--menu-text)] no-underline"
        >
          Skapa Livskompass
        </Link>
        <Link
          to="/design-principles"
          className="!text-[var(--menu-text)] no-underline"
        >
          Designprinciper
        </Link>
      </div>
      <div className="relative flex items-center gap-4">
        <a
          href="https://github.com/mandakan/life-compass"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center !text-[var(--menu-text)] no-underline"
        >
          {githubIcon}
          <span>GitHub</span>
        </a>
        <button
          onClick={toggleSettings}
          className="cursor-pointer border-0 bg-transparent p-0"
          aria-label="Toggle settings menu"
        >
          {settingsIcon}
        </button>
        {showSettings && (
          <div className="absolute top-full right-0 z-50 w-72 rounded-lg border border-[var(--border)] bg-[var(--menu-bg)] p-2">
            <SettingsMenu />
          </div>
        )}
      </div>
    </nav>
  );
};

export default DesktopNavigation;
