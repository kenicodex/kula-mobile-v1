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
    avatarSection: {
      alignItems: 'center',
      marginBottom: spacing[8],
    },
    avatarWrap: {
      position: 'relative',
    },
    avatarCircle: {
      width: 96,
      height: 96,
      borderRadius: radius.full,
      overflow: 'hidden',
      backgroundColor: theme.primaryMuted,
      alignItems: 'center',
      justifyContent: 'center',
    },
    avatarImage: {
      width: 96,
      height: 96,
      borderRadius: 48,
    },
    cameraBadge: {
      position: 'absolute',
      bottom: 0,
      right: 0,
      width: 32,
      height: 32,
      borderRadius: radius.full,
      backgroundColor: theme.primary,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 2,
      borderColor: theme.card,
    },
    uploadLink: {
      marginTop: spacing[2],
    },
    uploadText: {
      color: theme.primary,
      fontSize: 14,
      fontWeight: '600',
    },
    ctaWrap: {
      marginTop: 'auto',
      paddingTop: spacing[4],
    },
  });
