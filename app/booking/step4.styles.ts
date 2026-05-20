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
      paddingBottom: spacing[10],
    },
    sectionGap: { height: spacing[4] },
    summarySection: {
      backgroundColor: theme.surface,
      borderRadius: radius['2xl'],
      borderWidth: 1,
      borderColor: theme.hair,
      padding: spacing[4],
    },
    summaryTitle: {
      color: theme.ink,
      fontSize: 16,
      fontWeight: '700',
      marginBottom: spacing[2],
    },
    row: {
      flexDirection: 'row',
      paddingVertical: spacing[1],
    },
    rowLabel: {
      flex: 1,
      color: theme.inkMuted,
      fontSize: 13,
    },
    rowValue: {
      fontSize: 13,
    },
    rowValueDefault: {
      color: theme.inkLight,
      fontWeight: '600',
    },
    rowValueBold: {
      color: theme.ink,
      fontWeight: '700',
    },
    innerDivider: {
      height: 1,
      backgroundColor: theme.hair,
      marginVertical: spacing[2.5],
    },
    paymentTitle: {
      color: theme.ink,
      fontSize: 20,
      fontWeight: '700',
      marginTop: spacing[6],
    },
    methodsList: {
      marginTop: spacing[3],
      gap: spacing[2.5],
    },
    methodCard: {
      borderRadius: radius['2xl'],
      padding: spacing[3.5],
      flexDirection: 'row',
      alignItems: 'center',
    },
    methodCardSelected: {
      backgroundColor: theme.primaryMuted,
      borderWidth: 1.5,
      borderColor: theme.primary,
    },
    methodCardDefault: {
      backgroundColor: theme.card,
      borderWidth: 1,
      borderColor: theme.hair,
    },
    methodIconWrap: {
      width: 40,
      height: 40,
      borderRadius: radius.xl,
      backgroundColor: theme.surface,
      alignItems: 'center',
      justifyContent: 'center',
    },
    methodBody: {
      flex: 1,
      marginLeft: spacing[3],
    },
    methodName: {
      color: theme.ink,
      fontSize: 14,
      fontWeight: '600',
    },
    methodSubtitle: {
      color: theme.inkMuted,
      fontSize: 12,
    },
    radio: {
      width: 20,
      height: 20,
      borderRadius: radius.full,
      borderWidth: 2,
      alignItems: 'center',
      justifyContent: 'center',
    },
    radioSelected: {
      borderColor: theme.primary,
      backgroundColor: theme.primary,
    },
    radioDefault: {
      borderColor: theme.hair,
    },
    secureRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: spacing[3],
    },
    secureText: {
      marginLeft: spacing[1.5],
      color: theme.inkMuted,
      fontSize: 11,
    },
    footer: {
      backgroundColor: theme.card,
      borderTopWidth: 1,
      borderTopColor: theme.hair,
      paddingHorizontal: spacing[6],
      paddingVertical: spacing[3.5],
      paddingBottom: spacing[4],
    },
  });
