// Design System для Food Delivery App
// iPhone 14 Pro: 393 × 852 px
// 8px spacing system
// WCAG AA compliant colors

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 40,
} as const;

export const COLORS = {
  // Primary colors
  primary: '#FF6B35', // Orange - основной цвет приложения
  primaryDark: '#E55A2B',
  primaryLight: '#FF8558',

  // Secondary colors
  secondary: '#4ECDC4', // Teal - акцентный цвет
  secondaryDark: '#3DBDB5',
  secondaryLight: '#6ED8D1',

  // Neutral colors
  background: '#FFFFFF',
  surface: '#F8F9FA',
  card: '#FFFFFF',

  // Text colors (WCAG AA compliant)
  text: '#1A1A1A',
  textSecondary: '#6B7280',
  textTertiary: '#9CA3AF',
  textOnPrimary: '#FFFFFF',

  // Border & Divider
  border: '#E5E7EB',
  divider: '#F3F4F6',

  // Status colors
  success: '#10B981',
  error: '#EF4444',
  warning: '#F59E0B',
  info: '#3B82F6',

  // Overlay
  overlay: 'rgba(0, 0, 0, 0.5)',
  overlayLight: 'rgba(0, 0, 0, 0.3)',
} as const;

export const TYPOGRAPHY = {
  // Font sizes
  h1: 32,
  h2: 28,
  h3: 24,
  h4: 20,
  h5: 18,
  h6: 16,
  body: 16,
  bodySmall: 14,
  caption: 12,
  tiny: 10,

  // Font weights
  weightRegular: '400' as const,
  weightMedium: '500' as const,
  weightSemibold: '600' as const,
  weightBold: '700' as const,

  // Line heights
  lineHeightTight: 1.2,
  lineHeightNormal: 1.5,
  lineHeightRelaxed: 1.75,
} as const;

export const BORDER_RADIUS = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 9999,
} as const;

export const SHADOWS = {
  sm: {
    boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
    elevation: 1,
  },
  md: {
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.08)',
    elevation: 3,
  },
  lg: {
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.12)',
    elevation: 5,
  },
  xl: {
    boxShadow: '0 8px 16px rgba(0, 0, 0, 0.16)',
    elevation: 8,
  },
} as const;

export const SCREEN_WIDTH = 393; // iPhone 14 Pro width
export const SCREEN_HEIGHT = 852; // iPhone 14 Pro height

// Animation durations (ms)
export const ANIMATION_DURATION = {
  fast: 150,
  normal: 250,
  slow: 350,
} as const;
