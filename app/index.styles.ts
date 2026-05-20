import { StyleSheet } from 'react-native';
import type { Theme } from '@/constants/colors';
import { spacing } from '@/constants/commonStyles';

export const makeStyles = (theme: Theme) =>
  StyleSheet.create({
    screen: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: theme.primary,
    },
    logoWrap: {
      alignItems: 'center',
      gap: spacing[4],
    },
    tagline: {
      color: 'rgba(255,255,255,0.8)',
      fontSize: 16,
    },
  });
