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

    // Success state
    successWrap: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      gap: spacing[6],
    },
    envelopeBubble: {
      width: 128,
      height: 128,
      borderRadius: radius.full,
      backgroundColor: theme.primaryMuted,
      alignItems: 'center',
      justifyContent: 'center',
    },
    successTextWrap: {
      alignItems: 'center',
      gap: spacing[2],
    },
    successTitle: {
      color: theme.ink,
      fontSize: 24,
      fontWeight: '700',
      textAlign: 'center',
    },
    successBody: {
      color: theme.inkMuted,
      fontSize: 16,
      textAlign: 'center',
    },
    successEmphasis: {
      color: theme.ink,
      fontWeight: '600',
    },
    successHint: {
      color: theme.inkFaint,
      fontSize: 14,
      textAlign: 'center',
      marginTop: spacing[2],
    },
    fullBtn: {
      width: '100%',
      marginTop: spacing[4],
    },

    // Form state
    titleBlock: {
      marginBottom: spacing[8],
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
    submitBtn: {
      marginTop: spacing[4],
    },
  });
