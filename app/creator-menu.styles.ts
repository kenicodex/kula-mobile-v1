import { StyleSheet } from 'react-native';
import type { Theme } from '@/constants/colors';
import { radius, spacing } from '@/constants/commonStyles';

export const makeStyles = (theme: Theme) =>
  StyleSheet.create({
    safe: {
      flex: 1,
      backgroundColor: theme.surface,
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
    dishActions: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing[2],
    },
    dishDeleteBtn: {
      width: 32,
      height: 32,
      alignItems: 'center',
      justifyContent: 'center',
    },

    // Modal
    modalRoot: {
      flex: 1,
      justifyContent: 'flex-end',
    },
    modalBackdrop: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: 'rgba(0,0,0,0.4)',
    },
    modalSheet: {
      backgroundColor: theme.card,
      borderTopLeftRadius: radius['2xl'],
      borderTopRightRadius: radius['2xl'],
      paddingHorizontal: spacing[4],
      paddingTop: spacing[2],
      paddingBottom: spacing[6],
    },
    modalHandle: {
      alignSelf: 'center',
      width: 36,
      height: 4,
      borderRadius: 2,
      backgroundColor: theme.hair,
      marginBottom: spacing[3],
    },
    modalTitle: {
      fontSize: 18,
      fontWeight: '700',
      color: theme.ink,
      marginBottom: spacing[3],
    },
    modalImageTile: {
      alignSelf: 'center',
      width: 120,
      height: 120,
      borderRadius: radius['2xl'],
      backgroundColor: theme.surface,
      borderWidth: 2,
      borderStyle: 'dashed',
      borderColor: theme.hair,
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden',
      marginBottom: spacing[3],
    },
    modalImage: {
      width: '100%',
      height: '100%',
    },
    modalImageLabel: {
      fontSize: 12,
      color: theme.inkMuted,
      marginTop: spacing[1],
    },
    modalFieldLabel: {
      fontSize: 12,
      fontWeight: '600',
      color: theme.inkMuted,
      marginTop: spacing[2],
      marginBottom: 4,
    },
    modalInput: {
      backgroundColor: theme.surface,
      borderRadius: radius.xl,
      borderWidth: 1,
      borderColor: theme.hair,
      paddingHorizontal: spacing[3],
      paddingVertical: spacing[2],
      color: theme.ink,
      fontSize: 14,
    },
    modalTextarea: {
      minHeight: 80,
      textAlignVertical: 'top',
      paddingTop: spacing[2],
    },
    modalAvailabilityRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginTop: spacing[3],
    },
    modalActions: {
      flexDirection: 'row',
      gap: spacing[2],
      marginTop: spacing[4],
    },
    modalBtn: {
      flex: 1,
      paddingVertical: spacing[3],
      borderRadius: 999,
      alignItems: 'center',
      justifyContent: 'center',
    },
    modalBtnGhost: {
      backgroundColor: theme.surface,
      borderWidth: 1,
      borderColor: theme.hair,
    },
    modalBtnPrimary: {
      backgroundColor: theme.primary,
    },
    modalBtnLabel: {
      fontSize: 14,
      fontWeight: '700',
      color: theme.ink,
    },
    modalBtnLabelPrimary: {
      color: theme.white,
    },
  });
