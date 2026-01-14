// Types for Food Delivery App

export interface Restaurant {
  id: string;
  name: string;
  image: string;
  rating: number;
  deliveryTime: string; // e.g., "25-35 min"
  deliveryFee: number;
  minOrder: number;
  cuisineType: string[];
  promoted?: boolean;
  promo?: {
    code: string;
    discount: number; // e.g., 20 for 20%
  };
}

export interface Category {
  id: string;
  name: string;
  emoji: string;
}

export interface DishOption {
  id: string;
  name: string;
  price: number;
}

export interface DishSize {
  id: string;
  name: string; // "Small", "Medium", "Large"
  price: number;
}

export interface Dish {
  id: string;
  restaurantId: string;
  name: string;
  description: string;
  ingredients: string;
  image: string;
  price: number;
  category: string;
  sizes?: DishSize[];
  options?: DishOption[]; // Extras like sauces, toppings
  popular?: boolean;
}

export interface CartItem {
  id: string; // Unique cart item ID
  dish: Dish;
  quantity: number;
  selectedSize?: DishSize;
  selectedOptions?: DishOption[];
  totalPrice: number;
}

export interface PromoCode {
  code: string;
  discount: number; // Percentage or fixed amount
  type: 'percentage' | 'fixed';
}

export interface Address {
  id: string;
  label: string; // "Home", "Work", "Other"
  street: string;
  building: string;
  apartment?: string;
  floor?: string;
  instructions?: string;
}

export interface PaymentMethod {
  id: string;
  type: 'card' | 'cash' | 'apple_pay' | 'google_pay';
  label: string;
  last4?: string; // Last 4 digits for cards
  icon: string;
}

export interface Order {
  id: string;
  restaurantId: string;
  items: CartItem[];
  subtotal: number;
  deliveryFee: number;
  discount: number;
  total: number;
  address: Address;
  paymentMethod: PaymentMethod;
  deliveryTime: 'asap' | string; // ISO date string or "asap"
  comment?: string;
  status: 'pending' | 'confirmed' | 'preparing' | 'delivering' | 'delivered';
  estimatedDeliveryTime?: string;
  createdAt: string;
}
