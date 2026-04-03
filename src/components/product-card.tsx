import { Image } from 'expo-image';
import React from 'react';
import { StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

interface ProductCardProps {
  name: string;
  description: string;
  price: number;
  image: number;
}

export function ProductCard({ name, description, price, image }: ProductCardProps) {
  const theme = useTheme();

  return (
    <ThemedView type="card" style={[styles.card, { borderColor: theme.border }]}>
      <Image source={image} style={[styles.image, { backgroundColor: theme.imagePlaceholder }]} contentFit="contain" />
      <ThemedView style={styles.content}>
        <ThemedText type="subtitle" style={styles.name}>{name}</ThemedText>
        <ThemedText type="small" themeColor="textSecondary" style={styles.description}>
          {description}
        </ThemedText>
        <ThemedText type="subtitle" style={styles.price}>
          ${price.toFixed(2)}
        </ThemedText>
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '100%',
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.three,
    borderWidth: 1,
    borderRadius: Spacing.three,
  },
  image: {
    width: '100%',
    height: 150,
    borderRadius: Spacing.two,
  },
  content: {
    paddingTop: Spacing.two,
    gap: Spacing.half,
  },
  name: {
    fontSize: 18,
  },
  description: {
    lineHeight: 20,
  },
  price: {
    fontSize: 16,
    marginTop: Spacing.one,
  },
});
