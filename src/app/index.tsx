import { useFocusEffect } from '@react-navigation/native';
import { Image } from 'expo-image';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StyleSheet, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { AppScrollView } from '@/components/app-scroll';
import { AddToCartButton, WishlistButton } from '@/components/product-action-buttons';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { ProductSwiper } from '@/components/product-swiper';
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';
import { CartFlySource, useCart } from '@/context/cart-context';
import { useProducts } from '@/context/product-context';
import { useWishlist } from '@/context/wishlist-context';
import { useTheme } from '@/hooks/use-theme';

export default function HomeScreen() {
  const { getFeaturedProducts } = useProducts();
  const products = getFeaturedProducts();
  const featuredProducts = products.slice(0, 6);
  const theme = useTheme();
  const { cartIds, addToCartFrom } = useCart();
  const { isWishlisted, toggleWishlist } = useWishlist();
  const gridProducts = products.slice(0, 10);
  const baseDelay = 120;
  const [animationSeed, setAnimationSeed] = React.useState(0);
  const [gridWidth, setGridWidth] = React.useState(0);

  const cardWidth = gridWidth > 0 ? (gridWidth - Spacing.three) / 2 : undefined;

  useFocusEffect(
    React.useCallback(() => {
      setAnimationSeed((prev) => prev + 1);
    }, []),
  );

  const handleAddToCart = (id: string, source: CartFlySource) => {
    addToCartFrom(id, source);
  };

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <AppScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}>
          <Animated.View
            key={`featured-${animationSeed}`}
            entering={FadeInDown.duration(450).delay(baseDelay)}>
            <ThemedText type="title" style={styles.header}>
              Featured Products
            </ThemedText>
          </Animated.View>

          <Animated.View
            key={`swiper-${animationSeed}`}
            entering={FadeInDown.duration(450).delay(baseDelay * 2)}>
            <ProductSwiper products={featuredProducts} />
          </Animated.View>

          <Animated.View
            key={`section-${animationSeed}`}
            entering={FadeInDown.duration(450).delay(baseDelay * 3)}>
            <View style={styles.sectionHeader}>
              <ThemedText type="subtitle" style={styles.sectionTitle}>
                Browse Products
              </ThemedText>
              <ThemedText type="small" themeColor="textSecondary">
                {gridProducts.length} items available
              </ThemedText>
            </View>
          </Animated.View>

          <View
            style={styles.productGrid}
            onLayout={(event) => setGridWidth(event.nativeEvent.layout.width)}>
            {gridProducts.map((product, index) => {
              const isInCart = cartIds.includes(product.id);
              const wishlisted = isWishlisted(product.id);

              return (
                <Animated.View
                  key={`${product.id}-${animationSeed}`}
                  style={[styles.productCardWrapper, cardWidth ? { width: cardWidth } : null]}
                  entering={FadeInDown.duration(450).delay(baseDelay * 4 + index * 90)}>
                  <ThemedView
                    type="card"
                    style={[
                      styles.productCard,
                      { borderColor: theme.border },
                    ]}>
                    <Image
                      source={product.image}
                      style={[
                        styles.productImage,
                        { backgroundColor: theme.imagePlaceholder },
                      ]}
                      contentFit="contain"
                    />
                    <ThemedText type="smallBold" style={styles.productName}>
                      {product.name}
                    </ThemedText>
                    <ThemedText type="small" themeColor="textSecondary" style={styles.productDescription}>
                      {product.description}
                    </ThemedText>

                    <View style={styles.productFooter}>
                      <ThemedText type="smallBold" style={styles.productPrice}>
                        ${product.price.toFixed(2)}
                      </ThemedText>
                      <View style={styles.actions}>
                        <AddToCartButton
                          label={`Add ${product.name} to cart`}
                          isActive={isInCart}
                          onAdd={(source) => handleAddToCart(product.id, source)}
                        />
                        <WishlistButton
                          label={`Star ${product.name} to wishlist`}
                          isActive={wishlisted}
                          onToggle={() => toggleWishlist(product.id)}
                        />
                      </View>
                    </View>
                  </ThemedView>
                </Animated.View>
              );
            })}
          </View>
        </AppScrollView>
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
  sectionHeader: {
    gap: Spacing.one,
  },
  sectionTitle: {
    fontSize: 28,
  },
  productGrid: {
    width: '100%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.three,
    justifyContent: 'space-between',
  },
  productCardWrapper: {
    width: '48%',
  },
  productCard: {
    padding: Spacing.three,
    borderRadius: Spacing.three,
    gap: Spacing.one,
    borderWidth: 1,
  },
  productImage: {
    width: '100%',
    height: 120,
    borderRadius: Spacing.two,
  },
  productName: {
    marginTop: Spacing.one,
  },
  productDescription: {
    lineHeight: 18,
  },
  productFooter: {
    marginTop: Spacing.one,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.one,
  },
  productPrice: {
    fontSize: 16,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.one,
  },
});
