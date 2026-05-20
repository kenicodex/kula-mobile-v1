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
      paddingHorizontal: spacing[4],
      paddingTop: spacing[2],
      paddingBottom: spacing[3],
    },
    headerTitle: {
      flex: 1,
      marginLeft: spacing[2],
      color: theme.ink,
      fontSize: 24,
      fontWeight: '700',
    },
    searchWrap: {
      paddingHorizontal: spacing[4],
      paddingBottom: spacing[3],
    },
    searchBar: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.surface,
      borderRadius: radius.xl,
      borderWidth: 1,
      borderColor: theme.hair,
      paddingHorizontal: spacing[3],
      height: 40,
    },
    searchInput: {
      flex: 1,
      marginLeft: spacing[2],
      color: theme.ink,
      fontSize: 14,
    },
    separator: {
      height: 1,
      backgroundColor: theme.hair,
      marginLeft: 72,
    },
    loadingWrap: {
      paddingVertical: 48,
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
    row: {
      backgroundColor: theme.card,
      flexDirection: 'row',
      paddingHorizontal: spacing[4],
      paddingVertical: spacing[3],
    },
    rowPressed: {
      backgroundColor: theme.surface,
    },
    avatarWrap: {
      position: 'relative',
    },
    rowBody: {
      flex: 1,
      marginLeft: spacing[3],
    },
    rowTopLine: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    rowName: {
      flex: 1,
      color: theme.ink,
      fontSize: 14,
      fontWeight: '700',
    },
    rowTime: {
      fontSize: 11,
    },
    rowTimeUnread: {
      color: theme.primary,
      fontWeight: '700',
    },
    rowTimeRead: {
      color: theme.inkMuted,
    },
    rowBottomLine: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: spacing[1],
    },
    rowMessage: {
      flex: 1,
      fontSize: 13,
    },
    rowMessageUnread: {
      color: theme.ink,
      fontWeight: '600',
    },
    rowMessageRead: {
      color: theme.inkMuted,
    },
    unreadBadge: {
      marginLeft: spacing[2],
      minWidth: 18,
      height: 18,
      paddingHorizontal: spacing[1],
      borderRadius: radius.full,
      backgroundColor: theme.primary,
      alignItems: 'center',
      justifyContent: 'center',
    },
    unreadBadgeText: {
      color: theme.white,
      fontSize: 10,
      fontWeight: '700',
    },
  });
