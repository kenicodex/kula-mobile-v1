import { StyleSheet } from 'react-native';
import type { Theme } from '@/constants/colors';
import { radius, spacing } from '@/constants/commonStyles';

export const makeStyles = (theme: Theme) =>
  StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: theme.surface,
    },
    topBar: {
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
      borderRadius: radius.full,
      backgroundColor: theme.surface,
      borderWidth: 1,
      borderColor: theme.hair,
      alignItems: 'center',
      justifyContent: 'center',
    },
    topTitle: {
      flex: 1,
      textAlign: 'center',
      color: theme.ink,
      fontSize: 16,
      fontWeight: '700',
    },
    topRightSpacer: {
      width: 36,
    },
    scrollContent: {
      padding: spacing[4],
      paddingBottom: 100,
    },
    statusBanner: {
      backgroundColor: theme.primaryMuted,
      borderRadius: radius['2xl'],
      borderWidth: 1,
      borderColor: 'rgba(232,104,26,0.3)',
      padding: spacing[4],
      flexDirection: 'row',
      alignItems: 'center',
    },
    statusIconWrap: {
      width: 40,
      height: 40,
      borderRadius: radius.full,
      backgroundColor: theme.primary,
      alignItems: 'center',
      justifyContent: 'center',
    },
    statusBody: {
      marginLeft: spacing[3],
      flex: 1,
    },
    statusTitle: {
      color: theme.primary,
      fontSize: 13,
      fontWeight: '700',
    },
    statusSubtitle: {
      color: theme.primary,
      fontSize: 12,
    },
    chefCard: {
      backgroundColor: theme.card,
      borderRadius: radius['2xl'],
      borderWidth: 1,
      borderColor: theme.hair,
      padding: spacing[3.5],
      marginTop: spacing[3],
      flexDirection: 'row',
      alignItems: 'center',
    },
    chefBody: {
      flex: 1,
      marginLeft: spacing[3],
    },
    chefName: {
      color: theme.ink,
      fontSize: 14,
      fontWeight: '700',
    },
    chefMeta: {
      color: theme.inkMuted,
      fontSize: 12,
    },
    chatButton: {
      width: 36,
      height: 36,
      borderRadius: radius.full,
      backgroundColor: theme.primaryMuted,
      alignItems: 'center',
      justifyContent: 'center',
    },
    progressCard: {
      backgroundColor: theme.card,
      borderRadius: radius['2xl'],
      borderWidth: 1,
      borderColor: theme.hair,
      padding: spacing[4],
      marginTop: spacing[3],
    },
    progressTitle: {
      color: theme.ink,
      fontSize: 16,
      fontWeight: '700',
      marginBottom: spacing[3],
    },
    stepRow: {
      flexDirection: 'row',
      marginBottom: spacing[3],
    },
    stepIndicatorCol: {
      alignItems: 'center',
    },
    stepCircle: {
      width: 28,
      height: 28,
      borderRadius: radius.full,
      alignItems: 'center',
      justifyContent: 'center',
    },
    stepCircleDone: {
      backgroundColor: theme.primary,
    },
    stepCirclePending: {
      backgroundColor: theme.hair,
    },
    stepNumber: {
      color: theme.inkMuted,
      fontSize: 12,
      fontWeight: '700',
    },
    stepConnector: {
      width: 2,
      height: 20,
    },
    stepConnectorDone: {
      backgroundColor: theme.primary,
    },
    stepConnectorPending: {
      backgroundColor: theme.hair,
    },
    stepBody: {
      marginLeft: spacing[3],
      flex: 1,
    },
    stepLabel: {
      fontSize: 14,
    },
    stepLabelCurrent: {
      color: theme.primary,
      fontWeight: '600',
    },
    stepLabelDone: {
      color: theme.ink,
    },
    stepLabelPending: {
      color: theme.inkMuted,
    },
    stepTime: {
      color: theme.inkMuted,
      fontSize: 12,
      marginTop: 2,
    },
    groceryCard: {
      backgroundColor: theme.card,
      borderRadius: radius['2xl'],
      borderWidth: 1,
      borderColor: theme.hair,
      padding: spacing[4],
      marginTop: spacing[3],
      flexDirection: 'row',
      alignItems: 'center',
    },
    groceryIconWrap: {
      width: 40,
      height: 40,
      borderRadius: radius.xl,
      backgroundColor: theme.primaryMuted,
      alignItems: 'center',
      justifyContent: 'center',
    },
    groceryBody: {
      flex: 1,
      marginLeft: spacing[3],
    },
    groceryTitle: {
      color: theme.ink,
      fontSize: 14,
      fontWeight: '700',
    },
    grocerySubtitle: {
      color: theme.inkMuted,
      fontSize: 12,
    },
    footer: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: theme.card,
      borderTopWidth: 1,
      borderTopColor: theme.hair,
      paddingHorizontal: spacing[4],
      paddingVertical: spacing[3],
      paddingBottom: spacing[4],
    },
  });
