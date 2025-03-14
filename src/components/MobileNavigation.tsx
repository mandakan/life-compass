import React, { useState } from 'react';
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
          Life Compass
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
          <a
            href="/"
            style={{ color: menu[theme].text, textDecoration: 'underline' }}
          >
            Home
          </a>
          <a
            href="/design-principles"
            style={{ color: menu[theme].text, textDecoration: 'underline' }}
          >
            Design Principles Demo
          </a>
          <a
            href="/about"
            style={{ color: menu[theme].text, textDecoration: 'underline' }}
          >
            About
          </a>
          <a
            href="/contact"
            style={{ color: menu[theme].text, textDecoration: 'underline' }}
          >
            Contact
          </a>
        </div>
      )}
    </nav>
  );
};

export default MobileNavigation;
