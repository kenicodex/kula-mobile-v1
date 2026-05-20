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
    backBtn: {
      width: 36,
      height: 36,
      borderRadius: radius.full,
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
    headerIconBtn: {
      width: 36,
      height: 36,
      alignItems: 'center',
      justifyContent: 'center',
    },
    scrollContent: {
      padding: spacing[4],
      paddingBottom: spacing[8],
    },
    periodSwitcher: {
      backgroundColor: theme.surface,
      borderRadius: radius['2xl'],
      borderWidth: 1,
      borderColor: theme.hair,
      padding: spacing[1],
      flexDirection: 'row',
    },
    periodOption: {
      flex: 1,
      paddingVertical: spacing[2],
      borderRadius: radius.xl,
      alignItems: 'center',
    },
    periodOptionActive: {
      backgroundColor: theme.card,
    },
    periodOptionShadow: {
      shadowColor: theme.black,
      shadowOpacity: 0.06,
      shadowOffset: { width: 0, height: 1 },
      shadowRadius: 3,
      elevation: 1,
    },
    periodText: {
      fontSize: 12,
    },
    periodTextActive: {
      color: theme.ink,
      fontWeight: '700',
    },
    periodTextInactive: {
      color: theme.inkMuted,
    },
    revenueCard: {
      backgroundColor: theme.primary,
      borderRadius: radius['3xl'],
      padding: spacing[5],
      marginTop: spacing[4],
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
    revenueStatsRow: {
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
    payoutBtn: {
      backgroundColor: theme.card,
      borderRadius: radius.full,
      paddingHorizontal: spacing[4],
      alignSelf: 'flex-start',
      paddingVertical: spacing[2],
    },
    payoutText: {
      color: theme.primary,
      fontSize: 12,
      fontWeight: '700',
    },
    periodTotal: {
      color: theme.ink,
      fontSize: 14,
      fontWeight: '600',
      marginTop: spacing[4],
    },
    periodTotalAmount: {
      color: theme.primary,
    },
    recentTitle: {
      color: theme.ink,
      fontSize: 16,
      fontWeight: '700',
      marginTop: spacing[6],
      marginBottom: spacing[2],
    },
    txCard: {
      backgroundColor: theme.card,
      borderRadius: radius['2xl'],
      borderWidth: 1,
      borderColor: theme.hair,
      overflow: 'hidden',
    },
    txEmpty: {
      paddingVertical: spacing[8],
      alignItems: 'center',
    },
    txEmptyText: {
      color: theme.inkMuted,
      fontSize: 12,
    },
    txRow: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: spacing[3.5],
    },
    txRowDivider: {
      borderBottomWidth: 1,
      borderBottomColor: theme.hair,
    },
    txIconWrap: {
      width: 40,
      height: 40,
      borderRadius: radius.full,
      alignItems: 'center',
      justifyContent: 'center',
    },
    txBody: {
      flex: 1,
      marginLeft: spacing[3],
    },
    txLabel: {
      color: theme.ink,
      fontSize: 13,
      fontWeight: '600',
    },
    txDate: {
      color: theme.inkMuted,
      fontSize: 11,
    },
    txAmount: {
      fontSize: 13,
      fontWeight: '700',
    },
  });
