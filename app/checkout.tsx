import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';

import { Button } from '@/components/ui';
import { addresses, paymentMethods } from '@/data/mockData';
import { useCart } from '@/context/CartContext';
import { useOrders } from '@/context/OrdersContext';
import { Address, PaymentMethod } from '@/types';
import { COLORS, SPACING, TYPOGRAPHY, BORDER_RADIUS, SHADOWS } from '@/constants/Theme';

const DELIVERY_FEE = 150;

export default function CheckoutScreen() {
  const router = useRouter();
  const { items, getTotal, clearCart } = useCart();
  const { addOrder } = useOrders();

  const [selectedAddress, setSelectedAddress] = useState<Address>(addresses[0]);
  const [deliveryTime, setDeliveryTime] = useState<'asap' | 'scheduled'>('asap');
  const [selectedPayment, setSelectedPayment] = useState<PaymentMethod>(
    paymentMethods[0]
  );
  const [leaveAtDoor, setLeaveAtDoor] = useState(false);
  const [comment, setComment] = useState('');

  const subtotal = getTotal();
  const total = subtotal + DELIVERY_FEE;

  const handlePlaceOrder = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

    // Create order and save to history
    const order = addOrder(
      items,
      total,
      selectedAddress,
      selectedPayment,
      deliveryTime,
      comment || undefined
    );

    clearCart();
    router.replace({
      pathname: '/success',
      params: { orderId: order.id }
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Delivery Address */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Адрес доставки</Text>
          {addresses.map((address) => (
            <TouchableOpacity
              key={address.id}
              style={[
                styles.addressCard,
                selectedAddress.id === address.id && styles.addressCardSelected,
                SHADOWS.sm,
              ]}
              onPress={() => {
                Haptics.selectionAsync();
                setSelectedAddress(address);
              }}
            >
              <View style={styles.addressHeader}>
                <View style={styles.addressIcon}>
                  <Ionicons
                    name={address.label === 'Дом' ? 'home' : 'business'}
                    size={20}
                    color={
                      selectedAddress.id === address.id
                        ? COLORS.primary
                        : COLORS.textSecondary
                    }
                  />
                </View>
                <View style={styles.addressContent}>
                  <Text style={styles.addressLabel}>{address.label}</Text>
                  <Text style={styles.addressText}>
                    {address.street}, {address.building}
                    {address.apartment ? `, кв. ${address.apartment}` : ''}
                  </Text>
                  {address.instructions && (
                    <Text style={styles.addressInstructions}>
                      {address.instructions}
                    </Text>
                  )}
                </View>
                {selectedAddress.id === address.id && (
                  <Ionicons
                    name="checkmark-circle"
                    size={24}
                    color={COLORS.primary}
                  />
                )}
              </View>
            </TouchableOpacity>
          ))}

          {/* Leave at Door Option */}
          <TouchableOpacity
            style={styles.checkboxContainer}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              setLeaveAtDoor(!leaveAtDoor);
            }}
            activeOpacity={0.7}
          >
            <View style={[styles.checkbox, leaveAtDoor && styles.checkboxChecked]}>
              {leaveAtDoor && (
                <Ionicons name="checkmark" size={18} color={COLORS.textOnPrimary} />
              )}
            </View>
            <Text style={styles.checkboxLabel}>Оставить у двери</Text>
          </TouchableOpacity>
        </View>

        {/* Delivery Time */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Время доставки</Text>
          <View style={styles.timeOptions}>
            <TouchableOpacity
              style={[
                styles.timeOption,
                deliveryTime === 'asap' && styles.timeOptionSelected,
              ]}
              onPress={() => {
                Haptics.selectionAsync();
                setDeliveryTime('asap');
              }}
            >
              <Ionicons
                name="flash"
                size={20}
                color={
                  deliveryTime === 'asap' ? COLORS.primary : COLORS.textSecondary
                }
              />
              <Text
                style={[
                  styles.timeOptionText,
                  deliveryTime === 'asap' && styles.timeOptionTextSelected,
                ]}
              >
                Как можно скорее
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.timeOption,
                deliveryTime === 'scheduled' && styles.timeOptionSelected,
              ]}
              onPress={() => {
                Haptics.selectionAsync();
                setDeliveryTime('scheduled');
              }}
            >
              <Ionicons
                name="time"
                size={20}
                color={
                  deliveryTime === 'scheduled'
                    ? COLORS.primary
                    : COLORS.textSecondary
                }
              />
              <Text
                style={[
                  styles.timeOptionText,
                  deliveryTime === 'scheduled' && styles.timeOptionTextSelected,
                ]}
              >
                Ко времени
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Payment Method */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Способ оплаты</Text>
          {paymentMethods.map((method) => (
            <TouchableOpacity
              key={method.id}
              style={[
                styles.paymentCard,
                selectedPayment.id === method.id && styles.paymentCardSelected,
              ]}
              onPress={() => {
                Haptics.selectionAsync();
                setSelectedPayment(method);
              }}
            >
              <Text style={styles.paymentIcon}>{method.icon}</Text>
              <Text style={styles.paymentLabel}>{method.label}</Text>
              {selectedPayment.id === method.id && (
                <Ionicons
                  name="checkmark-circle"
                  size={24}
                  color={COLORS.primary}
                />
              )}
            </TouchableOpacity>
          ))}
        </View>

        {/* Comment */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Комментарий к заказу</Text>
          <View style={styles.commentContainer}>
            <TextInput
              style={styles.commentInput}
              placeholder="Особые пожелания к заказу..."
              placeholderTextColor={COLORS.textTertiary}
              value={comment}
              onChangeText={setComment}
              multiline
              numberOfLines={3}
              textAlignVertical="top"
            />
          </View>
        </View>

        {/* Order Summary */}
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
            <View style={styles.divider} />
            <View style={styles.summaryRow}>
              <Text style={styles.totalLabel}>К оплате</Text>
              <Text style={styles.totalValue}>{total}₽</Text>
            </View>
          </View>
        </View>

        {/* Bottom spacing */}
        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Place Order Button */}
      <View style={styles.footer}>
        <Button
          title={`Оформить заказ • ${total}₽`}
          onPress={handlePlaceOrder}
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
  section: {
    padding: SPACING.md,
  },
  sectionTitle: {
    fontSize: TYPOGRAPHY.h6,
    fontWeight: TYPOGRAPHY.weightBold,
    color: COLORS.text,
    marginBottom: SPACING.md,
  },
  addressCard: {
    backgroundColor: COLORS.card,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    borderWidth: 2,
    borderColor: COLORS.card,
  },
  addressCardSelected: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primaryLight + '10',
  },
  addressHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  addressIcon: {
    width: 40,
    height: 40,
    borderRadius: BORDER_RADIUS.md,
    backgroundColor: COLORS.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.md,
  },
  addressContent: {
    flex: 1,
  },
  addressLabel: {
    fontSize: TYPOGRAPHY.body,
    fontWeight: TYPOGRAPHY.weightSemibold,
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  addressText: {
    fontSize: TYPOGRAPHY.bodySmall,
    color: COLORS.textSecondary,
    lineHeight: TYPOGRAPHY.bodySmall * TYPOGRAPHY.lineHeightNormal,
    marginBottom: SPACING.xs,
  },
  addressInstructions: {
    fontSize: TYPOGRAPHY.caption,
    color: COLORS.textTertiary,
    fontStyle: 'italic',
  },
  timeOptions: {
    flexDirection: 'row',
    gap: SPACING.md,
  },
  timeOption: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    backgroundColor: COLORS.surface,
    borderWidth: 2,
    borderColor: COLORS.surface,
  },
  timeOptionSelected: {
    backgroundColor: COLORS.primaryLight + '20',
    borderColor: COLORS.primary,
  },
  timeOptionText: {
    fontSize: TYPOGRAPHY.bodySmall,
    fontWeight: TYPOGRAPHY.weightMedium,
    color: COLORS.textSecondary,
    marginLeft: SPACING.sm,
  },
  timeOptionTextSelected: {
    color: COLORS.primary,
    fontWeight: TYPOGRAPHY.weightSemibold,
  },
  paymentCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    borderWidth: 2,
    borderColor: COLORS.surface,
  },
  paymentCardSelected: {
    backgroundColor: COLORS.primaryLight + '20',
    borderColor: COLORS.primary,
  },
  paymentIcon: {
    fontSize: TYPOGRAPHY.h4,
    marginRight: SPACING.md,
  },
  paymentLabel: {
    flex: 1,
    fontSize: TYPOGRAPHY.body,
    fontWeight: TYPOGRAPHY.weightMedium,
    color: COLORS.text,
  },
  commentContainer: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    padding: SPACING.md,
  },
  commentInput: {
    fontSize: TYPOGRAPHY.body,
    color: COLORS.text,
    minHeight: 80,
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
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.md,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: BORDER_RADIUS.xs,
    borderWidth: 2,
    borderColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.md,
  },
  checkboxChecked: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  checkboxLabel: {
    fontSize: TYPOGRAPHY.body,
    fontWeight: TYPOGRAPHY.weightMedium,
    color: COLORS.text,
  },
  footer: {
    padding: SPACING.md,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    backgroundColor: COLORS.background,
  },
});
