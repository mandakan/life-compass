export function setTheme(theme: 'light' | 'dark'): void {
  if (theme !== 'light' && theme !== 'dark') {
    console.warn(`Invalid theme: ${theme}. Expected 'light' or 'dark'.`);
    return;
  }
  document.documentElement.setAttribute('data-theme', theme);
}

export function toggleTheme(currentTheme: 'light' | 'dark'): 'light' | 'dark' {
  const newTheme: 'light' | 'dark' =
    currentTheme === 'light' ? 'dark' : 'light';
  setTheme(newTheme);
  return newTheme;
}
