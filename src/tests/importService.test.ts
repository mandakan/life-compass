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
});
