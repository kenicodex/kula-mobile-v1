import { StyleSheet } from 'react-native';
import type { Theme } from '@/constants/colors';
import { radius, spacing } from '@/constants/commonStyles';

export const makeStyles = (theme: Theme) =>
  StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: theme.card,
    },
    scrollContent: {
      padding: spacing[6],
      paddingTop: 60,
      alignItems: 'center',
    },
    outerBadge: {
      width: 96,
      height: 96,
      borderRadius: radius.full,
      backgroundColor: theme.primaryMuted,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: spacing[6],
    },
    innerBadge: {
      width: 64,
      height: 64,
      borderRadius: radius.full,
      backgroundColor: theme.primary,
      alignItems: 'center',
      justifyContent: 'center',
    },
    title: {
      color: theme.ink,
      fontSize: 24,
      fontWeight: '700',
      textAlign: 'center',
    },
    subtitle: {
      color: theme.inkMuted,
      fontSize: 14,
      textAlign: 'center',
      marginTop: spacing[2],
      paddingHorizontal: spacing[4],
    },
    refCard: {
      backgroundColor: theme.surface,
      borderRadius: radius['2xl'],
      borderWidth: 1,
      borderColor: theme.hair,
      padding: spacing[4],
      marginTop: spacing[8],
      width: '100%',
    },
    refLabel: {
      color: theme.ink,
      fontSize: 14,
      fontWeight: '700',
      marginBottom: spacing[2],
    },
    refValue: {
      color: theme.primary,
      fontSize: 16,
      fontWeight: '700',
    },
    divider: {
      height: 1,
      backgroundColor: theme.hair,
      marginVertical: spacing[3],
    },
    rowsList: {
      gap: spacing[2],
    },
    detailRow: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    detailLabel: {
      marginLeft: spacing[2],
      flex: 1,
      color: theme.inkMuted,
      fontSize: 13,
    },
    detailValue: {
      color: theme.ink,
      fontSize: 13,
      fontWeight: '600',
    },
    viewBookingsLink: {
      marginTop: spacing[8],
    },
    viewBookingsText: {
      color: theme.primary,
      fontSize: 14,
      fontWeight: '600',
    },
    footer: {
      backgroundColor: theme.card,
      borderTopWidth: 1,
      borderTopColor: theme.hair,
      paddingHorizontal: spacing[6],
      paddingVertical: spacing[3.5],
    },
  });
