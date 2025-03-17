import { describe, test, expect, beforeEach, afterEach, vi } from 'vitest';
import i18n, { parseTranslation } from "../i18n";

describe("i18n translation parser", () => {
  const validData = JSON.stringify({
    version: "1.0.0",
    welcome: "Welcome",
    goodbye: "Goodbye"
  });
  
  const invalidData = JSON.stringify({
    version: "0.9.0",
    welcome: "Welcome",
    goodbye: "Goodbye"
  });
  
  let consoleWarnSpy;

  beforeEach(() => {
    consoleWarnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
  });
  
  afterEach(() => {
    consoleWarnSpy.mockRestore();
  });
  
  test("loads valid translation file correctly", () => {
    const result = parseTranslation(validData, "/locales/en.json");
    expect(result).toHaveProperty("version", "1.0.0");
    expect(result).toHaveProperty("welcome", "Welcome");
    expect(result).toHaveProperty("goodbye", "Goodbye");
  });
  
  test("handles version mismatch", () => {
    const result = parseTranslation(invalidData, "/locales/en.json");
    expect(result).toEqual({});
    expect(consoleWarnSpy).toHaveBeenCalledWith(
      'Translation file /locales/en.json version mismatch: expected "1.0.0", got "0.9.0"'
    );
  });
});

describe("i18n fallback behavior", () => {
  test("missing key defaults appropriately", async () => {
    // Ensure the language is set to English.
    await i18n.changeLanguage("en");
    // For a key that doesn't exist, i18next should return the key itself
    // or the provided defaultValue if specified.
    const missingKeyResult = i18n.t("nonexistent_key", { defaultValue: "nonexistent_key" });
    expect(missingKeyResult).toBe("nonexistent_key");
  }, { timeout: 10000 });
});
