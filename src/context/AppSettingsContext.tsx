import React, { createContext, useState, ReactNode } from 'react';

interface AppSettingsContextProps {
  showDevTools: boolean;
  setShowDevTools: (value: boolean) => void;
}

export const AppSettingsContext = createContext<AppSettingsContextProps>({
  showDevTools: false,
  setShowDevTools: () => {},
});

interface AppSettingsProviderProps {
  children: ReactNode;
}

export const AppSettingsProvider: React.FC<AppSettingsProviderProps> = ({ children }) => {
  const [showDevTools, setShowDevTools] = useState<boolean>(false);

  return (
    <AppSettingsContext.Provider value={{ showDevTools, setShowDevTools }}>
      {children}
    </AppSettingsContext.Provider>
  );
};

export default AppSettingsProvider;
