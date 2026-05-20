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
      paddingTop: spacing[4],
      paddingBottom: spacing[8],
    },
    titleBlock: {
      marginBottom: spacing[8],
    },
    title: {
      color: theme.ink,
      fontSize: 30,
      fontWeight: '700',
    },
    subtitle: {
      color: theme.inkMuted,
      fontSize: 14,
      marginTop: spacing[1],
    },
    submitBtn: {
      marginTop: spacing[2],
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
