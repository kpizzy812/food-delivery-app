import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import Animated, { FadeInDown, FadeIn, FadeOut } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';

import { DishCard, DishDetailsModal, useScrollToTop } from '@/components/ui';
import { restaurants, bellaitaliaDishes, sushiMasterDishes } from '@/data/mockData';
import { useCart } from '@/context/CartContext';
import { Dish, DishSize, DishOption } from '@/types';
import { COLORS, SPACING, TYPOGRAPHY, BORDER_RADIUS } from '@/constants/Theme';

export default function RestaurantScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { addItem, getTotal, getItemsCount } = useCart();

  const restaurant = restaurants.find((r) => r.id === id);
  const dishes = id === '1' ? bellaitaliaDishes : id === '2' ? sushiMasterDishes : [];

  const [selectedCategory, setSelectedCategory] = useState<string>('Все');
  const [selectedDish, setSelectedDish] = useState<Dish | null>(null);
  const [showModal, setShowModal] = useState(false);

  // Scroll to top
  const { scrollRef, handleScroll, scrollToTop, showButton } = useScrollToTop();

  if (!restaurant) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Ресторан не найден</Text>
      </View>
    );
  }

  const categories = ['Все', ...Array.from(new Set(dishes.map((d) => d.category)))];

  const filteredDishes =
    selectedCategory === 'Все'
      ? dishes
      : dishes.filter((d) => d.category === selectedCategory);

  const cartTotal = getTotal();
  const cartCount = getItemsCount();

  const handleDishPress = (dish: Dish) => {
    setSelectedDish(dish);
    setShowModal(true);
  };

  const handleAddToCart = (
    dish: Dish,
    quantity: number,
    selectedSize?: DishSize,
    selectedOptions?: DishOption[]
  ) => {
    addItem(dish, quantity, selectedSize, selectedOptions);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        ref={scrollRef}
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        {/* Header with Back Button */}
        <View style={styles.topBar}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
            activeOpacity={0.7}
          >
            <Ionicons name="arrow-back" size={24} color={COLORS.text} />
          </TouchableOpacity>
        </View>

        {/* Restaurant Header */}
        <Image source={{ uri: restaurant.image }} style={styles.headerImage} />
        <View style={styles.headerInfo}>
          <Text style={styles.restaurantName}>{restaurant.name}</Text>
          <View style={styles.meta}>
            <Ionicons name="star" size={14} color={COLORS.warning} />
            <Text style={styles.metaItem}> {restaurant.rating}</Text>
            <Text style={styles.dot}>•</Text>
            <Text style={styles.metaItem}>{restaurant.deliveryTime}</Text>
            <Text style={styles.dot}>•</Text>
            <Text style={styles.metaItem}>Доставка {restaurant.deliveryFee}₽</Text>
          </View>
          <Text style={styles.cuisine}>
            {restaurant.cuisineType.join(' • ')}
          </Text>
        </View>

        {/* Category Tabs */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tabsContainer}
          style={styles.tabs}
        >
          {categories.map((category) => (
            <TouchableOpacity
              key={category}
              style={[
                styles.tab,
                selectedCategory === category && styles.tabActive,
              ]}
              onPress={() => setSelectedCategory(category)}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.tabText,
                  selectedCategory === category && styles.tabTextActive,
                ]}
              >
                {category}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Menu Items - Grid Layout */}
        <View style={styles.menuContainer}>
          <View style={styles.grid}>
            {filteredDishes.map((dish, index) => (
              <Animated.View
                key={dish.id}
                style={styles.gridItem}
                entering={FadeInDown.delay(index * 50).springify()}
              >
                <DishCard
                  dish={dish}
                  onAddPress={() => handleDishPress(dish)}
                />
              </Animated.View>
            ))}
          </View>
        </View>

        {/* Bottom spacing for floating button */}
        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Floating Cart Button */}
      {cartCount > 0 && (
        <Animated.View
          entering={FadeInDown.springify()}
          style={styles.floatingCart}
        >
          <TouchableOpacity
            style={styles.cartButton}
            onPress={() => router.push('/cart')}
            activeOpacity={0.8}
          >
            <View style={styles.cartBadge}>
              <Text style={styles.cartBadgeText}>{cartCount}</Text>
            </View>
            <Text style={styles.cartButtonText}>Корзина</Text>
            <Text style={styles.cartButtonPrice}>{cartTotal}₽</Text>
          </TouchableOpacity>
        </Animated.View>
      )}

      {/* Dish Details Modal */}
      <DishDetailsModal
        dish={selectedDish}
        visible={showModal}
        onClose={() => setShowModal(false)}
        onAdd={handleAddToCart}
      />

      {/* Scroll to Top Button */}
      {showButton && (
        <Animated.View
          entering={FadeIn.duration(200)}
          exiting={FadeOut.duration(200)}
          style={styles.scrollToTopButton}
        >
          <TouchableOpacity
            style={styles.scrollToTopTouchable}
            onPress={scrollToTop}
            activeOpacity={0.7}
          >
            <Ionicons name="arrow-up" size={20} color={COLORS.textSecondary} />
          </TouchableOpacity>
        </Animated.View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollView: {
    flex: 1,
  },
  topBar: {
    position: 'absolute',
    top: SPACING.md,
    left: SPACING.md,
    zIndex: 10,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.lg,
  },
  errorText: {
    fontSize: TYPOGRAPHY.h6,
    color: COLORS.textSecondary,
  },
  headerImage: {
    width: '100%',
    height: 320,
    backgroundColor: COLORS.surface,
  },
  headerInfo: {
    padding: SPACING.md,
    paddingBottom: SPACING.lg,
  },
  restaurantName: {
    fontSize: TYPOGRAPHY.h3,
    fontWeight: TYPOGRAPHY.weightBold,
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.xs,
  },
  metaItem: {
    fontSize: TYPOGRAPHY.bodySmall,
    color: COLORS.textSecondary,
    fontWeight: TYPOGRAPHY.weightMedium,
  },
  dot: {
    color: COLORS.textTertiary,
    marginHorizontal: SPACING.xs,
  },
  cuisine: {
    fontSize: TYPOGRAPHY.bodySmall,
    color: COLORS.textTertiary,
  },
  tabs: {
    marginBottom: SPACING.md,
  },
  tabsContainer: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    gap: SPACING.sm,
  },
  tab: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.xl,
    backgroundColor: COLORS.surface,
  },
  tabActive: {
    backgroundColor: COLORS.primary,
  },
  tabText: {
    fontSize: TYPOGRAPHY.bodySmall,
    fontWeight: TYPOGRAPHY.weightMedium,
    color: COLORS.text,
  },
  tabTextActive: {
    color: COLORS.textOnPrimary,
    fontWeight: TYPOGRAPHY.weightBold,
  },
  menuContainer: {
    paddingHorizontal: SPACING.md,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  gridItem: {
    width: '48%',
  },
  floatingCart: {
    position: 'absolute',
    bottom: SPACING.lg,
    left: SPACING.md,
    right: SPACING.md,
  },
  cartButton: {
    backgroundColor: COLORS.primary,
    borderRadius: BORDER_RADIUS.lg,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cartBadge: {
    backgroundColor: COLORS.textOnPrimary,
    borderRadius: 12,
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cartBadgeText: {
    color: COLORS.primary,
    fontSize: TYPOGRAPHY.caption,
    fontWeight: TYPOGRAPHY.weightBold,
  },
  cartButtonText: {
    flex: 1,
    marginLeft: SPACING.md,
    color: COLORS.textOnPrimary,
    fontSize: TYPOGRAPHY.h6,
    fontWeight: TYPOGRAPHY.weightSemibold,
  },
  cartButtonPrice: {
    color: COLORS.textOnPrimary,
    fontSize: TYPOGRAPHY.h6,
    fontWeight: TYPOGRAPHY.weightBold,
  },
  scrollToTopButton: {
    position: 'absolute',
    bottom: SPACING.lg,
    left: SPACING.md,
  },
  scrollToTopTouchable: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.background,
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    elevation: 3,
  },
});
