import { Image } from 'expo-image';
import React from 'react';
import { Platform, Pressable, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, {
  FadeInDown,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { useFocusEffect } from '@react-navigation/native';

import { AppScrollView } from '@/components/app-scroll';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { ProductSwiper } from '@/components/product-swiper';
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';
import { CartFlySource, useCart } from '@/context/cart-context';
import { useProducts } from '@/context/product-context';
import { useTheme } from '@/hooks/use-theme';

export default function HomeScreen() {
  const { getFeaturedProducts } = useProducts();
  const products = getFeaturedProducts();
  const theme = useTheme();
  const { cartIds, addToCartFrom } = useCart();
  const [wishlistIds, setWishlistIds] = React.useState<string[]>([]);
  const gridProducts = products.slice(0, 10);
  const baseDelay = 120;
  const [animationSeed, setAnimationSeed] = React.useState(0);

  useFocusEffect(
    React.useCallback(() => {
      setAnimationSeed((prev) => prev + 1);
    }, []),
  );

  const toggleWishlist = (id: string) => {
    setWishlistIds((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]));
  };

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
            <ThemedText type="title" style={styles.header}>Featured Products</ThemedText>
          </Animated.View>

          <Animated.View
            key={`swiper-${animationSeed}`}
            entering={FadeInDown.duration(450).delay(baseDelay * 2)}>
            <ProductSwiper products={products} />
          </Animated.View>

          <Animated.View
            key={`section-${animationSeed}`}
            entering={FadeInDown.duration(450).delay(baseDelay * 3)}>
            <View style={styles.sectionHeader}>
              <ThemedText type="subtitle" style={styles.sectionTitle}>Browse Products</ThemedText>
              <ThemedText type="small" themeColor="textSecondary">
                {gridProducts.length} items available
              </ThemedText>
            </View>
          </Animated.View>

          <View style={styles.productGrid}>
            {gridProducts.map((product, index) => {
              const isInCart = cartIds.includes(product.id);
              const isWishlisted = wishlistIds.includes(product.id);

              return (
                <Animated.View
                  key={`${product.id}-${animationSeed}`}
                  style={styles.productCardWrapper}
                  entering={FadeInDown.duration(450).delay(baseDelay * 4 + index * 90)}>
                  <ThemedView type="backgroundElement" style={styles.productCard}>
                    <Image source={product.image} style={styles.productImage} contentFit="contain" />
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
                          isActive={isWishlisted}
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
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.three,
    justifyContent: 'space-between',
  },
  productCardWrapper: {
    flexBasis: '48%',
  },
  productCard: {
    padding: Spacing.three,
    borderRadius: Spacing.three,
    gap: Spacing.one,
  },
  productImage: {
    width: '100%',
    height: 120,
    borderRadius: Spacing.two,
    backgroundColor: '#f0f0f0',
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
  iconButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  starIcon: {
    fontSize: 18,
    lineHeight: 20,
  },
});

function AddToCartButton({
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
          backgroundColor: isActive ? theme.backgroundSelected : theme.background,
          borderColor: theme.textSecondary,
        },
      ]}>
      <ThemedText type="smallBold">+</ThemedText>
    </Pressable>
  );
}

function WishlistButton({
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
          backgroundColor: isActive ? theme.backgroundSelected : theme.background,
          borderColor: theme.textSecondary,
        },
      ]}>
      <Animated.View style={animatedStyle}>
        <ThemedText style={styles.starIcon}>
          {isActive ? '★' : '☆'}
        </ThemedText>
      </Animated.View>
    </Pressable>
  );
}
