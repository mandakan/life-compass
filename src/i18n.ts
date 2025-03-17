import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import HttpBackend from "i18next-http-backend";
import LanguageDetector from "i18next-browser-languagedetector";

const isDevelopment = process.env.NODE_ENV === "development";

export const parseTranslation = (data: string, url: string): any => {
  const parsed = JSON.parse(data);
  if (parsed.version !== "1.0.0") {
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
    detection: {
      order: ["navigator", "htmlTag", "path", "subdomain"],
      caches: ["localStorage"],
    },
    fallbackLng: {
      "en-GB": ["en"],
      "en-US": ["en"],
      default: ["en"],
    },
    load: "languageOnly",
    debug: isDevelopment,
    backend: {
      loadPath: "/locales/{{lng}}/translation.json",
      parse: parseTranslation,
    },
    interpolation: {
      escapeValue: false,
    },
    react: {
      useSuspense: true,
    },
  });

export default i18n;
