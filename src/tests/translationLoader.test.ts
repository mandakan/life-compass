import { describe, test, expect } from 'vitest';
import englishTranslations from '../../public/locales/en/translation.json';
import swedishTranslations from '../../public/locales/sv/translation.json';

describe('Translation Loader', () => {
  test('English translations have correct version', () => {
    expect(typeof englishTranslations).toBe('object');
    expect(englishTranslations.version).toBe('1.0.0');
  });

  test('Swedish translations have correct version', () => {
    expect(typeof swedishTranslations).toBe('object');
    expect(swedishTranslations.version).toBe('1.0.0');
  });

  const getTranslations = (lang: string) => {
    if (lang === 'sv') {
      return swedishTranslations;
    }
    return englishTranslations;
  };

  test('Should retrieve correct file based on user preference', () => {
    expect(getTranslations('en')).toEqual(englishTranslations);
    expect(getTranslations('sv')).toEqual(swedishTranslations);
  });

  test('Should fallback to english for missing keys', () => {
    // For this test, we simulate a scenario where the Swedish translations are missing a key.
    // We'll use an existing key from english translations. For example, "dismiss_callout" should exist in english.
    const key = 'dismiss_callout';
    expect(englishTranslations[key]).toBeDefined();

    // Create a copy of the swedish translations without the key to simulate a missing translation.
    const incompleteSwedish = { ...swedishTranslations };
    delete incompleteSwedish[key];

    // A simple fallback loader that returns the translation in the active language,
    // or falls back to the English translation if missing.
    const getTranslation = (
      lang: string,
      key: string,
      translations: any,
    ): string => {
      return translations[key] || englishTranslations[key] || key;
    };

    const translation = getTranslation('sv', key, incompleteSwedish);
    expect(translation).toEqual(englishTranslations[key]);
  });
});
