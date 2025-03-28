import { useTranslation } from 'react-i18next';
import { CheckCircleIcon } from '@heroicons/react/24/solid';
import CustomButton from './CustomButton';
import { useNavigate } from 'react-router-dom';

const Introduction = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <div className="mx-auto max-w-4xl rounded-lg bg-[var(--callout-bg)] px-4 py-4 text-[var(--color-text)] shadow">
      <h2 className="mb-4 text-3xl font-bold text-[var(--color-primary)]">
        {t('introduction.what_is_title')}
      </h2>
      <p className="mb-6">{t('introduction.what_is_description')}</p>

      <h3 className="mb-3 text-2xl font-semibold text-[var(--color-primary)]">
        {t('introduction.why_title')}
      </h3>
      <p className="mb-6">{t('introduction.why_description')}</p>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        <div>
          <h3 className="mb-3 text-2xl font-semibold text-[var(--color-primary)]">
            {t('introduction.how_title')}
          </h3>
          <p className="mb-6">{t('introduction.how_description')}</p>
          <ul className="space-y-2">
            {['how_family', 'how_work', 'how_health', 'how_leisure'].map(
              key => (
                <li key={key} className="flex items-start space-x-3">
                  <CheckCircleIcon className="h-6 w-6 flex-shrink-0 text-[var(--color-primary)]" />
                  <span className="text-lg">{t(`introduction.${key}`)}</span>
                </li>
              ),
            )}
          </ul>
        </div>
        <div>
          <h3 className="mb-3 text-2xl font-semibold text-[var(--color-primary)]">
            {t('introduction.examples_title')}
          </h3>
          <p className="mb-6">{t('introduction.examples_description')}</p>
          <ul className="mb-6 space-y-2">
            {['examples_family', 'examples_work', 'examples_health'].map(
              key => (
                <li key={key} className="flex items-start space-x-3">
                  <CheckCircleIcon className="h-6 w-6 flex-shrink-0 text-[var(--color-primary)]" />
                  <span className="text-lg">{t(`introduction.${key}`)}</span>
                </li>
              ),
            )}
          </ul>
        </div>
      </div>

      <div className="mt-4 mb-8 text-center text-sm text-[var(--color-primary)]">
        <p>
          {t('introduction.source_text')}{' '}
          <a
            href="https://kbtiprimarvarden.se/behandling/kbt-manualer/primarvardsanpassad-kbt-vid-depression/modul-varderingar/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[var(--accent)] underline"
          >
            KBT i primärvården
          </a>
        </p>
      </div>

      <div className="mx-auto max-w-xl text-center">
        <h3 className="mb-3 text-2xl font-semibold text-[var(--color-primary)]">
          {t('introduction.next_steps_title')}
        </h3>
        <p className="">{t('introduction.next_steps_description')}</p>
      </div>
      <CustomButton
        className="mt-8 text-xl"
        onClick={() => navigate('/create-life-compass')}
      >
        {t('start_your_journey', 'Börja din resa')}
      </CustomButton>
      
      <div className="mt-8">
        <h3 className="mb-3 text-2xl font-semibold text-[var(--color-primary)]">
          {t('introduction.disclaimer_title', 'Viktigt att veta')}
        </h3>
        <p className="mb-6">
          {t(
            'introduction.disclaimer_description',
            'Den här appen är tänkt som ett självreflekterande verktyg för att hjälpa dig utforska vad som är viktigt i ditt liv. Den är inte avsedd att ersätta professionell hjälp, terapi eller kontakt med hälso- och sjukvård. Om du mår dåligt eller har behov av stöd, uppmuntrar vi dig att kontakta vården eller en legitimerad terapeut.',
          )}
        </p>
      </div>

      <div className="mt-8">
        <h3 className="mb-3 text-2xl font-semibold text-[var(--color-primary)]">
          {t('introduction.privacy_title', 'Privacy and Data Protection')}
        </h3>
        <p className="mb-6">
          {t(
            'introduction.privacy_description',
            'We respect your privacy. We do not track any of your actions or what you write. All your data remains local and is not shared with any external party.',
          )}
        </p>
      </div>
    </div>
  );
};

export default Introduction;
