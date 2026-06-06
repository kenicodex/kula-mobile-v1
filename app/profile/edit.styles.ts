import { StyleSheet } from 'react-native';
import type { Theme } from '@/constants/colors';
import { radius, spacing } from '@/constants/commonStyles';

export const makeStyles = (theme: Theme) =>
  StyleSheet.create({
    safe: {
      flex: 1,
      backgroundColor: theme.surface,
    },
    flex1: { flex: 1 },
    saveBtn: {
      paddingHorizontal: spacing[2],
      minWidth: 56,
      alignItems: 'flex-end',
    },
    saveLabel: {
      fontSize: 14,
      fontWeight: '700',
    },
    saveLabelActive: {
      color: theme.primary,
    },
    saveLabelInactive: {
      color: theme.inkFaint,
    },
    scrollContent: {
      padding: spacing[4],
      gap: spacing[3],
      paddingBottom: spacing[10],
    },
    coverWrap: {
      height: 130,
      borderRadius: radius['2xl'],
      overflow: 'hidden',
      backgroundColor: theme.primaryMuted,
    },
    coverImage: {
      width: '100%',
      height: '100%',
    },
    coverPlaceholder: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      gap: spacing[1],
    },
    coverPlaceholderText: {
      color: theme.primary,
      fontSize: 13,
      fontWeight: '600',
    },
    coverOverlay: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: 'rgba(0,0,0,0.35)',
      alignItems: 'center',
      justifyContent: 'center',
    },
    coverEditBadge: {
      position: 'absolute',
      top: spacing[2],
      right: spacing[2],
      width: 28,
      height: 28,
      borderRadius: 999,
      backgroundColor: 'rgba(0,0,0,0.55)',
      alignItems: 'center',
      justifyContent: 'center',
    },
    avatarSection: {
      alignItems: 'center',
      marginTop: -44,
      marginBottom: spacing[3],
    },
    avatarWrap: {
      width: 96,
      height: 96,
      marginBottom: spacing[2],
    },
    avatarCircle: {
      width: 96,
      height: 96,
      borderRadius: 9999,
      backgroundColor: theme.primaryMuted,
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden',
      borderWidth: 3,
      borderColor: theme.surface,
    },
    avatarImage: {
      width: '100%',
      height: '100%',
    },
    avatarInitial: {
      fontSize: 36,
      color: theme.primary,
      fontWeight: '700',
    },
    avatarOverlay: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: 'rgba(0,0,0,0.35)',
      alignItems: 'center',
      justifyContent: 'center',
    },
    cameraBadge: {
      position: 'absolute',
      bottom: 0,
      right: 0,
      width: 28,
      height: 28,
      borderRadius: 999,
      backgroundColor: theme.primary,
      borderWidth: 2,
      borderColor: theme.card,
      alignItems: 'center',
      justifyContent: 'center',
    },
    uploadText: {
      color: theme.primary,
      fontSize: 14,
      fontWeight: '600',
    },
    sectionLabel: {
      color: theme.inkMuted,
      fontSize: 12,
      fontWeight: '700',
      textTransform: 'uppercase',
      marginTop: spacing[4],
      marginBottom: spacing[1],
    },
    linkRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing[2],
      backgroundColor: theme.card,
      borderRadius: radius['2xl'],
      borderWidth: 1,
      borderColor: theme.hair,
      paddingHorizontal: spacing[3],
      paddingVertical: spacing[3],
      marginTop: spacing[4],
    },
    linkText: {
      flex: 1,
      fontSize: 14,
      fontWeight: '600',
      color: theme.ink,
    },
  });
