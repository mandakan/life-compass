import React from 'react';
import { Link } from 'react-router-dom';
import SettingsMenu from '../components/SettingsMenu';
import { useTranslation } from 'react-i18next';

const SettingsPage: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="bg-bg text-text h-full font-sans">
      <header className="bg-[var(--menu-bg)] p-4 text-[var(--menu-text)]">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold">Inställningar</h1>
          <Link to="/" className="text-[var(--menu-text)] underline">
            {t('back', 'Tillbaka')}
          </Link>
        </div>
      </header>
      <main className="p-4">
        <SettingsMenu />
      </main>
    </div>
  );
};

export default SettingsPage;
