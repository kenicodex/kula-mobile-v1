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
    headerActionBtn: {
      width: 36,
      height: 36,
      alignItems: 'center',
      justifyContent: 'center',
    },
    loadingWrap: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    listContent: {
      padding: spacing[4],
      gap: 10,
    },
    banner: {
      backgroundColor: '#FBF1DA',
      borderRadius: radius['2xl'],
      borderWidth: 1,
      borderColor: 'rgba(217,150,42,0.3)',
      padding: spacing[3],
      marginBottom: spacing[2],
      flexDirection: 'row',
      alignItems: 'flex-start',
    },
    bannerText: {
      marginLeft: spacing[2],
      flex: 1,
      color: theme.warning,
      fontSize: 12,
    },
    emptyWrap: {
      paddingVertical: 48,
      alignItems: 'center',
    },
    emptyText: {
      color: theme.inkMuted,
      fontSize: 14,
    },
    dishRow: {
      backgroundColor: theme.card,
      borderRadius: radius['2xl'],
      borderWidth: 1,
      borderColor: theme.hair,
      padding: spacing[3.5],
      flexDirection: 'row',
      alignItems: 'center',
    },
    dishThumb: {
      width: 52,
      height: 52,
      borderRadius: radius.xl,
      backgroundColor: theme.primaryMuted,
      alignItems: 'center',
      justifyContent: 'center',
    },
    dishThumbEmoji: {
      fontSize: 24,
    },
    dishBody: {
      flex: 1,
      marginLeft: spacing[3],
    },
    dishName: {
      fontSize: 14,
      fontWeight: '600',
      color: theme.ink,
    },
    dishCaption: {
      fontSize: 12,
      marginTop: 2,
      color: theme.inkMuted,
    },
  });
