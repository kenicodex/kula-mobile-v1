import { StyleSheet } from 'react-native';
import type { Theme } from '@/constants/colors';
import { radius, spacing } from '@/constants/commonStyles';

export const makeStyles = (theme: Theme) =>
  StyleSheet.create({
    backRow: {
      paddingHorizontal: spacing[4],
      paddingTop: spacing[2],
    },
    backBtn: {
      width: 40,
      height: 40,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: radius.full,
      backgroundColor: theme.surface,
    },
    body: {
      flex: 1,
      paddingHorizontal: spacing[6],
      paddingTop: spacing[8],
      paddingBottom: spacing[8],
    },
    header: {
      marginBottom: spacing[10],
    },
    iconBubble: {
      width: 64,
      height: 64,
      borderRadius: radius['2xl'],
      backgroundColor: theme.primaryMuted,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: spacing[4],
    },
    title: {
      color: theme.ink,
      fontSize: 30,
      fontWeight: '700',
      marginBottom: spacing[2],
    },
    subtitle: {
      color: theme.inkMuted,
      fontSize: 16,
    },
    subtitleEmphasis: {
      color: theme.ink,
      fontWeight: '600',
    },
    otpRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: spacing[8],
    },
    otpInput: {
      width: 48,
      height: 56,
      borderRadius: 14,
      borderWidth: 2,
      textAlign: 'center',
      fontSize: 22,
      fontWeight: '700',
      color: theme.ink,
    },
    otpInputEmpty: {
      borderColor: theme.hair,
      backgroundColor: theme.card,
    },
    otpInputFilled: {
      borderColor: theme.primary,
      backgroundColor: theme.primaryMuted,
    },
    resendRow: {
      flexDirection: 'row',
      justifyContent: 'center',
      marginBottom: spacing[8],
    },
    resendActive: {
      color: theme.primary,
      fontSize: 14,
      fontWeight: '600',
    },
    resendInactive: {
      color: theme.inkMuted,
      fontSize: 14,
    },
    resendCount: {
      color: theme.ink,
      fontWeight: '600',
    },
  });
