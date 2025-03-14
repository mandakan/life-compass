import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { colors } from '../designTokens';

const MobileNavigation: React.FC = () => {
  const [open, setOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();

  const iconStyle = {
    width: '24px',
    height: '24px',
    fill: theme === 'light' ? colors.light.text : colors.dark.text,
  };

  return (
    <nav className="bg-blue-500 p-4 text-white">
      <div className="flex items-center justify-between">
        <div className="text-lg font-bold">Life Compass</div>
        <div className="flex items-center gap-2">
          <button
            onClick={toggleTheme}
            className="p-0"
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
            aria-label="Toggle mobile navigation"
          >
            <svg
              className="h-6 w-6"
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
        <div className="mt-2 flex flex-col space-y-2 md:hidden">
          <a href="/" className="hover:underline">
            Home
          </a>
          <a href="/design-principles" className="hover:underline">
            Design Principles Demo
          </a>
          <a href="/about" className="hover:underline">
            About
          </a>
          <a href="/contact" className="hover:underline">
            Contact
          </a>
        </div>
      )}
    </nav>
  );
};

export default MobileNavigation;
```