import { Image } from 'expo-image';
import React from 'react';
import { StyleSheet, View, useWindowDimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { FadeInDown, FadeInRight } from 'react-native-reanimated';

import { AppScrollView } from '@/components/app-scroll';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

const profile = {
  name: 'Rafael Nicholas Po',
  studentId: '00000092399',
  faculty: 'Cross Platform Development',
  institution: 'UTShop Student Card',
};

export default function ProfileScreen() {
  const theme = useTheme();
  const { width } = useWindowDimensions();
  const compact = width < 720;
  const [imageFailed, setImageFailed] = React.useState(false);

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <AppScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}>
          <Animated.View style={styles.headerBlock} entering={FadeInDown.duration(420).delay(80)}>
            <ThemedText type="title" style={styles.header}>
              Profile
            </ThemedText>
            <ThemedText themeColor="textSecondary" style={styles.subtitle}>
              A student ID card styled profile for quick identity details.
            </ThemedText>
          </Animated.View>

          <Animated.View entering={FadeInDown.duration(520).delay(140)}>
            <ThemedView
              type="card"
              style={[
                styles.cardShell,
                {
                  borderColor: theme.border,
                  backgroundColor: theme.backgroundElement,
                },
              ]}>
              <View style={[styles.cardGlow, { backgroundColor: theme.accent }]} />
              <View style={styles.cardTop}>
                <View style={styles.cardTopText}>
                  <ThemedText type="smallBold" themeColor="textSecondary" style={styles.kicker}>
                    {profile.institution}
                  </ThemedText>
                  <ThemedText type="subtitle" style={styles.cardTitle}>
                    Student ID
                  </ThemedText>
                </View>
                <View style={[styles.cardChip, { backgroundColor: theme.cardAlt, borderColor: theme.border }]}>
                  <View style={[styles.cardChipDot, { backgroundColor: theme.accent }]} />
                  <ThemedText type="smallBold">ACTIVE</ThemedText>
                </View>
              </View>

              <View style={[styles.cardBody, compact && styles.cardBodyCompact]}>
                <Animated.View
                  entering={FadeInRight.duration(460).delay(220)}
                  style={[
                    styles.photoFrame,
                    compact && styles.photoFrameCompact,
                    { borderColor: theme.border, backgroundColor: theme.card },
                  ]}>
                  <View style={[styles.photoAccent, { backgroundColor: theme.accent }]} />
                  {imageFailed ? (
                    <View style={[styles.photoFallback, { backgroundColor: theme.imagePlaceholder }]}>
                      <ThemedText type="subtitle" style={styles.photoFallbackInitials}>
                        RP
                      </ThemedText>
                      <ThemedText themeColor="textSecondary" style={styles.photoFallbackLabel}>
                        Photo unavailable
                      </ThemedText>
                    </View>
                  ) : (
                    <Image
                      source={require('@/assets/images/profile.jpeg')}
                      style={[styles.photo, { backgroundColor: theme.imagePlaceholder }]}
                      contentFit="cover"
                      onError={() => setImageFailed(true)}
                    />
                  )}
                </Animated.View>

                <Animated.View
                  entering={FadeInRight.duration(460).delay(300)}
                  style={[styles.infoBlock, compact && styles.infoBlockCompact]}>
                  <ProfileRow label="Name" value={profile.name} />
                  <ProfileRow label="Student ID" value={profile.studentId} />
                  <ProfileRow label="Program" value={profile.faculty} />
                </Animated.View>
              </View>

              <Animated.View
                entering={FadeInDown.duration(420).delay(360)}
                style={[styles.cardFooter, { borderTopColor: theme.border }]}>
                <View style={styles.footerMeta}>
                  <ThemedText themeColor="textSecondary" style={styles.footerLabel}>
                    Card No.
                  </ThemedText>
                  <ThemedText type="smallBold">UTS-92399</ThemedText>
                </View>
                <View style={styles.footerMeta}>
                  <ThemedText themeColor="textSecondary" style={styles.footerLabel}>
                    Holder
                  </ThemedText>
                  <ThemedText type="smallBold">R. N. Po</ThemedText>
                </View>
              </Animated.View>
            </ThemedView>
          </Animated.View>
        </AppScrollView>
      </SafeAreaView>
    </ThemedView>
  );
}

function ProfileRow({ label, value }: { label: string; value: string }) {
  const theme = useTheme();

  return (
    <View style={[styles.profileRow, { borderBottomColor: theme.border }]}>
      <ThemedText themeColor="textSecondary" style={styles.rowLabel}>
        {label}
      </ThemedText>
      <ThemedText type="smallBold" style={styles.rowValue}>
        {value}
      </ThemedText>
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
    justifyContent: 'center',
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
  cardShell: {
    borderWidth: 1,
    borderRadius: 28,
    padding: Spacing.four,
    gap: Spacing.three,
    overflow: 'hidden',
    position: 'relative',
  },
  cardGlow: {
    position: 'absolute',
    top: -80,
    right: -40,
    width: 220,
    height: 220,
    borderRadius: 110,
    opacity: 0.16,
  },
  cardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: Spacing.two,
    flexWrap: 'wrap',
  },
  cardTopText: {
    flex: 1,
    gap: Spacing.one,
  },
  kicker: {
    textTransform: 'uppercase',
    letterSpacing: 1.2,
  },
  cardTitle: {
    fontSize: 34,
    lineHeight: 38,
  },
  cardChip: {
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: Spacing.two,
    paddingVertical: Spacing.one,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.one,
  },
  cardChipDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  cardBody: {
    flexDirection: 'row',
    gap: Spacing.three,
    alignItems: 'stretch',
    flexWrap: 'wrap',
  },
  cardBodyCompact: {
    flexDirection: 'column',
  },
  photoFrame: {
    width: 180,
    borderWidth: 1,
    borderRadius: 22,
    padding: Spacing.two,
    gap: Spacing.two,
  },
  photoFrameCompact: {
    width: '100%',
    maxWidth: 220,
    alignSelf: 'center',
  },
  photoAccent: {
    width: 52,
    height: 8,
    borderRadius: 999,
  },
  photo: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: 18,
  },
  photoFallback: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.one,
    padding: Spacing.two,
  },
  photoFallbackInitials: {
    fontSize: 42,
    lineHeight: 46,
  },
  photoFallbackLabel: {
    textAlign: 'center',
  },
  infoBlock: {
    flex: 1,
    minWidth: 240,
    justifyContent: 'center',
    gap: Spacing.one,
  },
  infoBlockCompact: {
    width: '100%',
    minWidth: 0,
  },
  profileRow: {
    paddingVertical: Spacing.three,
    gap: Spacing.one,
    borderBottomWidth: 1,
  },
  rowLabel: {
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    fontSize: 12,
    lineHeight: 16,
  },
  rowValue: {
    fontSize: 19,
    lineHeight: 30,
  },
  cardFooter: {
    paddingTop: Spacing.three,
    borderTopWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: Spacing.two,
    flexWrap: 'wrap',
  },
  footerMeta: {
    gap: Spacing.half,
  },
  footerLabel: {
    fontSize: 12,
    lineHeight: 16,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
});
