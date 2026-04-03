import { useRouter } from 'expo-router';
import React from 'react';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { AppScrollView } from '@/components/app-scroll';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';
import { type HistoryEntry, useHistory } from '@/context/history-context';
import { useTheme } from '@/hooks/use-theme';

type SortDirection = 'desc' | 'asc';

function formatPurchaseDate(value: string) {
  const parsedDate = new Date(value);

  if (Number.isNaN(parsedDate.getTime())) {
    return 'Date unavailable';
  }

  return parsedDate.toLocaleString();
}

function sortEntries(entries: HistoryEntry[], direction: SortDirection) {
  return [...entries].sort((left, right) =>
    direction === 'asc'
      ? left.transactionId.localeCompare(right.transactionId)
      : right.transactionId.localeCompare(left.transactionId),
  );
}

export default function HistoryScreen() {
  const router = useRouter();
  const theme = useTheme();
  const { entries } = useHistory();
  const [transactionFilter, setTransactionFilter] = React.useState('');
  const [sortDirection, setSortDirection] = React.useState<SortDirection>('desc');

  const filteredEntries = React.useMemo(() => {
    const normalizedFilter = transactionFilter.trim().toUpperCase();
    const matchingEntries = normalizedFilter
      ? entries.filter((entry) => entry.transactionId.includes(normalizedFilter))
      : entries;

    return sortEntries(matchingEntries, sortDirection);
  }, [entries, sortDirection, transactionFilter]);

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <AppScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}>
          <Animated.View style={styles.headerBlock} entering={FadeInDown.duration(420).delay(60)}>
            <ThemedText type="title" style={styles.header}>
              History
            </ThemedText>
            <ThemedText themeColor="textSecondary" style={styles.subtitle}>
              {entries.length > 0
                ? `${entries.length} completed checkout${entries.length > 1 ? 's' : ''}`
                : 'Your completed purchases will appear here.'}
            </ThemedText>
          </Animated.View>

          {entries.length === 0 ? (
            <Animated.View entering={FadeInDown.duration(420).delay(140)}>
              <ThemedView type="card" style={[styles.emptyState, { borderColor: theme.border }]}>
                <ThemedText type="subtitle" style={styles.emptyTitle}>
                  No purchases yet
                </ThemedText>
                <ThemedText themeColor="textSecondary" style={styles.emptyCopy}>
                  When you checkout from the cart page, the transaction will be saved here.
                </ThemedText>
              </ThemedView>
            </Animated.View>
          ) : (
            <>
              <Animated.View
                entering={FadeInDown.duration(420).delay(120)}
                style={[styles.controlCard, { borderColor: theme.border, backgroundColor: theme.backgroundElement }]}>
                <View style={styles.controlHeader}>
                  <ThemedText type="smallBold">Filter / Sort</ThemedText>
                  <ThemedText themeColor="textSecondary">
                    {filteredEntries.length} match{filteredEntries.length === 1 ? '' : 'es'}
                  </ThemedText>
                </View>

                <View style={styles.filterGroup}>
                  <ThemedText themeColor="textSecondary">Transaction ID</ThemedText>
                  <TextInput
                    accessibilityLabel="Filter by transaction ID"
                    autoCapitalize="characters"
                    autoCorrect={false}
                    maxLength={6}
                    onChangeText={(value) => setTransactionFilter(value.toUpperCase())}
                    placeholder="Search ID"
                    placeholderTextColor={theme.textSecondary}
                    style={[
                      styles.filterInput,
                      {
                        borderColor: theme.border,
                        color: theme.text,
                        backgroundColor: theme.card,
                      },
                    ]}
                    value={transactionFilter}
                  />
                </View>

                <View style={styles.sortRow}>
                  <ThemedText themeColor="textSecondary">Sort by ID</ThemedText>
                  <View style={styles.sortButtons}>
                    <SortButton
                      active={sortDirection === 'desc'}
                      label="Z-A"
                      onPress={() => setSortDirection('desc')}
                    />
                    <SortButton
                      active={sortDirection === 'asc'}
                      label="A-Z"
                      onPress={() => setSortDirection('asc')}
                    />
                  </View>
                </View>
              </Animated.View>

              {filteredEntries.length === 0 ? (
                <Animated.View entering={FadeInDown.duration(420).delay(180)}>
                  <ThemedView
                    type="card"
                    style={[styles.emptyState, { borderColor: theme.border, backgroundColor: theme.backgroundElement }]}>
                    <ThemedText type="subtitle" style={styles.emptyTitle}>
                      No matching transactions
                    </ThemedText>
                    <ThemedText themeColor="textSecondary" style={styles.emptyCopy}>
                      Try another transaction ID or switch the current sort order.
                    </ThemedText>
                  </ThemedView>
                </Animated.View>
              ) : (
                <View style={styles.list}>
                  {filteredEntries.map((entry, index) => {
                    const purchasedAt = formatPurchaseDate(entry.purchasedAt);
                    const itemCount = entry.items.reduce((sum, item) => sum + item.quantity, 0);

                    return (
                      <Animated.View
                        key={entry.id}
                        entering={FadeInDown.duration(360).delay(180 + index * 70)}>
                        <Pressable onPress={() => router.push(`/history/${entry.transactionId}`)}>
                          <ThemedView
                            type="card"
                            style={[styles.entryCard, { borderColor: theme.border }]}>
                            <View style={styles.entryHeader}>
                              <View style={styles.entryMeta}>
                                <ThemedText type="smallBold">#{entry.transactionId}</ThemedText>
                                <ThemedText themeColor="textSecondary">{purchasedAt}</ThemedText>
                              </View>
                              <ThemedText type="smallBold" style={styles.entryTotal}>
                                ${entry.total.toFixed(2)}
                              </ThemedText>
                            </View>

                            <View style={styles.entrySummaryRow}>
                              <ThemedText themeColor="textSecondary">
                                {itemCount} item{itemCount === 1 ? '' : 's'}
                              </ThemedText>
                              <ThemedText type="linkPrimary">View details</ThemedText>
                            </View>
                          </ThemedView>
                        </Pressable>
                      </Animated.View>
                    );
                  })}
                </View>
              )}
            </>
          )}
        </AppScrollView>
      </SafeAreaView>
    </ThemedView>
  );
}

function SortButton({
  active,
  label,
  onPress,
}: {
  active: boolean;
  label: string;
  onPress: () => void;
}) {
  const theme = useTheme();

  return (
    <Pressable
      accessibilityLabel={`Sort transaction IDs ${label}`}
      onPress={onPress}
      style={[
        styles.sortButton,
        {
          borderColor: theme.border,
          backgroundColor: active ? theme.accent : theme.card,
        },
      ]}>
      <ThemedText type="smallBold" themeColor={active ? 'accentText' : undefined}>
        {label}
      </ThemedText>
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
  controlCard: {
    borderWidth: 1,
    borderRadius: Spacing.three,
    padding: Spacing.three,
    gap: Spacing.two,
  },
  controlHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: Spacing.two,
  },
  filterGroup: {
    gap: Spacing.one,
  },
  filterInput: {
    borderWidth: 1,
    borderRadius: Spacing.two,
    paddingHorizontal: Spacing.three,
    paddingVertical: 12,
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 1.6,
    textTransform: 'uppercase',
  },
  sortRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: Spacing.two,
    flexWrap: 'wrap',
  },
  sortButtons: {
    flexDirection: 'row',
    gap: Spacing.one,
  },
  sortButton: {
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.one,
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
  entrySummaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: Spacing.two,
  },
});
