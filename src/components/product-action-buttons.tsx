import { SymbolView } from 'expo-symbols';
import React from 'react';
import { Platform, Pressable, StyleSheet, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

import { ThemedText } from '@/components/themed-text';
import { CartFlySource } from '@/context/cart-context';
import { useTheme } from '@/hooks/use-theme';

export function AddToCartButton({
  label,
  isActive,
  onAdd,
}: {
  label: string;
  isActive: boolean;
  onAdd: (source: CartFlySource) => void;
}) {
  const theme = useTheme();
  const buttonRef = React.useRef<View>(null);

  const handlePress = () => {
    if (!buttonRef.current) {
      return;
    }
    buttonRef.current.measureInWindow((x, y, width, height) => {
      onAdd({ x, y, width, height });
    });
  };

  return (
    <Pressable
      ref={buttonRef}
      accessibilityLabel={label}
      onPress={handlePress}
      style={[
        styles.iconButton,
        {
          backgroundColor: isActive ? theme.accent : theme.card,
          borderColor: isActive ? theme.accent : theme.border,
        },
      ]}>
      <ThemedText type="smallBold" themeColor={isActive ? 'accentText' : 'text'}>
        +
      </ThemedText>
    </Pressable>
  );
}

export function WishlistButton({
  label,
  isActive,
  onToggle,
}: {
  label: string;
  isActive: boolean;
  onToggle: () => void;
}) {
  const theme = useTheme();
  const scale = useSharedValue(1);
  const rotate = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: scale.value },
      { rotateZ: `${rotate.value}deg` },
    ],
  }));

  const handlePress = () => {
    scale.value = withSequence(
      withSpring(1.2, { damping: 8, stiffness: 200 }),
      withSpring(1, { damping: 10, stiffness: 180 }),
    );
    rotate.value = withSequence(
      withTiming(-12, { duration: 70 }),
      withTiming(12, { duration: 70 }),
      withTiming(-8, { duration: 60 }),
      withTiming(0, { duration: 60 }),
    );
    onToggle();
  };

  return (
    <Pressable
      accessibilityLabel={label}
      onPress={handlePress}
      style={[
        styles.iconButton,
        {
          backgroundColor: isActive ? theme.cardAlt : theme.card,
          borderColor: isActive ? theme.accent : theme.border,
        },
      ]}>
      <Animated.View style={animatedStyle}>
        {Platform.OS === 'web' || Platform.OS === 'android' ? (
          <ThemedText style={styles.fallbackStar} themeColor={isActive ? 'accent' : 'text'}>
            {isActive ? '★' : '☆'}
          </ThemedText>
        ) : (
          <SymbolView
            tintColor={isActive ? theme.accent : theme.text}
            name={{
              ios: isActive ? 'star.fill' : 'star',
              android: isActive ? 'star' : 'star_outline',
              web: isActive ? 'star' : 'star_outline',
            }}
            size={18}
          />
        )}
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  iconButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  fallbackStar: {
    fontSize: 18,
    lineHeight: 20,
  },
});
