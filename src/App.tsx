import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import DesignPrinciplesDemo from './pages/DesignPrinciplesDemo';
import CreateLifeCompass from './pages/CreateLifeCompass';
import MobileNavigation from './components/MobileNavigation';
import DesktopNavigation from './components/DesktopNavigation';
import SettingsMenu from './components/SettingsMenu';
import { ThemeProvider } from './context/ThemeContext';

const Content = () => {
  return (
    <div className="min-h-screen bg-bg text-text transition-colors duration-300 flex">
      {/* Sidebar with SettingsMenu for desktop view */}
      <aside className="hidden md:block w-64 bg-gray-100 border-r">
        <SettingsMenu />
      </aside>
      <div className="flex-1 flex flex-col">
        <header className="bg-primary text-white">
          <div className="hidden md:block">
            <DesktopNavigation />
          </div>
          <div className="md:hidden p-4">
            <MobileNavigation />
          </div>
        </header>
        <main className="flex-1 p-4">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/design-principles" element={<DesignPrinciplesDemo />} />
            <Route path="/create-life-compass" element={<CreateLifeCompass />} />
          </Routes>
        </main>
        {/* Footer with SettingsMenu for mobile view */}
        <footer className="md:hidden bg-gray-100 p-4 border-t">
          <SettingsMenu />
        </footer>
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
