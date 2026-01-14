import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  Image,
  TextInput,
  Modal,
  PanResponder,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
  runOnJS,
  FadeIn,
  FadeOut,
} from 'react-native-reanimated';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';

import { RestaurantCard, CategoryChip, Toast, useScrollToTop, PromoBanner } from '@/components/ui';
import { restaurants, categories, addresses } from '@/data/mockData';
import { COLORS, SPACING, TYPOGRAPHY, BORDER_RADIUS } from '@/constants/Theme';

export default function HomeScreen() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(addresses[0]);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [bonusBalance] = useState(450); // Бонусный баланс

  // Scroll to top
  const { scrollRef, handleScroll, scrollToTop, showButton } = useScrollToTop();

  // Animated values for search
  const searchIconTranslateX = useSharedValue(0);
  const placeholderOpacity = useSharedValue(1);
  const inputOpacity = useSharedValue(0);

  // Animated values for modal
  const modalTranslateY = useSharedValue(500);
  const overlayOpacity = useSharedValue(0);
  const modalDragY = useSharedValue(0);

  const handleSearchFocus = () => {
    setSearchFocused(true);
    searchIconTranslateX.value = withTiming(-160, { duration: 300 });
    placeholderOpacity.value = withTiming(0, { duration: 150 });
    inputOpacity.value = withTiming(1, { duration: 300 });
  };

  const handleSearchBlur = () => {
    if (searchQuery.trim().length > 0) {
      return; // Оставляем поиск активным если есть текст
    }
    setSearchFocused(false);
    setSearchQuery('');
    inputOpacity.value = withTiming(0, { duration: 150 });
    searchIconTranslateX.value = withTiming(0, { duration: 300 });
    placeholderOpacity.value = withTiming(1, { duration: 300 });
  };

  const searchIconAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: searchIconTranslateX.value }],
  }));

  const placeholderAnimatedStyle = useAnimatedStyle(() => ({
    opacity: placeholderOpacity.value,
  }));

  const inputAnimatedStyle = useAnimatedStyle(() => ({
    opacity: inputOpacity.value,
  }));

  const handlePromoCopied = (code: string) => {
    setToastMessage(`Промокод ${code} скопирован`);
    setShowToast(true);
  };

  // Modal animation
  useEffect(() => {
    if (showAddressModal) {
      modalDragY.value = 0; // Reset drag position
      overlayOpacity.value = withTiming(1, { duration: 250 });
      modalTranslateY.value = withTiming(0, { duration: 350 });
    } else {
      overlayOpacity.value = withTiming(0, { duration: 200 });
      modalTranslateY.value = withTiming(500, { duration: 250 });
    }
  }, [showAddressModal]);

  const closeModal = () => {
    setShowAddressModal(false);
  };

  // Pan responder for swipe to dismiss
  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: (_, gestureState) => {
      return Math.abs(gestureState.dy) > 5;
    },
    onPanResponderMove: (_, gestureState) => {
      if (gestureState.dy > 0) {
        modalDragY.value = gestureState.dy;
      }
    },
    onPanResponderRelease: (_, gestureState) => {
      if (gestureState.dy > 100) {
        modalDragY.value = withTiming(500, { duration: 200 }, () => {
          runOnJS(closeModal)();
        });
      } else {
        modalDragY.value = withSpring(0, { damping: 20 });
      }
    },
  });

  const overlayAnimatedStyle = useAnimatedStyle(() => ({
    opacity: overlayOpacity.value,
  }));

  const modalAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: modalTranslateY.value + modalDragY.value }],
  }));

  const filteredRestaurants = restaurants.filter((restaurant) => {
    const query = searchQuery.toLowerCase();
    const matchesSearch =
      restaurant.name.toLowerCase().includes(query) ||
      restaurant.cuisineType.some((type) => type.toLowerCase().includes(query));
    const matchesCategory = selectedCategory
      ? restaurant.cuisineType.some((type) =>
          type.toLowerCase().includes(selectedCategory.toLowerCase())
        )
      : true;
    return matchesSearch && matchesCategory;
  });

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <ScrollView
        ref={scrollRef}
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        {/* Header with Profile, Address, Bonus */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.profileButton}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              router.push('/profile');
            }}
            activeOpacity={0.7}
          >
            <View style={styles.avatar}>
              <Ionicons name="person" size={20} color={COLORS.textSecondary} />
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.addressContainer}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              setShowAddressModal(true);
            }}
            activeOpacity={0.7}
          >
            <View style={styles.addressContent}>
              <Text style={styles.addressLabel}>{selectedAddress.label}</Text>
              <Text style={styles.addressText} numberOfLines={1}>
                {selectedAddress.street}, {selectedAddress.building}
              </Text>
            </View>
            <Ionicons
              name="chevron-down"
              size={16}
              color={COLORS.textSecondary}
            />
          </TouchableOpacity>

          <View style={styles.bonusContainer}>
            <Ionicons name="gift" size={16} color={COLORS.warning} />
            <Text style={styles.bonusText}>{bonusBalance}</Text>
          </View>
        </View>

        {/* Animated Search Bar */}
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => {
            if (!searchFocused) {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              handleSearchFocus();
            }
          }}
        >
          <View style={styles.searchContainer}>
            <View style={styles.searchContent}>
              {!searchFocused ? (
                <View style={styles.searchInactive}>
                  <Ionicons
                    name="search"
                    size={20}
                    color={COLORS.textSecondary}
                  />
                  <Text style={styles.searchPlaceholder}>Поиск</Text>
                </View>
              ) : (
                <>
                  <Animated.View style={[styles.searchIconWrapper, searchIconAnimatedStyle]}>
                    <Ionicons
                      name="search"
                      size={20}
                      color={COLORS.textSecondary}
                    />
                  </Animated.View>
                  <Animated.View style={[styles.searchInputWrapper, inputAnimatedStyle]}>
                    <TextInput
                      style={styles.searchInput}
                      placeholder="Быстрый поиск"
                      placeholderTextColor={COLORS.textSecondary}
                      value={searchQuery}
                      onChangeText={setSearchQuery}
                      onFocus={handleSearchFocus}
                      onBlur={handleSearchBlur}
                      cursorColor={COLORS.primary}
                      autoFocus
                    />
                  </Animated.View>
                </>
              )}
            </View>
          </View>
        </TouchableOpacity>

        {/* Categories */}
        <View style={styles.section}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoriesContainer}
          >
            {categories.map((category) => (
              <CategoryChip
                key={category.id}
                category={category}
                selected={selectedCategory === category.name}
                onPress={() =>
                  setSelectedCategory(
                    selectedCategory === category.name ? null : category.name
                  )
                }
              />
            ))}
          </ScrollView>
        </View>

        {/* Promo Banner */}
        <PromoBanner
          title="🎉 Бесплатная доставка при заказе от 1000₽"
          subtitle="Действует до конца недели"
          icon="flash"
        />

        {/* You Ordered Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Вы заказывали</Text>
            <TouchableOpacity onPress={() => router.push('/(tabs)/orders')}>
              <Text style={styles.seeAll}>Все</Text>
            </TouchableOpacity>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.orderedContainer}
          >
            {restaurants.slice(0, 3).map((restaurant) => (
              <TouchableOpacity
                key={restaurant.id}
                style={styles.orderedCard}
                onPress={() => router.push(`/restaurant/${restaurant.id}`)}
                activeOpacity={0.9}
              >
                <View style={styles.orderedImageWrapper}>
                  <Image
                    source={{ uri: restaurant.image }}
                    style={styles.orderedImage}
                    resizeMode="cover"
                  />
                </View>
                <Text style={styles.orderedName}>{restaurant.name}</Text>
                <View style={styles.orderedMeta}>
                  <Ionicons name="star" size={14} color={COLORS.warning} />
                  <Text style={styles.orderedRating}>{restaurant.rating}</Text>
                  <Text style={styles.orderedTime}>{restaurant.deliveryTime}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Restaurants List */}
        <View style={styles.section}>
          {selectedCategory && (
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>{selectedCategory}</Text>
            </View>
          )}
          {filteredRestaurants.length > 0 ? (
            filteredRestaurants.map((restaurant) => (
              <RestaurantCard
                key={restaurant.id}
                restaurant={restaurant}
                onPress={() => router.push(`/restaurant/${restaurant.id}`)}
                onPromoCopied={handlePromoCopied}
              />
            ))
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>
                Ничего не найдено
              </Text>
              <Text style={styles.emptySubtext}>
                Попробуйте изменить параметры поиска
              </Text>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Address Selection Modal */}
      <Modal
        visible={showAddressModal}
        transparent
        animationType="none"
        onRequestClose={() => setShowAddressModal(false)}
      >
        <View style={styles.modalContainer}>
          <Animated.View style={[styles.modalOverlay, overlayAnimatedStyle]}>
            <TouchableOpacity
              style={StyleSheet.absoluteFill}
              activeOpacity={1}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                setShowAddressModal(false);
              }}
            />
          </Animated.View>

          <Animated.View style={[styles.modalContent, modalAnimatedStyle]}>
            <View {...panResponder.panHandlers} style={styles.modalHeader}>
              <View style={styles.modalHandle} />
            </View>
            <Text style={styles.modalTitle}>Выберите адрес</Text>

            <ScrollView showsVerticalScrollIndicator={false}>
              {addresses.map((address) => (
                <TouchableOpacity
                  key={address.id}
                  style={[
                    styles.addressOption,
                    selectedAddress.id === address.id && styles.addressOptionSelected,
                  ]}
                  onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    setSelectedAddress(address);
                    setShowAddressModal(false);
                  }}
                  activeOpacity={0.7}
                >
                  <View style={styles.addressOptionContent}>
                    <View style={styles.addressOptionHeader}>
                      <Ionicons
                        name={address.label === 'Дом' ? 'home' : 'briefcase'}
                        size={20}
                        color={
                          selectedAddress.id === address.id
                            ? COLORS.textOnPrimary
                            : COLORS.textSecondary
                        }
                      />
                      <Text
                        style={[
                          styles.addressOptionLabel,
                          selectedAddress.id === address.id &&
                            styles.addressOptionLabelSelected,
                        ]}
                      >
                        {address.label}
                      </Text>
                    </View>
                    <Text
                      style={[
                        styles.addressOptionText,
                        selectedAddress.id === address.id &&
                          styles.addressOptionTextSelected,
                      ]}
                    >
                      {address.street}, {address.building}
                      {address.apartment && `, кв. ${address.apartment}`}
                    </Text>
                  </View>
                  {selectedAddress.id === address.id && (
                    <Ionicons name="checkmark-circle" size={24} color={COLORS.success} />
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </Animated.View>
        </View>
      </Modal>

      {/* Toast Notification */}
      <Toast
        message={toastMessage}
        visible={showToast}
        onHide={() => setShowToast(false)}
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
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
              scrollToTop();
            }}
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
  scrollContent: {
    paddingBottom: SPACING.xxl,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingTop: SPACING.md,
    paddingBottom: SPACING.md,
    gap: SPACING.sm,
  },
  profileButton: {
    padding: 0,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addressContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.md,
    gap: SPACING.xs,
  },
  addressContent: {
    flex: 1,
  },
  addressLabel: {
    fontSize: TYPOGRAPHY.caption,
    fontWeight: TYPOGRAPHY.weightSemibold,
    color: COLORS.textSecondary,
    marginBottom: 2,
  },
  addressText: {
    fontSize: TYPOGRAPHY.bodySmall,
    fontWeight: TYPOGRAPHY.weightMedium,
    color: COLORS.text,
  },
  bonusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.md,
    gap: SPACING.xs,
  },
  bonusText: {
    fontSize: TYPOGRAPHY.bodySmall,
    fontWeight: TYPOGRAPHY.weightBold,
    color: COLORS.text,
  },
  searchContainer: {
    marginHorizontal: SPACING.md,
    marginBottom: SPACING.lg,
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.md,
    height: 50,
    justifyContent: 'center',
  },
  searchContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  searchInactive: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
  },
  searchIconWrapper: {
    position: 'absolute',
    zIndex: 2,
  },
  searchPlaceholder: {
    fontSize: TYPOGRAPHY.body,
    fontWeight: TYPOGRAPHY.weightBold,
    color: COLORS.text,
  },
  searchInputWrapper: {
    position: 'absolute',
    left: 0,
    right: 0,
    paddingLeft: 36,
  },
  searchInput: {
    fontSize: TYPOGRAPHY.body,
    color: COLORS.text,
    padding: 0,
  },
  section: {
    marginBottom: SPACING.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
    paddingHorizontal: SPACING.md,
  },
  sectionTitle: {
    fontSize: TYPOGRAPHY.h5,
    fontWeight: TYPOGRAPHY.weightBold,
    color: COLORS.text,
  },
  seeAll: {
    fontSize: TYPOGRAPHY.body,
    color: COLORS.textSecondary,
    fontWeight: TYPOGRAPHY.weightMedium,
  },
  categoriesContainer: {
    paddingHorizontal: SPACING.md,
  },
  orderedContainer: {
    paddingHorizontal: SPACING.md,
  },
  orderedCard: {
    width: 280,
    marginRight: SPACING.md,
  },
  orderedImageWrapper: {
    width: '100%',
    height: 140,
    marginBottom: SPACING.sm,
  },
  orderedImage: {
    width: '100%',
    height: '100%',
    borderRadius: BORDER_RADIUS.lg,
  },
  orderedName: {
    fontSize: TYPOGRAPHY.body,
    fontWeight: TYPOGRAPHY.weightBold,
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  orderedMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
  },
  orderedRating: {
    fontSize: TYPOGRAPHY.bodySmall,
    fontWeight: TYPOGRAPHY.weightMedium,
    color: COLORS.text,
  },
  orderedTime: {
    fontSize: TYPOGRAPHY.bodySmall,
    color: COLORS.textSecondary,
    marginLeft: SPACING.xs,
  },
  emptyState: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xxl,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: TYPOGRAPHY.h6,
    fontWeight: TYPOGRAPHY.weightSemibold,
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  emptySubtext: {
    fontSize: TYPOGRAPHY.bodySmall,
    color: COLORS.textSecondary,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: COLORS.background,
    borderTopLeftRadius: BORDER_RADIUS.xl,
    borderTopRightRadius: BORDER_RADIUS.xl,
    paddingHorizontal: SPACING.md,
    paddingBottom: SPACING.xl,
    maxHeight: '50%',
  },
  modalHeader: {
    paddingTop: SPACING.sm,
    paddingBottom: SPACING.xs,
    alignItems: 'center',
  },
  modalHandle: {
    width: 40,
    height: 4,
    backgroundColor: COLORS.border,
    borderRadius: 2,
  },
  modalTitle: {
    fontSize: TYPOGRAPHY.h5,
    fontWeight: TYPOGRAPHY.weightBold,
    color: COLORS.text,
    marginBottom: SPACING.md,
    paddingTop: SPACING.xs,
  },
  addressOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
  },
  addressOptionSelected: {
    backgroundColor: COLORS.primaryLight,
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  addressOptionContent: {
    flex: 1,
  },
  addressOptionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    marginBottom: SPACING.xs,
  },
  addressOptionLabel: {
    fontSize: TYPOGRAPHY.body,
    fontWeight: TYPOGRAPHY.weightSemibold,
    color: COLORS.text,
  },
  addressOptionLabelSelected: {
    color: COLORS.textOnPrimary,
  },
  addressOptionText: {
    fontSize: TYPOGRAPHY.bodySmall,
    color: COLORS.textSecondary,
    marginLeft: 28,
  },
  addressOptionTextSelected: {
    color: COLORS.textOnPrimary,
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
