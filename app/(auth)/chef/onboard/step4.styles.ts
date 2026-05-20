import { StyleSheet } from 'react-native';
import type { Theme } from '@/constants/colors';
import { radius, spacing } from '@/constants/commonStyles';

export const makeStyles = (theme: Theme) =>
  StyleSheet.create({
    body: {
      flex: 1,
      paddingHorizontal: spacing[6],
      paddingTop: spacing[4],
      paddingBottom: spacing[8],
    },
    titleBlock: {
      marginBottom: spacing[8],
    },
    title: {
      color: theme.ink,
      fontSize: 24,
      fontWeight: '700',
      marginBottom: spacing[1],
    },
    subtitle: {
      color: theme.inkMuted,
      fontSize: 14,
    },

    docsWrap: {
      gap: spacing[4],
      marginBottom: spacing[8],
    },
    docBlock: {
      gap: spacing[2],
    },
    docLabel: {
      color: theme.ink,
      fontSize: 14,
      fontWeight: '600',
    },
    docDesc: {
      color: theme.inkMuted,
      fontSize: 12,
      marginBottom: spacing[1],
    },

    // Uploaded preview
    previewWrap: {
      borderRadius: radius.xl,
      overflow: 'hidden',
      borderWidth: 1.5,
      borderColor: theme.primary,
    },
    previewImage: {
      width: '100%',
      height: 140,
    },
    removeBtn: {
      position: 'absolute',
      top: spacing[2],
      right: spacing[2],
      width: 32,
      height: 32,
      borderRadius: radius.full,
      backgroundColor: theme.error,
      alignItems: 'center',
      justifyContent: 'center',
    },

    // Upload dropzone
    dropzone: {
      borderWidth: 1.5,
      borderColor: theme.hair,
      borderStyle: 'dashed',
      borderRadius: radius.xl,
      height: 120,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: theme.surface,
      gap: spacing[2],
    },
    uploadIconBubble: {
      width: 40,
      height: 40,
      borderRadius: radius.full,
      backgroundColor: theme.primaryMuted,
      alignItems: 'center',
      justifyContent: 'center',
    },
    uploadCta: {
      color: theme.primary,
      fontSize: 14,
      fontWeight: '600',
    },
    uploadHint: {
      color: theme.inkFaint,
      fontSize: 12,
    },
  });
