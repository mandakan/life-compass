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
  // Retrieve user preference from localStorage; default to following system preference.
  const localFollowSystem =
    localStorage.getItem('followSystem') === 'false' ? false : true;
  const localTheme = localStorage.getItem('theme') as Theme | null;

  // Function to get the current system theme using matchMedia.
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
  const [followSystem, setFollowSystemState] =
    useState<boolean>(localFollowSystem);
  const [theme, setThemeState] = useState<Theme>(
    localTheme && !localFollowSystem ? localTheme : systemTheme,
  );

  // Apply the theme to the document element and persist preferences.
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

  // Listen for changes in the system preferred color scheme.
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

  // Toggle theme and disable system follow on manual toggle.
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
