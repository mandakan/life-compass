import { describe, it, expect, beforeEach } from 'vitest';
import { exportData } from '../utils/exportService';
import { LifeArea } from '../types/LifeArea';
import { Goal, Snapshot } from '../types/LifeCompassDocument';

describe('exportData', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('should export default userSettings, empty life areas and history if no input provided', () => {
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
    // goals must always be present in the export envelope
    expect(data.data).toHaveProperty('goals');
    expect(Array.isArray(data.data.goals)).toBe(true);
    expect(data.data.goals.length).toBe(0);
  });

  it('should export provided userSettings from localStorage plus life areas and history from input', () => {
    const customUserSettings = { language: 'sv', theme: 'dark', custom: true };
    const customLifeAreas: LifeArea[] = [
      {
        id: '1',
        name: 'Testomrade',
        description: 'En kort beskrivning',
        importance: 7,
        satisfaction: 6,
        details: 'Detaljerad information',
      },
    ];
    const customHistory: Snapshot[] = [
      {
        id: 'snap-1',
        createdAt: new Date().toISOString(),
        label: 'test snapshot',
        areas: [{ id: '1', name: 'Testomrade', importance: 7, satisfaction: 6 }],
      },
    ];

    localStorage.setItem('userSettings', JSON.stringify(customUserSettings));

    const jsonString = exportData({ lifeAreas: customLifeAreas, history: customHistory });
    const data = JSON.parse(jsonString);

    expect(data.data.userSettings).toEqual(customUserSettings);
    expect(data.data.lifeAreas).toEqual(customLifeAreas);
    expect(data.data.history).toHaveLength(1);
    expect(data.data.history[0].id).toBe('snap-1');
    expect(data.data.history[0].label).toBe('test snapshot');
    expect(data.data.history[0].areas).toHaveLength(1);
  });

  it('should fall back to legacy localStorage keys when called without input', () => {
    const customUserSettings = { language: 'sv', theme: 'dark', custom: true };
    const customLifeAreas = [
      {
        id: '1',
        name: 'Testomrade',
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

  it('round-trip: history exported via input survives JSON.parse', () => {
    const lifeAreas: LifeArea[] = [
      {
        id: 'area-1',
        name: 'Health',
        description: 'Staying healthy',
        importance: 8,
        satisfaction: 6,
        details: '',
      },
    ];
    const history: Snapshot[] = [
      {
        id: 'snap-a',
        createdAt: '2026-06-14T10:00:00.000Z',
        areas: [{ id: 'area-1', name: 'Health', importance: 8, satisfaction: 6 }],
      },
      {
        id: 'snap-b',
        createdAt: '2026-06-14T11:00:00.000Z',
        label: 'after checkup',
        areas: [{ id: 'area-1', name: 'Health', importance: 8, satisfaction: 7 }],
      },
    ];

    const jsonString = exportData({ lifeAreas, history });
    const parsed = JSON.parse(jsonString);

    expect(parsed.data.history).toHaveLength(2);
    expect(parsed.data.history[0].id).toBe('snap-a');
    expect(parsed.data.history[1].label).toBe('after checkup');
    expect(parsed.data.history[1].areas[0].satisfaction).toBe(7);
  });

  it('round-trip: goals with steps survive export and JSON.parse', () => {
    const lifeAreas: LifeArea[] = [
      {
        id: 'area-1',
        name: 'Health',
        description: 'Staying healthy',
        importance: 8,
        satisfaction: 6,
        details: '',
      },
    ];
    const goals: Goal[] = [
      {
        id: 'goal-1',
        areaId: 'area-1',
        title: 'Exercise regularly',
        createdAt: '2026-06-14T10:00:00.000Z',
        steps: [
          { id: 'step-1', text: 'Walk 30 min daily', done: false },
          { id: 'step-2', text: 'Gym twice a week', done: true },
        ],
      },
      {
        id: 'goal-2',
        areaId: 'area-1',
        title: 'Eat better',
        createdAt: '2026-06-14T11:00:00.000Z',
        steps: [],
      },
    ];

    const jsonString = exportData({ lifeAreas, history: [], goals });
    const parsed = JSON.parse(jsonString);

    expect(parsed.data.goals).toHaveLength(2);
    expect(parsed.data.goals[0].id).toBe('goal-1');
    expect(parsed.data.goals[0].title).toBe('Exercise regularly');
    expect(parsed.data.goals[0].areaId).toBe('area-1');
    expect(parsed.data.goals[0].steps).toHaveLength(2);
    expect(parsed.data.goals[0].steps[0].text).toBe('Walk 30 min daily');
    expect(parsed.data.goals[0].steps[0].done).toBe(false);
    expect(parsed.data.goals[0].steps[1].done).toBe(true);
    expect(parsed.data.goals[1].title).toBe('Eat better');
    expect(parsed.data.goals[1].steps).toHaveLength(0);
  });

  it('omitting goals in input defaults to empty array in the export', () => {
    const lifeAreas: LifeArea[] = [];
    const jsonString = exportData({ lifeAreas, history: [] });
    const parsed = JSON.parse(jsonString);
    expect(Array.isArray(parsed.data.goals)).toBe(true);
    expect(parsed.data.goals).toHaveLength(0);
  });
});
