import React, { createContext, useContext, useMemo, useState } from 'react';

export interface HistoryLineItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

export interface HistoryEntry {
  id: string;
  purchasedAt: string;
  items: HistoryLineItem[];
  total: number;
}

interface HistoryContextValue {
  entries: HistoryEntry[];
  addEntry: (entry: Omit<HistoryEntry, 'id' | 'purchasedAt'>) => void;
}

const HistoryContext = createContext<HistoryContextValue | undefined>(undefined);

export function HistoryProvider({ children }: { children: React.ReactNode }) {
  const [entries, setEntries] = useState<HistoryEntry[]>([]);

  const value = useMemo<HistoryContextValue>(
    () => ({
      entries,
      addEntry: (entry) =>
        setEntries((prev) => [
          {
            ...entry,
            id: `${Date.now()}`,
            purchasedAt: new Date().toISOString(),
          },
          ...prev,
        ]),
    }),
    [entries],
  );

  return <HistoryContext.Provider value={value}>{children}</HistoryContext.Provider>;
}

export function useHistory() {
  const context = useContext(HistoryContext);
  if (!context) {
    throw new Error('useHistory must be used within a HistoryProvider');
  }
  return context;
}
