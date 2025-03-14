import { describe, test, expect } from 'vitest';
import { getPredefinedLifeAreas } from '../utils/lifeAreaService';
import predefinedAreas from '../data/predefinedLifeAreas.json';
import { LifeArea } from '../components/LifeAreaCard';

describe('lifeAreaService', () => {
  test('getPredefinedLifeAreas returns an array of life areas matching the predefined JSON', () => {
    const areas: LifeArea[] = getPredefinedLifeAreas();
    expect(Array.isArray(areas)).toBe(true);
    expect(areas).toEqual(predefinedAreas);
  });

  test('each life area has required properties with correct types', () => {
    const areas: LifeArea[] = getPredefinedLifeAreas();
    
    areas.forEach((area) => {
      expect(area).toHaveProperty('id');
      expect(typeof area.id).toBe('string');

      expect(area).toHaveProperty('name');
      expect(typeof area.name).toBe('string');

      expect(area).toHaveProperty('description');
      expect(typeof area.description).toBe('string');
      
      expect(area).toHaveProperty('importance');
      expect(typeof area.importance).toBe('number');

      expect(area).toHaveProperty('satisfaction');
      expect(typeof area.satisfaction).toBe('number');
    });
  });
});
