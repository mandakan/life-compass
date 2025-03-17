import i18next from 'i18next';
import { LifeArea } from '../types/LifeArea';

export async function getPredefinedLifeAreas(): Promise<LifeArea[]> {
  const language = i18next.language || 'en';
  try {
    const areas = await import(`../data/predefinedLifeAreas.${language}.json`);
    return areas.default;
  } catch (error) {
    console.error(`Could not load predefined life areas for language ${language}. Falling back to English.`, error);
    const fallback = await import(`../data/predefinedLifeAreas.en.json`);
    return fallback.default;
  }
}
