import React from 'react';
import { useTranslation } from 'react-i18next';
import Button from '@components/ui/Button';
import { CompassMark } from './primitives';

export interface WelcomeProps {
  onSuggest: () => void;
  onOwn: () => void;
}

const Welcome: React.FC<WelcomeProps> = ({ onSuggest, onOwn }) => {
  const { t } = useTranslation();

  return (
    <div
      className="mx-auto w-full max-w-[520px] text-center"
      style={{ padding: 'clamp(40px, 9vw, 80px) clamp(16px, 5vw, 24px) 80px' }}
    >
      <div className="mb-[26px] flex justify-center">
        <CompassMark size={60} />
      </div>

      <h1 className="font-display text-3xl font-semibold leading-tight text-text">
        {t('your_compass.welcome.title')}
      </h1>

      <p
        className="mx-auto mt-[18px] text-lg leading-relaxed text-text-muted"
        style={{ maxWidth: 430 }}
      >
        {t('your_compass.welcome.body')}
      </p>

      <div className="mt-[34px] flex flex-col items-center gap-3">
        <Button variant="primary" size="lg" onClick={onSuggest}>
          {t('your_compass.welcome.cta_suggest')}
        </Button>

        {/* Ghost-style text link -- no Button wrapper to stay visually minimal */}
        <button
          onClick={onOwn}
          className="min-h-[44px] cursor-pointer border-none bg-transparent font-body text-base text-text underline [text-underline-offset:3px] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
        >
          {t('your_compass.welcome.cta_own')}
        </button>
      </div>

      <p
        className="mx-auto mt-[30px] text-sm leading-normal text-text-muted"
        style={{ maxWidth: 420 }}
      >
        {t('your_compass.welcome.privacy')}
      </p>
    </div>
  );
};

export default Welcome;
