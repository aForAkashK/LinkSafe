// Theme colors for LinkSafe app - Clean & Sleek Light Theme
export const colors = {
  // Primary colors - Refined purple palette
  primary: '#7C3AED',
  primaryDark: '#6D28D9',
  primaryLight: '#A78BFA',

  // Secondary colors - Soft teal
  secondary: '#14B8A6',
  secondaryDark: '#0D9488',

  // Background colors - Clean light theme
  background: '#FFFFFF',
  backgroundLight: '#F8FAFC',
  card: '#FFFFFF',
  cardHover: '#F1F5F9',

  // Text colors - Dark for readability
  text: '#0F172A',
  textSecondary: '#475569',
  textMuted: '#94A3B8',

  // Status colors
  success: '#16A34A',
  warning: '#D97706',
  error: '#DC2626',
  info: '#2563EB',

  // Special colors
  private: '#DC2626',
  locked: '#D97706',
  border: '#E2E8F0',
  borderLight: '#F1F5F9',

  // Gradient colors
  gradientStart: '#7C3AED',
  gradientEnd: '#A78BFA',
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const borderRadius = {
  xs: 6,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 9999,
};

export const typography = {
  h1: {
    fontSize: 28,
    fontWeight: '700' as const,
    color: colors.text,
    letterSpacing: -0.5,
  },
  h2: {
    fontSize: 22,
    fontWeight: '600' as const,
    color: colors.text,
    letterSpacing: -0.3,
  },
  h3: {
    fontSize: 17,
    fontWeight: '600' as const,
    color: colors.text,
  },
  body: {
    fontSize: 15,
    fontWeight: '400' as const,
    color: colors.text,
  },
  caption: {
    fontSize: 13,
    fontWeight: '500' as const,
    color: colors.textSecondary,
  },
  small: {
    fontSize: 12,
    fontWeight: '400' as const,
    color: colors.textMuted,
  },
};

// Shadows for clean depth - softer for light theme
export const shadows = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 2,
    elevation: 1,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
};
