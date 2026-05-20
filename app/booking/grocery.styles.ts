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
    banner: {
      backgroundColor: theme.primaryMuted,
      borderRadius: radius['2xl'],
      borderWidth: 1,
      borderColor: 'rgba(232,104,26,0.3)',
      padding: spacing[3.5],
      flexDirection: 'row',
      alignItems: 'flex-start',
    },
    bannerText: {
      flex: 1,
      marginLeft: spacing[2],
      color: theme.primary,
      fontSize: 13,
      lineHeight: 20,
    },
    itemsCard: {
      backgroundColor: theme.card,
      borderRadius: radius['2xl'],
      borderWidth: 1,
      borderColor: theme.hair,
      marginTop: spacing[4],
      overflow: 'hidden',
    },
    itemRow: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: spacing[3.5],
    },
    itemRowDivider: {
      borderBottomWidth: 1,
      borderBottomColor: theme.hair,
    },
    checkbox: {
      width: 24,
      height: 24,
      borderRadius: radius.md,
      borderWidth: 2,
      alignItems: 'center',
      justifyContent: 'center',
    },
    checkboxOn: {
      backgroundColor: theme.primary,
      borderColor: theme.primary,
    },
    checkboxOff: {
      borderColor: theme.hair,
    },
    itemBody: {
      flex: 1,
      marginLeft: spacing[3],
    },
    itemName: {
      fontSize: 13,
    },
    itemNameOn: {
      color: theme.ink,
    },
    itemNameOff: {
      color: theme.inkMuted,
    },
    itemQty: {
      color: theme.inkMuted,
      fontSize: 11,
    },
    itemPrice: {
      fontSize: 13,
      fontWeight: '700',
    },
    itemPriceOn: {
      color: theme.ink,
    },
    itemPriceOff: {
      color: theme.inkMuted,
    },
    totalCard: {
      backgroundColor: theme.card,
      borderRadius: radius['2xl'],
      borderWidth: 1,
      borderColor: theme.hair,
      padding: spacing[4],
      marginTop: spacing[4],
    },
    totalRow: {
      flexDirection: 'row',
    },
    totalLabel: {
      flex: 1,
      color: theme.ink,
      fontSize: 14,
      fontWeight: '700',
    },
    totalValue: {
      color: theme.primary,
      fontSize: 16,
      fontWeight: '700',
    },
    totalSubtext: {
      color: theme.inkMuted,
      fontSize: 12,
      marginTop: spacing[1],
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
