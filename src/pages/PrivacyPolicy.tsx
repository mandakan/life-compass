import React from 'react';
import { useTranslation } from 'react-i18next';
import ContentPage from '@components/ui/ContentPage';

const PrivacyPolicy: React.FC = () => {
  const { t } = useTranslation();

  const sections: { titleKey: string; titleFallback: string; bodyKey: string; bodyFallback: string }[] = [
    {
      titleKey: 'privacyPolicy.dataStorageTitle',
      titleFallback: 'Local Data Storage',
      bodyKey: 'privacyPolicy.dataStorage',
      bodyFallback:
        "All the information you provide is stored locally in your browser's local storage. This means that your data is only available on the device you use and is not transmitted over the internet.",
    },
    {
      titleKey: 'privacyPolicy.noTrackingTitle',
      titleFallback: 'No User Tracking',
      bodyKey: 'privacyPolicy.noTracking',
      bodyFallback:
        'We do not track any of your actions or behaviors within the application. There are no tracking cookies or analytics services embedded in this app.',
    },
    {
      titleKey: 'privacyPolicy.noCookiesTitle',
      titleFallback: 'No Cookies',
      bodyKey: 'privacyPolicy.noCookies',
      bodyFallback:
        'This application does not use cookies for tracking or storing personal data.',
    },
    {
      titleKey: 'privacyPolicy.dataExportTitle',
      titleFallback: 'Data Export & Clear',
      bodyKey: 'privacyPolicy.dataExport',
      bodyFallback:
        'You can export your data at any time using the export function available in the app. If you wish to clear all your data, you can simply clear your browser’s local storage.',
    },
    {
      titleKey: 'privacyPolicy.userControlTitle',
      titleFallback: 'User Control',
      bodyKey: 'privacyPolicy.userControl',
      bodyFallback:
        'You have complete control over your data. It remains securely on your device, and you can export or delete it at any time by clearing your browser’s local storage.',
    },
  ];

  return (
    <ContentPage
      title={t('privacyPolicy.title', 'Privacy Policy')}
      subtitle={t(
        'privacyPolicy.intro',
        'Your privacy is very important to us. We are committed to protecting your personal data. This application is designed to respect your privacy by processing all data locally in your browser.',
      )}
    >
      <div className="space-y-8">
        {sections.map(section => (
          <section key={section.titleKey} className="space-y-2">
            <h2 className="font-display text-2xl font-semibold text-text">
              {t(section.titleKey, section.titleFallback)}
            </h2>
            <p className="text-lg leading-relaxed text-text">
              {t(section.bodyKey, section.bodyFallback)}
            </p>
          </section>
        ))}

        <p className="text-lg leading-relaxed text-text-muted">
          {t(
            'privacyPolicy.closing',
            'If you have any questions or concerns about your privacy, please feel free to contact us.',
          )}
        </p>
      </div>
    </ContentPage>
  );
};

export default PrivacyPolicy;
