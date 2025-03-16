import React from 'react';
import { Link } from 'react-router-dom';
import SettingsMenu from '../components/SettingsMenu';

const SettingsPage: React.FC = () => {
  return (
    <div className="bg-bg text-text min-h-screen font-sans">
      <header className="bg-[var(--menu-bg)] p-4 text-[var(--menu-text)]">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold">Inställningar</h1>
          <Link to="/" className="text-[var(--menu-text)] underline">
            Tillbaka
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
