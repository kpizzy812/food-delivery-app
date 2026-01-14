import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Image,
  TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useOrders } from '@/context/OrdersContext';
import { COLORS, SPACING, TYPOGRAPHY, BORDER_RADIUS, SHADOWS } from '@/constants/Theme';

export default function OrdersScreen() {
  const router = useRouter();
  const { orders } = useOrders();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return COLORS.success;
      case 'preparing':
        return COLORS.primary;
      case 'delivering':
        return COLORS.warning;
      case 'delivered':
        return COLORS.textSecondary;
      default:
        return COLORS.textSecondary;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'Подтвержден';
      case 'preparing':
        return 'Готовится';
      case 'delivering':
        return 'В пути';
      case 'delivered':
        return 'Доставлен';
      default:
        return status;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Orders List */}
        {orders.length === 0 ? (
          <View style={styles.emptyContainer}>
            <View style={styles.emptyIconContainer}>
              <Text style={styles.emptyEmoji}>📦</Text>
            </View>
            <Text style={styles.emptyTitle}>Пока нет заказов</Text>
            <Text style={styles.emptyText}>
              Выберите любимые блюда из ресторанов{'\n'}и оформите свой первый заказ
            </Text>
            <TouchableOpacity
              style={styles.browseButton}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                router.push('/(tabs)');
              }}
              activeOpacity={0.8}
            >
              <Text style={styles.browseButtonText}>Смотреть рестораны</Text>
              <Ionicons name="arrow-forward" size={20} color={COLORS.textOnPrimary} />
            </TouchableOpacity>

            {/* Promo Section */}
            <View style={styles.promoSection}>
              <View style={styles.promoHeader}>
                <Ionicons name="gift" size={24} color={COLORS.primary} />
                <Text style={styles.promoHeaderText}>Специальное предложение</Text>
              </View>
              <Text style={styles.promoTitle}>Скидка 25% на первый заказ</Text>
              <Text style={styles.promoDescription}>
                Используйте промокод <Text style={styles.promoCode}>FIRST25</Text> при оформлении первого заказа
              </Text>
              <View style={styles.promoBadge}>
                <Text style={styles.promoBadgeText}>-25%</Text>
              </View>
            </View>

            {/* Benefits */}
            <View style={styles.benefitsContainer}>
              <Text style={styles.benefitsTitle}>Почему выбирают нас</Text>
              <View style={styles.benefitItem}>
                <View style={styles.benefitIcon}>
                  <Ionicons name="flash" size={20} color={COLORS.primary} />
                </View>
                <View style={styles.benefitTextContainer}>
                  <Text style={styles.benefitText}>Быстрая доставка</Text>
                  <Text style={styles.benefitSubtext}>25-40 минут до вашей двери</Text>
                </View>
              </View>
              <View style={styles.benefitItem}>
                <View style={styles.benefitIcon}>
                  <Ionicons name="shield-checkmark" size={20} color={COLORS.primary} />
                </View>
                <View style={styles.benefitTextContainer}>
                  <Text style={styles.benefitText}>Безопасная оплата</Text>
                  <Text style={styles.benefitSubtext}>Карта, наличные, Apple Pay</Text>
                </View>
              </View>
              <View style={styles.benefitItem}>
                <View style={styles.benefitIcon}>
                  <Ionicons name="star" size={20} color={COLORS.primary} />
                </View>
                <View style={styles.benefitTextContainer}>
                  <Text style={styles.benefitText}>Лучшие рестораны</Text>
                  <Text style={styles.benefitSubtext}>Проверенные заведения города</Text>
                </View>
              </View>
              <View style={styles.benefitItem}>
                <View style={styles.benefitIcon}>
                  <Ionicons name="chatbubbles" size={20} color={COLORS.primary} />
                </View>
                <View style={styles.benefitTextContainer}>
                  <Text style={styles.benefitText}>Поддержка 24/7</Text>
                  <Text style={styles.benefitSubtext}>Всегда готовы помочь</Text>
                </View>
              </View>
            </View>

            {/* Popular Dishes Preview */}
            <View style={styles.popularSection}>
              <Text style={styles.popularTitle}>Популярные блюда</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.popularScroll}>
                <View style={styles.popularCard}>
                  <Text style={styles.popularEmoji}>🍕</Text>
                  <Text style={styles.popularName}>Пицца</Text>
                </View>
                <View style={styles.popularCard}>
                  <Text style={styles.popularEmoji}>🍔</Text>
                  <Text style={styles.popularName}>Бургеры</Text>
                </View>
                <View style={styles.popularCard}>
                  <Text style={styles.popularEmoji}>🍣</Text>
                  <Text style={styles.popularName}>Суши</Text>
                </View>
                <View style={styles.popularCard}>
                  <Text style={styles.popularEmoji}>🍜</Text>
                  <Text style={styles.popularName}>Рамен</Text>
                </View>
              </ScrollView>
            </View>
          </View>
        ) : (
          <View style={styles.ordersContainer}>
            {orders.map((order) => (
              <View key={order.id} style={[styles.orderCard, SHADOWS.sm]}>
                {/* Order Header */}
                <View style={styles.orderHeader}>
                  <View style={styles.orderHeaderLeft}>
                    <Text style={styles.orderId}>
                      Заказ #{order.id.replace('order-', '')}
                    </Text>
                    <Text style={styles.orderDate}>
                      {new Date(order.createdAt).toLocaleDateString('ru-RU', {
                        day: 'numeric',
                        month: 'long',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </Text>
                  </View>
                  <View
                    style={[
                      styles.statusBadge,
                      { backgroundColor: getStatusColor(order.status) + '20' },
                    ]}
                  >
                    <Text
                      style={[
                        styles.statusText,
                        { color: getStatusColor(order.status) },
                      ]}
                    >
                      {getStatusText(order.status)}
                    </Text>
                  </View>
                </View>

                {/* Order Items */}
                <View style={styles.orderItems}>
                  {order.items.map((item, index) => (
                    <View key={index} style={styles.orderItem}>
                      <Image
                        source={{ uri: item.dish.image }}
                        style={styles.itemImage}
                      />
                      <View style={styles.itemDetails}>
                        <Text style={styles.itemName} numberOfLines={1}>
                          {item.dish.name}
                        </Text>
                        <View style={styles.itemMeta}>
                          <Text style={styles.itemQuantity}>
                            {item.quantity}x
                          </Text>
                          {item.selectedSize && (
                            <Text style={styles.itemSize}>
                              {item.selectedSize.name}
                            </Text>
                          )}
                        </View>
                      </View>
                      <Text style={styles.itemPrice}>{item.totalPrice}₽</Text>
                    </View>
                  ))}
                </View>

                {/* Order Footer */}
                <View style={styles.orderFooter}>
                  <View style={styles.deliveryInfo}>
                    <Ionicons
                      name="location"
                      size={16}
                      color={COLORS.textSecondary}
                    />
                    <Text style={styles.deliveryText} numberOfLines={1}>
                      {order.address.street}, {order.address.building}
                    </Text>
                  </View>
                  <View style={styles.totalContainer}>
                    <Text style={styles.totalLabel}>Итого:</Text>
                    <Text style={styles.totalValue}>{order.total}₽</Text>
                  </View>
                </View>

                {/* Estimated Delivery Time */}
                {order.status !== 'delivered' && (
                  <View style={styles.estimatedTime}>
                    <Ionicons
                      name="time"
                      size={16}
                      color={COLORS.primary}
                    />
                    <Text style={styles.estimatedTimeText}>
                      Доставка: {order.estimatedDeliveryTime}
                    </Text>
                  </View>
                )}

                {/* Reorder Button */}
                <TouchableOpacity
                  style={styles.reorderButton}
                  onPress={() => {
                    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                  }}
                  activeOpacity={0.7}
                >
                  <Ionicons
                    name="refresh"
                    size={18}
                    color={COLORS.primary}
                  />
                  <Text style={styles.reorderText}>Повторить заказ</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}

        {/* Bottom spacing */}
        <View style={{ height: 100 }} />
      </ScrollView>
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
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.xl,
    marginTop: SPACING.xl,
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
    fontSize: TYPOGRAPHY.h4,
    fontWeight: TYPOGRAPHY.weightBold,
    color: COLORS.text,
    marginBottom: SPACING.sm,
    textAlign: 'center',
  },
  emptyText: {
    fontSize: TYPOGRAPHY.body,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: TYPOGRAPHY.body * TYPOGRAPHY.lineHeightNormal,
    marginBottom: SPACING.xl,
  },
  browseButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    borderRadius: BORDER_RADIUS.lg,
    gap: SPACING.sm,
    marginBottom: SPACING.xl,
  },
  browseButtonText: {
    fontSize: TYPOGRAPHY.body,
    fontWeight: TYPOGRAPHY.weightSemibold,
    color: COLORS.textOnPrimary,
  },
  promoSection: {
    width: '100%',
    backgroundColor: COLORS.primary + '15',
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.lg,
    marginBottom: SPACING.xl,
    position: 'relative',
    overflow: 'hidden',
  },
  promoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
    marginBottom: SPACING.sm,
  },
  promoHeaderText: {
    fontSize: TYPOGRAPHY.caption,
    fontWeight: TYPOGRAPHY.weightSemibold,
    color: COLORS.primary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  promoTitle: {
    fontSize: TYPOGRAPHY.h5,
    fontWeight: TYPOGRAPHY.weightBold,
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  promoDescription: {
    fontSize: TYPOGRAPHY.bodySmall,
    color: COLORS.textSecondary,
    lineHeight: TYPOGRAPHY.bodySmall * TYPOGRAPHY.lineHeightNormal,
  },
  promoCode: {
    fontWeight: TYPOGRAPHY.weightBold,
    color: COLORS.primary,
    backgroundColor: COLORS.background,
    paddingHorizontal: SPACING.xs,
    paddingVertical: 2,
    borderRadius: BORDER_RADIUS.xs,
  },
  promoBadge: {
    position: 'absolute',
    top: SPACING.md,
    right: SPACING.md,
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.md,
    transform: [{ rotate: '12deg' }],
  },
  promoBadgeText: {
    fontSize: TYPOGRAPHY.h5,
    fontWeight: TYPOGRAPHY.weightBold,
    color: COLORS.textOnPrimary,
  },
  benefitsContainer: {
    width: '100%',
    marginBottom: SPACING.xl,
  },
  benefitsTitle: {
    fontSize: TYPOGRAPHY.h6,
    fontWeight: TYPOGRAPHY.weightBold,
    color: COLORS.text,
    marginBottom: SPACING.md,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    marginBottom: SPACING.sm,
    gap: SPACING.md,
  },
  benefitIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.primaryLight + '20',
    alignItems: 'center',
    justifyContent: 'center',
  },
  benefitTextContainer: {
    flex: 1,
  },
  benefitText: {
    fontSize: TYPOGRAPHY.body,
    fontWeight: TYPOGRAPHY.weightSemibold,
    color: COLORS.text,
    marginBottom: 2,
  },
  benefitSubtext: {
    fontSize: TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
  },
  popularSection: {
    width: '100%',
  },
  popularTitle: {
    fontSize: TYPOGRAPHY.h6,
    fontWeight: TYPOGRAPHY.weightBold,
    color: COLORS.text,
    marginBottom: SPACING.md,
  },
  popularScroll: {
    marginLeft: -SPACING.xl,
    marginRight: -SPACING.xl,
    paddingLeft: SPACING.xl,
  },
  popularCard: {
    width: 100,
    height: 100,
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.md,
  },
  popularEmoji: {
    fontSize: 40,
    marginBottom: SPACING.xs,
  },
  popularName: {
    fontSize: TYPOGRAPHY.bodySmall,
    fontWeight: TYPOGRAPHY.weightMedium,
    color: COLORS.text,
  },
  ordersContainer: {
    padding: SPACING.md,
  },
  orderCard: {
    backgroundColor: COLORS.card,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.md,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: SPACING.md,
  },
  orderHeaderLeft: {
    flex: 1,
  },
  orderId: {
    fontSize: TYPOGRAPHY.body,
    fontWeight: TYPOGRAPHY.weightBold,
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  orderDate: {
    fontSize: TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
  },
  statusBadge: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.sm,
  },
  statusText: {
    fontSize: TYPOGRAPHY.caption,
    fontWeight: TYPOGRAPHY.weightSemibold,
  },
  orderItems: {
    marginBottom: SPACING.md,
  },
  orderItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  itemImage: {
    width: 48,
    height: 48,
    borderRadius: BORDER_RADIUS.md,
    backgroundColor: COLORS.surface,
    marginRight: SPACING.sm,
  },
  itemDetails: {
    flex: 1,
  },
  itemName: {
    fontSize: TYPOGRAPHY.bodySmall,
    fontWeight: TYPOGRAPHY.weightMedium,
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  itemMeta: {
    flexDirection: 'row',
    gap: SPACING.xs,
  },
  itemQuantity: {
    fontSize: TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
    fontWeight: TYPOGRAPHY.weightSemibold,
  },
  itemSize: {
    fontSize: TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
  },
  itemPrice: {
    fontSize: TYPOGRAPHY.body,
    fontWeight: TYPOGRAPHY.weightBold,
    color: COLORS.text,
  },
  orderFooter: {
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingTop: SPACING.md,
    marginBottom: SPACING.sm,
  },
  deliveryInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.sm,
    gap: SPACING.xs,
  },
  deliveryText: {
    flex: 1,
    fontSize: TYPOGRAPHY.bodySmall,
    color: COLORS.textSecondary,
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalLabel: {
    fontSize: TYPOGRAPHY.body,
    fontWeight: TYPOGRAPHY.weightSemibold,
    color: COLORS.text,
  },
  totalValue: {
    fontSize: TYPOGRAPHY.h6,
    fontWeight: TYPOGRAPHY.weightBold,
    color: COLORS.primary,
  },
  estimatedTime: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primaryLight + '20',
    paddingVertical: SPACING.xs,
    paddingHorizontal: SPACING.sm,
    borderRadius: BORDER_RADIUS.sm,
    marginBottom: SPACING.sm,
    gap: SPACING.xs,
  },
  estimatedTimeText: {
    fontSize: TYPOGRAPHY.caption,
    color: COLORS.primary,
    fontWeight: TYPOGRAPHY.weightSemibold,
  },
  reorderButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primaryLight + '20',
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.md,
    gap: SPACING.xs,
  },
  reorderText: {
    fontSize: TYPOGRAPHY.bodySmall,
    fontWeight: TYPOGRAPHY.weightSemibold,
    color: COLORS.primary,
  },
});
