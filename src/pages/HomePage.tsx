import React, { useEffect } from 'react';
import { getUserData } from '../utils/storageService';
import { useNavigate } from 'react-router-dom';
import CustomButton from '../components/CustomButton';
import LanguageSwitcher from 'components/LanguageSwitcher';
import { useTranslation } from 'react-i18next';

const HomePage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  useEffect(() => {
    const data = getUserData();
    console.log('Laddade användardata:', data);
  }, []);

  return (
    <div className="bg-bg text-text flex h-full flex-col items-center justify-center p-8 font-sans">
      <header className="mb-8 text-center">
        <h1 className="mb-4 text-3xl font-bold">
          {t('life_compass_title', 'Livskompass')}
        </h1>
        <h2 className="mb-2 text-xl">
          {t(
            'life_compass_subtitle',
            'Discover your life balance. Create your life compass.',
          )}
        </h2>
      </header>
      <main className="mb-6 w-full max-w-md text-center">
        <CustomButton onClick={() => navigate('/create-life-compass')}>
          {t('create_life_compass', 'Skapa Livskompass')}
        </CustomButton>
      </main>
      <footer className="mt-4">
        <LanguageSwitcher />
      </footer>
    </div>
  );
};

export default HomePage;
