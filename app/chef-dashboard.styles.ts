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
      paddingHorizontal: spacing[4],
      paddingVertical: spacing[3],
    },
    headerBody: {
      marginLeft: spacing[2.5],
      flex: 1,
    },
    greeting: {
      color: theme.ink,
      fontSize: 13,
      fontWeight: '600',
    },
    roleLabel: {
      color: theme.inkMuted,
      fontSize: 11,
    },
    scrollContent: {
      padding: spacing[4],
      paddingBottom: spacing[8],
    },
    completeProfileCard: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.primaryMuted,
      borderRadius: radius['2xl'],
      borderWidth: 1,
      borderColor: theme.primary,
      padding: spacing[3.5],
      marginBottom: spacing[4],
      gap: spacing[3],
    },
    completeProfileIcon: {
      width: 40,
      height: 40,
      borderRadius: radius.full,
      backgroundColor: theme.card,
      alignItems: 'center',
      justifyContent: 'center',
    },
    completeProfileBody: {
      flex: 1,
    },
    completeProfileTitle: {
      color: theme.ink,
      fontSize: 14,
      fontWeight: '700',
    },
    completeProfileSubtitle: {
      color: theme.inkLight,
      fontSize: 12,
      marginTop: 2,
      lineHeight: 16,
    },
    revenueCard: {
      backgroundColor: theme.primary,
      borderRadius: radius['3xl'],
      padding: spacing[5],
    },
    revenueLabel: {
      color: 'rgba(255,255,255,0.8)',
      fontSize: 13,
    },
    revenueAmount: {
      color: theme.white,
      fontSize: 30,
      fontWeight: '700',
      marginTop: spacing[1],
    },
    statsRow: {
      flexDirection: 'row',
      marginTop: spacing[4],
      gap: spacing[3],
    },
    statCol: {
      flex: 1,
    },
    statValue: {
      color: theme.white,
      fontSize: 16,
      fontWeight: '700',
    },
    statLabel: {
      color: 'rgba(255,255,255,0.8)',
      fontSize: 11,
    },
    quickActionsRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      marginTop: spacing[4],
      gap: 10,
    },
    quickAction: {
      width: '47%',
      backgroundColor: theme.card,
      borderRadius: radius['2xl'],
      borderWidth: 1,
      borderColor: theme.hair,
      padding: spacing[4],
      alignItems: 'flex-start',
    },
    quickActionIcon: {
      width: 40,
      height: 40,
      borderRadius: radius.lg,
      backgroundColor: theme.primaryMuted,
      alignItems: 'center',
      justifyContent: 'center',
    },
    quickActionLabel: {
      color: theme.ink,
      fontSize: 14,
      fontWeight: '700',
      marginTop: spacing[2],
    },
    pendingHeaderRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: spacing[6],
      marginBottom: spacing[2],
    },
    pendingHeaderTitle: {
      flex: 1,
      color: theme.ink,
      fontSize: 16,
      fontWeight: '700',
    },
    pendingSeeAll: {
      color: theme.primary,
      fontSize: 12,
      fontWeight: '600',
    },
    pendingList: {
      gap: 10,
    },
    pendingEmpty: {
      color: theme.inkMuted,
      fontSize: 12,
      textAlign: 'center',
      paddingVertical: spacing[4],
    },
    pendingCard: {
      backgroundColor: theme.card,
      borderRadius: radius['2xl'],
      borderWidth: 1,
      borderColor: theme.hair,
      padding: spacing[3.5],
      flexDirection: 'row',
      alignItems: 'center',
    },
    pendingCardBody: {
      flex: 1,
      marginLeft: spacing[3],
    },
    pendingClient: {
      color: theme.ink,
      fontSize: 14,
      fontWeight: '700',
    },
    pendingService: {
      color: theme.inkLight,
      fontSize: 12,
      textTransform: 'capitalize',
    },
    pendingDate: {
      color: theme.inkMuted,
      fontSize: 11,
      marginTop: 2,
    },
    pendingPill: {
      backgroundColor: '#FBF1DA',
      borderRadius: radius.full,
      paddingHorizontal: spacing[2.5],
      paddingVertical: spacing[1],
    },
    pendingPillText: {
      color: theme.warning,
      fontSize: 11,
      fontWeight: '700',
    },
  });
