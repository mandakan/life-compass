import { describe, it, expect, beforeEach } from 'vitest';
import { removeUserData, clearAllUserData } from '@utils/storageService';

describe('storageService', () => {
  beforeEach(() => {
    clearAllUserData();
  });

  it('removeUserData removes a single key without touching others', () => {
    localStorage.setItem('tutorialCompleted', 'true');
    localStorage.setItem('keepMe', 'yes');

    removeUserData('tutorialCompleted');

    expect(localStorage.getItem('tutorialCompleted')).toBeNull();
    expect(localStorage.getItem('keepMe')).toBe('yes');
  });

  it('clearAllUserData clears every key', () => {
    localStorage.setItem('a', '1');
    localStorage.setItem('b', '2');

    clearAllUserData();

    expect(localStorage.length).toBe(0);
  });
});
