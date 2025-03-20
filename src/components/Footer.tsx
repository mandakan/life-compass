import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const Footer: React.FC = () => {
  const { t } = useTranslation();

  const githubIcon = (
    <svg
      className="mr-1 inline h-6 w-6 align-middle"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      fill="currentColor"
    >
      <path d="M12 0.297c-6.63 0-12 5.373-12 12 0 5.302 3.438 9.8 8.205 11.387 0.6 0.113 0.82-0.258 0.82-0.577v-2.234c-3.338 0.726-4.033-1.416-4.033-1.416-0.546-1.387-1.333-1.756-1.333-1.756-1.089-0.744 0.084-0.729 0.084-0.729 1.205 0.084 1.838 1.234 1.838 1.234 1.07 1.834 2.809 1.304 3.495 0.997 0.108-0.776 0.418-1.304 0.762-1.604-2.665-0.304-5.467-1.332-5.467-5.93 0-1.31 0.468-2.381 1.236-3.221-0.124-0.303-0.536-1.524 0.117-3.176 0 0 1.008-0.322 3.3 1.23 0.957-0.266 1.983-0.399 3.003-0.404 1.02 0.005 2.047 0.138 3.006 0.404 2.29-1.552 3.296-1.23 3.296-1.23 0.655 1.653 0.243 2.874 0.12 3.176 0.77 0.84 1.234 1.911 1.234 3.221 0 4.61-2.807 5.624-5.481 5.921 0.43 0.372 0.823 1.102 0.823 2.222v3.293c0 0.321 0.218 0.694 0.825 0.576 4.765-1.589 8.2-6.085 8.2-11.386 0-6.627-5.373-12-12-12z" />
    </svg>
  );

  return (
    <footer className="mt-auto bg-[var(--color-primary)] p-4 text-[var(--on-primary)]">
      <div className="container mx-auto flex flex-col items-center md:flex-row md:justify-between">
        <nav className="flex flex-col items-center space-y-2 md:flex-row md:space-y-0 md:space-x-8">
          <Link to="/about" className="text-[var(--on-primary)]">
            {t('about', 'About')}
          </Link>
          <a
            href="https://github.com/mandakan/life-compass"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center text-[var(--on-primary)]"
          >
            {githubIcon}
            <span>{t('github', 'GitHub')}</span>
          </a>
          <div className="text-center">
            <a
              href="https://www.buymeacoffee.com/thias"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--on-primary)] underline"
            >
              ☕ {t('buy_me_coffee', 'Buy Me a Coffee')}
            </a>
          </div>
        </nav>
        <span className="mt-2 md:mt-0 text-sm">
          {t('footer_text', '© 2025 Life Compass. MIT Licensed.')}
        </span>
      </div>
    </footer>
  );
};

export default Footer;
