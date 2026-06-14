import { describe, it, expect } from 'vitest';
import { parseAndValidateJSON } from '../utils/importService';
import { Snapshot } from '../types/LifeCompassDocument';

describe('parseAndValidateJSON', () => {
  it('should validate a valid JSON string', () => {
    const validData = {
      metadata: {
        exportTimestamp: new Date().toISOString(),
        version: '1.0.0',
      },
      data: {
        userSettings: {
          language: 'en',
          theme: 'light',
        },
        lifeAreas: [
          {
            id: '1',
            name: 'Area 1',
            description: 'Description of Area 1',
            importance: 5,
            satisfaction: 5,
            details: 'Some details about Area 1',
          },
        ],
        history: [],
      },
    };
    const jsonString = JSON.stringify(validData);
    const result = parseAndValidateJSON(jsonString);
    expect(result.valid).toBe(true);
    expect(result.data).toEqual(validData);
  });

  it('should return an error for an invalid JSON format', () => {
    const invalidJson = '{invalid json';
    const result = parseAndValidateJSON(invalidJson);
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('Invalid JSON format.');
  });

  it('should return an error when JSON does not conform to the schema', () => {
    // Missing the 'metadata' property
    const invalidSchemaData = {
      data: {
        userSettings: {
          language: 'en',
          theme: 'dark',
        },
        lifeAreas: [],
        history: [],
      },
    };
    const jsonString = JSON.stringify(invalidSchemaData);
    const result = parseAndValidateJSON(jsonString);
    expect(result.valid).toBe(false);
    expect(result.errors && result.errors.length).toBeGreaterThan(0);
  });

  it('round-trip: history with snapshots passes validation and is returned intact', () => {
    const snapshots: Snapshot[] = [
      {
        id: 'snap-1',
        createdAt: '2026-06-14T10:00:00.000Z',
        areas: [
          { id: 'area-1', name: 'Health', importance: 8, satisfaction: 6 },
        ],
      },
      {
        id: 'snap-2',
        createdAt: '2026-06-14T11:00:00.000Z',
        label: 'after summer',
        areas: [
          { id: 'area-1', name: 'Health', importance: 8, satisfaction: 7 },
          { id: 'area-2', name: 'Career', importance: 7, satisfaction: 5 },
        ],
      },
    ];

    const exportEnvelope = {
      metadata: {
        exportTimestamp: '2026-06-14T12:00:00.000Z',
        version: '1.0.0',
      },
      data: {
        userSettings: { language: 'en', theme: 'light' as const },
        lifeAreas: [
          {
            id: 'area-1',
            name: 'Health',
            description: '',
            importance: 8,
            satisfaction: 7,
            details: '',
          },
          {
            id: 'area-2',
            name: 'Career',
            description: '',
            importance: 7,
            satisfaction: 5,
            details: '',
          },
        ],
        history: snapshots,
      },
    };

    const result = parseAndValidateJSON(JSON.stringify(exportEnvelope));

    expect(result.valid).toBe(true);
    const returned = result.data as typeof exportEnvelope;
    expect(returned.data.history).toHaveLength(2);
    expect(returned.data.history[0].id).toBe('snap-1');
    expect(returned.data.history[1].label).toBe('after summer');
    expect(returned.data.history[1].areas).toHaveLength(2);
  });

  it('round-trip: goals with steps pass validation and are returned intact', () => {
    const exportEnvelope = {
      metadata: {
        exportTimestamp: '2026-06-14T12:00:00.000Z',
        version: '1.0.0',
      },
      data: {
        userSettings: { language: 'en', theme: 'light' as const },
        lifeAreas: [
          {
            id: 'area-1',
            name: 'Health',
            description: '',
            importance: 8,
            satisfaction: 7,
            details: '',
          },
        ],
        history: [],
        goals: [
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
        ],
      },
    };

    const result = parseAndValidateJSON(JSON.stringify(exportEnvelope));

    expect(result.valid).toBe(true);
    const returned = result.data as typeof exportEnvelope;
    expect(returned.data.goals).toHaveLength(1);
    expect(returned.data.goals[0].id).toBe('goal-1');
    expect(returned.data.goals[0].title).toBe('Exercise regularly');
    expect(returned.data.goals[0].steps).toHaveLength(2);
    expect(returned.data.goals[0].steps[0].done).toBe(false);
    expect(returned.data.goals[0].steps[1].done).toBe(true);
  });

  it('older export without goals key passes validation (goals defaults to absent)', () => {
    // Simulates importing a file created before goals were added.
    const oldExport = {
      metadata: {
        exportTimestamp: '2025-01-01T00:00:00.000Z',
        version: '1.0.0',
      },
      data: {
        userSettings: { language: 'en', theme: 'light' as const },
        lifeAreas: [
          {
            id: 'area-1',
            name: 'Health',
            description: '',
            importance: 7,
            satisfaction: 6,
            details: '',
          },
        ],
        history: [],
        // no goals key intentionally
      },
    };

    const result = parseAndValidateJSON(JSON.stringify(oldExport));

    expect(result.valid).toBe(true);
    const returned = result.data as { data: { goals?: unknown[] } };
    // goals is optional in the schema; its absence does not invalidate the file.
    expect(returned.data.goals).toBeUndefined();
  });
});
