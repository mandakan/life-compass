import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import DesignPrinciplesDemo from './pages/DesignPrinciplesDemo';
import CreateLifeCompass from './pages/CreateLifeCompass';
import MobileNavigation from './components/MobileNavigation';
import DesktopNavigation from './components/DesktopNavigation';
import SettingsPage from './pages/SettingsPage';
import { ThemeProvider } from './context/ThemeContext';

const Content = () => {
  return (
    <div className="bg-bg text-text flex min-h-screen transition-colors duration-300">
      <div className="flex flex-1 flex-col">
        <header className="bg-primary text-[var(--on-primary)]">
          <div className="hidden md:block">
            <DesktopNavigation />
          </div>
          <div className="p-4 md:hidden">
            <MobileNavigation />
          </div>
        </header>
        <main className="flex-1 p-4">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route
              path="/design-principles"
              element={<DesignPrinciplesDemo />}
            />
            <Route
              path="/create-life-compass"
              element={<CreateLifeCompass />}
            />
            <Route path="/settings" element={<SettingsPage />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <Router basename={import.meta.env.BASE_URL}>
        <Content />
      </Router>
    </ThemeProvider>
  );
};

export default App;
