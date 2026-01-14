import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Clipboard from 'expo-clipboard';
import * as Haptics from 'expo-haptics';
import { Restaurant } from '@/types';
import { COLORS, TYPOGRAPHY, BORDER_RADIUS, SPACING } from '@/constants/Theme';
import { useFavorites } from '@/context/FavoritesContext';

interface RestaurantCardProps {
  restaurant: Restaurant;
  onPress: () => void;
  onPromoCopied?: (code: string) => void;
}

export const RestaurantCard: React.FC<RestaurantCardProps> = ({
  restaurant,
  onPress,
  onPromoCopied,
}) => {
  const [promoCopied, setPromoCopied] = useState(false);
  const { isRestaurantFavorite, toggleRestaurantFavorite } = useFavorites();
  const isFavorite = isRestaurantFavorite(restaurant.id);

  const handlePromoCopy = async (e: any) => {
    if (!restaurant.promo) return;

    e.stopPropagation();
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    await Clipboard.setStringAsync(restaurant.promo.code);
    setPromoCopied(true);
    onPromoCopied?.(restaurant.promo.code);

    setTimeout(() => {
      setPromoCopied(false);
    }, 2000);
  };

  const handleFavoriteToggle = (e: any) => {
    e.stopPropagation();
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    toggleRestaurantFavorite(restaurant.id);
  };

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress();
  };

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={handlePress}
      activeOpacity={0.9}
    >
      <View style={styles.imageContainer}>
        <Image source={{ uri: restaurant.image }} style={styles.image} />

        {/* Favorite Button */}
        <TouchableOpacity
          style={styles.favoriteButton}
          onPress={handleFavoriteToggle}
          activeOpacity={0.7}
        >
          <Ionicons
            name={isFavorite ? 'heart' : 'heart-outline'}
            size={24}
            color={isFavorite ? '#FF4444' : COLORS.textOnPrimary}
          />
        </TouchableOpacity>

        {restaurant.promo && (
          <View style={styles.promoOverlay}>
            <View style={styles.promoDiscount}>
              <Ionicons name="pricetag" size={16} color={COLORS.textOnPrimary} />
              <Text style={styles.promoDiscountText}>-{restaurant.promo.discount}%</Text>
            </View>
            <TouchableOpacity
              style={styles.promoCodeContainer}
              onPress={handlePromoCopy}
              activeOpacity={0.7}
            >
              <Text style={styles.promoCodeText}>{restaurant.promo.code}</Text>
              <Ionicons
                name={promoCopied ? 'checkmark' : 'copy-outline'}
                size={14}
                color={promoCopied ? COLORS.success : COLORS.textOnPrimary}
              />
            </TouchableOpacity>
          </View>
        )}
      </View>
      <Text style={styles.name} numberOfLines={1}>
        {restaurant.name}
      </Text>
      <View style={styles.meta}>
        <Ionicons name="star" size={14} color={COLORS.warning} />
        <Text style={styles.ratingText}>{restaurant.rating}</Text>
        <Text style={styles.dot}>•</Text>
        <Text style={styles.metaText}>{restaurant.deliveryTime}</Text>
        <Text style={styles.dot}>•</Text>
        <Text style={styles.cuisine} numberOfLines={1}>
          {restaurant.cuisineType.join(', ')}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: SPACING.lg,
    paddingHorizontal: SPACING.md,
  },
  imageContainer: {
    position: 'relative',
    width: '100%',
    marginBottom: SPACING.sm,
  },
  image: {
    width: '100%',
    height: 160,
    borderRadius: BORDER_RADIUS.lg,
    backgroundColor: COLORS.surface,
  },
  favoriteButton: {
    position: 'absolute',
    top: SPACING.sm,
    right: SPACING.sm,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  promoOverlay: {
    position: 'absolute',
    top: SPACING.sm,
    left: SPACING.sm,
    gap: SPACING.xs,
  },
  promoDiscount: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.md,
    gap: SPACING.xs,
  },
  promoDiscountText: {
    fontSize: TYPOGRAPHY.bodySmall,
    fontWeight: TYPOGRAPHY.weightBold,
    color: COLORS.textOnPrimary,
  },
  promoCodeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.sm,
    gap: SPACING.xs,
  },
  promoCodeText: {
    fontSize: TYPOGRAPHY.caption,
    fontWeight: TYPOGRAPHY.weightSemibold,
    color: COLORS.textOnPrimary,
    letterSpacing: 0.5,
  },
  name: {
    fontSize: TYPOGRAPHY.body,
    fontWeight: TYPOGRAPHY.weightBold,
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: TYPOGRAPHY.bodySmall,
    color: COLORS.text,
    fontWeight: TYPOGRAPHY.weightMedium,
    marginLeft: SPACING.xs,
  },
  dot: {
    color: COLORS.textTertiary,
    marginHorizontal: SPACING.xs,
  },
  metaText: {
    fontSize: TYPOGRAPHY.bodySmall,
    color: COLORS.textSecondary,
  },
  cuisine: {
    fontSize: TYPOGRAPHY.bodySmall,
    color: COLORS.textTertiary,
    flex: 1,
  },
});
