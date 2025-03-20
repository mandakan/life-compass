import React from 'react';
import { useTranslation } from 'react-i18next';

const PrivacyPolicy: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-4 text-3xl font-bold">
        {t('privacyPolicy.title', 'Privacy Policy')}
      </h1>
      <p className="mb-4">
        {t(
          'privacyPolicy.intro',
          'Your privacy is very important to us. We are committed to protecting your personal data. This application is designed to respect your privacy by processing all data locally in your browser.'
        )}
      </p>
      <h2 className="mb-2 text-2xl font-semibold">
        {t('privacyPolicy.dataStorageTitle', 'Local Data Storage')}
      </h2>
      <p className="mb-4">
        {t(
          'privacyPolicy.dataStorage',
          'All the information you provide is stored locally in your browser\'s local storage. This means that your data is only available on the device you use and is not transmitted over the internet.'
        )}
      </p>
      <h2 className="mb-2 text-2xl font-semibold">
        {t('privacyPolicy.noTrackingTitle', 'No User Tracking')}
      </h2>
      <p className="mb-4">
        {t(
          'privacyPolicy.noTracking',
          'We do not track any of your actions or behaviors within the application. There are no tracking cookies or analytics services embedded in this app.'
        )}
      </p>
      <h2 className="mb-2 text-2xl font-semibold">
        {t('privacyPolicy.noCookiesTitle', 'No Cookies')}
      </h2>
      <p className="mb-4">
        {t(
          'privacyPolicy.noCookies',
          'This application does not use cookies for tracking or storing personal data.'
        )}
      </p>
      <h2 className="mb-2 text-2xl font-semibold">
        {t('privacyPolicy.dataExportTitle', 'Data Export & Clear')}
      </h2>
      <p className="mb-4">
        {t(
          'privacyPolicy.dataExport',
          'You can export your data at any time using the export function available in the app. If you wish to clear all your data, you can simply clear your browser\'s local storage.'
        )}
      </p>
      <p>
        {t(
          'privacyPolicy.closing',
          'If you have any questions or concerns about your privacy, please feel free to contact us.'
        )}
      </p>
    </div>
  );
};

export default PrivacyPolicy;
