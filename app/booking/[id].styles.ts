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
    topActionButton: {
      width: 36,
      height: 36,
      alignItems: 'center',
      justifyContent: 'center',
    },
    centeredFill: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    scrollContent: {
      padding: spacing[4],
      paddingBottom: spacing[6],
    },
    statusBanner: {
      borderRadius: radius['2xl'],
      padding: spacing[3.5],
      flexDirection: 'row',
      alignItems: 'center',
    },
    statusBody: {
      flex: 1,
      marginLeft: spacing[2.5],
    },
    statusTitle: {
      fontSize: 13,
      fontWeight: '700',
    },
    statusSubtitle: {
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
    chefNameRow: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    chefName: {
      color: theme.ink,
      fontSize: 14,
      fontWeight: '700',
    },
    chefIconSpacer: { marginLeft: 4 },
    chefCuisine: {
      color: theme.inkMuted,
      fontSize: 12,
    },
    detailsCard: {
      backgroundColor: theme.card,
      borderRadius: radius['2xl'],
      borderWidth: 1,
      borderColor: theme.hair,
      padding: spacing[4],
      marginTop: spacing[3],
    },
    detailsTitle: {
      color: theme.ink,
      fontSize: 16,
      fontWeight: '700',
      marginBottom: spacing[2.5],
    },
    detailRow: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: spacing[2],
    },
    detailLabel: {
      marginLeft: spacing[2],
      flex: 1,
      color: theme.inkMuted,
      fontSize: 13,
    },
    detailValue: {
      fontSize: 13,
      fontWeight: '600',
      textTransform: 'capitalize',
    },
    actionsRow: {
      flexDirection: 'row',
      gap: spacing[3],
      marginTop: spacing[4],
    },
    actionFlex: { flex: 1 },
  });
