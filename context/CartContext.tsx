import React, { createContext, useContext, useState, ReactNode } from 'react';
import { CartItem, Dish, DishSize, DishOption } from '@/types';

interface CartContextType {
  items: CartItem[];
  addItem: (
    dish: Dish,
    quantity: number,
    selectedSize?: DishSize,
    selectedOptions?: DishOption[]
  ) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  getTotal: () => number;
  getItemsCount: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);

  const addItem = (
    dish: Dish,
    quantity: number,
    selectedSize?: DishSize,
    selectedOptions?: DishOption[]
  ) => {
    const basePrice = dish.price + (selectedSize?.price || 0);
    const optionsPrice = selectedOptions?.reduce((sum, opt) => sum + opt.price, 0) || 0;
    const totalPrice = (basePrice + optionsPrice) * quantity;

    const newItem: CartItem = {
      id: `${dish.id}-${Date.now()}`,
      dish,
      quantity,
      selectedSize,
      selectedOptions,
      totalPrice,
    };

    setItems((prev) => [...prev, newItem]);
  };

  const removeItem = (itemId: string) => {
    setItems((prev) => prev.filter((item) => item.id !== itemId));
  };

  const updateQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(itemId);
      return;
    }

    setItems((prev) =>
      prev.map((item) => {
        if (item.id === itemId) {
          const basePrice = item.dish.price + (item.selectedSize?.price || 0);
          const optionsPrice =
            item.selectedOptions?.reduce((sum, opt) => sum + opt.price, 0) || 0;
          const totalPrice = (basePrice + optionsPrice) * quantity;

          return {
            ...item,
            quantity,
            totalPrice,
          };
        }
        return item;
      })
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const getTotal = () => {
    return items.reduce((sum, item) => sum + item.totalPrice, 0);
  };

  const getItemsCount = () => {
    return items.reduce((sum, item) => sum + item.quantity, 0);
  };

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        getTotal,
        getItemsCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
};
