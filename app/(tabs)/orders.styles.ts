import { StyleSheet } from 'react-native';
import type { Theme } from '@/constants/colors';
import { radius, spacing } from '@/constants/commonStyles';

export const makeStyles = (theme: Theme) =>
  StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: theme.surface,
    },
    header: {
      backgroundColor: theme.card,
      paddingTop: spacing[2],
      paddingBottom: spacing[3],
      paddingHorizontal: spacing[4],
      borderBottomWidth: 1,
      borderBottomColor: theme.hair,
    },
    headerTitleRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: spacing[3],
    },
    headerTitle: {
      flex: 1,
      color: theme.ink,
      fontSize: 24,
      fontWeight: '700',
    },

    // ── Tabs ──────────────────────────────────────────────────────────────────
    tabsRow: {
      flexDirection: 'row',
      gap: spacing[2],
    },
    tabPill: {
      paddingHorizontal: spacing[4],
      paddingVertical: spacing[2],
      borderRadius: 999,
    },
    tabPillActive: {
      backgroundColor: theme.primary,
    },
    tabPillInactive: {
      backgroundColor: theme.surface,
      borderWidth: 1,
      borderColor: theme.hair,
    },
    tabPillText: {
      fontSize: 13,
      fontWeight: '600',
    },
    tabPillTextActive: {
      color: theme.white,
    },
    tabPillTextInactive: {
      color: theme.inkLight,
    },

    // ── List ──────────────────────────────────────────────────────────────────
    listContent: {
      padding: spacing[4],
      gap: spacing[2.5],
    },

    // ── Empty ─────────────────────────────────────────────────────────────────
    loadingWrap: {
      paddingVertical: spacing[16],
      alignItems: 'center',
    },
    emptyWrap: {
      alignItems: 'center',
      paddingTop: spacing[20],
      paddingHorizontal: spacing[8],
    },
    emptyIcon: {
      width: 64,
      height: 64,
      borderRadius: 999,
      backgroundColor: theme.primaryMuted,
      alignItems: 'center',
      justifyContent: 'center',
    },
    emptyTitle: {
      color: theme.ink,
      fontSize: 16,
      fontWeight: '700',
      marginTop: spacing[4],
    },
    emptySub: {
      color: theme.inkMuted,
      fontSize: 14,
      marginTop: spacing[1],
      textAlign: 'center',
    },

    // ── Order card ────────────────────────────────────────────────────────────
    orderCard: {
      backgroundColor: theme.card,
      borderRadius: radius['2xl'],
      borderWidth: 1,
      borderColor: theme.hair,
      padding: spacing[3.5],
    },
    orderRow: {
      flexDirection: 'row',
    },
    orderBody: {
      flex: 1,
      marginLeft: spacing[3],
    },
    orderTopRow: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    orderChefName: {
      flex: 1,
      color: theme.ink,
      fontSize: 14,
      fontWeight: '700',
    },
    statusPill: {
      paddingHorizontal: spacing[2],
      paddingVertical: 2,
      borderRadius: 999,
    },
    statusText: {
      fontSize: 10,
      fontWeight: '600',
    },
    itemsText: {
      color: theme.inkLight,
      fontSize: 12,
      marginTop: 2,
    },
    metaRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: spacing[1.5],
    },
    metaLeft: {
      color: theme.inkMuted,
      fontSize: 11,
      flex: 1,
    },
    metaTotal: {
      color: theme.primary,
      fontSize: 13,
      fontWeight: '700',
    },
  });
