// Generic localStorage helpers for flags that live outside the Life Compass
// document (e.g. the onboarding `tutorialCompleted` flag). Life-area and
// snapshot data is owned by the Zustand store (see src/store/lifeCompassStore.ts),
// not this module. The former `userData` blob path was removed as dead code.

export function removeUserData(key: string): void {
  localStorage.removeItem(key);
}

export function clearAllUserData(): void {
  localStorage.clear();
}

// ----- onboarding (welcome guide) flag -----
// Tracks whether the gentle welcome tour has been seen, so a returning visitor
// is never forced back through it. Reading is defensive: a blocked/absent
// localStorage simply behaves as "not seen yet" rather than throwing.

const ONBOARDING_SEEN_KEY = 'tutorialCompleted';

export function hasSeenOnboarding(): boolean {
  try {
    return localStorage.getItem(ONBOARDING_SEEN_KEY) === 'true';
  } catch {
    return false;
  }
}

export function markOnboardingSeen(): void {
  try {
    localStorage.setItem(ONBOARDING_SEEN_KEY, 'true');
  } catch {
    // Ignore: a missing flag just means the welcome may show again.
  }
}
