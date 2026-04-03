import React, { createContext, useContext, useMemo, useState } from 'react';

export interface HistoryLineItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

export interface HistoryEntry {
  id: string;
  transactionId: string;
  purchasedAt: string;
  items: HistoryLineItem[];
  total: number;
}

interface HistoryContextValue {
  entries: HistoryEntry[];
  addEntry: (entry: Omit<HistoryEntry, 'id' | 'transactionId' | 'purchasedAt'>) => HistoryEntry;
  getEntryByTransactionId: (transactionId: string) => HistoryEntry | undefined;
}

const HistoryContext = createContext<HistoryContextValue | undefined>(undefined);

function generateTransactionId(existingIds: Set<string>) {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const numbers = '0123456789';

  let transactionId = '';

  do {
    let letterBlock = '';
    let numberBlock = '';

    for (let index = 0; index < 3; index += 1) {
      letterBlock += letters[Math.floor(Math.random() * letters.length)];
      numberBlock += numbers[Math.floor(Math.random() * numbers.length)];
    }

    transactionId = `${letterBlock}${numberBlock}`;
  } while (existingIds.has(transactionId));

  return transactionId;
}

export function HistoryProvider({ children }: { children: React.ReactNode }) {
  const [entries, setEntries] = useState<HistoryEntry[]>([]);

  const value = useMemo<HistoryContextValue>(
    () => ({
      entries,
      addEntry: (entry) => {
        let nextEntry: HistoryEntry | undefined;

        setEntries((prev) => {
          nextEntry = {
            ...entry,
            id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
            transactionId: generateTransactionId(new Set(prev.map((historyEntry) => historyEntry.transactionId))),
            purchasedAt: new Date().toISOString(),
          };

          return [nextEntry, ...prev];
        });

        return nextEntry as HistoryEntry;
      },
      getEntryByTransactionId: (transactionId) =>
        entries.find((entry) => entry.transactionId === transactionId),
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
