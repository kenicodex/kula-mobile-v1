import { StyleSheet } from 'react-native';
import type { Theme } from '@/constants/colors';
import { radius, spacing } from '@/constants/commonStyles';

export const makeStyles = (theme: Theme) =>
  StyleSheet.create({
    safe: {
      flex: 1,
      backgroundColor: theme.surface,
    },
    tabsRow: {
      flexDirection: 'row',
      gap: spacing[2],
    },
    tab: {
      paddingHorizontal: spacing[3.5],
      paddingVertical: spacing[1.5],
      borderRadius: radius.full,
    },
    tabActive: {
      backgroundColor: theme.primary,
    },
    tabInactive: {
      backgroundColor: theme.surface,
      borderWidth: 1,
      borderColor: theme.hair,
    },
    tabText: {
      fontSize: 12,
      fontWeight: '600',
    },
    tabTextActive: {
      color: theme.white,
    },
    tabTextInactive: {
      color: theme.inkLight,
    },
    listContent: {
      padding: spacing[4],
      gap: 10,
    },
    loadingWrap: {
      paddingVertical: 64,
      alignItems: 'center',
    },
    emptyWrap: {
      alignItems: 'center',
      paddingTop: 64,
    },
    emptyText: {
      color: theme.inkMuted,
      fontSize: 14,
    },
  });
