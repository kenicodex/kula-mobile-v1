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
      paddingTop: spacing[6],
      paddingBottom: spacing[8],
    },
    logoBlock: {
      alignItems: 'center',
      marginBottom: spacing[8],
    },
    title: {
      color: theme.ink,
      fontSize: 24,
      fontWeight: '700',
    },
    subtitle: {
      color: theme.inkMuted,
      fontSize: 14,
      marginTop: spacing[1],
    },
    form: {
      gap: spacing[1],
    },
    forgotLink: {
      alignSelf: 'flex-end',
      marginTop: spacing[1],
      marginBottom: spacing[6],
    },
    forgotText: {
      color: theme.primary,
      fontSize: 14,
      fontWeight: '600',
    },
    divider: {
      flexDirection: 'row',
      alignItems: 'center',
      marginVertical: spacing[6],
      gap: spacing[3],
    },
    dividerLine: {
      flex: 1,
      height: 1,
      backgroundColor: theme.hair,
    },
    dividerText: {
      color: theme.inkFaint,
      fontSize: 12,
    },
    footer: {
      flexDirection: 'row',
      justifyContent: 'center',
      marginTop: spacing[6],
      gap: spacing[1],
    },
    footerText: {
      color: theme.inkMuted,
      fontSize: 14,
    },
    footerLink: {
      color: theme.primary,
      fontSize: 14,
      fontWeight: '600',
    },
  });
