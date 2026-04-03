import { Image } from 'expo-image';
import React from 'react';
import { Pressable, StyleSheet, useWindowDimensions, View } from 'react-native';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, {
  FadeInDown,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

import { AppScrollView } from '@/components/app-scroll';
import { AddToCartButton, WishlistButton } from '@/components/product-action-buttons';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';
import { CartFlySource, useCart } from '@/context/cart-context';
import { useProducts } from '@/context/product-context';
import { useWishlist } from '@/context/wishlist-context';
import { useTheme } from '@/hooks/use-theme';
import { Product } from '@/types/product';

export default function WishlistScreen() {
  const theme = useTheme();
  const { products } = useProducts();
  const { cartIds, addToCartFrom } = useCart();
  const { wishlistIds } = useWishlist();
  const { width } = useWindowDimensions();
  const compact = width < 560;
  const wishlistProducts = products.filter((product) => wishlistIds.includes(product.id));
  const [animationSeed, setAnimationSeed] = React.useState(0);
  const [emptyNoteHeight, setEmptyNoteHeight] = React.useState(0);

  const emptyNoteLineCount = Math.max(12, Math.ceil(emptyNoteHeight / 34));

  React.useEffect(() => {
    setAnimationSeed((prev) => prev + 1);
  }, [wishlistProducts.length]);

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <AppScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}>
          <Animated.View
            key={`wishlist-header-${animationSeed}`}
            style={styles.headerBlock}
            entering={FadeInDown.duration(420).delay(80)}>
            <ThemedText type="title" style={styles.header}>
              Wishlist
            </ThemedText>
            <ThemedText themeColor="textSecondary" style={styles.subtitle}>
              {wishlistProducts.length > 0
                ? `${wishlistProducts.length} saved products ready to revisit`
                : 'Save products from the home page and they will show up here.'}
            </ThemedText>
          </Animated.View>

          {wishlistProducts.length === 0 ? (
            <Animated.View
              key={`wishlist-empty-${animationSeed}`}
              entering={FadeInDown.duration(460).delay(150)}>
              <ThemedView
              type="card"
              style={[
                styles.noteCard,
                styles.emptyState,
                {
                  borderColor: theme.border,
                  backgroundColor: theme.card,
                },
              ]}
              onLayout={(event) => setEmptyNoteHeight(event.nativeEvent.layout.height)}>
                <View pointerEvents="none" style={styles.noteLines}>
                  {Array.from({ length: emptyNoteLineCount }).map((_, index) => (
                    <View
                      key={index}
                      style={[
                        styles.noteLine,
                        {
                          top: 72 + index * 34,
                          backgroundColor: theme.border,
                        },
                      ]}
                    />
                  ))}
                </View>
                <View style={[styles.noteTape, { backgroundColor: theme.cardAlt, borderColor: theme.border }]} />
                <View style={styles.noteHeader}>
                  <ThemedText type="smallBold" themeColor="textSecondary" style={styles.noteKicker}>
                    Wishlist Note
                  </ThemedText>
                </View>
                <View style={[styles.noteRule, { backgroundColor: theme.border }]} />
                <ThemedText type="subtitle" style={styles.emptyTitle}>
                  Nothing saved yet
                </ThemedText>
                <ThemedText themeColor="textSecondary" style={styles.emptyCopy}>
                  Tap the star on any product to build your wishlist.
              </ThemedText>
              </ThemedView>
            </Animated.View>
          ) : (
            <View style={styles.list}>
              {wishlistProducts.map((product, index) => (
                <WishlistItem
                  key={product.id}
                  product={product}
                  index={index}
                  compact={compact}
                  isInCart={cartIds.includes(product.id)}
                  onAddToCart={(source) => addToCartFrom(product.id, source)}
                />
              ))}
            </View>
          )}
        </AppScrollView>
      </SafeAreaView>
    </ThemedView>
  );
}

function WishlistItem({
  product,
  index,
  compact,
  isInCart,
  onAddToCart,
}: {
  product: Product;
  index: number;
  compact: boolean;
  isInCart: boolean;
  onAddToCart: (source: CartFlySource) => void;
}) {
  const theme = useTheme();
  const { removeFromWishlist, toggleWishlist } = useWishlist();
  const [noteHeight, setNoteHeight] = React.useState(0);
  const noteLineCount = Math.max(compact ? 9 : 6, Math.ceil(noteHeight / 34));
  const swingDegrees = useSharedValue(-10);
  const dropOffset = useSharedValue(-18);
  const appear = useSharedValue(0);

  React.useEffect(() => {
    const delay = 180 + index * 90;
    swingDegrees.value = -10;
    dropOffset.value = -18;
    appear.value = 0;
    swingDegrees.value = withDelay(
      delay,
      withSequence(
        withTiming(8, { duration: 220 }),
        withTiming(-6, { duration: 210 }),
        withTiming(4, { duration: 180 }),
        withTiming(-2, { duration: 160 }),
        withSpring(0, { damping: 12, stiffness: 120 }),
      ),
    );
    dropOffset.value = withDelay(delay, withTiming(0, { duration: 420 }));
    appear.value = withDelay(delay, withTiming(1, { duration: 180 }));
  }, [appear, dropOffset, index, swingDegrees]);

  const paperSwingStyle = useAnimatedStyle(() => {
    return {
      opacity: appear.value,
      transform: [
        { translateY: 28 },
        { rotateZ: `${swingDegrees.value}deg` },
        { translateY: -28 },
        { translateY: dropOffset.value },
      ],
    };
  });

  const renderRightActions = () => (
    <Pressable
      accessibilityLabel={`Remove ${product.name} from wishlist`}
      onPress={() => removeFromWishlist(product.id)}
      style={[
        styles.swipeAction,
        { backgroundColor: theme.badge },
      ]}>
      <ThemedText type="smallBold" themeColor="accentText">
        Remove
      </ThemedText>
    </Pressable>
  );

  return (
    <View style={styles.itemWrap}>
      <View
        pointerEvents="none"
        style={[
          styles.detachedItemTape,
          { backgroundColor: theme.cardAlt, borderColor: theme.border },
        ]}
      />
      <Swipeable overshootRight={false} renderRightActions={renderRightActions}>
        <Animated.View style={paperSwingStyle}>
        <ThemedView
          type="card"
          style={[
            styles.noteCard,
            styles.itemNoteCard,
            { borderColor: theme.border, backgroundColor: theme.card },
          ]}
          onLayout={(event) => setNoteHeight(event.nativeEvent.layout.height)}>
          <View pointerEvents="none" style={styles.noteLines}>
            {Array.from({ length: noteLineCount }).map((_, lineIndex) => (
              <View
                key={lineIndex}
                style={[
                  styles.noteLine,
                  {
                    top: 72 + lineIndex * 34,
                    backgroundColor: theme.border,
                  },
                ]}
              />
            ))}
          </View>
          <View style={styles.noteHeader}>
            <ThemedText type="smallBold" themeColor="textSecondary" style={styles.noteKicker}>
              Wishlist Pick
            </ThemedText>
            <ThemedText type="smallBold" themeColor="textSecondary" style={styles.noteKicker}>
              {index + 1}
            </ThemedText>
          </View>
          <View style={[styles.noteRule, { backgroundColor: theme.border }]} />
          <ThemedView
            type="card"
            style={[
              styles.itemCard,
              compact && styles.itemCardCompact,
              { borderColor: theme.border, backgroundColor: theme.backgroundElement },
            ]}>
            <View style={[styles.itemMarginLine, { backgroundColor: theme.accent }]} />
            <Image
              source={product.image}
              style={[
                styles.itemImage,
                compact && styles.itemImageCompact,
                { backgroundColor: theme.imagePlaceholder },
              ]}
              contentFit="contain"
            />
            <View style={styles.itemContent}>
              <View style={styles.itemTextBlock}>
                <ThemedText type="smallBold" style={styles.itemName}>
                  {product.name}
                </ThemedText>
                <ThemedText themeColor="textSecondary" style={styles.itemDescription}>
                  {product.description}
                </ThemedText>
              </View>

              <View style={[styles.itemFooter, compact && styles.itemFooterCompact]}>
                <ThemedText type="subtitle" style={styles.itemPrice}>
                  ${product.price.toFixed(2)}
                </ThemedText>
                <View style={[styles.itemActions, compact && styles.itemActionsCompact]}>
                  <AddToCartButton
                    label={`Add ${product.name} to cart`}
                    isActive={isInCart}
                    onAdd={onAddToCart}
                  />
                  <WishlistButton
                    label={`Remove ${product.name} from wishlist`}
                    isActive
                    onToggle={() => toggleWishlist(product.id)}
                  />
                </View>
              </View>
            </View>
          </ThemedView>
        </ThemedView>
        </Animated.View>
      </Swipeable>
    </View>
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
    gap: Spacing.three,
    paddingBottom: Spacing.four,
  },
  headerBlock: {
    gap: Spacing.one,
  },
  header: {
    textAlign: 'center',
  },
  subtitle: {
    textAlign: 'center',
  },
  list: {
    gap: Spacing.three,
    paddingBottom: Spacing.two,
  },
  noteCard: {
    borderWidth: 1,
    borderRadius: Spacing.three,
    paddingTop: Spacing.four,
    paddingBottom: Spacing.three,
    paddingHorizontal: Spacing.three,
    gap: Spacing.three,
    position: 'relative',
    overflow: 'visible',
  },
  noteLines: {
    ...StyleSheet.absoluteFillObject,
  },
  noteLine: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 2,
    opacity: 0.32,
  },
  noteTape: {
    position: 'absolute',
    top: -14,
    alignSelf: 'center',
    width: 92,
    height: 26,
    borderRadius: 6,
    borderWidth: 1,
    opacity: 0.9,
    transform: [{ rotate: '-3deg' }],
  },
  noteHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: Spacing.two,
  },
  noteKicker: {
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  noteRule: {
    height: 1,
    opacity: 0.6,
  },
  emptyState: {
    paddingVertical: Spacing.four,
    paddingHorizontal: Spacing.two,
    alignItems: 'center',
    gap: Spacing.one,
  },
  itemNoteCard: {
    paddingTop: Spacing.four,
  },
  detachedItemTape: {
    position: 'absolute',
    top: 0,
    alignSelf: 'center',
    width: 84,
    height: 26,
    borderRadius: 6,
    borderWidth: 1,
    opacity: 0.9,
    transform: [{ rotate: '-3deg' }],
    zIndex: 3,
  },
  itemWrap: {
    paddingTop: Spacing.three,
    position: 'relative',
  },
  emptyTitle: {
    fontSize: 24,
    textAlign: 'center',
  },
  emptyCopy: {
    textAlign: 'center',
  },
  itemCard: {
    borderWidth: 1,
    borderRadius: Spacing.three,
    paddingTop: Spacing.three,
    paddingBottom: Spacing.three,
    paddingRight: Spacing.three,
    paddingLeft: Spacing.four,
    flexDirection: 'row',
    gap: Spacing.three,
    alignItems: 'center',
    position: 'relative',
  },
  itemMarginLine: {
    position: 'absolute',
    left: Spacing.three,
    top: 0,
    bottom: 0,
    width: 2,
    opacity: 0.45,
  },
  itemCardCompact: {
    flexDirection: 'column',
    alignItems: 'stretch',
  },
  itemImage: {
    width: 110,
    height: 110,
    borderRadius: Spacing.two,
  },
  itemImageCompact: {
    width: '100%',
    height: 180,
  },
  itemContent: {
    flex: 1,
    gap: Spacing.two,
  },
  itemTextBlock: {
    gap: Spacing.one,
  },
  itemName: {
    fontSize: 18,
  },
  itemDescription: {
    lineHeight: 20,
  },
  itemFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.two,
  },
  itemFooterCompact: {
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  itemPrice: {
    fontSize: 22,
    lineHeight: 28,
  },
  itemActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.one,
  },
  itemActionsCompact: {
    alignSelf: 'flex-start',
  },
  swipeAction: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 104,
    borderRadius: Spacing.three,
    marginBottom: Spacing.three,
  },
});
