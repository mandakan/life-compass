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
      <h1 className="mb-6 text-center text-2xl font-bold">Livskompass</h1>
      <CustomButton onClick={() => navigate('/create-life-compass')}>
        {t('create_life_compass', 'Skapa Livskompass')}
      </CustomButton>
      <div className="mt-4">
        <LanguageSwitcher />
      </div>
    </div>
  );
};

export default HomePage;
