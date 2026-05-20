import { StyleSheet } from 'react-native';
import type { Theme } from '@/constants/colors';
import { radius, spacing } from '@/constants/commonStyles';

export const makeStyles = (theme: Theme) =>
  StyleSheet.create({
    safe: {
      flex: 1,
      backgroundColor: theme.card,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: spacing[3],
      paddingVertical: spacing[2],
      borderBottomWidth: 1,
      borderBottomColor: theme.hair,
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
    headerTitle: {
      flex: 1,
      textAlign: 'center',
      color: theme.ink,
      fontSize: 16,
      fontWeight: '700',
    },
    publishButton: {
      paddingHorizontal: spacing[4],
      paddingVertical: spacing[2],
      borderRadius: 999,
    },
    publishButtonActive: {
      backgroundColor: theme.primary,
    },
    publishButtonInactive: {
      backgroundColor: theme.hair,
    },
    publishLabel: {
      color: theme.white,
      fontSize: 13,
      fontWeight: '700',
    },
    scrollContent: {
      paddingBottom: 32,
    },
    mediaScrollContent: {
      paddingHorizontal: spacing[4],
      paddingVertical: spacing[3],
      gap: 10,
    },
    mediaWrap: {
      paddingHorizontal: spacing[4],
      paddingTop: spacing[3],
      paddingBottom: spacing[2],
    },
    uploadTile: {
      width: 100,
      height: 100,
      borderRadius: radius['2xl'],
      backgroundColor: theme.surface,
      borderWidth: 2,
      borderStyle: 'dashed',
      borderColor: theme.hair,
      alignItems: 'center',
      justifyContent: 'center',
    },
    uploadLabel: {
      color: theme.inkMuted,
      fontSize: 12,
      marginTop: spacing[1],
    },
    mediaTile: {
      width: 100,
      height: 100,
      borderRadius: radius['2xl'],
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 1,
      backgroundColor: theme.primaryMuted,
      borderColor: theme.hair,
    },
    mediaTileActive: {
      borderColor: theme.primary,
      borderWidth: 2,
    },
    pickerTile: {
      alignSelf: 'center',
      width: '100%',
      aspectRatio: 1,
      borderRadius: radius['2xl'],
      backgroundColor: theme.surface,
      borderWidth: 2,
      borderStyle: 'dashed',
      borderColor: theme.hair,
      alignItems: 'center',
      justifyContent: 'center',
    },
    previewTile: {
      alignSelf: 'center',
      width: '100%',
      aspectRatio: 1,
      borderRadius: radius['2xl'],
      backgroundColor: theme.surface,
      borderWidth: 2,
      borderColor: theme.primary,
      overflow: 'hidden',
    },
    previewImage: {
      width: '100%',
      height: '100%',
    },
    uploadingOverlay: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: 'rgba(0,0,0,0.35)',
      borderRadius: radius['2xl'],
      alignItems: 'center',
      justifyContent: 'center',
    },
    mediaRemoveBtn: {
      position: 'absolute',
      top: spacing[1],
      right: spacing[1],
      backgroundColor: 'rgba(0,0,0,0.45)',
      borderRadius: 999,
    },
    mediaEmoji: {
      fontSize: 36,
    },
    mediaLabel: {
      color: theme.inkLight,
      fontSize: 11,
      marginTop: spacing[1],
      fontWeight: '600',
    },
    mediaCheck: {
      position: 'absolute',
      top: spacing[1],
      right: spacing[1],
    },
    body: {
      paddingHorizontal: spacing[4],
    },
    captionCard: {
      backgroundColor: theme.card,
      borderRadius: radius['2xl'],
      borderWidth: 1,
      borderColor: theme.hair,
      padding: spacing[3],
      minHeight: 120,
    },
    captionInput: {
      color: theme.ink,
      fontSize: 16,
      minHeight: 100,
    },
    tagsTitle: {
      color: theme.ink,
      fontSize: 16,
      fontWeight: '700',
      marginTop: spacing[5],
    },
    tagsHelp: {
      color: theme.inkMuted,
      fontSize: 12,
      marginTop: 2,
    },
    tagsRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: spacing[2],
      marginTop: spacing[3],
    },
    tagPill: {
      paddingHorizontal: spacing[3],
      paddingVertical: spacing[2],
      borderRadius: 999,
      borderWidth: 1,
    },
    tagPillActive: {
      backgroundColor: theme.primaryMuted,
      borderColor: theme.primary,
    },
    tagPillInactive: {
      backgroundColor: theme.surface,
      borderColor: theme.hair,
    },
    tagText: {
      fontSize: 12,
      fontWeight: '600',
    },
    tagTextActive: {
      color: theme.primary,
    },
    tagTextInactive: {
      color: theme.inkLight,
    },
  });
