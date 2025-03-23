import { describe, it, expect, beforeEach } from 'vitest';
import {
  getUserData,
  saveUserData,
  clearAllUserData
} from '@utils/storageService';

describe('storageService', () => {
  beforeEach(() => {
    clearAllUserData();
  });

  it('should return an empty object when no user data is stored', () => {
    const data = getUserData();
    expect(data).toEqual({});
  });

  it('should save and retrieve user data correctly', () => {
    const sampleData = { name: 'Test', value: 123 };
    saveUserData(sampleData);
    const retrievedData = getUserData();
    expect(retrievedData).toEqual(sampleData);
  });
});
