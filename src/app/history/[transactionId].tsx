import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { AppScrollView } from '@/components/app-scroll';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';
import { useHistory } from '@/context/history-context';
import { useTheme } from '@/hooks/use-theme';

export default function TransactionDetailScreen() {
  const router = useRouter();
  const theme = useTheme();
  const { transactionId } = useLocalSearchParams<{ transactionId: string }>();
  const { getEntryByTransactionId } = useHistory();
  const entry = getEntryByTransactionId(transactionId ?? '');

  if (!entry) {
    return (
      <ThemedView style={styles.container}>
        <SafeAreaView style={styles.safeArea}>
          <AppScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}>
            <Animated.View entering={FadeInDown.duration(420).delay(60)} style={styles.headerBlock}>
              <ThemedText type="title" style={styles.header}>
                History Detail
              </ThemedText>
            </Animated.View>

            <Animated.View entering={FadeInDown.duration(420).delay(140)}>
              <ThemedView type="card" style={[styles.emptyState, { borderColor: theme.border }]}>
                <ThemedText type="subtitle" style={styles.emptyTitle}>
                  Transaction not found
                </ThemedText>
                <ThemedText themeColor="textSecondary" style={styles.emptyCopy}>
                  This transaction may no longer be available in the current session.
                </ThemedText>
                <Pressable
                  onPress={() => router.push('/history')}
                  style={[styles.backButton, { backgroundColor: theme.accent }]}>
                  <ThemedText type="smallBold" themeColor="accentText">
                    Back to history
                  </ThemedText>
                </Pressable>
              </ThemedView>
            </Animated.View>
          </AppScrollView>
        </SafeAreaView>
      </ThemedView>
    );
  }

  const purchasedAt = new Date(entry.purchasedAt).toLocaleString();

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <AppScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}>
          <Animated.View style={styles.headerBlock} entering={FadeInDown.duration(420).delay(60)}>
            <ThemedText type="title" style={styles.header}>
              Transaction Detail
            </ThemedText>
            <ThemedText themeColor="textSecondary" style={styles.subtitle}>
              Review your purchase breakdown and item quantities.
            </ThemedText>
          </Animated.View>

          <Animated.View entering={FadeInDown.duration(420).delay(120)}>
            <ThemedView
              type="card"
              style={[styles.summaryCard, { borderColor: theme.border, backgroundColor: theme.backgroundElement }]}>
              <View style={styles.summaryHeader}>
                <View style={styles.summaryMeta}>
                  <ThemedText type="smallBold">Transaction ID</ThemedText>
                  <ThemedText type="subtitle" style={styles.transactionCode}>
                    {entry.transactionId}
                  </ThemedText>
                </View>
                <Pressable
                  onPress={() => router.push('/history')}
                  style={[styles.historyButton, { borderColor: theme.border, backgroundColor: theme.card }]}>
                  <ThemedText type="smallBold">All history</ThemedText>
                </Pressable>
              </View>

              <View style={styles.metaRow}>
                <ThemedText themeColor="textSecondary">Purchased at</ThemedText>
                <ThemedText type="smallBold">{purchasedAt}</ThemedText>
              </View>
            </ThemedView>
          </Animated.View>

          <Animated.View entering={FadeInDown.duration(420).delay(180)}>
            <ThemedView type="card" style={[styles.itemsCard, { borderColor: theme.border }]}>
              <ThemedText type="subtitle" style={styles.sectionTitle}>
                Products
              </ThemedText>

              <View style={styles.itemsList}>
                {entry.items.map((item, index) => (
                  <Animated.View
                    key={item.id}
                    entering={FadeInDown.duration(320).delay(240 + index * 70)}
                    style={[
                      styles.itemRow,
                      index < entry.items.length - 1 && {
                        borderBottomWidth: StyleSheet.hairlineWidth,
                        borderBottomColor: theme.border,
                      },
                    ]}>
                    <View style={styles.itemMeta}>
                      <ThemedText type="smallBold" style={styles.itemName}>
                        {item.name}
                      </ThemedText>
                      <ThemedText themeColor="textSecondary">
                        Qty {item.quantity} x ${item.price.toFixed(2)}
                      </ThemedText>
                    </View>
                    <ThemedText type="smallBold">${(item.quantity * item.price).toFixed(2)}</ThemedText>
                  </Animated.View>
                ))}
              </View>
            </ThemedView>
          </Animated.View>

          <Animated.View entering={FadeInDown.duration(420).delay(240)}>
            <ThemedView
              type="card"
              style={[styles.itemsCard, { borderColor: theme.border, backgroundColor: theme.backgroundElement }]}>
              <ThemedText type="subtitle" style={styles.sectionTitle}>
                Price Breakdown
              </ThemedText>

              <View style={styles.breakdownList}>
                {entry.items.map((item) => (
                  <View key={`${item.id}-breakdown`} style={styles.metaRow}>
                    <ThemedText themeColor="textSecondary">{item.name}</ThemedText>
                    <ThemedText type="smallBold">${(item.quantity * item.price).toFixed(2)}</ThemedText>
                  </View>
                ))}
                <View style={[styles.metaRow, styles.totalRow, { borderTopColor: theme.border }]}>
                  <ThemedText type="subtitle" style={styles.totalLabel}>
                    Final Total
                  </ThemedText>
                  <ThemedText type="subtitle" style={styles.totalLabel}>
                    ${entry.total.toFixed(2)}
                  </ThemedText>
                </View>
              </View>
            </ThemedView>
          </Animated.View>
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
  summaryCard: {
    borderWidth: 1,
    borderRadius: Spacing.three,
    padding: Spacing.three,
    gap: Spacing.two,
  },
  summaryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: Spacing.two,
    flexWrap: 'wrap',
  },
  summaryMeta: {
    gap: Spacing.one,
  },
  transactionCode: {
    fontSize: 28,
    lineHeight: 34,
  },
  historyButton: {
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.one,
  },
  itemsCard: {
    borderWidth: 1,
    borderRadius: Spacing.three,
    padding: Spacing.three,
    gap: Spacing.three,
  },
  sectionTitle: {
    fontSize: 24,
    lineHeight: 30,
  },
  itemsList: {
    gap: Spacing.two,
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: Spacing.two,
    paddingBottom: Spacing.two,
  },
  itemMeta: {
    flex: 1,
    gap: Spacing.half,
  },
  itemName: {
    fontSize: 18,
  },
  breakdownList: {
    gap: Spacing.two,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: Spacing.two,
  },
  totalRow: {
    paddingTop: Spacing.one,
    marginTop: Spacing.one,
    borderTopWidth: 1,
  },
  totalLabel: {
    fontSize: 26,
    lineHeight: 32,
  },
  emptyState: {
    borderWidth: 1,
    borderRadius: Spacing.three,
    padding: Spacing.four,
    alignItems: 'center',
    gap: Spacing.two,
  },
  emptyTitle: {
    fontSize: 24,
    textAlign: 'center',
  },
  emptyCopy: {
    textAlign: 'center',
  },
  backButton: {
    borderRadius: Spacing.three,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
  },
});
