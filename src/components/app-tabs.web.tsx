import { Tabs, TabList, TabSlot, TabTrigger } from 'expo-router/ui';
import React from 'react';
import { StyleSheet, View } from 'react-native';

import { AppShell } from '@/components/app-shell';

export default function AppTabs() {
  return (
    <Tabs>
      <AppShell>
        <TabSlot style={{ height: '100%' }} />
      </AppShell>
      <TabList asChild>
        <View style={styles.hiddenTabList}>
          <TabTrigger name="index" href="/" />
          <TabTrigger name="explore" href="/explore" />
          <TabTrigger name="wishlist" href="/wishlist" />
          <TabTrigger name="history" href="/history" />
          <TabTrigger name="profile" href="/profile" />
        </View>
      </TabList>
    </Tabs>
  );
}

const styles = StyleSheet.create({
  hiddenTabList: {
    display: 'none',
  },
});
