import React from 'react';
import { Link } from 'react-router-dom';
import SettingsMenu from '../components/SettingsMenu';
import { useTheme } from '../context/ThemeContext';
import { menu } from '../designTokens';

const SettingsPage: React.FC = () => {
  const { theme } = useTheme();

  return (
    <div className="min-h-screen bg-bg text-text">
      <header
        className="p-4"
        style={{ backgroundColor: menu[theme].background, color: menu[theme].text }}
      >
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-bold">Inställningar</h1>
          <Link to="/" className="underline" style={{ color: menu[theme].text }}>
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
