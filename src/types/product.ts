export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: number;
}

export const featuredProducts: Product[] = [
  {
    id: '1',
    name: 'Premium Headphones',
    description: 'High-quality wireless headphones with noise cancellation',
    price: 299.99,
    image: require('@/assets/images/react-logo.png'),
  },
  {
    id: '2',
    name: 'Smart Watch Pro',
    description: 'Advanced fitness tracking and notifications on your wrist',
    price: 449.99,
    image: require('@/assets/images/react-logo.png'),
  },
  {
    id: '3',
    name: 'Wireless Earbuds',
    description: 'Compact earbuds with premium sound quality',
    price: 179.99,
    image: require('@/assets/images/react-logo.png'),
  },
  {
    id: '4',
    name: 'Portable Speaker',
    description: 'Powerful Bluetooth speaker with 20-hour battery life',
    price: 129.99,
    image: require('@/assets/images/react-logo.png'),
  },
  {
    id: '5',
    name: 'Gaming Mouse',
    description: 'Precision gaming mouse with customizable RGB lighting',
    price: 89.99,
    image: require('@/assets/images/react-logo.png'),
  },
];
