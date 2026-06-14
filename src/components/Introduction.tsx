import { useTranslation } from 'react-i18next';
import { CheckCircleIcon } from '@heroicons/react/24/solid';
import CustomButton from './CustomButton';
import { useNavigate } from 'react-router-dom';

const Introduction = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const listItem = (key: string) => (
    <li key={key} className="flex items-start gap-3">
      <CheckCircleIcon className="mt-0.5 h-5 w-5 flex-shrink-0 text-secondary" />
      <span>{t(`introduction.${key}`)}</span>
    </li>
  );

  return (
    <div className="bg-surface px-4 py-12 text-text sm:py-16">
      <div className="mx-auto w-full max-w-2xl space-y-12">
        {/* What is it */}
        <section className="space-y-3">
          <h2 className="font-display text-3xl font-semibold text-text">
            {t('introduction.what_is_title')}
          </h2>
          <p className="text-lg leading-relaxed text-text">
            {t('introduction.what_is_description')}
          </p>
        </section>

        {/* Why */}
        <section className="space-y-3">
          <h2 className="font-display text-2xl font-semibold text-text">
            {t('introduction.why_title')}
          </h2>
          <p className="text-lg leading-relaxed text-text">
            {t('introduction.why_description')}
          </p>
        </section>

        {/* How */}
        <section className="space-y-3">
          <h2 className="font-display text-2xl font-semibold text-text">
            {t('introduction.how_title')}
          </h2>
          <p className="text-lg leading-relaxed text-text">
            {t('introduction.how_description')}
          </p>
          <ul className="space-y-2 text-lg leading-relaxed text-text">
            {['how_family', 'how_work', 'how_health', 'how_leisure'].map(
              listItem,
            )}
          </ul>
        </section>

        {/* Examples */}
        <section className="space-y-3">
          <h2 className="font-display text-2xl font-semibold text-text">
            {t('introduction.examples_title')}
          </h2>
          <p className="text-lg leading-relaxed text-text">
            {t('introduction.examples_description')}
          </p>
          <ul className="space-y-2 text-lg leading-relaxed text-text">
            {['examples_family', 'examples_work', 'examples_health'].map(
              listItem,
            )}
          </ul>
          <p className="text-sm text-text-muted">
            {t('introduction.source_text')}{' '}
            <a
              href="https://kbtiprimarvarden.se/behandling/kbt-manualer/primarvardsanpassad-kbt-vid-depression/modul-varderingar/"
              target="_blank"
              rel="noopener noreferrer"
              className="underline"
            >
              KBT i primärvården
            </a>
          </p>
        </section>

        {/* Next steps + CTA */}
        <section className="space-y-3">
          <h2 className="font-display text-2xl font-semibold text-text">
            {t('introduction.next_steps_title')}
          </h2>
          <p className="text-lg leading-relaxed text-text">
            {t('introduction.next_steps_description')}
          </p>
          <CustomButton
            className="mt-2 text-lg"
            onClick={() => navigate('/create-life-compass')}
          >
            {t('start_your_journey', 'Börja din resa')}
          </CustomButton>
        </section>

        {/* Disclaimer */}
        <section className="space-y-3">
          <h2 className="font-display text-2xl font-semibold text-text">
            {t('introduction.disclaimer_title', 'Viktigt att veta')}
          </h2>
          <p className="text-lg leading-relaxed text-text-muted">
            {t(
              'introduction.disclaimer_description',
              'Den här appen är tänkt som ett självreflekterande verktyg för att hjälpa dig utforska vad som är viktigt i ditt liv. Den är inte avsedd att ersätta professionell hjälp, terapi eller kontakt med hälso- och sjukvård. Om du mår dåligt eller har behov av stöd, uppmuntrar vi dig att kontakta vården eller en legitimerad terapeut.',
            )}
          </p>
        </section>

        {/* Privacy */}
        <section className="space-y-3">
          <h2 className="font-display text-2xl font-semibold text-text">
            {t('introduction.privacy_title', 'Privacy and Data Protection')}
          </h2>
          <p className="text-lg leading-relaxed text-text-muted">
            {t(
              'introduction.privacy_description',
              'We respect your privacy. We do not track any of your actions or what you write. All your data remains local and is not shared with any external party.',
            )}
          </p>
        </section>
      </div>
    </div>
  );
};

export default Introduction;
