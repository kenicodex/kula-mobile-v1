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
      flexGrow: 1,
      padding: spacing[6],
      justifyContent: 'center',
      alignItems: 'center',
    },
    badge: {
      width: 96,
      height: 96,
      borderRadius: radius.full,
      backgroundColor: '#E4F3EB',
      alignItems: 'center',
      justifyContent: 'center',
    },
    title: {
      color: theme.ink,
      fontSize: 24,
      fontWeight: '700',
      marginTop: spacing[6],
      textAlign: 'center',
    },
    subtitle: {
      color: theme.inkLight,
      fontSize: 14,
      marginTop: spacing[2],
      textAlign: 'center',
      paddingHorizontal: spacing[4],
      lineHeight: 20,
    },
    detailsCard: {
      backgroundColor: theme.surface,
      borderRadius: radius['2xl'],
      borderWidth: 1,
      borderColor: theme.hair,
      padding: spacing[4],
      marginTop: spacing[8],
      width: '100%',
    },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: spacing[1],
    },
    rowLabel: {
      marginLeft: spacing[2],
      flex: 1,
      color: theme.inkMuted,
      fontSize: 13,
    },
    rowValue: {
      fontSize: 13,
      fontWeight: '700',
    },
    divider: {
      height: 1,
      backgroundColor: theme.hair,
      marginVertical: spacing[2],
    },
    footer: {
      paddingHorizontal: spacing[6],
      paddingTop: spacing[2],
      paddingBottom: spacing[4],
      gap: spacing[3],
    },
  });
