import React, { createContext, useContext, useMemo, useState } from 'react';

interface CartContextValue {
  cartIds: string[];
  cartItems: Record<string, number>;
  addToCart: (id: string) => void;
  addToCartFrom: (id: string, source: CartFlySource) => void;
  increaseQuantity: (id: string) => void;
  decreaseQuantity: (id: string) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  getQuantity: (id: string) => number;
  count: number;
  uniqueCount: number;
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
  const [cartItems, setCartItems] = useState<Record<string, number>>({});
  const [lastAddedAt, setLastAddedAt] = useState(0);
  const [lastAddSource, setLastAddSource] = useState<CartFlySource | null>(null);

  const cartIds = Object.keys(cartItems).filter((id) => cartItems[id] > 0);

  const increaseItem = (prev: Record<string, number>, id: string) => ({
    ...prev,
    [id]: (prev[id] ?? 0) + 1,
  });

  const value = useMemo<CartContextValue>(
    () => ({
      cartIds,
      cartItems,
      addToCart: (id: string) =>
        setCartItems((prev) => {
          setLastAddedAt(Date.now());
          return increaseItem(prev, id);
        }),
      addToCartFrom: (id: string, source: CartFlySource) =>
        setCartItems((prev) => {
          setLastAddSource(source);
          setLastAddedAt(Date.now());
          return increaseItem(prev, id);
        }),
      increaseQuantity: (id: string) =>
        setCartItems((prev) => increaseItem(prev, id)),
      decreaseQuantity: (id: string) =>
        setCartItems((prev) => {
          const nextQuantity = (prev[id] ?? 0) - 1;
          if (nextQuantity <= 0) {
            const { [id]: _removed, ...rest } = prev;
            return rest;
          }
          return {
            ...prev,
            [id]: nextQuantity,
          };
        }),
      removeFromCart: (id: string) =>
        setCartItems((prev) => {
          const { [id]: _removed, ...rest } = prev;
          return rest;
        }),
      clearCart: () => setCartItems({}),
      getQuantity: (id: string) => cartItems[id] ?? 0,
      count: Object.values(cartItems).reduce((sum, quantity) => sum + quantity, 0),
      uniqueCount: cartIds.length,
      lastAddedAt,
      lastAddSource,
    }),
    [cartIds, cartItems, lastAddedAt, lastAddSource],
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
