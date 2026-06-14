import React from 'react';
import { useNavigate } from 'react-router-dom';
import CustomButton from '../components/CustomButton';
import LanguageSwitcher from '../components/LanguageSwitcher';
import { useTranslation } from 'react-i18next';
import Introduction from 'components/Introduction';

const HomePage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <div className="bg-bg text-text flex flex-col">
      {/* Editorial hero on warm sand */}
      <section className="px-4 py-16 sm:py-24">
        <div className="mx-auto flex max-w-2xl flex-col items-center text-center">
          <h1 className="font-display text-4xl font-semibold text-text sm:text-5xl">
            {t(
              'life_compass_title',
              'Utforska dina livsvärden med Livskompassen',
            )}
          </h1>
          <p className="mt-5 max-w-xl text-lg text-text-muted sm:text-xl">
            {t(
              'life_compass_subtitle',
              'Discover your life balance. Create your life compass.',
            )}
          </p>
          <div className="mt-8">
            <CustomButton
              className="text-lg"
              onClick={() => navigate('/create-life-compass')}
            >
              {t('start_your_journey', 'Börja din resa')}
            </CustomButton>
          </div>
          <div className="mt-6 flex justify-center">
            <LanguageSwitcher testId="language-switcher-home" />
          </div>
        </div>
      </section>

      {/* Editorial sections */}
      <Introduction />
    </div>
  );
};

export default HomePage;
