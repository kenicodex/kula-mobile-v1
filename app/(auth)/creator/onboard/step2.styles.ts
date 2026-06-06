import { StyleSheet } from 'react-native';
import type { Theme } from '@/constants/colors';
import { spacing } from '@/constants/commonStyles';

export const makeStyles = (theme: Theme) =>
  StyleSheet.create({
    body: {
      flex: 1,
      paddingHorizontal: spacing[6],
      paddingTop: spacing[4],
      paddingBottom: spacing[8],
    },
    titleBlock: {
      marginBottom: spacing[8],
    },
    title: {
      color: theme.ink,
      fontSize: 24,
      fontWeight: '700',
      marginBottom: spacing[1],
    },
    subtitle: {
      color: theme.inkMuted,
      fontSize: 14,
    },
    section: {
      marginBottom: spacing[8],
    },
    sectionTitle: {
      color: theme.ink,
      fontSize: 16,
      fontWeight: '600',
      marginBottom: spacing[3],
    },
    chipsRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: spacing[2],
    },
    hint: {
      color: theme.inkFaint,
      fontSize: 12,
      textAlign: 'center',
      marginBottom: spacing[4],
    },
  });
