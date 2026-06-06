import { StyleSheet } from 'react-native';
import type { Theme } from '@/constants/colors';
import { radius, spacing } from '@/constants/commonStyles';

export const makeStyles = (theme: Theme) =>
  StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: theme.surface,
    },
    centeredFill: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    scrollContent: {
      padding: spacing[4],
      paddingBottom: 100,
    },
    progressCard: {
      backgroundColor: theme.card,
      borderRadius: radius['2xl'],
      borderWidth: 1,
      borderColor: theme.hair,
      padding: spacing[5],
    },
    progressHeader: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    progressOrderId: {
      flex: 1,
      color: theme.ink,
      fontSize: 14,
      fontWeight: '700',
    },
    statusPill: {
      backgroundColor: theme.primaryMuted,
      borderRadius: radius.full,
      paddingHorizontal: spacing[2.5],
      paddingVertical: spacing[1],
    },
    statusPillText: {
      color: theme.primary,
      fontSize: 12,
      fontWeight: '600',
      textTransform: 'capitalize',
    },
    stepsList: {
      marginTop: spacing[5],
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
      height: 16,
    },
    stepConnectorDone: {
      backgroundColor: theme.primary,
    },
    stepConnectorPending: {
      backgroundColor: theme.hair,
    },
    stepLabel: {
      marginLeft: spacing[3],
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
    creatorCard: {
      backgroundColor: theme.card,
      borderRadius: radius['2xl'],
      borderWidth: 1,
      borderColor: theme.hair,
      padding: spacing[3.5],
      marginTop: spacing[3],
      flexDirection: 'row',
      alignItems: 'center',
    },
    creatorBody: {
      flex: 1,
      marginLeft: spacing[3],
    },
    creatorName: {
      color: theme.ink,
      fontSize: 14,
      fontWeight: '700',
    },
    creatorCuisine: {
      color: theme.inkMuted,
      fontSize: 12,
    },
    itemsCard: {
      backgroundColor: theme.card,
      borderRadius: radius['2xl'],
      borderWidth: 1,
      borderColor: theme.hair,
      padding: spacing[4],
      marginTop: spacing[3],
    },
    itemsTitle: {
      color: theme.ink,
      fontSize: 16,
      fontWeight: '700',
      marginBottom: spacing[2],
    },
    divider: {
      height: 1,
      backgroundColor: theme.hair,
      marginVertical: spacing[2],
    },
    row: {
      flexDirection: 'row',
      paddingVertical: spacing[1],
    },
    rowLabel: {
      flex: 1,
      color: theme.inkMuted,
      fontSize: 13,
    },
    rowValue: {
      fontSize: 13,
    },
    rowValueDefault: {
      color: theme.inkLight,
      fontWeight: '600',
    },
    rowValueBold: {
      color: theme.ink,
      fontWeight: '700',
    },
    itemRow: {
      flexDirection: 'row',
      paddingVertical: spacing[1],
    },
    itemName: {
      color: theme.ink,
      fontSize: 13,
      flex: 1,
    },
    itemPrice: {
      color: theme.inkLight,
      fontSize: 13,
      fontWeight: '600',
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
    footerRow: {
      flexDirection: 'row',
      gap: spacing[2],
    },
    footerCol: { flex: 1 },
  });
