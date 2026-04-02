import { Image } from 'expo-image';
import React from 'react';
import { StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';

interface ProductCardProps {
  name: string;
  description: string;
  price: number;
  image: number;
}

export function ProductCard({ name, description, price, image }: ProductCardProps) {
  return (
    <ThemedView style={styles.card}>
      <Image source={image} style={styles.image} contentFit="contain" />
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
  },
  image: {
    width: '100%',
    height: 150,
    borderRadius: Spacing.two,
    backgroundColor: '#f0f0f0',
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
