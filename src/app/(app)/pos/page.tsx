
'use client';

import { useState, useMemo } from 'react';
import ProductGrid from '@/components/pos/ProductGrid';
import Cart from '@/components/pos/Cart';
import type { Product, CartItem } from '@/lib/types';

const mockProducts: Product[] = [
  { id: '1', name: 'Espresso', price: 2.5, imageUrl: 'https://picsum.photos/200/200?random=1', category: 'Coffee', stock: 100 },
  { id: '2', name: 'Latte', price: 3.5, imageUrl: 'https://picsum.photos/200/200?random=2', category: 'Coffee', stock: 100 },
  { id: '3', name: 'Cappuccino', price: 3.5, imageUrl: 'https://picsum.photos/200/200?random=3', category: 'Coffee', stock: 100 },
  { id: '4', name: 'Croissant', price: 2.75, imageUrl: 'https://picsum.photos/200/200?random=4', category: 'Pastries', stock: 50 },
  { id: '5', name: 'Muffin', price: 2.25, imageUrl: 'https://picsum.photos/200/200?random=5', category: 'Pastries', stock: 50 },
  { id: '6', name: 'Iced Tea', price: 2.0, imageUrl: 'https://picsum.photos/200/200?random=6', category: 'Drinks', stock: 75 },
  { id: '7', name: 'Bagel', price: 3.0, imageUrl: 'https://picsum.photos/200/200?random=7', category: 'Pastries', stock: 40 },
  { id: '8', name: 'Americano', price: 2.75, imageUrl: 'https://picsum.photos/200/200?random=8', category: 'Coffee', stock: 100 },
];

export default function PosPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  const addToCart = (product: Product) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.id === product.id);
      if (existingItem) {
        return prevItems.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prevItems, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCartItems((prevItems) =>
      prevItems.reduce((acc, item) => {
        if (item.id === productId) {
          if (item.quantity > 1) {
            acc.push({ ...item, quantity: item.quantity - 1 });
          }
        } else {
          acc.push(item);
        }
        return acc;
      }, [] as CartItem[])
    );
  };
  
  const clearCart = () => {
    setCartItems([]);
  };

  const filteredProducts = useMemo(() => {
    if (!searchTerm) {
      return mockProducts;
    }
    return mockProducts.filter(product =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  return (
    <div className="h-[calc(100vh-6rem)] grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 h-full">
        <ProductGrid 
          products={filteredProducts} 
          onAddToCart={addToCart}
          searchTerm={searchTerm}
          onSearchTermChange={setSearchTerm}
        />
      </div>
      <div className="lg:col-span-1 h-full">
        <Cart
          items={cartItems}
          onAdd={addToCart}
          onRemove={removeFromCart}
          onClear={clearCart}
        />
      </div>
    </div>
  );
}
