const STORAGE_KEY = 'userData';

export function getUserData(): unknown;
export function getUserData(key: string): unknown;
export function getUserData(key?: string): unknown {
  const storageKey = key ?? STORAGE_KEY;
  const data = localStorage.getItem(storageKey);
  return data ? JSON.parse(data) : {};
}

export function saveUserData(data: unknown, key?: string): void {
  const storageKey = key ?? STORAGE_KEY;
  localStorage.setItem(storageKey, JSON.stringify(data));
}

export function removeUserData(key: string): void {
  localStorage.removeItem(key);
}

export function clearAllUserData(): void {
  localStorage.clear();
}
