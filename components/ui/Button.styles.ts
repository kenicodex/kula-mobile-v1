import { StyleSheet, TextStyle, ViewStyle } from 'react-native';
import type { Theme } from '@/constants/colors';
import { radius, spacing } from '@/constants/commonStyles';

export type Variant = 'primary' | 'secondary' | 'ghost' | 'outline' | 'danger';
export type Size = 'sm' | 'md' | 'lg';

export const containerSize: Record<Size, ViewStyle> = {
  sm: { height: 36, paddingHorizontal: spacing[4], borderRadius: radius.lg },
  md: { height: 48, paddingHorizontal: spacing[6], borderRadius: radius['2xl'] },
  lg: { height: 56, paddingHorizontal: spacing[8], borderRadius: radius['2xl'] },
};

export const labelSize: Record<Size, TextStyle> = {
  sm: { fontSize: 14, fontWeight: '600' },
  md: { fontSize: 16, fontWeight: '600' },
  lg: { fontSize: 18, fontWeight: '700' },
};

export const makeContainerVariant = (theme: Theme): Record<Variant, ViewStyle> => ({
  primary: {
    backgroundColor: theme.primary,
    borderWidth: 1,
    borderColor: theme.primary,
  },
  secondary: {
    backgroundColor: theme.ink,
    borderWidth: 1,
    borderColor: theme.ink,
  },
  ghost: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: theme.primary,
  },
  danger: {
    backgroundColor: theme.error,
    borderWidth: 1,
    borderColor: theme.error,
  },
});

export const makeLabelVariant = (theme: Theme): Record<Variant, TextStyle> => ({
  primary: { color: theme.white },
  secondary: { color: theme.white },
  ghost: { color: theme.ink },
  outline: { color: theme.primary },
  danger: { color: theme.white },
});

export const makeSpinnerColor = (theme: Theme): Record<Variant, string> => ({
  primary: theme.white,
  secondary: theme.white,
  ghost: theme.ink,
  outline: theme.primary,
  danger: theme.white,
});

export const makeStyles = (_theme: Theme) =>
  StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
    },
    disabled: { opacity: 0.5 },
    enabled: { opacity: 1 },
    iconLeft: { marginRight: spacing[2] },
    iconRight: { marginLeft: spacing[2] },
  });
