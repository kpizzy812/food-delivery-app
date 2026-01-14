import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import * as Haptics from 'expo-haptics';
import { Category } from '@/types';
import { COLORS, TYPOGRAPHY, BORDER_RADIUS, SPACING } from '@/constants/Theme';

interface CategoryChipProps {
  category: Category;
  selected?: boolean;
  onPress: () => void;
}

export const CategoryChip: React.FC<CategoryChipProps> = ({
  category,
  selected = false,
  onPress,
}) => {
  const handlePress = () => {
    Haptics.selectionAsync();
    onPress();
  };

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={handlePress}
      activeOpacity={0.7}
    >
      <View
        style={[
          styles.circle,
          selected ? styles.circleSelected : styles.circleDefault,
        ]}
      >
        <Text style={styles.emoji}>{category.emoji}</Text>
      </View>
      <Text style={[styles.text, selected && styles.textSelected]}>
        {category.name}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginRight: SPACING.md,
    width: 70,
  },
  circle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.xs,
  },
  circleDefault: {
    backgroundColor: COLORS.surface,
  },
  circleSelected: {
    backgroundColor: COLORS.primaryLight,
  },
  emoji: {
    fontSize: 32,
  },
  text: {
    fontSize: TYPOGRAPHY.bodySmall,
    fontWeight: TYPOGRAPHY.weightMedium,
    color: COLORS.text,
    textAlign: 'center',
  },
  textSelected: {
    color: COLORS.primary,
    fontWeight: TYPOGRAPHY.weightBold,
  },
});
