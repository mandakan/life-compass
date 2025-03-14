import React, { useState } from 'react';

const MobileNavigation: React.FC = () => {
  const [open, setOpen] = useState(false);

  return (
    <nav className="bg-blue-500 text-white p-4">
      <div className="flex items-center justify-between">
        <div className="text-lg font-bold">Life Compass</div>
        <button
          className="md:hidden"
          onClick={() => setOpen(!open)}
          aria-label="Toggle mobile navigation"
        >
          <svg
            className="w-6 h-6"
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
        <div className="hidden md:flex space-x-4">
          <a href="/" className="hover:underline">
            Home
          </a>
          <a href="/about" className="hover:underline">
            About
          </a>
          <a href="/contact" className="hover:underline">
            Contact
          </a>
        </div>
      </div>
      {open && (
        <div className="mt-2 md:hidden flex flex-col space-y-2">
          <a href="/" className="hover:underline">
            Home
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
