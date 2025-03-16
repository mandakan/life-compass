import { describe, it, expect, beforeEach } from 'vitest';
import { exportData } from '../utils/exportService';

describe('exportData', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('should export default userSettings, empty life areas and history if not provided in localStorage', () => {
    const jsonString = exportData();
    const data = JSON.parse(jsonString);

    // Check metadata
    expect(data).toHaveProperty('metadata.exportTimestamp');
    expect(data.metadata).toHaveProperty('version', '1.0.0');

    // Check data properties with defaults
    expect(data.data).toHaveProperty('userSettings');
    expect(data.data.userSettings).toEqual({ language: 'en', theme: 'light' });
    expect(data.data).toHaveProperty('lifeAreas');
    expect(Array.isArray(data.data.lifeAreas)).toBe(true);
    expect(data.data.lifeAreas.length).toBe(0);
    expect(data.data).toHaveProperty('history');
    expect(Array.isArray(data.data.history)).toBe(true);
    expect(data.data.history.length).toBe(0);
  });

  it('should export provided userSettings, life areas and history from localStorage', () => {
    const customUserSettings = { language: 'sv', theme: 'dark', custom: true };
    const customLifeAreas = [
      {
        id: '1',
        name: 'Testområde',
        description: 'En kort beskrivning',
        importance: 7,
        satisfaction: 6,
        details: 'Detaljerad information',
      },
    ];
    const customHistory = [
      { action: 'edit', timestamp: '2023-10-10T10:00:00Z' },
    ];

    localStorage.setItem('userSettings', JSON.stringify(customUserSettings));
    localStorage.setItem('lifeCompass', JSON.stringify(customLifeAreas));
    localStorage.setItem('history', JSON.stringify(customHistory));

    const jsonString = exportData();
    const data = JSON.parse(jsonString);

    expect(data.data.userSettings).toEqual(customUserSettings);
    expect(data.data.lifeAreas).toEqual(customLifeAreas);
    expect(data.data.history).toEqual(customHistory);
  });

  it('should throw an error if exported data does not conform to schema', () => {
    // Set an invalid userSettings (missing the required 'language' property)
    localStorage.setItem('userSettings', JSON.stringify({ theme: 'dark' }));
    expect(() => {
      exportData();
    }).toThrow(/Export data does not conform to schema/);
  });
});
