import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import HomePage from './pages/HomePage';
import DesignPrinciplesDemo from './pages/DesignPrinciplesDemo';
import { colors } from './designTokens';

const App: React.FC = () => {
  return (
    <Router basename={import.meta.env.BASE_URL}>
      <div
        style={{
          minHeight: '100vh',
          backgroundColor: colors.light.background,
        }}
      >
        <nav
          style={{
            marginBottom: '1rem',
            backgroundColor: colors.dark.background,
            padding: '1rem',
            display: 'flex',
            gap: '1rem',
          }}
        >
          <Link
            to="/"
            style={{ color: colors.light.text, textDecoration: 'none' }}
          >
            Home
          </Link>
          <Link
            to="/design-principles"
            style={{ color: colors.light.text, textDecoration: 'none' }}
          >
            Design Principles Demo
          </Link>
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
```