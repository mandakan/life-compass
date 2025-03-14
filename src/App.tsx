import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import HomePage from './pages/HomePage';
import DesignPrinciplesDemo from './pages/DesignPrinciplesDemo';
import { colors } from './designTokens';

const App: React.FC = () => {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  return (
    <Router basename={import.meta.env.BASE_URL}>
      <div
        style={{
          minHeight: '100vh',
          backgroundColor: colors[theme].background,
          color: colors[theme].text,
          transition: 'background-color 300ms, color 300ms',
        }}
      >
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
        <div style={{ padding: '1rem' }}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/design-principles" element={<DesignPrinciplesDemo />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;
