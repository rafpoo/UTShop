import { AnimatedSplashOverlay } from "@/components/animated-icon";
import AppTabs from "@/components/app-tabs";
import { CartProvider } from "@/context/cart-context";
import { HistoryProvider } from "@/context/history-context";
import { ProductProvider } from "@/context/product-context";
import { ThemeModeProvider } from "@/context/theme-mode-context";
import { WishlistProvider } from "@/context/wishlist-context";
import { useColorScheme } from "@/hooks/use-color-scheme";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import React from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";

function InnerLayout() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <AnimatedSplashOverlay />
      <AppTabs />
    </ThemeProvider>
  );
}

export default function TabLayout() {
  const [fontsLoaded] = useFonts({
    Transcity: require("@/assets/fonts/Transcity.otf"),
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeModeProvider>
        <HistoryProvider>
          <CartProvider>
            <ProductProvider>
              <WishlistProvider>
                <InnerLayout />
              </WishlistProvider>
            </ProductProvider>
          </CartProvider>
        </HistoryProvider>
      </ThemeModeProvider>
    </GestureHandlerRootView>
  );
}
