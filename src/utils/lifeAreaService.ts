import i18next from 'i18next';
import { LifeArea } from '../types/LifeArea';
import areasEn from '../data/predefinedLifeAreas.en.json';
import areasDa from '../data/predefinedLifeAreas.da.json';
import areasNb from '../data/predefinedLifeAreas.nb.json';
import areasNl from '../data/predefinedLifeAreas.nl.json';
import areasSv from '../data/predefinedLifeAreas.sv.json';

const areasMap: { [key: string]: LifeArea[] } = {
  en: areasEn,
  da: areasDa,
  nb: areasNb,
  nl: areasNl,
  sv: areasSv,
};

export function getPredefinedLifeAreas(): LifeArea[] {
  const language = i18next.language || 'en';
  if (areasMap[language]) {
    return areasMap[language];
  }
  return areasEn;
}
