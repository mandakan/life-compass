import React from 'react';
import { Link } from 'react-router-dom';
import SettingsMenu from '../components/SettingsMenu';

const SettingsPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-bg text-text font-sans">
      <header className="p-4 bg-[var(--menu-bg)] text-[var(--menu-text)]">
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-bold">Inställningar</h1>
          <Link to="/" className="underline text-[var(--menu-text)]">
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
