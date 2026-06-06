import { StyleSheet } from 'react-native';
import type { Theme } from '@/constants/colors';
import { radius, spacing } from '@/constants/commonStyles';

export const makeStyles = (theme: Theme) =>
  StyleSheet.create({
    safe: {
      flex: 1,
      backgroundColor: theme.surface,
    },
    countBar: {
      paddingHorizontal: spacing[4],
      paddingTop: spacing[3],
      paddingBottom: spacing[2],
      backgroundColor: theme.card,
      borderBottomWidth: 1,
      borderBottomColor: theme.hair,
    },
    countText: {
      color: theme.inkMuted,
      fontSize: 14,
    },
    listContent: {
      padding: 1,
    },
    emptyLoading: {
      paddingVertical: 64,
      alignItems: 'center',
    },
    emptyWrap: {
      alignItems: 'center',
      paddingVertical: 64,
      paddingHorizontal: 32,
    },
    emptyText: {
      color: theme.inkMuted,
      fontSize: 14,
    },
    cell: {
      width: '33.333%',
      aspectRatio: 1,
      padding: 2,
    },
    cellImage: {
      width: '100%',
      height: '100%',
      borderRadius: radius.sm,
    },
    cellPlaceholder: {
      width: '100%',
      height: '100%',
      backgroundColor: theme.hair,
      borderRadius: radius.sm,
    },
  });
