import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import HomePage from './pages/HomePage';
import DesignPrinciplesDemo from './pages/DesignPrinciplesDemo';
import MobileNavigation from './components/MobileNavigation';
import { colors } from './designTokens';
import { ThemeProvider, useTheme } from './context/ThemeContext';

const DesktopNavigation = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <nav
      style={{
        marginBottom: '1rem',
        backgroundColor: colors[theme].background,
        padding: '1rem',
        display: 'flex',
        gap: '1rem',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}
    >
      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
        <Link
          to="/"
          style={{ color: colors[theme].text, textDecoration: 'none' }}
        >
          Home
        </Link>
        <Link
          to="/design-principles"
          style={{ color: colors[theme].text, textDecoration: 'none' }}
        >
          Design Principles Demo
        </Link>
      </div>
      <button
        onClick={toggleTheme}
        style={{
          backgroundColor: colors.primary,
          border: 'none',
          borderRadius: '4px',
          color: '#fff',
          padding: '0.5rem 1rem',
          cursor: 'pointer',
          transition: 'background-color 150ms'
        }}
      >
        Toggle Theme
      </button>
    </nav>
  );
};

const Content = () => {
  const { theme } = useTheme();
  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: colors[theme].background,
        color: colors[theme].text,
        transition: 'background-color 300ms, color 300ms'
      }}
    >
      <div className="md:hidden">
        <MobileNavigation />
      </div>
      <div className="hidden md:block">
        <DesktopNavigation />
      </div>
      <div style={{ padding: '1rem' }}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/design-principles" element={<DesignPrinciplesDemo />} />
        </Routes>
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
```