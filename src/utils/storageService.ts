export const STORAGE_KEY = 'userData';

export const getUserData = (): any => {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : {};
};

export const saveUserData = (data: any): void => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};
