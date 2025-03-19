import React from 'react';
import { useTranslation } from 'react-i18next';

const Footer: React.FC = () => {
  const { t } = useTranslation();
  return (
    <footer className="bg-primary text-[var(--on-primary)] text-center p-4">
      <span>{t('footer_text', '© 2023 Life Compass')}</span>
    </footer>
  );
};

export default Footer;
