import { StyleSheet } from 'react-native';
import type { Theme } from '@/constants/colors';
import { radius, spacing } from '@/constants/commonStyles';

export const makeStyles = (theme: Theme) =>
  StyleSheet.create({
    safe: {
      flex: 1,
      backgroundColor: theme.surface,
    },
    topBar: {
      backgroundColor: theme.card,
      paddingHorizontal: spacing[4],
      paddingTop: spacing[2],
      paddingBottom: spacing[3],
      borderBottomWidth: 1,
      borderBottomColor: theme.hair,
    },
    topRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: spacing[2],
    },
    topTitle: {
      color: theme.ink,
      fontSize: 20,
      fontWeight: '700',
    },
    searchBar: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.surface,
      borderRadius: radius.xl,
      paddingHorizontal: spacing[3],
      height: 40,
      borderWidth: 1,
      borderColor: theme.hair,
    },
    searchInput: {
      flex: 1,
      marginLeft: spacing[2],
      color: theme.ink,
      fontSize: 13,
    },
    sortBar: {
      backgroundColor: theme.card,
      borderBottomWidth: 1,
      borderBottomColor: theme.hair,
    },
    sortScrollContent: {
      paddingHorizontal: spacing[4],
      paddingVertical: spacing[2],
      gap: spacing[2],
    },
    listContent: {
      padding: spacing[4],
      gap: spacing[3],
    },
    emptyLoading: {
      paddingVertical: 64,
      alignItems: 'center',
    },
    emptyWrap: {
      alignItems: 'center',
      paddingVertical: 64,
    },
    emptyText: {
      color: theme.inkMuted,
      fontSize: 14,
    },
    sortChip: {
      paddingHorizontal: spacing[3],
      paddingVertical: spacing[1.5],
      borderRadius: 999,
      borderWidth: 1,
    },
    sortChipActive: {
      backgroundColor: theme.primary,
      borderColor: theme.primary,
    },
    sortChipInactive: {
      backgroundColor: theme.surface,
      borderColor: theme.hair,
    },
    sortChipText: {
      fontSize: 12,
      fontWeight: '600',
    },
    sortChipTextActive: {
      color: theme.white,
    },
    sortChipTextInactive: {
      color: theme.inkLight,
    },

    // Filter sheet
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.4)',
      justifyContent: 'flex-end',
    },
    sheet: {
      backgroundColor: theme.card,
      borderTopLeftRadius: radius['3xl'],
      borderTopRightRadius: radius['3xl'],
      paddingTop: spacing[2],
      paddingBottom: spacing[8],
    },
    sheetHandleWrap: {
      alignItems: 'center',
      paddingTop: spacing[2],
    },
    sheetHandle: {
      width: 36,
      height: 4,
      backgroundColor: theme.hair,
      borderRadius: 999,
    },
    sheetHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: spacing[5],
      marginTop: spacing[3],
      marginBottom: spacing[3],
    },
    sheetTitle: {
      color: theme.ink,
      fontSize: 20,
      fontWeight: '700',
      flex: 1,
    },
    sheetReset: {
      color: theme.primary,
      fontSize: 14,
      fontWeight: '600',
    },
    sheetScroll: {
      paddingHorizontal: spacing[5],
      maxHeight: 480,
    },
    sheetSectionTitle: {
      color: theme.ink,
      fontWeight: '700',
      marginTop: spacing[2],
      marginBottom: spacing[2],
    },
    sheetSectionTitleSpaced: {
      color: theme.ink,
      fontWeight: '700',
      marginTop: spacing[5],
      marginBottom: spacing[2],
    },
    ratingsRow: {
      flexDirection: 'row',
      gap: spacing[1.5],
    },
    ratingPill: {
      flex: 1,
      paddingVertical: spacing[2],
      borderRadius: radius.lg,
      borderWidth: 1,
      alignItems: 'center',
    },
    ratingPillActive: {
      backgroundColor: theme.primaryMuted,
      borderColor: theme.primary,
    },
    ratingPillInactive: {
      backgroundColor: theme.surface,
      borderColor: theme.hair,
    },
    ratingPillText: {
      fontSize: 12,
      fontWeight: '600',
    },
    ratingPillTextActive: {
      color: theme.primary,
    },
    ratingPillTextInactive: {
      color: theme.inkMuted,
    },
    chipsRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: spacing[2],
    },
    chip: {
      paddingHorizontal: spacing[3],
      paddingVertical: spacing[2],
      borderRadius: 999,
      borderWidth: 1,
    },
    chipActive: {
      backgroundColor: theme.primaryMuted,
      borderColor: theme.primary,
    },
    chipInactive: {
      backgroundColor: theme.surface,
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
    applyWrap: {
      paddingHorizontal: spacing[5],
      marginTop: spacing[4],
    },
    applyButton: {
      backgroundColor: theme.primary,
      borderRadius: radius['2xl'],
      paddingVertical: spacing[4],
      alignItems: 'center',
    },
    applyLabel: {
      color: theme.white,
      fontSize: 16,
      fontWeight: '700',
    },
  });
