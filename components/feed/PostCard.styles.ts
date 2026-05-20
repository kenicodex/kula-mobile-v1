import { StyleSheet } from 'react-native';
import type { Theme } from '@/constants/colors';
import { radius, spacing } from '@/constants/commonStyles';

export const makeStyles = (theme: Theme) =>
  StyleSheet.create({
    card: {
      backgroundColor: theme.card,
      borderRadius: radius['2xl'],
      borderWidth: 1,
      borderColor: theme.hair,
      overflow: 'hidden',
    },
    authorRow: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: spacing[3],
    },
    authorBody: {
      marginLeft: spacing[2.5],
      flex: 1,
    },
    authorTopRow: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    authorName: {
      color: theme.ink,
      fontSize: 14,
      fontWeight: '700',
    },
    authorBadgeSpacer: { marginLeft: 4 },
    authorMeta: {
      color: theme.inkMuted,
      fontSize: 11,
    },
    image: {
      width: '100%',
      aspectRatio: 1,
    },
    actionsRow: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: spacing[3],
      paddingTop: spacing[2],
    },
    actionLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      marginRight: spacing[4],
    },
    actionCount: {
      marginLeft: spacing[1],
      color: theme.ink,
      fontSize: 13,
      fontWeight: '600',
    },
    flexSpacer: { flex: 1 },
    captionWrap: {
      paddingHorizontal: spacing[3],
      paddingTop: spacing[2],
      paddingBottom: spacing[3],
    },
    captionText: {
      color: theme.ink,
      fontSize: 13,
      lineHeight: 20,
    },
    captionAuthor: {
      fontWeight: '700',
    },
    hashtags: {
      color: theme.primary,
      fontSize: 12,
      marginTop: spacing[1],
      fontWeight: '600',
    },
  });
