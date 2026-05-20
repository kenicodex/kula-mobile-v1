import { StyleSheet } from 'react-native';
import type { Theme } from '@/constants/colors';
import { radius, spacing } from '@/constants/commonStyles';

export const makeStyles = (theme: Theme) =>
  StyleSheet.create({
    // Option card
    card: {
      borderWidth: 2,
      borderRadius: radius['2xl'],
      padding: spacing[6],
      gap: spacing[3],
    },
    cardSelected: {
      borderColor: theme.primary,
      backgroundColor: theme.primaryMuted,
    },
    cardUnselected: {
      borderColor: theme.hair,
      backgroundColor: theme.card,
    },
    cardTopRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    emoji: {
      fontSize: 48,
    },
    radio: {
      width: 24,
      height: 24,
      borderRadius: 12,
      borderWidth: 2,
      alignItems: 'center',
      justifyContent: 'center',
    },
    radioSelected: {
      borderColor: theme.primary,
      backgroundColor: theme.primary,
    },
    radioUnselected: {
      borderColor: theme.hair,
      backgroundColor: 'transparent',
    },
    cardBody: {
      gap: spacing[1],
    },
    cardTitle: {
      color: theme.ink,
      fontSize: 20,
      fontWeight: '700',
    },
    cardDesc: {
      color: theme.inkMuted,
      fontSize: 14,
    },

    // Header
    headerRow: {
      paddingHorizontal: spacing[4],
      paddingTop: spacing[2],
      paddingBottom: spacing[4],
    },
    backBtn: {
      width: 40,
      height: 40,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: radius.full,
      backgroundColor: theme.surface,
    },

    // Title
    titleBlock: {
      paddingHorizontal: spacing[6],
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

    // Cards container
    cardsWrap: {
      paddingHorizontal: spacing[6],
      gap: spacing[4],
      flex: 1,
    },

    // CTA
    ctaWrap: {
      paddingHorizontal: spacing[6],
      paddingVertical: spacing[8],
    },
  });
