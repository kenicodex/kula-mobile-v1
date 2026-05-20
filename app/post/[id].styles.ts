import { StyleSheet } from 'react-native';
import type { Theme } from '@/constants/colors';
import { spacing } from '@/constants/commonStyles';

export const makeStyles = (theme: Theme) =>
  StyleSheet.create({
    safe: {
      flex: 1,
      backgroundColor: theme.card,
    },
    flex1: {
      flex: 1,
    },
    loadingWrap: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    mediaImage: {
      width: '100%',
      aspectRatio: 1,
    },
    mediaPlaceholder: {
      width: '100%',
      aspectRatio: 1,
      backgroundColor: theme.primaryMuted,
    },
    mediaButton: {
      position: 'absolute',
      width: 36,
      height: 36,
      borderRadius: 999,
      backgroundColor: 'rgba(0,0,0,0.35)',
      alignItems: 'center',
      justifyContent: 'center',
    },
    mediaButtonLeft: {
      top: spacing[3],
      left: spacing[3],
    },
    mediaButtonRight: {
      top: spacing[3],
      right: spacing[3],
    },
    authorRow: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: spacing[4],
      paddingTop: 14,
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
    authorBadgeSpacer: {
      marginLeft: 4,
    },
    authorMeta: {
      color: theme.inkMuted,
      fontSize: 11,
    },
    actionsRow: {
      flexDirection: 'row',
      paddingHorizontal: spacing[3],
      marginTop: spacing[3],
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
    flexSpacer: {
      flex: 1,
    },
    captionWrap: {
      paddingHorizontal: spacing[4],
      paddingTop: spacing[2],
      paddingBottom: spacing[3],
    },
    captionText: {
      color: theme.ink,
      fontSize: 14,
      lineHeight: 20,
    },
    captionAuthor: {
      fontWeight: '700',
    },
    hashtagsRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      marginTop: spacing[1.5],
    },
    hashtag: {
      color: theme.primary,
      fontSize: 12,
      marginRight: spacing[2],
      fontWeight: '600',
    },
    divider: {
      height: 1,
      backgroundColor: theme.hair,
      marginHorizontal: spacing[4],
    },
    commentsWrap: {
      paddingHorizontal: spacing[4],
      paddingTop: spacing[3],
      paddingBottom: spacing[6],
    },
    commentsTitle: {
      color: theme.ink,
      fontSize: 14,
      fontWeight: '700',
    },
    commentsList: {
      marginTop: spacing[3],
      gap: spacing[3],
    },
    commentsEmpty: {
      color: theme.inkMuted,
      fontSize: 12,
    },
    commentRow: {
      flexDirection: 'row',
    },
    commentBody: {
      marginLeft: spacing[2.5],
      flex: 1,
    },
    commentText: {
      color: theme.ink,
      fontSize: 13,
    },
    commentAuthor: {
      fontWeight: '700',
    },
    commentMetaRow: {
      flexDirection: 'row',
      marginTop: spacing[1],
    },
    commentMeta: {
      color: theme.inkMuted,
      fontSize: 11,
      marginRight: spacing[3],
    },
    commentBar: {
      borderTopWidth: 1,
      borderTopColor: theme.hair,
      backgroundColor: theme.card,
      paddingHorizontal: spacing[3],
      paddingVertical: spacing[2],
      flexDirection: 'row',
      alignItems: 'center',
    },
    commentInputWrap: {
      flex: 1,
      marginHorizontal: spacing[2],
      backgroundColor: theme.surface,
      borderRadius: 999,
      borderWidth: 1,
      borderColor: theme.hair,
      paddingHorizontal: spacing[3],
      height: 40,
      justifyContent: 'center',
    },
    commentInput: {
      color: theme.ink,
      fontSize: 14,
    },
    postLabel: {
      fontSize: 14,
      fontWeight: '700',
    },
    postLabelActive: {
      color: theme.primary,
    },
    postLabelInactive: {
      color: theme.inkFaint,
    },
  });
