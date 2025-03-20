import React, { useEffect } from 'react';
import { getUserData } from '../utils/storageService';
import { useNavigate } from 'react-router-dom';
import CustomButton from '../components/CustomButton';
import LanguageSwitcher from '../components/LanguageSwitcher';
import { useTranslation } from 'react-i18next';
import Introduction from 'components/Introduction';

const HomePage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  useEffect(() => {
    const data = getUserData();
    console.log('Laddade användardata:', data);
  }, []);

  return (
    <div className="bg-bg text-text flex h-full flex-col items-center justify-center p-8 font-sans">
      <header className="mb-24 text-center">
        <h1 className="mb-4 text-4xl font-bold">
          {t(
            'life_compass_title',
            'Utforska dina livsvärden med Livskompassen',
          )}
        </h1>
        <h2 className="text-xl">
          {t(
            'life_compass_subtitle',
            'Discover your life balance. Create your life compass.',
          )}
        </h2>
      </header>
      <main className="w-full max-w-4xl text-center">
        <CustomButton
          className="text-xl"
          onClick={() => navigate('/create-life-compass')}
        >
          {t('start_your_journey', 'Börja din resa')}
        </CustomButton>
        <div className="mt-4">
          <LanguageSwitcher />
        </div>
        <div className="mt-24">
          <Introduction />
        </div>
      </main>
    </div>
  );
};

export default HomePage;
