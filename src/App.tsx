import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import HomePage from './pages/HomePage';
import DesignPrinciplesDemo from './pages/DesignPrinciplesDemo';
import MobileNavigation from './components/MobileNavigation';
import { colors } from './designTokens';
import { ThemeProvider, useTheme } from './context/ThemeContext';

const DesktopNavigation = () => {
  const { theme, toggleTheme } = useTheme();

  const iconStyle = {
    width: '24px',
    height: '24px',
    fill: theme === 'light' ? colors.light.text : colors.dark.text,
  };

  return (
    <nav
      style={{
        marginBottom: '1rem',
        backgroundColor: colors.menu[theme].background,
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
          style={{ color: colors.menu[theme].text, textDecoration: 'none' }}
        >
          Home
        </Link>
        <Link
          to="/design-principles"
          style={{ color: colors.menu[theme].text, textDecoration: 'none' }}
        >
          Design Principles Demo
        </Link>
      </div>
      <button
        onClick={toggleTheme}
        style={{
          backgroundColor: 'transparent',
          border: 'none',
          cursor: 'pointer',
          padding: 0
        }}
        aria-label="Toggle theme"
      >
        {theme === 'light' ? (
          <svg
            style={iconStyle}
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M21 12.79A9 9 0 0111.21 3 7 7 0 0012 17a7 7 0 009-4.21z" />
          </svg>
        ) : (
          <svg
            style={iconStyle}
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="12" cy="12" r="5" />
            <path d="M12 1v2" />
            <path d="M12 21v2" />
            <path d="M4.22 4.22l1.42 1.42" />
            <path d="M18.36 18.36l1.42 1.42" />
            <path d="M1 12h2" />
            <path d="M21 12h2" />
            <path d="M4.22 19.78l1.42-1.42" />
            <path d="M18.36 5.64l1.42-1.42" />
          </svg>
        )}
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
