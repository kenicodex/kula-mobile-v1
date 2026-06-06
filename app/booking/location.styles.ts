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
    sectionTitle: {
      color: theme.ink,
      fontSize: 20,
      fontWeight: '700',
    },
    sectionTitleSpaced: {
      color: theme.ink,
      fontSize: 20,
      fontWeight: '700',
      marginTop: spacing[7],
    },
    sectionSubtitle: {
      color: theme.inkMuted,
      fontSize: 13,
      marginTop: spacing[1],
    },
    inputWrap: {
      backgroundColor: theme.card,
      borderRadius: radius['2xl'],
      borderWidth: 1,
      borderColor: theme.hair,
      marginTop: spacing[3],
      paddingHorizontal: spacing[4],
      paddingVertical: spacing[3],
    },
    input: {
      color: theme.ink,
      fontSize: 16,
      minHeight: 24,
    },
    inputMultiline: {
      color: theme.ink,
      fontSize: 16,
      minHeight: 72,
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
