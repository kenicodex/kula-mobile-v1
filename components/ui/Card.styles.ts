import { StyleSheet } from 'react-native';
import type { Theme } from '@/constants/colors';
import { radius, shadows, spacing } from '@/constants/commonStyles';

export const makeStyles = (theme: Theme) =>
  StyleSheet.create({
    base: {
      backgroundColor: theme.card,
      borderRadius: radius['2xl'],
      padding: spacing[4],
    },
    shadow: shadows.md,
  });
