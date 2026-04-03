import { useRouter } from 'expo-router';
import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, {
  FadeInDown,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from 'react-native-reanimated';

import { AppScrollView } from '@/components/app-scroll';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';
import { useCart } from '@/context/cart-context';
import { useHistory } from '@/context/history-context';
import { useProducts } from '@/context/product-context';
import { useTheme } from '@/hooks/use-theme';

export default function CartScreen() {
  const router = useRouter();
  const theme = useTheme();
  const { products } = useProducts();
  const { cartIds, getQuantity, increaseQuantity, decreaseQuantity, clearCart, count } = useCart();
  const { addEntry } = useHistory();
  const printProgress = useSharedValue(0);
  const [animationSeed, setAnimationSeed] = React.useState(0);

  const cartProducts = products.filter((product) => cartIds.includes(product.id));
  const total = cartProducts.reduce((sum, product) => sum + product.price * getQuantity(product.id), 0);

  React.useEffect(() => {
    setAnimationSeed((prev) => prev + 1);
    printProgress.value = 0;
    printProgress.value = withDelay(120, withTiming(1, { duration: 850 }));
  }, [cartProducts.length, printProgress]);

  const printerFrameStyle = useAnimatedStyle(() => ({
    opacity: interpolate(printProgress.value, [0, 0.15, 1], [0, 1, 1]),
    transform: [
      { translateY: interpolate(printProgress.value, [0, 1], [-10, 0]) },
    ],
  }));

  const billPaperStyle = useAnimatedStyle(() => ({
    opacity: interpolate(printProgress.value, [0, 0.15, 1], [0, 0.85, 1]),
    transform: [
      { translateY: interpolate(printProgress.value, [0, 1], [-56, 0]) },
      { scaleY: interpolate(printProgress.value, [0, 0.4, 1], [0.94, 0.98, 1]) },
    ],
  }));

  const handleCheckout = () => {
    if (cartProducts.length === 0) {
      return;
    }

    addEntry({
      items: cartProducts.map((product) => ({
        id: product.id,
        name: product.name,
        price: product.price,
        quantity: getQuantity(product.id),
      })),
      total,
    });
    clearCart();
    router.push('/history');
  };

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <AppScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}>
          <Animated.View
            key={`cart-header-${animationSeed}`}
            style={styles.headerBlock}
            entering={FadeInDown.duration(420).delay(80)}>
            <ThemedText type="title" style={styles.header}>
              Cart
            </ThemedText>
            <ThemedText themeColor="textSecondary" style={styles.subtitle}>
              {count > 0 ? `${count} items ready for checkout` : 'Your cart is currently empty.'}
            </ThemedText>
          </Animated.View>

          <Animated.View style={[styles.printerFrame, printerFrameStyle]}>
            <View style={[styles.printerMouth, { backgroundColor: theme.cardAlt, borderColor: theme.border }]} />
            <Animated.View style={billPaperStyle}>
                {cartProducts.length === 0 ? (
                  <ThemedView
                    type="card"
                    style={[
                      styles.billCard,
                      styles.emptyBillCard,
                      {
                        borderColor: theme.border,
                        backgroundColor: theme.backgroundElement,
                      },
                    ]}>
                    <View style={styles.billTopRow}>
                      <ThemedText type="smallBold" themeColor="textSecondary" style={styles.billKicker}>
                        UTShop Receipt
                      </ThemedText>
                      <ThemedText type="smallBold" themeColor="textSecondary" style={styles.billKicker}>
                        0 items
                      </ThemedText>
                    </View>

                    <View style={styles.billDividerWrap}>
                      <View style={[styles.billCutout, { backgroundColor: theme.background }]} />
                      <View style={[styles.billDivider, { borderColor: theme.border }]} />
                      <View style={[styles.billCutout, { backgroundColor: theme.background }]} />
                    </View>

                    <View style={styles.emptyState}>
                      <ThemedText type="subtitle" style={styles.emptyTitle}>
                        Your cart is empty
                      </ThemedText>
                      <ThemedText themeColor="textSecondary" style={styles.emptyCopy}>
                        Add products from the home or wishlist pages to see them here.
                      </ThemedText>
                    </View>
                  </ThemedView>
                ) : (
                  <ThemedView
                    type="card"
                    style={[
                      styles.billCard,
                      {
                        borderColor: theme.border,
                        backgroundColor: theme.backgroundElement,
                      },
                    ]}>
                    <View style={styles.billTopRow}>
                      <ThemedText type="smallBold" themeColor="textSecondary" style={styles.billKicker}>
                        UTShop Receipt
                      </ThemedText>
                      <ThemedText type="smallBold" themeColor="textSecondary" style={styles.billKicker}>
                        {count} item{count > 1 ? 's' : ''}
                      </ThemedText>
                    </View>

                    <View style={styles.billDividerWrap}>
                      <View style={[styles.billCutout, { backgroundColor: theme.background }]} />
                      <View style={[styles.billDivider, { borderColor: theme.border }]} />
                      <View style={[styles.billCutout, { backgroundColor: theme.background }]} />
                    </View>

                    <View style={styles.list}>
                      {cartProducts.map((product, index) => {
                        const quantity = getQuantity(product.id);
                        const lineTotal = product.price * quantity;

                        return (
                          <Animated.View
                            key={product.id}
                            style={styles.billItem}
                            entering={FadeInDown.duration(320).delay(460 + index * 80)}>
                            <View style={styles.itemMain}>
                              <View style={styles.itemText}>
                                <ThemedText type="smallBold" style={styles.itemName}>
                                  {product.name}
                                </ThemedText>
                                <ThemedText themeColor="textSecondary" style={styles.itemDescription}>
                                  ${product.price.toFixed(2)} each
                                </ThemedText>
                              </View>
                              <ThemedText type="smallBold" style={styles.itemPrice}>
                                ${lineTotal.toFixed(2)}
                              </ThemedText>
                            </View>

                            <View style={styles.itemFooter}>
                              <ThemedText themeColor="textSecondary">Qty</ThemedText>
                              <View style={styles.quantityControls}>
                                <QuantityButton
                                  label={`Decrease ${product.name} quantity`}
                                  onPress={() => decreaseQuantity(product.id)}>
                                  -
                                </QuantityButton>
                                <ThemedView
                                  type="cardAlt"
                                  style={[styles.quantityPill, { borderColor: theme.border }]}>
                                  <ThemedText type="smallBold">{quantity}</ThemedText>
                                </ThemedView>
                                <QuantityButton
                                  label={`Increase ${product.name} quantity`}
                                  onPress={() => increaseQuantity(product.id)}>
                                  +
                                </QuantityButton>
                              </View>
                            </View>
                          </Animated.View>
                        );
                      })}
                    </View>

                    <View style={styles.billDividerWrap}>
                      <View style={[styles.billCutout, { backgroundColor: theme.background }]} />
                      <View style={[styles.billDivider, { borderColor: theme.border }]} />
                      <View style={[styles.billCutout, { backgroundColor: theme.background }]} />
                    </View>

                    <Animated.View
                      entering={FadeInDown.duration(360).delay(520 + cartProducts.length * 70)}
                      style={styles.summaryCard}>
                      <View style={styles.summaryRow}>
                        <ThemedText type="subtitle" style={styles.summaryTitle}>
                          Total
                        </ThemedText>
                        <ThemedText type="subtitle" style={styles.summaryPrice}>
                          ${total.toFixed(2)}
                        </ThemedText>
                      </View>
                      <ThemedText themeColor="textSecondary" style={styles.summaryCopy}>
                        Checkout clears the cart and stores the transaction in your history.
                      </ThemedText>
                      <Pressable
                        accessibilityLabel="Checkout cart"
                        onPress={handleCheckout}
                        style={[
                          styles.checkoutButton,
                          { backgroundColor: theme.accent },
                        ]}>
                        <ThemedText type="smallBold" themeColor="accentText">
                          Checkout
                        </ThemedText>
                      </Pressable>
                    </Animated.View>
                  </ThemedView>
                )}
            </Animated.View>
          </Animated.View>
        </AppScrollView>
      </SafeAreaView>
    </ThemedView>
  );
}

function QuantityButton({
  label,
  onPress,
  children,
}: {
  label: string;
  onPress: () => void;
  children: React.ReactNode;
}) {
  const theme = useTheme();

  return (
    <Pressable
      accessibilityLabel={label}
      onPress={onPress}
      style={[
        styles.quantityButton,
        { backgroundColor: theme.cardAlt, borderColor: theme.border },
      ]}>
      <ThemedText type="smallBold">{children}</ThemedText>
    </Pressable>
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
  emptyState: {
    paddingVertical: Spacing.four,
    paddingHorizontal: Spacing.two,
    alignItems: 'center',
    gap: Spacing.one,
  },
  emptyBillCard: {
    minHeight: 280,
    justifyContent: 'center',
  },
  emptyTitle: {
    fontSize: 24,
    textAlign: 'center',
  },
  emptyCopy: {
    textAlign: 'center',
  },
  list: {
    gap: Spacing.three,
  },
  printerFrame: {
    paddingTop: Spacing.one,
  },
  printerMouth: {
    alignSelf: 'center',
    width: '92%',
    height: 24,
    borderRadius: 14,
    borderWidth: 1,
    marginBottom: -10,
    zIndex: 2,
  },
  billCard: {
    borderWidth: 1,
    borderRadius: Spacing.three,
    paddingVertical: Spacing.three,
    paddingHorizontal: Spacing.three,
    gap: Spacing.three,
  },
  billTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: Spacing.two,
  },
  billKicker: {
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  billDividerWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  billCutout: {
    width: 18,
    height: 18,
    borderRadius: 9,
  },
  billDivider: {
    flex: 1,
    borderTopWidth: 1,
    borderStyle: 'dashed',
  },
  billItem: {
    gap: Spacing.two,
    paddingBottom: Spacing.two,
  },
  itemMain: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: Spacing.two,
  },
  itemText: {
    flex: 1,
    gap: Spacing.one,
  },
  itemName: {
    fontSize: 18,
  },
  itemDescription: {
    lineHeight: 20,
  },
  itemPrice: {
    fontSize: 18,
  },
  itemFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: Spacing.two,
    flexWrap: 'wrap',
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.one,
  },
  quantityButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quantityPill: {
    minWidth: 44,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.two,
  },
  summaryCard: {
    gap: Spacing.two,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: Spacing.two,
  },
  summaryTitle: {
    fontSize: 28,
  },
  summaryPrice: {
    fontSize: 28,
  },
  summaryCopy: {
    lineHeight: 20,
  },
  checkoutButton: {
    borderRadius: Spacing.three,
    paddingVertical: Spacing.two,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
