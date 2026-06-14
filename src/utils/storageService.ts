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
