import React, { useState, useEffect, useCallback, useRef } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

import { ProductCard } from '@/components/product-card';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { Product } from '@/types/product';

interface ProductSwiperProps {
  products: Product[];
}

export function ProductSwiper({ products }: ProductSwiperProps) {
  const theme = useTheme();
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollViewRef = React.useRef<ScrollView>(null);
  const isUserScrolling = useRef(false);
  const autoplayRef = useRef<NodeJS.Timeout | null>(null);

  const scrollToIndex = useCallback((index: number) => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollTo({
        x: index * 300,
        animated: true,
      });
    }
  }, []);

  // Clear autoplay timer
  const clearAutoplay = useCallback(() => {
    if (autoplayRef.current) {
      clearInterval(autoplayRef.current);
      autoplayRef.current = null;
    }
  }, []);

  // Start autoplay timer
  const startAutoplay = useCallback(() => {
    clearAutoplay();
    autoplayRef.current = setInterval(() => {
      if (!isUserScrolling.current) {
        setCurrentIndex((prev) => {
          const next = (prev + 1) % products.length;
          scrollToIndex(next);
          return next;
        });
      }
    }, 3000);
  }, [products.length, scrollToIndex, clearAutoplay]);

  useEffect(() => {
    startAutoplay();
    return () => clearAutoplay();
  }, [startAutoplay, clearAutoplay]);

  const handleScrollBegin = () => {
    isUserScrolling.current = true;
    clearAutoplay();
  };

  const handleScrollEnd = () => {
    isUserScrolling.current = false;
    startAutoplay();
  };

  const handleScroll = (event: any) => {
    const index = Math.round(event.nativeEvent.contentOffset.x / 300);
    if (index !== currentIndex) {
      setCurrentIndex(index);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScrollBeginDrag={handleScrollBegin}
        onScrollEndDrag={handleScrollEnd}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        style={styles.scrollView}>
        {products.map((product) => (
          <View key={product.id} style={styles.slide}>
            <ProductCard
              name={product.name}
              description={product.description}
              price={product.price}
              image={product.image}
            />
          </View>
        ))}
      </ScrollView>

      <View style={styles.pagination}>
        {products.map((_, index) => (
          <View
            key={index}
            style={[
              styles.dot,
              { backgroundColor: theme.dot },
              index === currentIndex && { backgroundColor: theme.accent },
            ]}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 420,
    paddingVertical: Spacing.five,
  },
  scrollView: {
    flex: 1,
  },
  slide: {
    width: 300,
    justifyContent: 'center',
    paddingVertical: Spacing.two,
    marginHorizontal: Spacing.two,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 3,
  },
});
