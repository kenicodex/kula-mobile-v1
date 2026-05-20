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
    backButton: {
      width: 36,
      height: 36,
      borderRadius: 999,
      backgroundColor: theme.surface,
      borderWidth: 1,
      borderColor: theme.hair,
      alignItems: 'center',
      justifyContent: 'center',
    },
    headerCenter: {
      flexDirection: 'row',
      alignItems: 'center',
      marginLeft: spacing[2],
      flex: 1,
    },
    headerTextWrap: {
      marginLeft: spacing[2.5],
    },
    headerTitle: {
      color: theme.ink,
      fontSize: 14,
      fontWeight: '700',
    },
    headerSubtitle: {
      color: theme.inkMuted,
      fontSize: 11,
    },
    flex1: {
      flex: 1,
    },
    loadingWrap: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    listContent: {
      padding: spacing[4],
      gap: spacing[2],
    },
    emptyWrap: {
      alignItems: 'center',
      paddingVertical: 64,
    },
    emptyText: {
      color: theme.inkMuted,
      fontSize: 14,
    },
    systemRow: {
      alignItems: 'center',
      marginVertical: spacing[2],
    },
    systemBubble: {
      backgroundColor: theme.primaryMuted,
      borderRadius: 999,
      paddingHorizontal: spacing[3],
      paddingVertical: spacing[1.5],
    },
    systemText: {
      color: theme.primary,
      fontSize: 11,
      fontWeight: '600',
    },
    bubbleRow: {
      flexDirection: 'row',
    },
    bubbleRowMine: {
      justifyContent: 'flex-end',
    },
    bubbleRowOther: {
      justifyContent: 'flex-start',
    },
    bubble: {
      maxWidth: '78%',
      borderRadius: radius['2xl'],
      paddingHorizontal: 14,
      paddingVertical: 10,
    },
    bubbleMine: {
      backgroundColor: theme.primary,
    },
    bubbleOther: {
      backgroundColor: theme.card,
      borderWidth: 1,
      borderColor: theme.hair,
    },
    bubbleText: {
      fontSize: 14,
      lineHeight: 20,
    },
    bubbleTextMine: {
      color: theme.white,
    },
    bubbleTextOther: {
      color: theme.ink,
    },
    bubbleTime: {
      fontSize: 10,
      marginTop: spacing[1],
    },
    bubbleTimeMine: {
      color: 'rgba(255,255,255,0.8)',
      textAlign: 'right',
    },
    bubbleTimeOther: {
      color: theme.inkMuted,
    },
    inputBar: {
      borderTopWidth: 1,
      borderTopColor: theme.hair,
      backgroundColor: theme.card,
      paddingHorizontal: spacing[3],
      paddingVertical: spacing[2],
      paddingBottom: 14,
      flexDirection: 'row',
      alignItems: 'flex-end',
    },
    attachButton: {
      width: 36,
      height: 36,
      borderRadius: 999,
      backgroundColor: theme.surface,
      alignItems: 'center',
      justifyContent: 'center',
    },
    textInputWrap: {
      flex: 1,
      marginHorizontal: spacing[2],
      backgroundColor: theme.surface,
      borderRadius: radius['2xl'],
      borderWidth: 1,
      borderColor: theme.hair,
      paddingHorizontal: spacing[3],
      minHeight: 40,
      justifyContent: 'center',
    },
    textInput: {
      color: theme.ink,
      fontSize: 14,
      maxHeight: 100,
      paddingVertical: spacing[2],
    },
    sendButton: {
      width: 36,
      height: 36,
      borderRadius: 999,
      alignItems: 'center',
      justifyContent: 'center',
    },
    sendButtonActive: {
      backgroundColor: theme.primary,
    },
    sendButtonInactive: {
      backgroundColor: theme.hair,
    },
  });
