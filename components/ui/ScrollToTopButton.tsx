import React, { useState } from 'react';
import { StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING } from '@/constants/Theme';

interface ScrollToTopButtonProps {
  scrollRef: React.RefObject<ScrollView>;
  showThreshold?: number;
}

export const ScrollToTopButton: React.FC<ScrollToTopButtonProps> = ({
  scrollRef,
  showThreshold = 300,
}) => {
  const [showButton, setShowButton] = useState(false);

  const handleScroll = (event: any) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    setShowButton(offsetY > showThreshold);
  };

  const scrollToTop = () => {
    scrollRef.current?.scrollTo({ y: 0, animated: true });
  };

  return (
    <>
      {/* Attach scroll listener */}
      {React.cloneElement(scrollRef.current as any, {
        onScroll: handleScroll,
        scrollEventThrottle: 16,
      })}

      {/* Button */}
      {showButton && (
        <Animated.View
          entering={FadeIn.duration(200)}
          exiting={FadeOut.duration(200)}
          style={styles.button}
        >
          <TouchableOpacity
            style={styles.touchable}
            onPress={scrollToTop}
            activeOpacity={0.7}
          >
            <Ionicons name="arrow-up" size={20} color={COLORS.textSecondary} />
          </TouchableOpacity>
        </Animated.View>
      )}
    </>
  );
};

// Hook version for easier usage
export const useScrollToTop = (showThreshold = 300) => {
  const [showButton, setShowButton] = useState(false);
  const scrollRef = React.useRef<ScrollView>(null);

  const handleScroll = (event: any) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    setShowButton(offsetY > showThreshold);
  };

  const scrollToTop = () => {
    scrollRef.current?.scrollTo({ y: 0, animated: true });
  };

  return {
    scrollRef,
    handleScroll,
    scrollToTop,
    showButton,
  };
};

const styles = StyleSheet.create({
  button: {
    position: 'absolute',
    bottom: SPACING.lg,
    left: SPACING.md,
  },
  touchable: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
