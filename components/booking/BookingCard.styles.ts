import { StyleSheet } from 'react-native';
import type { Theme } from '@/constants/colors';
import { radius, spacing } from '@/constants/commonStyles';

export const makeStyles = (theme: Theme) =>
  StyleSheet.create({
    card: {
      backgroundColor: theme.card,
      borderRadius: radius['2xl'],
      borderWidth: 1,
      borderColor: theme.hair,
      padding: spacing[3.5],
      flexDirection: 'row',
    },
    body: {
      flex: 1,
      marginLeft: spacing[3],
    },
    chefName: {
      color: theme.ink,
      fontSize: 14,
      fontWeight: '700',
    },
    service: {
      color: theme.inkLight,
      fontSize: 12,
      marginTop: 2,
    },
    dateRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: spacing[1],
    },
    dateText: {
      marginLeft: spacing[1],
      color: theme.inkMuted,
      fontSize: 11,
    },
    rightCol: {
      alignItems: 'flex-end',
      justifyContent: 'space-between',
    },
    statusPill: {
      paddingHorizontal: spacing[2],
      paddingVertical: spacing[1],
      borderRadius: 999,
    },
    statusText: {
      fontSize: 10,
      fontWeight: '600',
    },
    actionText: {
      color: theme.primary,
      fontSize: 11,
      fontWeight: '700',
      marginTop: spacing[1.5],
    },
  });
