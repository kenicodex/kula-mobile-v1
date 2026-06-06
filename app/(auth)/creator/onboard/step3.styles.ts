import { StyleSheet } from 'react-native';
import type { Theme } from '@/constants/colors';
import { radius, spacing } from '@/constants/commonStyles';

export const makeStyles = (theme: Theme) =>
  StyleSheet.create({
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
      fontSize: 24,
      fontWeight: '700',
      marginBottom: spacing[1],
    },
    subtitle: {
      color: theme.inkMuted,
      fontSize: 14,
    },

    // Service cards container
    cardsWrap: {
      gap: spacing[3],
      marginBottom: spacing[8],
    },

    // Service card
    card: {
      borderWidth: 2,
      borderRadius: radius.xl,
      padding: spacing[4],
    },
    cardActive: {
      borderColor: theme.primary,
      backgroundColor: theme.primaryMuted,
    },
    cardInactive: {
      borderColor: theme.hair,
      backgroundColor: theme.card,
    },

    // Checkbox row
    topRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing[3],
    },
    checkbox: {
      width: 24,
      height: 24,
      borderRadius: 6,
      borderWidth: 2,
      alignItems: 'center',
      justifyContent: 'center',
    },
    checkboxActive: {
      borderColor: theme.primary,
      backgroundColor: theme.primary,
    },
    checkboxInactive: {
      borderColor: theme.hair,
      backgroundColor: 'transparent',
    },
    icon: {
      fontSize: 20,
    },
    optionTextWrap: {
      flex: 1,
    },
    optionLabel: {
      color: theme.ink,
      fontSize: 14,
      fontWeight: '600',
    },
    optionDesc: {
      color: theme.inkMuted,
      fontSize: 12,
    },

    // Price input
    priceWrap: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: spacing[3],
      borderWidth: 1,
      borderColor: theme.hair,
      borderRadius: radius.lg,
      paddingHorizontal: spacing[3],
      height: 40,
      backgroundColor: theme.card,
    },
    currency: {
      color: theme.inkMuted,
      fontSize: 14,
      marginRight: spacing[1],
    },
    priceInput: {
      flex: 1,
      fontSize: 14,
      color: theme.ink,
    },
    priceUnit: {
      color: theme.inkFaint,
      fontSize: 12,
    },
  });
