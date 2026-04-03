import { Slot } from 'expo-router';
import React from 'react';

import { AppShell } from '@/components/app-shell';

export default function AppTabs() {
  return (
    <AppShell>
      <Slot />
    </AppShell>
  );
}
