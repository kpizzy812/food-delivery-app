import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, TYPOGRAPHY, BORDER_RADIUS, SPACING } from '@/constants/Theme';

interface PromoBannerProps {
  title: string;
  subtitle?: string;
  icon?: keyof typeof Ionicons.glyphMap;
  onPress?: () => void;
}

export const PromoBanner: React.FC<PromoBannerProps> = ({
  title,
  subtitle,
  icon = 'gift',
  onPress,
}) => {
  return (
    <TouchableOpacity
      style={styles.banner}
      onPress={onPress}
      activeOpacity={0.8}
      disabled={!onPress}
    >
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <Ionicons name={icon} size={24} color={COLORS.textOnPrimary} />
        </View>
        <View style={styles.textContent}>
          <Text style={styles.title}>{title}</Text>
          {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
        </View>
        <Ionicons
          name="chevron-forward"
          size={20}
          color={COLORS.textOnPrimary}
          style={styles.arrow}
        />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  banner: {
    backgroundColor: COLORS.primary,
    borderRadius: BORDER_RADIUS.xl,
    marginHorizontal: SPACING.md,
    marginBottom: SPACING.lg,
    overflow: 'hidden',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.md,
    gap: SPACING.sm,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  textContent: {
    flex: 1,
  },
  title: {
    fontSize: TYPOGRAPHY.body,
    fontWeight: TYPOGRAPHY.weightBold,
    color: COLORS.textOnPrimary,
    marginBottom: 2,
  },
  subtitle: {
    fontSize: TYPOGRAPHY.caption,
    color: COLORS.textOnPrimary,
    opacity: 0.9,
  },
  arrow: {
    opacity: 0.8,
  },
});
