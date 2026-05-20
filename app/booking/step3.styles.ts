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
    guestsRow: {
      backgroundColor: theme.surface,
      borderRadius: radius['2xl'],
      borderWidth: 1,
      borderColor: theme.hair,
      marginTop: spacing[4],
      paddingHorizontal: spacing[4],
      paddingVertical: spacing[3],
      flexDirection: 'row',
      alignItems: 'center',
    },
    guestsButton: {
      width: 36,
      height: 36,
      borderRadius: radius.full,
      backgroundColor: theme.card,
      borderWidth: 1,
      borderColor: theme.hair,
      alignItems: 'center',
      justifyContent: 'center',
    },
    guestsButtonDisabled: {
      opacity: 0.5,
    },
    guestsButtonAdd: {
      width: 36,
      height: 36,
      borderRadius: radius.full,
      backgroundColor: theme.primary,
      alignItems: 'center',
      justifyContent: 'center',
    },
    guestsValue: {
      flex: 1,
      textAlign: 'center',
      color: theme.ink,
      fontSize: 24,
      fontWeight: '700',
    },
    dietaryRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: spacing[2],
      marginTop: spacing[3],
    },
    dietaryChip: {
      paddingHorizontal: spacing[3.5],
      paddingVertical: spacing[2],
      borderRadius: radius.full,
      borderWidth: 1,
    },
    dietaryChipSelected: {
      backgroundColor: theme.primaryMuted,
      borderColor: theme.primary,
    },
    dietaryChipDefault: {
      backgroundColor: theme.card,
      borderColor: theme.hair,
    },
    dietaryText: {
      fontSize: 13,
      fontWeight: '600',
    },
    dietaryTextSelected: {
      color: theme.primary,
    },
    dietaryTextDefault: {
      color: theme.inkLight,
    },
    notesWrap: {
      backgroundColor: theme.card,
      borderRadius: radius['2xl'],
      borderWidth: 1,
      borderColor: theme.hair,
      marginTop: spacing[3],
      paddingHorizontal: spacing[4],
      paddingVertical: spacing[3],
      minHeight: 100,
    },
    notesInput: {
      color: theme.ink,
      fontSize: 16,
      minHeight: 80,
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
