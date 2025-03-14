import { describe, it, expect, beforeEach } from 'vitest';
import {
  getUserData,
  saveUserData,
  STORAGE_KEY,
} from '../utils/storageService';

describe('storageService', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('should return an empty object when no user data is stored', () => {
    const data = getUserData();
    expect(data).toEqual({});
  });

  it('should save and retrieve user data correctly', () => {
    const sampleData = { name: 'Test', value: 123 };
    saveUserData(sampleData);
    const storedString = localStorage.getItem(STORAGE_KEY);
    expect(storedString).toBe(JSON.stringify(sampleData));
    const retrievedData = getUserData();
    expect(retrievedData).toEqual(sampleData);
  });
});
