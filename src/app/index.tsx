import React from 'react';
import { Platform, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { ProductSwiper } from '@/components/product-swiper';
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';
import { useProducts } from '@/context/product-context';

export default function HomeScreen() {
  const { getFeaturedProducts } = useProducts();
  const products = getFeaturedProducts();

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}>

          <ThemedText type="title" style={styles.header}>Featured Products</ThemedText>

          <ProductSwiper products={products} />

        </ScrollView>
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    flexDirection: 'row',
  },
  safeArea: {
    flex: 1,
    paddingHorizontal: Spacing.four,
    gap: Spacing.three,
    paddingBottom: BottomTabInset + Spacing.three,
    maxWidth: MaxContentWidth,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    gap: Spacing.four,
  },
  header: {
    textAlign: 'center',
    marginBottom: Spacing.two,
  },
});
