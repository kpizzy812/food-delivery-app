import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Restaurant, Dish } from '@/types';

interface FavoritesContextType {
  favoriteRestaurants: Set<string>;
  favoriteDishes: Set<string>;
  toggleRestaurantFavorite: (restaurantId: string) => void;
  toggleDishFavorite: (dishId: string) => void;
  isRestaurantFavorite: (restaurantId: string) => boolean;
  isDishFavorite: (dishId: string) => boolean;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export const FavoritesProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [favoriteRestaurants, setFavoriteRestaurants] = useState<Set<string>>(new Set());
  const [favoriteDishes, setFavoriteDishes] = useState<Set<string>>(new Set());

  const toggleRestaurantFavorite = (restaurantId: string) => {
    setFavoriteRestaurants((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(restaurantId)) {
        newSet.delete(restaurantId);
      } else {
        newSet.add(restaurantId);
      }
      return newSet;
    });
  };

  const toggleDishFavorite = (dishId: string) => {
    setFavoriteDishes((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(dishId)) {
        newSet.delete(dishId);
      } else {
        newSet.add(dishId);
      }
      return newSet;
    });
  };

  const isRestaurantFavorite = (restaurantId: string): boolean => {
    return favoriteRestaurants.has(restaurantId);
  };

  const isDishFavorite = (dishId: string): boolean => {
    return favoriteDishes.has(dishId);
  };

  return (
    <FavoritesContext.Provider
      value={{
        favoriteRestaurants,
        favoriteDishes,
        toggleRestaurantFavorite,
        toggleDishFavorite,
        isRestaurantFavorite,
        isDishFavorite,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = (): FavoritesContextType => {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites must be used within FavoritesProvider');
  }
  return context;
};
