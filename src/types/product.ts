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
    image: require('@/assets/images/products/premium-headphones.png'),
  },
  {
    id: '2',
    name: 'Smart Watch Pro',
    description: 'Advanced fitness tracking and notifications on your wrist',
    price: 449.99,
    image: require('@/assets/images/products/smart-watch-pro.png'),
  },
  {
    id: '3',
    name: 'Wireless Earbuds',
    description: 'Compact earbuds with premium sound quality',
    price: 179.99,
    image: require('@/assets/images/products/wireless-earbuds.png'),
  },
  {
    id: '4',
    name: 'Portable Speaker',
    description: 'Powerful Bluetooth speaker with 20-hour battery life',
    price: 129.99,
    image: require('@/assets/images/products/portable-speaker.png'),
  },
  {
    id: '5',
    name: 'Gaming Mouse',
    description: 'Precision gaming mouse with customizable RGB lighting',
    price: 89.99,
    image: require('@/assets/images/products/gaming-mouse.png'),
  },
  {
    id: '6',
    name: 'Mechanical Keyboard',
    description: 'Tactile switches with customizable backlight profiles',
    price: 159.99,
    image: require('@/assets/images/products/mechanical-keyboard.png'),
  },
  {
    id: '7',
    name: '4K Action Camera',
    description: 'Rugged, waterproof camera for adventure footage',
    price: 249.99,
    image: require('@/assets/images/products/action-camera-4k.png'),
  },
  {
    id: '8',
    name: 'Smart Home Hub',
    description: 'Control lights, locks, and devices from one screen',
    price: 199.99,
    image: require('@/assets/images/products/smart-home-hub.png'),
  },
  {
    id: '9',
    name: 'USB-C Dock',
    description: 'Expand your laptop with 10 ports and fast charging',
    price: 119.99,
    image: require('@/assets/images/products/usb-c-dock.png'),
  },
  {
    id: '10',
    name: 'Ergonomic Chair',
    description: 'All-day comfort with adjustable lumbar support',
    price: 329.99,
    image: require('@/assets/images/products/ergonomic-chair.png'),
  },
];
