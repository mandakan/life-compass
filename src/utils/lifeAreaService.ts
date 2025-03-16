import predefinedAreas from '../data/predefinedLifeAreas.json';
import { LifeArea } from '../types/LifeArea';

export function getPredefinedLifeAreas(): LifeArea[] {
  return predefinedAreas;
}
