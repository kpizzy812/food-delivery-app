import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import Animated, {
  FadeIn,
  FadeInDown,
  BounceIn,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  useSharedValue,
} from 'react-native-reanimated';

import { Button } from '@/components/ui';
import { useOrders } from '@/context/OrdersContext';
import { COLORS, SPACING, TYPOGRAPHY } from '@/constants/Theme';

export default function SuccessScreen() {
  const router = useRouter();
  const { orderId } = useLocalSearchParams<{ orderId: string }>();
  const { getOrderById } = useOrders();

  // Get order details from context
  const order = orderId ? getOrderById(orderId) : null;
  const orderNumber = order?.id.replace('order-', '') || Math.floor(100000 + Math.random() * 900000);
  const estimatedTime = order?.estimatedDeliveryTime || '25-35 мин';

  // Pulsing animation for checkmark
  const scale = useSharedValue(1);

  useEffect(() => {
    scale.value = withRepeat(
      withSequence(
        withTiming(1.1, { duration: 800 }),
        withTiming(1, { duration: 800 })
      ),
      -1,
      false
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  return (
    <View style={styles.container}>
      {/* Success Icon */}
      <Animated.View
        entering={BounceIn.delay(200).springify()}
        style={[styles.iconContainer, animatedStyle]}
      >
        <Text style={styles.checkmark}>✓</Text>
      </Animated.View>

      {/* Success Message */}
      <Animated.View entering={FadeIn.delay(400)} style={styles.content}>
        <Text style={styles.title}>Заказ оформлен!</Text>
        <Text style={styles.subtitle}>
          Спасибо за ваш заказ. Мы уже начали его готовить
        </Text>
      </Animated.View>

      {/* Order Details */}
      <Animated.View
        entering={FadeInDown.delay(600).springify()}
        style={styles.detailsContainer}
      >
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Номер заказа</Text>
          <Text style={styles.detailValue}>#{orderNumber}</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Ожидаемое время</Text>
          <Text style={styles.detailValue}>{estimatedTime}</Text>
        </View>
      </Animated.View>

      {/* Delivery Status */}
      <Animated.View
        entering={FadeInDown.delay(800).springify()}
        style={styles.statusContainer}
      >
        <View style={styles.statusStep}>
          <View style={[styles.statusDot, styles.statusDotActive]} />
          <View style={styles.statusTextContainer}>
            <Text style={styles.statusTitle}>Заказ принят</Text>
            <Text style={styles.statusSubtitle}>Ресторан готовит ваш заказ</Text>
          </View>
        </View>
        <View style={styles.statusLine} />
        <View style={styles.statusStep}>
          <View style={styles.statusDot} />
          <View style={styles.statusTextContainer}>
            <Text style={[styles.statusTitle, styles.statusTitleInactive]}>
              В пути
            </Text>
            <Text style={styles.statusSubtitle}>
              Курьер заберет заказ из ресторана
            </Text>
          </View>
        </View>
        <View style={styles.statusLine} />
        <View style={styles.statusStep}>
          <View style={styles.statusDot} />
          <View style={styles.statusTextContainer}>
            <Text style={[styles.statusTitle, styles.statusTitleInactive]}>
              Доставлен
            </Text>
            <Text style={styles.statusSubtitle}>
              Заказ будет у вас через {estimatedTime}
            </Text>
          </View>
        </View>
      </Animated.View>

      {/* Action Buttons */}
      <Animated.View
        entering={FadeInDown.delay(1000).springify()}
        style={styles.buttonsContainer}
      >
        <Button
          title="Отследить заказ"
          onPress={() => {
            // Navigate to tracking screen (would be implemented in real app)
            router.replace('/(tabs)');
          }}
          variant="primary"
          fullWidth
          style={styles.button}
        />
        <Button
          title="Вернуться на главную"
          onPress={() => router.replace('/(tabs)')}
          variant="ghost"
          fullWidth
        />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    padding: SPACING.lg,
    justifyContent: 'center',
  },
  iconContainer: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: COLORS.success,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.xl,
  },
  checkmark: {
    fontSize: 48,
    color: COLORS.textOnPrimary,
    fontWeight: TYPOGRAPHY.weightBold,
  },
  content: {
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  title: {
    fontSize: TYPOGRAPHY.h2,
    fontWeight: TYPOGRAPHY.weightBold,
    color: COLORS.text,
    marginBottom: SPACING.sm,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: TYPOGRAPHY.body,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: TYPOGRAPHY.body * TYPOGRAPHY.lineHeightNormal,
  },
  detailsContainer: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: SPACING.lg,
    marginBottom: SPACING.lg,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  detailLabel: {
    fontSize: TYPOGRAPHY.body,
    color: COLORS.textSecondary,
  },
  detailValue: {
    fontSize: TYPOGRAPHY.h6,
    fontWeight: TYPOGRAPHY.weightBold,
    color: COLORS.text,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: SPACING.md,
  },
  statusContainer: {
    marginBottom: SPACING.xl,
  },
  statusStep: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  statusDot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: COLORS.border,
    marginRight: SPACING.md,
    marginTop: 2,
  },
  statusDotActive: {
    backgroundColor: COLORS.success,
  },
  statusLine: {
    width: 2,
    height: 32,
    backgroundColor: COLORS.border,
    marginLeft: 9,
    marginVertical: SPACING.xs,
  },
  statusTextContainer: {
    flex: 1,
  },
  statusTitle: {
    fontSize: TYPOGRAPHY.body,
    fontWeight: TYPOGRAPHY.weightSemibold,
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  statusTitleInactive: {
    color: COLORS.textTertiary,
    fontWeight: TYPOGRAPHY.weightMedium,
  },
  statusSubtitle: {
    fontSize: TYPOGRAPHY.bodySmall,
    color: COLORS.textSecondary,
    lineHeight: TYPOGRAPHY.bodySmall * TYPOGRAPHY.lineHeightNormal,
  },
  buttonsContainer: {
    gap: SPACING.md,
  },
  button: {
    marginBottom: 0,
  },
});
