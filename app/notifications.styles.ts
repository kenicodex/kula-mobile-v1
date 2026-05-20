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
    readAllBtn: {
      width: 48,
      height: 36,
      alignItems: 'center',
      justifyContent: 'center',
    },
    readAllText: {
      color: theme.primary,
      fontSize: 12,
      fontWeight: '700',
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
    card: {
      borderRadius: radius['2xl'],
      borderWidth: 1,
      padding: spacing[3.5],
      flexDirection: 'row',
    },
    cardRead: {
      backgroundColor: theme.card,
      borderColor: theme.hair,
    },
    cardUnread: {
      backgroundColor: '#FFF8F1',
      borderColor: 'rgba(232,104,26,0.3)',
    },
    cardIcon: {
      width: 40,
      height: 40,
      borderRadius: radius.full,
      alignItems: 'center',
      justifyContent: 'center',
    },
    cardBody: {
      flex: 1,
      marginLeft: spacing[3],
    },
    cardTopRow: {
      flexDirection: 'row',
      alignItems: 'flex-start',
    },
    cardTitle: {
      flex: 1,
      color: theme.ink,
      fontSize: 14,
      fontWeight: '700',
    },
    cardTime: {
      marginLeft: spacing[2],
      color: theme.inkMuted,
      fontSize: 11,
    },
    cardText: {
      color: theme.inkLight,
      fontSize: 13,
      marginTop: 2,
      lineHeight: 20,
    },
    unreadDot: {
      width: 8,
      height: 8,
      borderRadius: radius.full,
      backgroundColor: theme.primary,
      marginLeft: spacing[1],
      marginTop: spacing[1],
    },
  });
