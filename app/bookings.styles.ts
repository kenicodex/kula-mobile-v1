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
      color: theme.ink,
      fontSize: 24,
      fontWeight: '700',
    },
    addBtn: {
      width: 36,
      height: 36,
      borderRadius: radius.full,
      backgroundColor: theme.primaryMuted,
      alignItems: 'center',
      justifyContent: 'center',
    },
    tabsContent: {
      paddingHorizontal: spacing[3],
      paddingBottom: spacing[2],
    },
    tab: {
      paddingHorizontal: spacing[3.5],
      paddingVertical: spacing[1.5],
      marginRight: spacing[1],
    },
    tabText: {
      fontSize: 13,
    },
    tabTextActive: {
      color: theme.primary,
      fontWeight: '600',
    },
    tabTextInactive: {
      color: theme.inkMuted,
    },
    tabUnderline: {
      height: 2,
      backgroundColor: theme.primary,
      marginTop: spacing[1],
      borderRadius: radius.full,
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
      paddingTop: 80,
      paddingHorizontal: spacing[8],
    },
    emptyIcon: {
      width: 64,
      height: 64,
      borderRadius: radius.full,
      backgroundColor: theme.primaryMuted,
      alignItems: 'center',
      justifyContent: 'center',
    },
    emptyMessage: {
      color: theme.ink,
      fontSize: 16,
      fontWeight: '700',
      marginTop: spacing[4],
      textAlign: 'center',
    },
    emptySub: {
      color: theme.inkMuted,
      fontSize: 14,
      marginTop: spacing[1],
      textAlign: 'center',
    },
    emptyCta: {
      marginTop: spacing[5],
      backgroundColor: theme.primary,
      borderRadius: radius['2xl'],
      paddingHorizontal: spacing[6],
      paddingVertical: spacing[3],
    },
    emptyCtaText: {
      color: theme.white,
      fontSize: 14,
      fontWeight: '700',
    },
  });
