import { StyleSheet } from 'react-native';
import type { Theme } from '@/constants/colors';
import { radius, spacing } from '@/constants/commonStyles';

export const makeStyles = (theme: Theme) =>
  StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: theme.surface,
    },
    header: {
      backgroundColor: theme.card,
      borderBottomWidth: 1,
      borderBottomColor: theme.hair,
      paddingHorizontal: spacing[4],
      paddingVertical: spacing[3],
      flexDirection: 'row',
      alignItems: 'center',
    },
    headerBody: {
      marginLeft: spacing[2.5],
      flex: 1,
    },
    headerGreeting: {
      color: theme.inkMuted,
      fontSize: 11,
    },
    headerName: {
      color: theme.ink,
      fontSize: 16,
      fontWeight: '700',
    },
    headerIconSpacer: {
      marginRight: spacing[3],
    },
    listContent: {
      padding: spacing[4],
      gap: spacing[4],
      paddingBottom: spacing[8],
    },
    cta: {
      backgroundColor: theme.primary,
      borderRadius: radius['2xl'],
      padding: spacing[5],
    },
    ctaTitle: {
      color: theme.white,
      fontSize: 18,
      fontWeight: '700',
    },
    ctaSubtitle: {
      color: 'rgba(255,255,255,0.8)',
      fontSize: 14,
      marginTop: spacing[1],
    },
    ctaActionRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: spacing[3],
    },
    ctaActionText: {
      color: theme.white,
      fontSize: 14,
      fontWeight: '700',
    },
    emptyWrap: {
      paddingVertical: spacing[16],
      alignItems: 'center',
    },
    emptyText: {
      color: theme.inkMuted,
    },
  });
