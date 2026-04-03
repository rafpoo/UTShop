/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import "@/global.css";

import { Platform } from "react-native";

export const Colors = {
  light: {
    text: "#182126",
    background: "#F6F1E8",
    backgroundElement: "#FFF9F0",
    backgroundSelected: "#E9DFC9",
    textSecondary: "#6D6A63",
    accent: "#C46A3C",
    accentText: "#FFF7F2",
    border: "#D8C9AF",
    card: "#FFFDF8",
    cardAlt: "#F1E7D7",
    imagePlaceholder: "#E7DCCA",
    badge: "#D0553F",
    overlay: "rgba(24,33,38,0.18)",
    dot: "rgba(24,33,38,0.18)",
  },
  dark: {
    text: "#F6EFE5",
    background: "#181511",
    backgroundElement: "#221D18",
    backgroundSelected: "#332A23",
    textSecondary: "#B8AA99",
    accent: "#F0A36B",
    accentText: "#22150C",
    border: "#4A3D33",
    card: "#201A15",
    cardAlt: "#2A221C",
    imagePlaceholder: "#312922",
    badge: "#FF7A59",
    overlay: "rgba(0,0,0,0.4)",
    dot: "rgba(246,239,229,0.24)",
  },
} as const;

export type ThemeColor = keyof typeof Colors.light & keyof typeof Colors.dark;

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: "system-ui",
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: "ui-serif",
    title: "Palatino",
    brand: "Transcity",
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: "ui-rounded",
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: "ui-monospace",
  },
  default: {
    sans: "normal",
    serif: "serif",
    title: "serif",
    brand: "Transcity",
    rounded: "normal",
    mono: "monospace",
  },
  web: {
    sans: "var(--font-display)",
    serif: "var(--font-serif)",
    title: "var(--font-editorial)",
    brand: "Transcity",
    rounded: "var(--font-rounded)",
    mono: "var(--font-mono)",
  },
});

export const Spacing = {
  half: 2,
  one: 4,
  two: 8,
  three: 16,
  four: 24,
  five: 32,
  six: 64,
} as const;

export const BottomTabInset = Platform.select({ ios: 50, android: 80 }) ?? 0;
export const MaxContentWidth = 800;
