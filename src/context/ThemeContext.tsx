import React, { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'light' | 'dark' | 'high-contrast' | 'sugar-sweet';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
  systemTheme: Theme;
  followSystem: boolean;
  setFollowSystem: (follow: boolean) => void;
}

export const ThemeContext = createContext<ThemeContextType | undefined>(
  undefined,
);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [theme, setThemeState] = useState<Theme>('light');
  const [systemTheme, setSystemTheme] = useState<Theme>('light');
  const [followSystem, setFollowSystemState] = useState<boolean>(false);

  const setTheme = (theme: Theme) => {
    setThemeState(theme);
    localStorage.setItem('theme', theme);
    localStorage.setItem('followSystem', 'false');
  };

  const setFollowSystem = (follow: boolean) => {
    setFollowSystemState(follow);
    localStorage.setItem('followSystem', String(follow));
    if (follow) {
      setThemeState(systemTheme);
    }
  };

  const toggleTheme = () => {
    const nextTheme =
      theme === 'light'
        ? 'dark'
        : theme === 'dark'
          ? 'high-contrast'
          : theme === 'high-contrast'
            ? 'sugar-sweet'
            : 'light';
    setTheme(nextTheme);
  };

  useEffect(() => {
    const media = window.matchMedia('(prefers-color-scheme: dark)');
    const updateSystemTheme = () => {
      setSystemTheme(media.matches ? 'dark' : 'light');
    };
    updateSystemTheme();
    media.addEventListener('change', updateSystemTheme);
    return () => media.removeEventListener('change', updateSystemTheme);
  }, []);

  useEffect(() => {
    const storedTheme = localStorage.getItem('theme') as Theme;
    const storedFollow = localStorage.getItem('followSystem') === 'true';
    setFollowSystemState(storedFollow);
    if (storedFollow) {
      setThemeState(systemTheme);
    } else if (storedTheme) {
      setThemeState(storedTheme);
    }
  }, [systemTheme]);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  return (
    <ThemeContext.Provider
      value={{
        theme,
        setTheme,
        toggleTheme,
        systemTheme,
        followSystem,
        setFollowSystem,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within a ThemeProvider');
  return ctx;
};
