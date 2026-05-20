import { StyleSheet } from 'react-native';
import type { Theme } from '@/constants/colors';
import { spacing } from '@/constants/commonStyles';

export const makeStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      backgroundColor: theme.card,
      borderBottomWidth: 1,
      borderBottomColor: theme.hair,
    },
    topRow: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: spacing[3],
      paddingVertical: spacing[2],
    },
    backBtn: {
      width: 36,
      height: 36,
      borderRadius: 999,
      backgroundColor: theme.surface,
      borderWidth: 1,
      borderColor: theme.hair,
      alignItems: 'center',
      justifyContent: 'center',
    },
    title: {
      flex: 1,
      textAlign: 'center',
      color: theme.ink,
      fontSize: 16,
      fontWeight: '700',
    },
    rightSpacer: { width: 36 },
    barsRow: {
      flexDirection: 'row',
      paddingHorizontal: spacing[5],
      paddingBottom: spacing[3],
      gap: spacing[1.5],
    },
    bar: {
      flex: 1,
      height: 4,
      borderRadius: 999,
    },
    barFilled: { backgroundColor: theme.primary },
    barEmpty: { backgroundColor: theme.hair },
    labelsRow: {
      flexDirection: 'row',
      paddingHorizontal: spacing[5],
      paddingBottom: spacing[2],
      gap: spacing[1.5],
    },
    label: {
      flex: 1,
      textAlign: 'center',
      fontSize: 10,
    },
    labelActive: {
      color: theme.primary,
      fontWeight: '600',
    },
    labelInactive: {
      color: theme.inkMuted,
    },
  });
