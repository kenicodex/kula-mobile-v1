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
    headerTitle: {
      flex: 1,
      textAlign: 'center',
      color: theme.ink,
      fontSize: 16,
      fontWeight: '700',
    },
    headerSpacer: {
      width: 36,
    },
    scrollContent: {
      padding: spacing[4],
      gap: spacing[3],
    },
    statsRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: spacing[3],
    },
    statCard: {
      width: '47%',
      backgroundColor: theme.card,
      borderRadius: radius['2xl'],
      borderWidth: 1,
      borderColor: theme.hair,
      padding: spacing[4],
    },
    statLabel: {
      color: theme.inkMuted,
      fontSize: 12,
    },
    statValue: {
      color: theme.ink,
      fontSize: 24,
      fontWeight: '700',
      marginTop: spacing[1],
    },
    statDeltaRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: spacing[1],
    },
    statDelta: {
      fontSize: 11,
      marginLeft: 2,
      fontWeight: '600',
    },
    card: {
      backgroundColor: theme.card,
      borderRadius: radius['2xl'],
      borderWidth: 1,
      borderColor: theme.hair,
      padding: spacing[4],
    },
    cardTitle: {
      color: theme.ink,
      fontSize: 16,
      fontWeight: '700',
      marginBottom: spacing[2],
    },
    cardBody: {
      color: theme.inkLight,
      fontSize: 14,
      lineHeight: 20,
    },
    audienceRow: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: spacing[1.5],
    },
    audienceLabel: {
      width: 112,
      color: theme.inkLight,
      fontSize: 13,
    },
    audienceTrack: {
      flex: 1,
      height: 8,
      backgroundColor: theme.hair,
      borderRadius: 999,
      overflow: 'hidden',
    },
    audienceFill: {
      height: 8,
      backgroundColor: theme.primary,
    },
    audienceValue: {
      marginLeft: spacing[2],
      color: theme.ink,
      fontSize: 13,
      fontWeight: '700',
      width: 48,
      textAlign: 'right',
    },
  });
