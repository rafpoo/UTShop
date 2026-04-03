import React, { useCallback, useEffect, useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';

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
  const scrollRef = useRef<any>(null);
  const autoplayRef = useRef<NodeJS.Timeout | null>(null);

  const scrollToIndex = useCallback((index: number) => {
    const node = scrollRef.current;
    const left = index * 300;
    if (node?.scrollTo) {
      node.scrollTo({ left, behavior: 'smooth' });
    } else if (node) {
      node.scrollLeft = left;
    }
  }, []);

  const clearAutoplay = useCallback(() => {
    if (autoplayRef.current) {
      clearInterval(autoplayRef.current);
      autoplayRef.current = null;
    }
  }, []);

  const startAutoplay = useCallback(() => {
    clearAutoplay();
    autoplayRef.current = setInterval(() => {
      setCurrentIndex((prev) => {
        const next = (prev + 1) % products.length;
        scrollToIndex(next);
        return next;
      });
    }, 3000);
  }, [products.length, scrollToIndex, clearAutoplay]);

  useEffect(() => {
    if (products.length > 1) {
      startAutoplay();
      return () => clearAutoplay();
    }
    return undefined;
  }, [products.length, startAutoplay, clearAutoplay]);

  const handleScroll = (event: any) => {
    const target = event?.target ?? event?.nativeEvent?.target;
    const scrollLeft = target?.scrollLeft ?? 0;
    const index = Math.round(scrollLeft / 300);
    if (index !== currentIndex) {
      setCurrentIndex(index);
    }
  };

  return (
    <View style={styles.container}>
      <View
        ref={scrollRef}
        onScroll={handleScroll}
        style={styles.scrollView}
        onMouseEnter={clearAutoplay}
        onMouseLeave={startAutoplay}>
        <View style={styles.track}>
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
        </View>
      </View>

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
    overflowX: 'auto',
    overflowY: 'hidden',
    scrollSnapType: 'x mandatory',
    scrollBehavior: 'smooth',
  },
  track: {
    flexDirection: 'row',
  },
  slide: {
    width: 300,
    justifyContent: 'center',
    scrollSnapAlign: 'center',
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
