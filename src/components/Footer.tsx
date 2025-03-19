import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const Footer: React.FC = () => {
  const { t } = useTranslation();
  return (
    <footer className="mt-auto bg-[var(--color-primary)] text-[var(--on-primary)] text-center p-4">
      <div className="flex flex-col items-center">
        <span>{t('footer_text', '© 2023 Life Compass')}</span>
        <nav className="mt-2">
          <Link to="/about" className="text-[var(--on-primary)] underline">
            {t('about', 'About')}
          </Link>
        </nav>
      </div>
    </footer>
  );
};

export default Footer;
