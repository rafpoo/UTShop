import React from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppScrollView } from '@/components/app-scroll';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';
import { useHistory } from '@/context/history-context';
import { useTheme } from '@/hooks/use-theme';

export default function HistoryScreen() {
  const theme = useTheme();
  const { entries } = useHistory();

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <AppScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}>
          <View style={styles.headerBlock}>
            <ThemedText type="title" style={styles.header}>
              History
            </ThemedText>
            <ThemedText themeColor="textSecondary" style={styles.subtitle}>
              {entries.length > 0
                ? `${entries.length} completed checkout${entries.length > 1 ? 's' : ''}`
                : 'Your completed purchases will appear here.'}
            </ThemedText>
          </View>

          {entries.length === 0 ? (
            <ThemedView type="card" style={[styles.emptyState, { borderColor: theme.border }]}>
              <ThemedText type="subtitle" style={styles.emptyTitle}>
                No purchases yet
              </ThemedText>
              <ThemedText themeColor="textSecondary" style={styles.emptyCopy}>
                When you checkout from the cart page, the transaction will be saved here.
              </ThemedText>
            </ThemedView>
          ) : (
            <View style={styles.list}>
              {entries.map((entry) => {
                const purchasedAt = new Date(entry.purchasedAt).toLocaleString();

                return (
                  <ThemedView
                    key={entry.id}
                    type="card"
                    style={[styles.entryCard, { borderColor: theme.border }]}>
                    <View style={styles.entryHeader}>
                      <View style={styles.entryMeta}>
                        <ThemedText type="smallBold">Transaction</ThemedText>
                        <ThemedText themeColor="textSecondary">{purchasedAt}</ThemedText>
                      </View>
                      <ThemedText type="smallBold" style={styles.entryTotal}>
                        ${entry.total.toFixed(2)}
                      </ThemedText>
                    </View>

                    <View style={styles.entryItems}>
                      {entry.items.map((item) => (
                        <View key={item.id} style={styles.entryItemRow}>
                          <View style={styles.entryItemMeta}>
                            <ThemedText type="smallBold">{item.name}</ThemedText>
                            <ThemedText themeColor="textSecondary">
                              {item.quantity} x ${item.price.toFixed(2)}
                            </ThemedText>
                          </View>
                          <ThemedText type="smallBold">
                            ${(item.quantity * item.price).toFixed(2)}
                          </ThemedText>
                        </View>
                      ))}
                    </View>
                  </ThemedView>
                );
              })}
            </View>
          )}
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
  emptyState: {
    borderWidth: 1,
    borderRadius: Spacing.three,
    padding: Spacing.four,
    alignItems: 'center',
    gap: Spacing.one,
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
  entryCard: {
    borderWidth: 1,
    borderRadius: Spacing.three,
    padding: Spacing.three,
    gap: Spacing.two,
  },
  entryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: Spacing.two,
  },
  entryMeta: {
    flex: 1,
    gap: Spacing.half,
  },
  entryTotal: {
    fontSize: 18,
  },
  entryItems: {
    gap: Spacing.two,
  },
  entryItemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: Spacing.two,
  },
  entryItemMeta: {
    flex: 1,
    gap: Spacing.half,
  },
});
