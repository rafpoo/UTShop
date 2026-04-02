import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import React from 'react';
import { AnimatedSplashOverlay } from '@/components/animated-icon';
import AppTabs from '@/components/app-tabs';
import { CartProvider } from '@/context/cart-context';
import { ProductProvider } from '@/context/product-context';
import { ThemeModeProvider } from '@/context/theme-mode-context';
import { useColorScheme } from '@/hooks/use-color-scheme';

function InnerLayout() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <AnimatedSplashOverlay />
      <AppTabs />
    </ThemeProvider>
  );
}

export default function TabLayout() {
  return (
    <ThemeModeProvider>
      <CartProvider>
        <ProductProvider>
          <InnerLayout />
        </ProductProvider>
      </CartProvider>
    </ThemeModeProvider>
  );
}
