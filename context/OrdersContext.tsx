import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Order, CartItem, Address, PaymentMethod } from '@/types';

interface OrdersContextType {
  orders: Order[];
  addOrder: (
    items: CartItem[],
    total: number,
    address: Address,
    paymentMethod: PaymentMethod,
    deliveryTime: 'asap' | string,
    comment?: string
  ) => Order;
  getOrderById: (orderId: string) => Order | undefined;
}

const OrdersContext = createContext<OrdersContextType | undefined>(undefined);

export const OrdersProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [orders, setOrders] = useState<Order[]>([]);

  const addOrder = (
    items: CartItem[],
    total: number,
    address: Address,
    paymentMethod: PaymentMethod,
    deliveryTime: 'asap' | string,
    comment?: string
  ): Order => {
    const newOrder: Order = {
      id: `order-${Date.now()}`,
      items,
      total,
      address,
      paymentMethod,
      deliveryTime,
      comment,
      status: 'confirmed',
      estimatedDeliveryTime: deliveryTime === 'asap' ? '30-40 мин' : deliveryTime,
      createdAt: new Date().toISOString(),
    };

    setOrders((prev) => [newOrder, ...prev]);
    return newOrder;
  };

  const getOrderById = (orderId: string): Order | undefined => {
    return orders.find((order) => order.id === orderId);
  };

  return (
    <OrdersContext.Provider value={{ orders, addOrder, getOrderById }}>
      {children}
    </OrdersContext.Provider>
  );
};

export const useOrders = (): OrdersContextType => {
  const context = useContext(OrdersContext);
  if (!context) {
    throw new Error('useOrders must be used within OrdersProvider');
  }
  return context;
};
