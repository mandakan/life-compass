import React, {
  createContext,
  useState,
  useEffect,
  ReactNode,
  useContext,
} from 'react';
import { setTheme as applyTheme } from '../utils/themeUtils';

export type Theme = 'light' | 'dark';

interface ThemeContextProps {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
  systemTheme: Theme;
  followSystem: boolean;
  setFollowSystem: (follow: boolean) => void;
}

export const ThemeContext = createContext<ThemeContextProps>({
  theme: 'light',
  setTheme: () => {},
  toggleTheme: () => {},
  systemTheme: 'light',
  followSystem: true,
  setFollowSystem: () => {},
});

export const useTheme = () => useContext(ThemeContext);

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const DEFAULT_FOLLOW_SYSTEM = true;
  const localFollowSystemRaw = localStorage.getItem('followSystem');
  const initialFollowSystem =
    localFollowSystemRaw === null ? DEFAULT_FOLLOW_SYSTEM : localFollowSystemRaw === 'true';
  const localTheme = localStorage.getItem('theme') as Theme | null;

  const getSystemTheme = (): Theme => {
    if (
      window.matchMedia &&
      window.matchMedia('(prefers-color-scheme: dark)').matches
    ) {
      return 'dark';
    }
    return 'light';
  };

  const [systemTheme, setSystemTheme] = useState<Theme>(getSystemTheme());
  const [followSystem, setFollowSystemState] = useState<boolean>(initialFollowSystem);
  const [theme, setThemeState] = useState<Theme>(
    localTheme && !initialFollowSystem ? localTheme : systemTheme
  );

  useEffect(() => {
    if (followSystem) {
      setThemeState(systemTheme);
      localStorage.removeItem('theme');
    } else {
      localStorage.setItem('theme', theme);
    }
    localStorage.setItem('followSystem', followSystem.toString());
    applyTheme(theme);
  }, [theme, followSystem, systemTheme]);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (event: MediaQueryListEvent) => {
      setSystemTheme(event.matches ? 'dark' : 'light');
    };

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleChange);
    } else {
      mediaQuery.addListener(handleChange);
    }
    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener('change', handleChange);
      } else {
        mediaQuery.removeListener(handleChange);
      }
    };
  }, []);

  const toggleTheme = () => {
    setFollowSystemState(false);
    setThemeState(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  const contextValue: ThemeContextProps = {
    theme,
    setTheme: (newTheme: Theme) => {
      setFollowSystemState(false);
      setThemeState(newTheme);
    },
    toggleTheme,
    systemTheme,
    followSystem,
    setFollowSystem: (value: boolean) => {
      setFollowSystemState(value);
      if (value) {
        setThemeState(systemTheme);
      }
    },
  };

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
};
