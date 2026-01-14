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
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import Animated, { FadeInRight, FadeOutLeft } from 'react-native-reanimated';

import { Button, Input } from '@/components/ui';
import { useCart } from '@/context/CartContext';
import { COLORS, SPACING, TYPOGRAPHY, BORDER_RADIUS, SHADOWS } from '@/constants/Theme';

const DELIVERY_FEE = 150;
const PROMO_CODES = {
  FIRST25: 0.25, // 25% discount
  SAVE10: 0.10, // 10% discount
  ITALY20: 0.20, // 20% discount (Bella Italia)
  BURGER15: 0.15, // 15% discount (Burger House)
};

export default function CartScreen() {
  const router = useRouter();
  const { items, updateQuantity, removeItem, getTotal } = useCart();

  const [promoCode, setPromoCode] = useState('');
  const [appliedPromo, setAppliedPromo] = useState<string | null>(null);
  const [promoError, setPromoError] = useState('');

  const subtotal = getTotal();
  const discount = appliedPromo
    ? subtotal * (PROMO_CODES[appliedPromo as keyof typeof PROMO_CODES] || 0)
    : 0;
  const total = subtotal + DELIVERY_FEE - discount;

  const applyPromoCode = () => {
    const code = promoCode.toUpperCase();
    if (PROMO_CODES[code as keyof typeof PROMO_CODES]) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setAppliedPromo(code);
      setPromoError('');
      setPromoCode('');
    } else {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      setPromoError('Неверный промокод');
    }
  };

  const removePromo = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setAppliedPromo(null);
    setPromoError('');
  };

  const handleUpdateQuantity = (itemId: string, newQuantity: number) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    updateQuantity(itemId, newQuantity);
  };

  const handleRemoveItem = (itemId: string) => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    removeItem(itemId);
  };

  if (items.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.emptyContainer}>
          <View style={styles.emptyIconContainer}>
            <Text style={styles.emptyEmoji}>🛒</Text>
          </View>
          <Text style={styles.emptyTitle}>Корзина пуста</Text>
          <Text style={styles.emptySubtitle}>
            Добавьте вкусные блюда из меню{'\n'}ваших любимых ресторанов
          </Text>
          <Button
            title="Смотреть рестораны"
            onPress={() => router.push('/(tabs)')}
            style={styles.emptyButton}
            fullWidth
          />

          {/* Info Cards */}
          <View style={styles.infoCards}>
            <View style={styles.infoCard}>
              <View style={styles.infoIconContainer}>
                <Ionicons name="pricetag" size={24} color={COLORS.primary} />
              </View>
              <Text style={styles.infoCardTitle}>Промокоды</Text>
              <Text style={styles.infoCardText}>
                Используйте промокоды для получения скидок
              </Text>
            </View>
            <View style={styles.infoCard}>
              <View style={styles.infoIconContainer}>
                <Ionicons name="bicycle" size={24} color={COLORS.primary} />
              </View>
              <Text style={styles.infoCardTitle}>Быстрая доставка</Text>
              <Text style={styles.infoCardText}>
                Доставим ваш заказ за 25-40 минут
              </Text>
            </View>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Cart Items */}
        <View style={styles.section}>
          {items.map((item) => (
            <Animated.View
              key={item.id}
              entering={FadeInRight.springify()}
              exiting={FadeOutLeft.springify()}
              style={[styles.cartItem, SHADOWS.sm]}
            >
              <Image
                source={{ uri: item.dish.image }}
                style={styles.itemImage}
              />
              <View style={styles.itemContent}>
                <Text style={styles.itemName} numberOfLines={2}>
                  {item.dish.name}
                </Text>
                {item.selectedSize && (
                  <Text style={styles.itemMeta}>{item.selectedSize.name}</Text>
                )}
                {item.selectedOptions && item.selectedOptions.length > 0 && (
                  <Text style={styles.itemMeta} numberOfLines={1}>
                    {item.selectedOptions.map((o) => o.name).join(', ')}
                  </Text>
                )}
                <View style={styles.quantityControl}>
                  <TouchableOpacity
                    style={styles.quantityBtn}
                    onPress={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                    activeOpacity={0.7}
                  >
                    <Ionicons name="remove" size={16} color={COLORS.primary} />
                  </TouchableOpacity>
                  <Text style={styles.quantityText}>{item.quantity}</Text>
                  <TouchableOpacity
                    style={styles.quantityBtn}
                    onPress={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                    activeOpacity={0.7}
                  >
                    <Ionicons name="add" size={16} color={COLORS.primary} />
                  </TouchableOpacity>
                </View>
              </View>
              <View style={styles.itemActions}>
                <Text style={styles.itemPrice}>{item.totalPrice}₽</Text>
                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => handleRemoveItem(item.id)}
                  activeOpacity={0.7}
                >
                  <Ionicons name="trash-outline" size={20} color={COLORS.error} />
                </TouchableOpacity>
              </View>
            </Animated.View>
          ))}
        </View>

        {/* Promo Code */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Промокод</Text>
          {appliedPromo ? (
            <View style={styles.appliedPromo}>
              <View style={styles.appliedPromoContent}>
                <Text style={styles.appliedPromoCode}>{appliedPromo}</Text>
                <Text style={styles.appliedPromoDiscount}>
                  −{Math.round(discount)}₽
                </Text>
              </View>
              <TouchableOpacity onPress={removePromo}>
                <Ionicons name="close-circle" size={24} color={COLORS.error} />
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.promoContainer}>
              <Input
                placeholder="Введите промокод"
                value={promoCode}
                onChangeText={(text) => {
                  setPromoCode(text);
                  setPromoError('');
                }}
                error={promoError}
                containerStyle={styles.promoInput}
              />
              <Button
                title="Применить"
                onPress={applyPromoCode}
                size="medium"
                style={styles.promoButton}
              />
            </View>
          )}
        </View>

        {/* Summary */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Итого</Text>
          <View style={styles.summaryContainer}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Сумма заказа</Text>
              <Text style={styles.summaryValue}>{subtotal}₽</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Доставка</Text>
              <Text style={styles.summaryValue}>{DELIVERY_FEE}₽</Text>
            </View>
            {discount > 0 && (
              <View style={styles.summaryRow}>
                <Text style={[styles.summaryLabel, styles.discountLabel]}>
                  Скидка
                </Text>
                <Text style={[styles.summaryValue, styles.discountValue]}>
                  −{Math.round(discount)}₽
                </Text>
              </View>
            )}
            <View style={styles.divider} />
            <View style={styles.summaryRow}>
              <Text style={styles.totalLabel}>К оплате</Text>
              <Text style={styles.totalValue}>{Math.round(total)}₽</Text>
            </View>
          </View>
        </View>

        {/* Bottom spacing */}
        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Checkout Button */}
      <View style={styles.footer}>
        <Button
          title={`Оформить заказ • ${Math.round(total)}₽`}
          onPress={() => router.push('/checkout')}
          size="large"
          fullWidth
        />
      </View>
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
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.xl,
  },
  emptyIconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: COLORS.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.lg,
  },
  emptyEmoji: {
    fontSize: 60,
  },
  emptyTitle: {
    fontSize: TYPOGRAPHY.h3,
    fontWeight: TYPOGRAPHY.weightBold,
    color: COLORS.text,
    marginBottom: SPACING.sm,
  },
  emptySubtitle: {
    fontSize: TYPOGRAPHY.body,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: TYPOGRAPHY.body * TYPOGRAPHY.lineHeightNormal,
    marginBottom: SPACING.xl,
  },
  emptyButton: {
    minWidth: 250,
    marginBottom: SPACING.xl,
  },
  infoCards: {
    width: '100%',
    gap: SPACING.md,
  },
  infoCard: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    alignItems: 'center',
  },
  infoIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: COLORS.primaryLight + '20',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.md,
  },
  infoCardTitle: {
    fontSize: TYPOGRAPHY.body,
    fontWeight: TYPOGRAPHY.weightBold,
    color: COLORS.text,
    marginBottom: SPACING.xs,
    textAlign: 'center',
  },
  infoCardText: {
    fontSize: TYPOGRAPHY.bodySmall,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: TYPOGRAPHY.bodySmall * TYPOGRAPHY.lineHeightNormal,
  },
  section: {
    padding: SPACING.md,
  },
  sectionTitle: {
    fontSize: TYPOGRAPHY.h6,
    fontWeight: TYPOGRAPHY.weightBold,
    color: COLORS.text,
    marginBottom: SPACING.md,
  },
  cartItem: {
    flexDirection: 'row',
    backgroundColor: COLORS.card,
    borderRadius: BORDER_RADIUS.lg,
    marginBottom: SPACING.md,
    padding: SPACING.md,
    gap: SPACING.md,
  },
  itemImage: {
    width: 80,
    height: 80,
    borderRadius: BORDER_RADIUS.md,
    backgroundColor: COLORS.surface,
  },
  itemContent: {
    flex: 1,
  },
  itemName: {
    fontSize: TYPOGRAPHY.body,
    fontWeight: TYPOGRAPHY.weightSemibold,
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  itemMeta: {
    fontSize: TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
    marginBottom: SPACING.xs,
  },
  quantityControl: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.sm,
    padding: SPACING.xs,
    marginTop: SPACING.sm,
    alignSelf: 'flex-start',
  },
  quantityBtn: {
    padding: SPACING.xs,
  },
  quantityText: {
    fontSize: TYPOGRAPHY.body,
    fontWeight: TYPOGRAPHY.weightSemibold,
    color: COLORS.text,
    marginHorizontal: SPACING.sm,
    minWidth: 20,
    textAlign: 'center',
  },
  itemActions: {
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  itemPrice: {
    fontSize: TYPOGRAPHY.h5,
    fontWeight: TYPOGRAPHY.weightBold,
    color: COLORS.primary,
    marginBottom: SPACING.md,
  },
  deleteButton: {
    padding: SPACING.xs,
  },
  promoContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  promoInput: {
    flex: 1,
    marginBottom: 0,
    marginRight: SPACING.sm,
  },
  promoButton: {
    minWidth: 100,
  },
  appliedPromo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.success + '20',
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
  },
  appliedPromoContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginRight: SPACING.md,
  },
  appliedPromoCode: {
    fontSize: TYPOGRAPHY.body,
    fontWeight: TYPOGRAPHY.weightSemibold,
    color: COLORS.success,
  },
  appliedPromoDiscount: {
    fontSize: TYPOGRAPHY.body,
    fontWeight: TYPOGRAPHY.weightBold,
    color: COLORS.success,
  },
  summaryContainer: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.sm,
  },
  summaryLabel: {
    fontSize: TYPOGRAPHY.body,
    color: COLORS.textSecondary,
  },
  summaryValue: {
    fontSize: TYPOGRAPHY.body,
    fontWeight: TYPOGRAPHY.weightMedium,
    color: COLORS.text,
  },
  discountLabel: {
    color: COLORS.success,
  },
  discountValue: {
    color: COLORS.success,
    fontWeight: TYPOGRAPHY.weightBold,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: SPACING.sm,
  },
  totalLabel: {
    fontSize: TYPOGRAPHY.h6,
    fontWeight: TYPOGRAPHY.weightBold,
    color: COLORS.text,
  },
  totalValue: {
    fontSize: TYPOGRAPHY.h5,
    fontWeight: TYPOGRAPHY.weightBold,
    color: COLORS.primary,
  },
  footer: {
    padding: SPACING.md,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    backgroundColor: COLORS.background,
  },
});
