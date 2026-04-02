import React, { createContext, useContext, useMemo, useState } from 'react';

export type ThemeMode = 'system' | 'light' | 'dark';

interface ThemeModeContextValue {
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
  toggleMode: () => void;
}

const ThemeModeContext = createContext<ThemeModeContextValue | undefined>(undefined);

export function ThemeModeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setMode] = useState<ThemeMode>('system');

  const value = useMemo<ThemeModeContextValue>(
    () => ({
      mode,
      setMode,
      toggleMode: () =>
        setMode((prev) => (prev === 'dark' ? 'light' : prev === 'light' ? 'dark' : 'dark')),
    }),
    [mode],
  );

  return <ThemeModeContext.Provider value={value}>{children}</ThemeModeContext.Provider>;
}

export function useThemeMode() {
  const context = useContext(ThemeModeContext);
  if (!context) {
    throw new Error('useThemeMode must be used within a ThemeModeProvider');
  }
  return context;
}
