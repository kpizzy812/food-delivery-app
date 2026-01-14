import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import Animated, { FadeIn, ZoomIn } from 'react-native-reanimated';

import { Button } from '@/components/ui';
import { allDishes } from '@/data/mockData';
import { useCart } from '@/context/CartContext';
import { DishSize, DishOption } from '@/types';
import { COLORS, SPACING, TYPOGRAPHY, BORDER_RADIUS } from '@/constants/Theme';

export default function DishModal() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { addItem } = useCart();

  const dish = allDishes.find((d) => d.id === id);

  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState<DishSize | undefined>(
    dish?.sizes?.[0]
  );
  const [selectedOptions, setSelectedOptions] = useState<DishOption[]>([]);

  if (!dish) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Блюдо не найдено</Text>
      </View>
    );
  }

  const toggleOption = (option: DishOption) => {
    setSelectedOptions((prev) => {
      const exists = prev.find((o) => o.id === option.id);
      if (exists) {
        return prev.filter((o) => o.id !== option.id);
      }
      return [...prev, option];
    });
  };

  const calculateTotal = () => {
    const basePrice = dish.price + (selectedSize?.price || 0);
    const optionsPrice = selectedOptions.reduce((sum, opt) => sum + opt.price, 0);
    return (basePrice + optionsPrice) * quantity;
  };

  const handleAddToCart = () => {
    addItem(dish, quantity, selectedSize, selectedOptions);
    router.back();
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Dish Image */}
        <Animated.Image
          entering={ZoomIn.springify()}
          source={{ uri: dish.image }}
          style={styles.image}
        />

        {/* Dish Info */}
        <Animated.View entering={FadeIn.delay(100)} style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.name}>{dish.name}</Text>
            {dish.popular && <Text style={styles.popularBadge}>🔥 Популярное</Text>}
          </View>

          <Text style={styles.description}>{dish.description}</Text>

          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Состав:</Text>
            <Text style={styles.ingredients}>{dish.ingredients}</Text>
          </View>

          {/* Size Selection */}
          {dish.sizes && dish.sizes.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Выберите размер</Text>
              {dish.sizes.map((size) => (
                <TouchableOpacity
                  key={size.id}
                  style={[
                    styles.optionItem,
                    selectedSize?.id === size.id && styles.optionItemSelected,
                  ]}
                  onPress={() => setSelectedSize(size)}
                >
                  <Text
                    style={[
                      styles.optionName,
                      selectedSize?.id === size.id && styles.optionNameSelected,
                    ]}
                  >
                    {size.name}
                  </Text>
                  <Text
                    style={[
                      styles.optionPrice,
                      selectedSize?.id === size.id && styles.optionPriceSelected,
                    ]}
                  >
                    {size.price > 0 ? `+${size.price}₽` : `${dish.price}₽`}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}

          {/* Options Selection */}
          {dish.options && dish.options.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Дополнительно</Text>
              {dish.options.map((option) => {
                const isSelected = selectedOptions.some((o) => o.id === option.id);
                return (
                  <TouchableOpacity
                    key={option.id}
                    style={[
                      styles.optionItem,
                      isSelected && styles.optionItemSelected,
                    ]}
                    onPress={() => toggleOption(option)}
                  >
                    <Text
                      style={[
                        styles.optionName,
                        isSelected && styles.optionNameSelected,
                      ]}
                    >
                      {option.name}
                    </Text>
                    <Text
                      style={[
                        styles.optionPrice,
                        isSelected && styles.optionPriceSelected,
                      ]}
                    >
                      +{option.price}₽
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          )}

          {/* Quantity Counter */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Количество</Text>
            <View style={styles.quantityContainer}>
              <TouchableOpacity
                style={[styles.quantityButton, quantity === 1 && styles.quantityButtonDisabled]}
                onPress={() => setQuantity((q) => Math.max(1, q - 1))}
                disabled={quantity === 1}
              >
                <Text style={styles.quantityButtonText}>−</Text>
              </TouchableOpacity>
              <Text style={styles.quantityText}>{quantity}</Text>
              <TouchableOpacity
                style={styles.quantityButton}
                onPress={() => setQuantity((q) => q + 1)}
              >
                <Text style={styles.quantityButtonText}>+</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Bottom spacing */}
          <View style={{ height: 100 }} />
        </Animated.View>
      </ScrollView>

      {/* Add to Cart Button */}
      <View style={styles.footer}>
        <Button
          title={`Добавить в корзину • ${calculateTotal()}₽`}
          onPress={handleAddToCart}
          size="large"
          fullWidth
        />
      </View>
    </View>
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
  image: {
    width: '100%',
    height: 300,
    backgroundColor: COLORS.surface,
  },
  content: {
    padding: SPACING.md,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SPACING.sm,
  },
  name: {
    flex: 1,
    fontSize: TYPOGRAPHY.h3,
    fontWeight: TYPOGRAPHY.weightBold,
    color: COLORS.text,
  },
  popularBadge: {
    fontSize: TYPOGRAPHY.bodySmall,
    color: COLORS.primary,
    fontWeight: TYPOGRAPHY.weightSemibold,
  },
  description: {
    fontSize: TYPOGRAPHY.body,
    color: COLORS.textSecondary,
    lineHeight: TYPOGRAPHY.body * TYPOGRAPHY.lineHeightNormal,
    marginBottom: SPACING.md,
  },
  section: {
    marginBottom: SPACING.lg,
  },
  sectionLabel: {
    fontSize: TYPOGRAPHY.bodySmall,
    fontWeight: TYPOGRAPHY.weightSemibold,
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  sectionTitle: {
    fontSize: TYPOGRAPHY.h6,
    fontWeight: TYPOGRAPHY.weightBold,
    color: COLORS.text,
    marginBottom: SPACING.md,
  },
  ingredients: {
    fontSize: TYPOGRAPHY.bodySmall,
    color: COLORS.textTertiary,
    lineHeight: TYPOGRAPHY.bodySmall * TYPOGRAPHY.lineHeightNormal,
  },
  optionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    backgroundColor: COLORS.surface,
    borderWidth: 2,
    borderColor: COLORS.surface,
    marginBottom: SPACING.sm,
  },
  optionItemSelected: {
    backgroundColor: COLORS.primaryLight + '20',
    borderColor: COLORS.primary,
  },
  optionName: {
    fontSize: TYPOGRAPHY.body,
    color: COLORS.text,
    fontWeight: TYPOGRAPHY.weightMedium,
  },
  optionNameSelected: {
    color: COLORS.primary,
    fontWeight: TYPOGRAPHY.weightSemibold,
  },
  optionPrice: {
    fontSize: TYPOGRAPHY.body,
    color: COLORS.textSecondary,
    fontWeight: TYPOGRAPHY.weightMedium,
  },
  optionPriceSelected: {
    color: COLORS.primary,
    fontWeight: TYPOGRAPHY.weightBold,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.lg,
  },
  quantityButton: {
    width: 48,
    height: 48,
    borderRadius: BORDER_RADIUS.md,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quantityButtonDisabled: {
    opacity: 0.5,
  },
  quantityButtonText: {
    color: COLORS.textOnPrimary,
    fontSize: TYPOGRAPHY.h4,
    fontWeight: TYPOGRAPHY.weightBold,
  },
  quantityText: {
    fontSize: TYPOGRAPHY.h3,
    fontWeight: TYPOGRAPHY.weightBold,
    color: COLORS.text,
    minWidth: 40,
    textAlign: 'center',
  },
  footer: {
    padding: SPACING.md,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    backgroundColor: COLORS.background,
  },
});
