import React, { createContext, useContext, useEffect, useState } from 'react';

type Theme =
  | 'light'
  | 'dark'
  | 'high-contrast'
  | 'sugar-sweet-light'
  | 'sugar-sweet-dark';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
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
  const getSystemTheme = (): Theme =>
    window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light';

  const [systemTheme, setSystemTheme] = useState<Theme>(getSystemTheme);
  const [followSystem, setFollowSystemState] = useState<boolean>(
    () => localStorage.getItem('followSystem') === 'true',
  );
  const [theme, setThemeState] = useState<Theme>(() => {
    if (localStorage.getItem('followSystem') === 'true') {
      return getSystemTheme();
    }
    return (localStorage.getItem('theme') as Theme) || 'light';
  });

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

  useEffect(() => {
    const media = window.matchMedia('(prefers-color-scheme: dark)');
    const updateSystemTheme = () => {
      setSystemTheme(media.matches ? 'dark' : 'light');
    };
    media.addEventListener('change', updateSystemTheme);
    return () => media.removeEventListener('change', updateSystemTheme);
  }, []);

  // When following the OS preference, keep the applied theme in sync as that
  // preference changes mid-session. A deliberate sync with an external system.
  useEffect(() => {
    if (followSystem) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setThemeState(systemTheme);
    }
  }, [systemTheme, followSystem]);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  return (
    <ThemeContext.Provider
      value={{
        theme,
        setTheme,
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
