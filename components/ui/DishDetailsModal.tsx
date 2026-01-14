import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  Image,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { Dish, DishSize, DishOption } from '@/types';
import { COLORS, TYPOGRAPHY, BORDER_RADIUS, SPACING } from '@/constants/Theme';

interface DishDetailsModalProps {
  dish: Dish | null;
  visible: boolean;
  onClose: () => void;
  onAdd: (
    dish: Dish,
    quantity: number,
    selectedSize?: DishSize,
    selectedOptions?: DishOption[]
  ) => void;
}

export const DishDetailsModal: React.FC<DishDetailsModalProps> = ({
  dish,
  visible,
  onClose,
  onAdd,
}) => {
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState<DishSize | undefined>(undefined);
  const [selectedOptions, setSelectedOptions] = useState<DishOption[]>([]);

  // Auto-select first size when modal opens
  useEffect(() => {
    if (visible && dish && dish.sizes && dish.sizes.length > 0) {
      setSelectedSize(dish.sizes[0]);
    }
  }, [visible, dish]);

  if (!dish) return null;

  const handleIncrement = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setQuantity((prev) => prev + 1);
  };

  const handleDecrement = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setQuantity((prev) => (prev > 1 ? prev - 1 : 1));
  };

  const handleSizeSelect = (size: DishSize) => {
    Haptics.selectionAsync();
    setSelectedSize(size);
  };

  const toggleOption = (option: DishOption) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelectedOptions((prev) =>
      prev.find((o) => o.id === option.id)
        ? prev.filter((o) => o.id !== option.id)
        : [...prev, option]
    );
  };

  const calculateTotal = () => {
    let total = dish.price;
    if (selectedSize) {
      total += selectedSize.price;
    }
    selectedOptions.forEach((opt) => {
      total += opt.price;
    });
    return total * quantity;
  };

  const handleAdd = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    onAdd(dish, quantity, selectedSize, selectedOptions);
    // Reset state
    setQuantity(1);
    setSelectedSize(undefined);
    setSelectedOptions([]);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="fullScreen"
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <View style={{ width: 40 }} />
          <Text style={styles.headerTitle}>{dish.name}</Text>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={onClose}
            activeOpacity={0.7}
          >
            <Ionicons name="close" size={24} color={COLORS.text} />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          {/* Image */}
          <Image source={{ uri: dish.image }} style={styles.image} />

          {/* Content */}
          <View style={styles.content}>
            {/* Description */}
            <View style={styles.section}>
              <Text style={styles.description}>{dish.description}</Text>
            </View>

            {/* Ingredients */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Ингредиенты</Text>
              <Text style={styles.sectionText}>{dish.ingredients}</Text>
            </View>

            {/* Calories (placeholder - можно добавить в mockData) */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Пищевая ценность</Text>
              <View style={styles.nutritionRow}>
                <View style={styles.nutritionItem}>
                  <Text style={styles.nutritionValue}>420</Text>
                  <Text style={styles.nutritionLabel}>ккал</Text>
                </View>
                <View style={styles.nutritionItem}>
                  <Text style={styles.nutritionValue}>25г</Text>
                  <Text style={styles.nutritionLabel}>белки</Text>
                </View>
                <View style={styles.nutritionItem}>
                  <Text style={styles.nutritionValue}>30г</Text>
                  <Text style={styles.nutritionLabel}>жиры</Text>
                </View>
                <View style={styles.nutritionItem}>
                  <Text style={styles.nutritionValue}>45г</Text>
                  <Text style={styles.nutritionLabel}>углеводы</Text>
                </View>
              </View>
            </View>

            {/* Size Selection */}
            {dish.sizes && dish.sizes.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Размер</Text>
                <View style={styles.optionsContainer}>
                  {dish.sizes.map((size) => (
                    <TouchableOpacity
                      key={size.id}
                      style={[
                        styles.optionButton,
                        selectedSize?.id === size.id && styles.optionButtonSelected,
                      ]}
                      onPress={() => handleSizeSelect(size)}
                      activeOpacity={0.7}
                    >
                      <Text
                        style={[
                          styles.optionButtonText,
                          selectedSize?.id === size.id && styles.optionButtonTextSelected,
                        ]}
                      >
                        {size.name}
                      </Text>
                      {size.price > 0 && (
                        <Text
                          style={[
                            styles.optionButtonPrice,
                            selectedSize?.id === size.id && styles.optionButtonPriceSelected,
                          ]}
                        >
                          +{size.price}₽
                        </Text>
                      )}
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            )}

            {/* Options Selection */}
            {dish.options && dish.options.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Дополнительно</Text>
                <View style={styles.optionsContainer}>
                  {dish.options.map((option) => (
                    <TouchableOpacity
                      key={option.id}
                      style={[
                        styles.optionButton,
                        selectedOptions.find((o) => o.id === option.id) &&
                          styles.optionButtonSelected,
                      ]}
                      onPress={() => toggleOption(option)}
                      activeOpacity={0.7}
                    >
                      <Text
                        style={[
                          styles.optionButtonText,
                          selectedOptions.find((o) => o.id === option.id) &&
                            styles.optionButtonTextSelected,
                        ]}
                      >
                        {option.name}
                      </Text>
                      <Text
                        style={[
                          styles.optionButtonPrice,
                          selectedOptions.find((o) => o.id === option.id) &&
                            styles.optionButtonPriceSelected,
                        ]}
                      >
                        +{option.price}₽
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            )}

            {/* Bottom spacing */}
            <View style={{ height: 100 }} />
          </View>
        </ScrollView>

        {/* Bottom Bar */}
        <View style={styles.bottomBar}>
          <View style={styles.quantityContainer}>
            <TouchableOpacity
              style={styles.quantityButton}
              onPress={handleDecrement}
              activeOpacity={0.7}
            >
              <Ionicons name="remove" size={20} color={COLORS.text} />
            </TouchableOpacity>
            <Text style={styles.quantityText}>{quantity}</Text>
            <TouchableOpacity
              style={styles.quantityButton}
              onPress={handleIncrement}
              activeOpacity={0.7}
            >
              <Ionicons name="add" size={20} color={COLORS.text} />
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={styles.addButton}
            onPress={handleAdd}
            activeOpacity={0.8}
          >
            <Text style={styles.addButtonText}>
              Добавить • {calculateTotal()}₽
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  headerTitle: {
    fontSize: TYPOGRAPHY.h6,
    fontWeight: TYPOGRAPHY.weightBold,
    color: COLORS.text,
  },
  closeButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollView: {
    flex: 1,
  },
  image: {
    width: '100%',
    height: 300,
    backgroundColor: COLORS.surface,
  },
  content: {
    padding: SPACING.md,
  },
  section: {
    marginBottom: SPACING.lg,
  },
  description: {
    fontSize: TYPOGRAPHY.body,
    color: COLORS.textSecondary,
    lineHeight: TYPOGRAPHY.body * 1.5,
  },
  sectionTitle: {
    fontSize: TYPOGRAPHY.h6,
    fontWeight: TYPOGRAPHY.weightBold,
    color: COLORS.text,
    marginBottom: SPACING.sm,
  },
  sectionText: {
    fontSize: TYPOGRAPHY.body,
    color: COLORS.textSecondary,
    lineHeight: TYPOGRAPHY.body * 1.5,
  },
  nutritionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: COLORS.surface,
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.lg,
  },
  nutritionItem: {
    alignItems: 'center',
  },
  nutritionValue: {
    fontSize: TYPOGRAPHY.h6,
    fontWeight: TYPOGRAPHY.weightBold,
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  nutritionLabel: {
    fontSize: TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
  },
  optionsContainer: {
    gap: SPACING.sm,
  },
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.surface,
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.lg,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  optionButtonSelected: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  optionButtonText: {
    fontSize: TYPOGRAPHY.body,
    fontWeight: TYPOGRAPHY.weightMedium,
    color: COLORS.text,
  },
  optionButtonTextSelected: {
    color: COLORS.textOnPrimary,
    fontWeight: TYPOGRAPHY.weightBold,
  },
  optionButtonPrice: {
    fontSize: TYPOGRAPHY.body,
    fontWeight: TYPOGRAPHY.weightSemibold,
    color: COLORS.textSecondary,
  },
  optionButtonPriceSelected: {
    color: COLORS.textOnPrimary,
  },
  bottomBar: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.md,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    gap: SPACING.md,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.xs,
    gap: SPACING.sm,
  },
  quantityButton: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: BORDER_RADIUS.md,
    backgroundColor: COLORS.background,
  },
  quantityText: {
    fontSize: TYPOGRAPHY.h6,
    fontWeight: TYPOGRAPHY.weightBold,
    color: COLORS.text,
    minWidth: 30,
    textAlign: 'center',
  },
  addButton: {
    flex: 1,
    backgroundColor: COLORS.primary,
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.lg,
    alignItems: 'center',
  },
  addButtonText: {
    fontSize: TYPOGRAPHY.body,
    fontWeight: TYPOGRAPHY.weightBold,
    color: COLORS.textOnPrimary,
  },
});
