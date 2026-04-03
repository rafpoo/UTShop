import { Link } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import React from 'react';
import { Platform, Pressable, StyleSheet, Switch, useWindowDimensions, View } from 'react-native';
import Animated, {
  Easing,
  FadeIn,
  FadeOut,
  SlideInLeft,
  SlideOutLeft,
  interpolate,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import { useCart } from '@/context/cart-context';
import { useThemeMode } from '@/context/theme-mode-context';
import { useTheme } from '@/hooks/use-theme';

interface AppShellProps {
  children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const { width } = useWindowDimensions();
  const showSidebar = Platform.OS === 'web' ? width >= 900 : width >= 720;
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);
  const { count, lastAddedAt, lastAddSource } = useCart();
  const { mode, toggleMode } = useThemeMode();
  const theme = useTheme();
  const cartRef = React.useRef<View>(null);
  const [flyVisible, setFlyVisible] = React.useState(false);
  const flyProgress = useSharedValue(0);
  const flyStartX = useSharedValue(0);
  const flyStartY = useSharedValue(0);
  const flyEndX = useSharedValue(0);
  const flyEndY = useSharedValue(0);
  const shake = useSharedValue(0);

  React.useEffect(() => {
    if (!lastAddedAt || !cartRef.current) {
      return;
    }
    cartRef.current.measureInWindow((x, y, width, height) => {
      const endX = x + width / 2 - 10;
      const endY = y + height / 2 - 10;
      const source = lastAddSource ?? {
        x: x - 120,
        y,
        width: 20,
        height: 20,
      };

      flyStartX.value = source.x + source.width / 2 - 10;
      flyStartY.value = source.y + source.height / 2 - 10;
      flyEndX.value = endX;
      flyEndY.value = endY;

      setFlyVisible(true);
      flyProgress.value = 0;
      flyProgress.value = withTiming(
        1,
        { duration: 700, easing: Easing.out(Easing.cubic) },
        (finished) => {
          if (finished) {
            runOnJS(setFlyVisible)(false);
          }
        },
      );
      shake.value = withSequence(
        withTiming(1, { duration: 80 }),
        withTiming(-1, { duration: 80 }),
        withTiming(1, { duration: 80 }),
        withTiming(-1, { duration: 80 }),
        withTiming(0, { duration: 80 }),
      );
    });
  }, [lastAddedAt, lastAddSource, flyProgress, shake, flyStartX, flyStartY, flyEndX, flyEndY]);

  const handleNavPress = () => {
    if (!showSidebar) {
      setIsSidebarOpen(false);
    }
  };

  const flyStyle = useAnimatedStyle(() => {
    const translateX = interpolate(flyProgress.value, [0, 1], [flyStartX.value, flyEndX.value]);
    const translateY = interpolate(flyProgress.value, [0, 1], [flyStartY.value, flyEndY.value]);
    const scale = interpolate(flyProgress.value, [0, 0.7, 1], [1, 1, 0.2]);
    const opacity = interpolate(flyProgress.value, [0, 0.2, 0.9, 1], [0, 1, 1, 0]);

    return {
      opacity,
      transform: [{ translateX }, { translateY }, { scale }],
    };
  });

  const cartShakeStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: shake.value * 3 }],
  }));

  const renderSidebarContent = () => (
    <>
      <ThemedText type="smallBold" style={styles.sidebarTitle}>
        Navigation
      </ThemedText>
      <View style={styles.sidebarLinks}>
        <Link href="/" asChild>
          <Pressable style={styles.navLink} onPress={handleNavPress}>
            <ThemedText type="small">Home</ThemedText>
          </Pressable>
        </Link>
        <Link href="/wishlist" asChild>
          <Pressable style={styles.navLink} onPress={handleNavPress}>
            <ThemedText type="small">Wishlist</ThemedText>
          </Pressable>
        </Link>
        <Link href="/history" asChild>
          <Pressable style={styles.navLink} onPress={handleNavPress}>
            <ThemedText type="small">History</ThemedText>
          </Pressable>
        </Link>
        <Link href="/profile" asChild>
          <Pressable style={styles.navLink} onPress={handleNavPress}>
            <ThemedText type="small">Profile</ThemedText>
          </Pressable>
        </Link>
      </View>

      <View style={styles.toggleRow}>
        <ThemedText type="small">Dark Mode</ThemedText>
        <Switch
          value={mode === 'dark'}
          onValueChange={toggleMode}
          trackColor={{ false: theme.backgroundSelected, true: theme.accent }}
          thumbColor={theme.accentText}
        />
      </View>
    </>
  );

  return (
    <ThemedView style={[styles.shell, !showSidebar && styles.shellCompact]}>
      {showSidebar && isSidebarOpen && (
        <Animated.View
          entering={SlideInLeft.duration(240)}
          exiting={SlideOutLeft.duration(200)}
          style={[
            styles.sidebar,
            { backgroundColor: theme.cardAlt, borderRightColor: theme.border },
          ]}>
          {renderSidebarContent()}
        </Animated.View>
      )}

      <View style={styles.main}>
        <ThemedView
          style={[
            styles.navbar,
            { borderBottomColor: theme.backgroundSelected },
          ]}>
          <View style={styles.navbarLeft}>
            <Pressable
              accessibilityLabel={isSidebarOpen ? 'Close navigation' : 'Open navigation'}
              onPress={() => setIsSidebarOpen((prev) => !prev)}
              style={[
                styles.iconButton,
                { borderColor: theme.border, backgroundColor: theme.card },
              ]}>
              <ThemedText type="smallBold">≡</ThemedText>
            </Pressable>
            <ThemedText type="smallBold" style={styles.brandText}>
              UTShop
            </ThemedText>
          </View>
          <Animated.View style={[styles.cart, cartShakeStyle]} ref={cartRef}>
            {Platform.OS === 'web' || Platform.OS === 'android' ? (
              <ThemedText style={styles.cartIcon}>🛒</ThemedText>
            ) : (
              <SymbolView
                tintColor={theme.text}
                name={{ ios: 'cart', android: 'shopping-cart', web: 'cart' }}
                size={18}
              />
            )}
            <ThemedView
              type="backgroundSelected"
              style={[
                styles.badge,
                count > 0 && styles.badgeActive,
                count > 0 && { backgroundColor: theme.badge },
              ]}>
              <ThemedText type="smallBold" style={styles.badgeText}>
                {count}
              </ThemedText>
            </ThemedView>
          </Animated.View>
        </ThemedView>
        {flyVisible && (
          <View pointerEvents="none" style={styles.flyLayer}>
            <Animated.View style={[styles.flyShape, { backgroundColor: theme.accent }, flyStyle]}>
              <View style={[styles.flyInner, { backgroundColor: theme.accentText }]} />
            </Animated.View>
          </View>
        )}
        <View style={styles.content}>{children}</View>
      </View>

      {!showSidebar && isSidebarOpen && (
        <View style={styles.overlay}>
          <Animated.View
            entering={FadeIn.duration(150)}
            exiting={FadeOut.duration(150)}
            style={[styles.backdrop, { backgroundColor: theme.overlay }]}>
            <Pressable style={StyleSheet.absoluteFillObject} onPress={() => setIsSidebarOpen(false)} />
          </Animated.View>
          <Animated.View
            entering={SlideInLeft.duration(220)}
            exiting={SlideOutLeft.duration(180)}
            style={[
              styles.overlayPanel,
              { backgroundColor: theme.cardAlt, borderRightColor: theme.border },
            ]}>
            <View style={styles.overlayHeader}>
              <ThemedText type="smallBold">Menu</ThemedText>
              <Pressable
                accessibilityLabel="Close navigation"
                onPress={() => setIsSidebarOpen(false)}
                style={[
                  styles.iconButton,
                  { borderColor: theme.border, backgroundColor: theme.card },
                ]}>
                <ThemedText type="smallBold">×</ThemedText>
              </Pressable>
            </View>
            {renderSidebarContent()}
          </Animated.View>
        </View>
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  shell: {
    flex: 1,
    flexDirection: 'row',
    position: 'relative',
  },
  shellCompact: {
    flexDirection: 'column',
  },
  sidebar: {
    width: 240,
    padding: Spacing.four,
    gap: Spacing.three,
    borderRightWidth: 1,
  },
  sidebarTitle: {
    letterSpacing: 0.3,
  },
  sidebarLinks: {
    gap: Spacing.two,
  },
  navLink: {
    paddingVertical: Spacing.one,
    paddingHorizontal: Spacing.two,
    borderRadius: Spacing.two,
  },
  navbarLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  toggleRow: {
    marginTop: 'auto',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  main: {
    flex: 1,
  },
  navbar: {
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.three,
    borderBottomWidth: 1,
    position: 'relative',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  brandText: {
    letterSpacing: 0.6,
  },
  cart: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.one,
  },
  cartIcon: {
    fontSize: 18,
    lineHeight: 20,
  },
  badge: {
    minWidth: 22,
    height: 22,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.one,
  },
  badgeActive: {
  },
  badgeText: {
    fontSize: 12,
  },
  flyLayer: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 20,
  },
  flyShape: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 28,
    height: 28,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  flyInner: {
    width: 12,
    height: 12,
    borderRadius: 4,
  },
  content: {
    flex: 1,
  },
  iconButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-start',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  overlayPanel: {
    width: 260,
    height: '100%',
    padding: Spacing.four,
    gap: Spacing.three,
    borderRightWidth: 1,
  },
  overlayHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});
