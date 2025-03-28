import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import HomePage from './pages/HomePage';
import DesignPrinciplesDemo from './pages/DesignPrinciplesDemo';
import CreateLifeCompass from './pages/CreateLifeCompass';
import About from './pages/About';
import PrivacyPolicy from './pages/PrivacyPolicy';
import Navigation from '@components/ui/Navigation';
import SettingsPage from './pages/SettingsPage';
import { ThemeProvider } from './context/ThemeContext';
import AppSettingsProvider from './context/AppSettingsContext';
import Footer from './components/Footer';

const Content = () => {
  const { t } = useTranslation();
  useEffect(() => {
    document.title = t('life_compass_title', 'Livskompass');
  }, [t]);

  return (
    <div className="bg-bg text-text bg-escher flex min-h-screen transition-colors duration-300">
      <div className="flex flex-1 flex-col">
        <Navigation />
        <main className="mb-16 flex-1 md:mb-0">
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
            <Route path="/about" element={<About />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <AppSettingsProvider>
        <Router basename={import.meta.env.BASE_URL}>
          <Content />
        </Router>
      </AppSettingsProvider>
    </ThemeProvider>
  );
};

export default App;
