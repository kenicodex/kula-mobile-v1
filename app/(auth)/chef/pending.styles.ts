import { StyleSheet } from 'react-native';
import type { Theme } from '@/constants/colors';
import { radius, spacing } from '@/constants/commonStyles';

export const makeStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: spacing[8],
    },
    illustration: {
      width: 160,
      height: 160,
      borderRadius: radius.full,
      backgroundColor: theme.primaryMuted,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: spacing[8],
    },
    title: {
      color: theme.ink,
      fontSize: 24,
      fontWeight: '700',
      textAlign: 'center',
      marginBottom: spacing[3],
    },
    body: {
      color: theme.inkMuted,
      fontSize: 16,
      textAlign: 'center',
      lineHeight: 24,
      marginBottom: spacing[2],
    },
    bodyLast: {
      color: theme.inkMuted,
      fontSize: 16,
      textAlign: 'center',
      lineHeight: 24,
      marginBottom: spacing[10],
    },
    bodyEmphasis: {
      color: theme.ink,
      fontWeight: '600',
    },
    stepsCard: {
      width: '100%',
      backgroundColor: theme.surface,
      borderRadius: radius['2xl'],
      padding: spacing[5],
      marginBottom: spacing[10],
      gap: spacing[3],
    },
    stepRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing[3],
    },
    stepLabelDone: {
      fontSize: 14,
      color: theme.primary,
      fontWeight: '600',
    },
    stepLabel: {
      fontSize: 14,
      color: theme.inkMuted,
    },
    fullBtn: {
      width: '100%',
    },
  });
