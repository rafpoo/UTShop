import React, { createContext, useContext, ReactNode } from 'react';

import { Product, featuredProducts } from '@/types/product';

interface ProductContextType {
  products: Product[];
  getFeaturedProducts: () => Product[];
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

interface ProductProviderProps {
  children: ReactNode;
}

export function ProductProvider({ children }: ProductProviderProps) {
  const getFeaturedProducts = () => featuredProducts;

  const value: ProductContextType = {
    products: featuredProducts,
    getFeaturedProducts,
  };

  return (
    <ProductContext.Provider value={value}>
      {children}
    </ProductContext.Provider>
  );
}

export function useProducts() {
  const context = useContext(ProductContext);
  if (context === undefined) {
    throw new Error('useProducts must be used within a ProductProvider');
  }
  return context;
}
