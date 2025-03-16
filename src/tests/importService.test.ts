import { describe, it, expect } from 'vitest';
import { parseAndValidateJSON } from "../utils/importService";

describe("parseAndValidateJSON", () => {
  it("should validate a valid JSON string", () => {
    const validData = {
      metadata: {
        exportTimestamp: new Date().toISOString(),
        version: "1.0.0"
      },
      data: {
        userSettings: {
          language: "en",
          theme: "light"
        },
        lifeAreas: [
          {
            id: "1",
            name: "Area 1",
            description: "Description of Area 1",
            importance: 5,
            satisfaction: 5,
            details: "Some details about Area 1"
          }
        ],
        history: []
      }
    };
    const jsonString = JSON.stringify(validData);
    const result = parseAndValidateJSON(jsonString);
    expect(result.valid).toBe(true);
    expect(result.data).toEqual(validData);
  });

  it("should return an error for an invalid JSON format", () => {
    const invalidJson = "{invalid json";
    const result = parseAndValidateJSON(invalidJson);
    expect(result.valid).toBe(false);
    expect(result.errors).toContain("Ogiltigt JSON-format.");
  });

  it("should return an error when JSON does not conform to the schema", () => {
    // Missing the 'metadata' property
    const invalidSchemaData = {
      data: {
        userSettings: {
          language: "en",
          theme: "dark"
        },
        lifeAreas: [],
        history: []
      }
    };
    const jsonString = JSON.stringify(invalidSchemaData);
    const result = parseAndValidateJSON(jsonString);
    expect(result.valid).toBe(false);
    expect(result.errors && result.errors.length).toBeGreaterThan(0);
  });
});
