import { Platform, StyleSheet, TextStyle, ViewStyle } from 'react-native';
import { Colors } from './colors';

// ─── Spacing scale (matches Tailwind's 4px grid) ──────────────────────────────

export const spacing = {
  px: 1,
  0: 0,
  0.5: 2,
  1: 4,
  1.5: 6,
  2: 8,
  2.5: 10,
  3: 12,
  3.5: 14,
  4: 16,
  5: 20,
  6: 24,
  7: 28,
  8: 32,
  9: 36,
  10: 40,
  11: 44,
  12: 48,
  14: 56,
  16: 64,
  20: 80,
  24: 96,
  32: 128,
} as const;

// ─── Radius scale ─────────────────────────────────────────────────────────────

export const radius = {
  none: 0,
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  '2xl': 20,
  '3xl': 24,
  full: 9999,
} as const;

// ─── Font sizes (Tailwind text-* equivalents) ─────────────────────────────────

export const fontSize = {
  '2xs': 9,
  xs: 12,
  sm: 14,
  base: 16,
  lg: 18,
  xl: 20,
  '2xl': 24,
  '3xl': 30,
  '4xl': 36,
} as const;

// ─── Font families ────────────────────────────────────────────────────────────
// Note: the codebase references font-[PlusJakartaSans-*] in className strings
// but the loaded fonts in _layout.tsx are Roboto and Oswald, so those references
// were silently no-ops in NativeWind. We preserve that behavior by leaving the
// fontFamily unset on typography defaults — set it explicitly per-component when
// you actually want a custom font.

export const fontFamily = {
  robotoLight: 'Roboto_300Light',
  roboto: 'Roboto_400Regular',
  robotoMedium: 'Roboto_500Medium',
  oswaldSemiBold: 'Oswald_600SemiBold',
  oswaldBold: 'Oswald_700Bold',
} as const;

// ─── Shadows ──────────────────────────────────────────────────────────────────

export const shadows = {
  none: {},
  sm: Platform.select({
    ios: {
      shadowColor: Colors.black,
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 2,
    },
    android: { elevation: 1 },
    default: {},
  }) as ViewStyle,
  md: Platform.select({
    ios: {
      shadowColor: Colors.black,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.06,
      shadowRadius: 8,
    },
    android: { elevation: 3 },
    default: {},
  }) as ViewStyle,
  lg: Platform.select({
    ios: {
      shadowColor: Colors.black,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 16,
    },
    android: { elevation: 6 },
    default: {},
  }) as ViewStyle,
} as const;

// ─── Common StyleSheet ────────────────────────────────────────────────────────

export const commonStyles = StyleSheet.create({
  // Flex helpers
  flex1: { flex: 1 },
  row: { flexDirection: 'row' },
  rowCenter: { flexDirection: 'row', alignItems: 'center' },
  rowBetween: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  center: { alignItems: 'center', justifyContent: 'center' },
  itemsCenter: { alignItems: 'center' },
  itemsStart: { alignItems: 'flex-start' },
  itemsEnd: { alignItems: 'flex-end' },
  justifyCenter: { justifyContent: 'center' },
  justifyEnd: { justifyContent: 'flex-end' },
  justifyBetween: { justifyContent: 'space-between' },

  // Screen / page container
  screen: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  screenWhite: {
    flex: 1,
    backgroundColor: Colors.white,
  },

  // Cards
  card: {
    backgroundColor: Colors.white,
    borderRadius: radius['2xl'],
    borderWidth: 1,
    borderColor: Colors.hair,
    padding: spacing[4],
  },
  cardSurface: {
    backgroundColor: Colors.surface,
    borderRadius: radius['2xl'],
    borderWidth: 1,
    borderColor: Colors.hair,
    padding: spacing[4],
  },

  // Section heading divider line
  hairline: {
    height: 1,
    backgroundColor: Colors.hair,
  },
  hairlineVertical: {
    width: 1,
    backgroundColor: Colors.hair,
  },

  // Top bars / header rows
  topBar: {
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.hair,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[3],
  },
  bottomBar: {
    backgroundColor: Colors.white,
    borderTopWidth: 1,
    borderTopColor: Colors.hair,
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[3],
  },

  // Typography
  h1: {
    fontSize: fontSize['3xl'],
    fontWeight: '700',
    color: Colors.ink,
  } as TextStyle,
  h2: {
    fontSize: fontSize['2xl'],
    fontWeight: '700',
    color: Colors.ink,
  } as TextStyle,
  h3: {
    fontSize: fontSize.xl,
    fontWeight: '600',
    color: Colors.ink,
  } as TextStyle,
  h4: {
    fontSize: fontSize.lg,
    fontWeight: '600',
    color: Colors.ink,
  } as TextStyle,
  bodyLg: {
    fontSize: fontSize.lg,
    color: Colors.ink,
  } as TextStyle,
  body: {
    fontSize: fontSize.base,
    color: Colors.ink,
  } as TextStyle,
  bodySm: {
    fontSize: fontSize.sm,
    color: Colors.ink,
  } as TextStyle,
  caption: {
    fontSize: fontSize.xs,
    color: Colors.inkMuted,
  } as TextStyle,
  label: {
    fontSize: fontSize.sm,
    fontWeight: '600',
    color: Colors.ink,
  } as TextStyle,
  textMuted: {
    color: Colors.inkMuted,
  } as TextStyle,
  textLight: {
    color: Colors.inkLight,
  } as TextStyle,
  textPrimary: {
    color: Colors.primary,
  } as TextStyle,
  textError: {
    color: Colors.error,
  } as TextStyle,
  textSuccess: {
    color: Colors.success,
  } as TextStyle,
  textWhite: {
    color: Colors.white,
  } as TextStyle,
  semibold: { fontWeight: '600' } as TextStyle,
  bold: { fontWeight: '700' } as TextStyle,
  medium: { fontWeight: '500' } as TextStyle,

  // Pressable feedback (approximation of NativeWind's active:opacity-* — RN
  // doesn't support pressed pseudo-class styling without inline style funcs).
  pressable: {},

  // Absolute fill
  absoluteFill: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
  },

  // Common image / media
  imageCover: {
    width: '100%',
    height: '100%',
  },
});

export default commonStyles;
