import { StyleSheet } from 'react-native';
import type { Theme } from '@/constants/colors';
import { radius, spacing } from '@/constants/commonStyles';

export const makeStyles = (theme: Theme) =>
  StyleSheet.create({
    safe: {
      flex: 1,
      backgroundColor: theme.surface,
    },
    header: {
      backgroundColor: theme.card,
      borderBottomWidth: 1,
      borderBottomColor: theme.hair,
    },
    headerRow: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: spacing[3],
      paddingVertical: spacing[2],
    },
    backBtn: {
      width: 36,
      height: 36,
      borderRadius: radius.full,
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
    tabsRow: {
      flexDirection: 'row',
      paddingHorizontal: spacing[3],
      paddingBottom: spacing[2],
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
