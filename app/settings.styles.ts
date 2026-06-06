import { StyleSheet } from 'react-native';
import type { Theme } from '@/constants/colors';
import { radius, spacing } from '@/constants/commonStyles';

export const makeStyles = (theme: Theme) =>
  StyleSheet.create({
    safe: {
      flex: 1,
      backgroundColor: theme.surface,
    },
    scrollContent: {
      paddingBottom: spacing[8],
    },
    sectionHeader: {
      paddingHorizontal: spacing[4],
      paddingTop: spacing[5],
      paddingBottom: spacing[1],
    },
    sectionHeaderText: {
      color: theme.inkMuted,
      fontSize: 11,
      textTransform: 'uppercase',
      letterSpacing: 0.8,
      fontWeight: '700',
    },
    logoutWrap: {
      paddingHorizontal: spacing[4],
      marginTop: spacing[6],
    },
    logoutBtn: {
      backgroundColor: theme.card,
      borderWidth: 1,
      borderColor: 'rgba(200,74,58,0.3)',
      borderRadius: radius['2xl'],
      paddingVertical: spacing[4],
      alignItems: 'center',
    },
    logoutText: {
      color: theme.error,
      fontSize: 14,
      fontWeight: '700',
    },
    navTile: {
      backgroundColor: theme.card,
      paddingHorizontal: spacing[4],
      paddingVertical: spacing[3.5],
      flexDirection: 'row',
      alignItems: 'center',
      borderBottomWidth: 1,
      borderBottomColor: theme.hair,
    },
    navTileLabel: {
      marginLeft: spacing[3],
      flex: 1,
      color: theme.ink,
      fontSize: 14,
    },
    navTileValue: {
      color: theme.inkMuted,
      fontSize: 12,
      marginRight: spacing[1],
    },
    toggleTile: {
      backgroundColor: theme.card,
      paddingHorizontal: spacing[4],
      paddingVertical: spacing[3],
      flexDirection: 'row',
      alignItems: 'center',
      borderBottomWidth: 1,
      borderBottomColor: theme.hair,
    },
    toggleTileLabel: {
      marginLeft: spacing[3],
      flex: 1,
      color: theme.ink,
      fontSize: 14,
    },
  });
