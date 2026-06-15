import React, { useEffect } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import YourCompass from './pages/YourCompass';
import DesignPrinciplesDemo from './pages/DesignPrinciplesDemo';
import About from './pages/About';
import PrivacyPolicy from './pages/PrivacyPolicy';
import HelpGuide from './pages/HelpGuide';
import WelcomePage from './pages/WelcomePage';
import Navigation from '@components/ui/Navigation';
import SettingsPage from './pages/SettingsPage';
import { ThemeProvider } from './context/ThemeContext';
import AppSettingsProvider from './context/AppSettingsContext';
import Footer from './components/Footer';

const Content = () => {
  const { t } = useTranslation();
  const location = useLocation();
  // The welcome flow is immersive: it carries its own minimal top bar, so the
  // standard app header and footer step aside on that route.
  const immersive = location.pathname === '/welcome';

  useEffect(() => {
    document.title = t('life_compass_title', 'Livskompass');
  }, [t]);

  return (
    <div className="bg-bg text-text bg-escher flex min-h-screen transition-colors duration-300">
      <div className="flex flex-1 flex-col">
        {!immersive && <Navigation />}
        <main className={immersive ? 'flex-1' : 'mb-16 flex-1 md:mb-0'}>
          <Routes>
            <Route path="/" element={<YourCompass />} />
            <Route path="/welcome" element={<WelcomePage />} />
            <Route path="/help" element={<HelpGuide />} />
            <Route
              path="/design-principles"
              element={<DesignPrinciplesDemo />}
            />
            <Route
              path="/create-life-compass"
              element={<Navigate to="/" replace />}
            />
            <Route path="/about" element={<About />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />
          </Routes>
        </main>
        {!immersive && <Footer />}
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
