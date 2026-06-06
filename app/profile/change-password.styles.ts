import { StyleSheet } from 'react-native';
import type { Theme } from '@/constants/colors';
import { spacing } from '@/constants/commonStyles';

export const makeStyles = (theme: Theme) =>
  StyleSheet.create({
    safe: {
      flex: 1,
      backgroundColor: theme.surface,
    },
    flex1: { flex: 1 },
    scrollContent: {
      padding: spacing[4],
      gap: spacing[3],
    },
    intro: {
      color: theme.inkMuted,
      fontSize: 13,
      marginBottom: spacing[2],
    },
    submitBtn: {
      marginTop: spacing[3],
    },
  });
