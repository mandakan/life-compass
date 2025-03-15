import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { colors, menu } from '../designTokens';

const MobileNavigation: React.FC = () => {
  const [open, setOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();

  const iconStyle = {
    width: '24px',
    height: '24px',
    fill: theme === 'light' ? colors.light.text : colors.dark.text,
  };

  return (
    <nav
      style={{
        backgroundColor: menu[theme].background,
        color: menu[theme].text,
        padding: '1rem',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div style={{ fontSize: '1.125rem', fontWeight: 'bold' }}>
          <Link
            to="/"
            style={{ color: menu[theme].text, textDecoration: 'none' }}
          >
            Livskompass
          </Link>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <button
            onClick={toggleTheme}
            style={{
              backgroundColor: 'transparent',
              border: 'none',
              cursor: 'pointer',
              padding: 0,
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
          <button
            onClick={() => setOpen(!open)}
            style={{
              backgroundColor: 'transparent',
              border: 'none',
              cursor: 'pointer',
              padding: 0,
            }}
            aria-label="Toggle mobile navigation"
          >
            <svg
              style={{ width: '24px', height: '24px' }}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              {open ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>
      </div>
      {open && (
        <div
          style={{
            marginTop: '0.5rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.5rem',
          }}
        >
          <Link
            to="/"
            onClick={() => setOpen(false)}
            style={{ color: menu[theme].text, textDecoration: 'underline' }}
          >
            Hem
          </Link>
          <Link
            to="/create-life-compass"
            onClick={() => setOpen(false)}
            style={{ color: menu[theme].text, textDecoration: 'underline' }}
          >
            Skapa Livskompass
          </Link>
          <Link
            to="/about"
            onClick={() => setOpen(false)}
            style={{ color: menu[theme].text, textDecoration: 'underline' }}
          >
            Om
          </Link>
          <Link
            to="/contact"
            onClick={() => setOpen(false)}
            style={{ color: menu[theme].text, textDecoration: 'underline' }}
          >
            Kontakt
          </Link>
          <Link
            to="/design-principles"
            onClick={() => setOpen(false)}
            style={{ color: menu[theme].text, textDecoration: 'underline' }}
          >
            Designprinciper
          </Link>
          <a
            href="https://github.com/mandakan/life-compass"
            onClick={() => setOpen(false)}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: menu[theme].text,
              textDecoration: 'underline',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <svg
              style={{
                width: '24px',
                height: '24px',
                fill: theme === 'light' ? colors.light.text : colors.dark.text,
                marginRight: '0.5rem',
              }}
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M12 0.297c-6.63 0-12 5.373-12 12 0 5.302 3.438 9.8 8.205 11.387 0.6 0.113 0.82-0.258 0.82-0.577v-2.234c-3.338 0.726-4.033-1.416-4.033-1.416-0.546-1.387-1.333-1.756-1.333-1.756-1.089-0.744 0.084-0.729 0.084-0.729 1.205 0.084 1.838 1.234 1.838 1.234 1.07 1.834 2.809 1.304 3.495 0.997 0.108-0.776 0.418-1.304 0.762-1.604-2.665-0.304-5.467-1.332-5.467-5.93 0-1.31 0.468-2.381 1.236-3.221-0.124-0.303-0.536-1.524 0.117-3.176 0 0 1.008-0.322 3.3 1.23 0.957-0.266 1.983-0.399 3.003-0.404 1.02 0.005 2.047 0.138 3.006 0.404 2.29-1.552 3.296-1.23 3.296-1.23 0.655 1.653 0.243 2.874 0.12 3.176 0.77 0.84 1.234 1.911 1.234 3.221 0 4.61-2.807 5.624-5.481 5.921 0.43 0.372 0.823 1.102 0.823 2.222v3.293c0 0.321 0.218 0.694 0.825 0.576 4.765-1.589 8.2-6.085 8.2-11.386 0-6.627-5.373-12-12-12z" />
            </svg>
            <span>GitHub</span>
          </a>
        </div>
      )}
    </nav>
  );
};

export default MobileNavigation;
