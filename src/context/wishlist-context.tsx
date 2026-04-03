import React, { createContext, useContext, useMemo, useState } from 'react';

interface WishlistContextValue {
  wishlistIds: string[];
  isWishlisted: (id: string) => boolean;
  addToWishlist: (id: string) => void;
  removeFromWishlist: (id: string) => void;
  toggleWishlist: (id: string) => void;
}

const WishlistContext = createContext<WishlistContextValue | undefined>(undefined);

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [wishlistIds, setWishlistIds] = useState<string[]>([]);

  const value = useMemo<WishlistContextValue>(
    () => ({
      wishlistIds,
      isWishlisted: (id: string) => wishlistIds.includes(id),
      addToWishlist: (id: string) =>
        setWishlistIds((prev) => (prev.includes(id) ? prev : [...prev, id])),
      removeFromWishlist: (id: string) =>
        setWishlistIds((prev) => prev.filter((item) => item !== id)),
      toggleWishlist: (id: string) =>
        setWishlistIds((prev) =>
          prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
        ),
    }),
    [wishlistIds],
  );

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
}
