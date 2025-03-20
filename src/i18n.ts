import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import HttpBackend from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';

const isDevelopment = process.env.NODE_ENV === 'development';

export const parseTranslation = (data: string, url: string): any => {
  const parsed = JSON.parse(data);
  if (parsed.version !== '1.0.0') {
    console.warn(
      `Translation file ${url} version mismatch: expected "1.0.0", got "${parsed.version}"`
    );
    // Fallback gracefully by returning an empty object so that i18next will use the fallback language.
    return {};
  }
  return parsed;
};

i18n
  .use(HttpBackend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    // If a language was previously selected, use it. Otherwise, let the detector decide.
    lng: localStorage.getItem('selectedLanguage') || undefined,
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag', 'path', 'subdomain'],
      caches: ['localStorage']
    },
    supportedLngs: ['en', 'sv', 'de', 'da', 'nl', 'nb', 'tlh'],
    nonExplicitSupportedLngs: true,
    fallbackLng: 'en',
    load: 'languageOnly',
    debug: isDevelopment,
    backend: {
      loadPath: import.meta.env.DEV
        ? '/locales/{{lng}}/translation.json'
        : `${import.meta.env.BASE_URL}/locales/{{lng}}/translation.json`,
      parse: parseTranslation,
    },
    interpolation: {
      escapeValue: false,
    },
    react: {
      useSuspense: true,
    },
  });

// Handle language resource load failure (e.g., offline or missing file) by falling back to English.
i18n.on('failedLoading', (lng, ns, msg) => {
  console.error(
    `Failed loading language resources for '${lng}' namespace '${ns}': ${msg}. Falling back to English.`
  );
  if (lng !== 'en') {
    i18n.changeLanguage('en');
    localStorage.setItem('selectedLanguage', 'en');
  }
});

export default i18n;
