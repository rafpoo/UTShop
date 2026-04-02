import { useEffect, useState } from 'react';
import { useColorScheme as useRNColorScheme } from 'react-native';

import { useThemeMode } from '@/context/theme-mode-context';

/**
 * To support static rendering, this value needs to be re-calculated on the client side for web
 */
export function useColorScheme() {
  const [hasHydrated, setHasHydrated] = useState(false);
  const { mode } = useThemeMode();

  useEffect(() => {
    setHasHydrated(true);
  }, []);

  const colorScheme = useRNColorScheme();

  if (mode !== 'system') {
    return mode;
  }

  if (hasHydrated) {
    return colorScheme;
  }

  return 'light';
}
