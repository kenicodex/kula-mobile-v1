import { StyleSheet, TextStyle } from 'react-native';
import type { Theme } from '@/constants/colors';

export type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

export const sizeMap: Record<AvatarSize, number> = {
  xs: 24,
  sm: 32,
  md: 40,
  lg: 56,
  xl: 80,
};

export const textSizeMap: Record<AvatarSize, TextStyle> = {
  xs: { fontSize: 9 },
  sm: { fontSize: 12 },
  md: { fontSize: 14 },
  lg: { fontSize: 18 },
  xl: { fontSize: 24 },
};

export const makeStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden',
    },
    initials: {
      color: theme.white,
      fontWeight: '700',
    },
  });
