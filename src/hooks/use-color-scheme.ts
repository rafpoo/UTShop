import { useColorScheme as useSystemColorScheme } from 'react-native';

import { useThemeMode } from '@/context/theme-mode-context';

export function useColorScheme() {
  const systemScheme = useSystemColorScheme();
  const { mode } = useThemeMode();

  if (mode === 'system') {
    return systemScheme;
  }

  return mode;
}
