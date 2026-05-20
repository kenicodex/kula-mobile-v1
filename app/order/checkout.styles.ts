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
    topRightSpacer: { width: 36 },
    scrollContent: {
      padding: spacing[4],
      paddingBottom: spacing[6],
    },
    card: {
      backgroundColor: theme.card,
      borderRadius: radius['2xl'],
      borderWidth: 1,
      borderColor: theme.hair,
      padding: spacing[4],
    },
    cardSpaced: {
      backgroundColor: theme.card,
      borderRadius: radius['2xl'],
      borderWidth: 1,
      borderColor: theme.hair,
      padding: spacing[4],
      marginTop: spacing[3],
    },
    sectionTitle: {
      color: theme.ink,
      fontSize: 16,
      fontWeight: '700',
      marginBottom: spacing[2],
    },
    itemRow: {
      flexDirection: 'row',
      paddingVertical: spacing[1.5],
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
    fulfillmentRow: {
      flexDirection: 'row',
      gap: spacing[2],
      marginTop: spacing[1],
    },
    fulfillmentOption: {
      flex: 1,
      paddingVertical: spacing[3],
      borderRadius: radius.xl,
      borderWidth: 1,
      alignItems: 'center',
    },
    fulfillmentActive: {
      backgroundColor: theme.primaryMuted,
      borderColor: theme.primary,
    },
    fulfillmentInactive: {
      backgroundColor: theme.surface,
      borderColor: theme.hair,
    },
    fulfillmentLabel: {
      marginTop: spacing[1],
      fontSize: 13,
      fontWeight: '600',
    },
    fulfillmentLabelActive: {
      color: theme.primary,
    },
    fulfillmentLabelInactive: {
      color: theme.inkLight,
    },
    totalsDivider: {
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
    footer: {
      backgroundColor: theme.card,
      borderTopWidth: 1,
      borderTopColor: theme.hair,
      paddingHorizontal: spacing[6],
      paddingVertical: spacing[3],
      paddingBottom: spacing[4],
    },
  });
