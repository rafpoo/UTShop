import React, { createContext, useContext, useMemo, useState } from 'react';

interface CartContextValue {
  cartIds: string[];
  addToCart: (id: string) => void;
  addToCartFrom: (id: string, source: CartFlySource) => void;
  count: number;
  lastAddedAt: number;
  lastAddSource: CartFlySource | null;
}

export interface CartFlySource {
  x: number;
  y: number;
  width: number;
  height: number;
}

const CartContext = createContext<CartContextValue | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cartIds, setCartIds] = useState<string[]>([]);
  const [lastAddedAt, setLastAddedAt] = useState(0);
  const [lastAddSource, setLastAddSource] = useState<CartFlySource | null>(null);

  const value = useMemo<CartContextValue>(
    () => ({
      cartIds,
      addToCart: (id: string) =>
        setCartIds((prev) => {
          if (prev.includes(id)) {
            return prev;
          }
          setLastAddedAt(Date.now());
          return [...prev, id];
        }),
      addToCartFrom: (id: string, source: CartFlySource) =>
        setCartIds((prev) => {
          if (prev.includes(id)) {
            return prev;
          }
          setLastAddSource(source);
          setLastAddedAt(Date.now());
          return [...prev, id];
        }),
      count: cartIds.length,
      lastAddedAt,
      lastAddSource,
    }),
    [cartIds, lastAddedAt, lastAddSource],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
