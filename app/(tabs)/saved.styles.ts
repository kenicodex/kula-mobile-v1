import { StyleSheet } from 'react-native';
import type { Theme } from '@/constants/colors';
import { spacing } from '@/constants/commonStyles';

export const makeStyles = (theme: Theme) =>
  StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: theme.surface,
    },
    header: {
      backgroundColor: theme.card,
      paddingHorizontal: spacing[4],
      paddingTop: spacing[2],
      paddingBottom: spacing[3],
      borderBottomWidth: 1,
      borderBottomColor: theme.hair,
    },
    headerTitle: {
      color: theme.ink,
      fontSize: 24,
      fontWeight: '700',
    },
    tabsRow: {
      flexDirection: 'row',
      gap: spacing[2],
      marginTop: spacing[3],
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
    listContent: {
      padding: spacing[4],
      gap: spacing[3],
    },
    gridContent: {
      padding: 1,
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
  });
