import React, { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'light' | 'dark' | 'high-contrast';

const VALID_THEMES: readonly Theme[] = ['light', 'dark', 'high-contrast'];

// An unknown or legacy persisted theme falls back to 'light'.
const coerceTheme = (value: string | null): Theme =>
  VALID_THEMES.includes(value as Theme) ? (value as Theme) : 'light';

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
    return coerceTheme(localStorage.getItem('theme'));
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
