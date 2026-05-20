import { StyleSheet } from 'react-native';
import type { Theme } from '@/constants/colors';
import { radius, spacing } from '@/constants/commonStyles';

export const makeStyles = (theme: Theme) =>
  StyleSheet.create({
    safe: {
      flex: 1,
      backgroundColor: theme.card,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: spacing[3],
      paddingVertical: spacing[2],
      borderBottomWidth: 1,
      borderBottomColor: theme.hair,
    },
    backButton: {
      width: 36,
      height: 36,
      borderRadius: 999,
      backgroundColor: theme.surface,
      borderWidth: 1,
      borderColor: theme.hair,
      alignItems: 'center',
      justifyContent: 'center',
    },
    headerTitle: {
      flex: 1,
      textAlign: 'center',
      color: theme.ink,
      fontSize: 16,
      fontWeight: '700',
    },
    headerSpacer: {
      width: 36,
    },
    scrollContent: {
      padding: 24,
      paddingBottom: 40,
    },
    bookingCard: {
      backgroundColor: theme.surface,
      borderRadius: radius['2xl'],
      borderWidth: 1,
      borderColor: theme.hair,
      padding: spacing[4],
      flexDirection: 'row',
      alignItems: 'center',
    },
    bookingInfo: {
      marginLeft: spacing[3],
    },
    chefName: {
      color: theme.ink,
      fontSize: 14,
      fontWeight: '700',
    },
    bookingMeta: {
      color: theme.inkMuted,
      fontSize: 12,
      textTransform: 'capitalize',
    },
    rateSection: {
      alignItems: 'center',
      marginTop: spacing[8],
    },
    rateTitle: {
      color: theme.ink,
      fontSize: 20,
      fontWeight: '700',
    },
    rateLabel: {
      fontSize: 14,
      marginTop: spacing[1],
    },
    rateLabelEmpty: {
      color: theme.inkMuted,
    },
    rateLabelFilled: {
      color: theme.warning,
      fontWeight: '600',
    },
    starsRow: {
      flexDirection: 'row',
      marginTop: spacing[4],
    },
    starButton: {
      paddingHorizontal: spacing[1],
    },
    sectionTitle: {
      color: theme.ink,
      fontSize: 16,
      fontWeight: '700',
      marginTop: spacing[8],
    },
    sectionTitleSecondary: {
      color: theme.ink,
      fontSize: 16,
      fontWeight: '700',
      marginTop: spacing[7],
    },
    sectionHelp: {
      color: theme.inkMuted,
      fontSize: 12,
      marginTop: 2,
    },
    chipsRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: spacing[2],
      marginTop: spacing[3],
    },
    chip: {
      paddingHorizontal: 14,
      paddingVertical: spacing[2],
      borderRadius: 999,
      borderWidth: 1,
    },
    chipActive: {
      backgroundColor: theme.primaryMuted,
      borderColor: theme.primary,
    },
    chipInactive: {
      backgroundColor: theme.card,
      borderColor: theme.hair,
    },
    chipText: {
      fontSize: 12,
      fontWeight: '600',
    },
    chipTextActive: {
      color: theme.primary,
    },
    chipTextInactive: {
      color: theme.inkLight,
    },
    commentCard: {
      backgroundColor: theme.card,
      borderRadius: radius['2xl'],
      borderWidth: 1,
      borderColor: theme.hair,
      padding: spacing[3],
      marginTop: spacing[3],
      minHeight: 120,
    },
    commentInput: {
      color: theme.ink,
      fontSize: 16,
      minHeight: 100,
    },
    bottomBar: {
      borderTopWidth: 1,
      borderTopColor: theme.hair,
      backgroundColor: theme.card,
      paddingHorizontal: spacing[6],
      paddingVertical: 14,
      paddingBottom: 16,
    },
  });
