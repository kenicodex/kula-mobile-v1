import { StyleSheet } from 'react-native';
import type { Theme } from '@/constants/colors';
import { radius, spacing } from '@/constants/commonStyles';

export const makeStyles = (theme: Theme) =>
  StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: theme.card,
    },
    scrollContent: {
      padding: spacing[6],
      paddingBottom: spacing[10],
    },
    creatorCard: {
      backgroundColor: theme.surface,
      borderRadius: radius['2xl'],
      borderWidth: 1,
      borderColor: theme.hair,
      padding: spacing[3.5],
      flexDirection: 'row',
      alignItems: 'center',
    },
    creatorBody: {
      marginLeft: spacing[3],
      flex: 1,
    },
    creatorNameRow: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    creatorName: {
      color: theme.ink,
      fontSize: 14,
      fontWeight: '700',
    },
    creatorIconSpacer: { marginLeft: 4 },
    creatorCuisine: {
      color: theme.inkMuted,
      fontSize: 12,
    },
    ratingRow: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    ratingText: {
      marginLeft: 2,
      color: theme.inkLight,
      fontSize: 12,
      fontWeight: '600',
    },
    sectionTitle: {
      color: theme.ink,
      fontSize: 20,
      fontWeight: '700',
      marginTop: spacing[7],
    },
    sectionSubtitle: {
      color: theme.inkMuted,
      fontSize: 13,
      marginTop: spacing[1],
    },
    servicesList: {
      marginTop: spacing[4],
      gap: spacing[2.5],
    },
    serviceCard: {
      borderRadius: radius['2xl'],
      padding: spacing[4],
      flexDirection: 'row',
      alignItems: 'center',
    },
    serviceCardSelected: {
      backgroundColor: theme.primaryMuted,
      borderWidth: 1.5,
      borderColor: theme.primary,
    },
    serviceCardDefault: {
      backgroundColor: theme.card,
      borderWidth: 1,
      borderColor: theme.hair,
    },
    serviceIconWrap: {
      width: 44,
      height: 44,
      borderRadius: radius.xl,
      alignItems: 'center',
      justifyContent: 'center',
    },
    serviceIconWrapSelected: {
      backgroundColor: theme.primary,
    },
    serviceIconWrapDefault: {
      backgroundColor: theme.surface,
    },
    serviceBody: {
      flex: 1,
      marginLeft: spacing[3],
    },
    serviceName: {
      color: theme.ink,
      fontSize: 14,
      fontWeight: '600',
    },
    serviceDescription: {
      color: theme.inkMuted,
      fontSize: 12,
      marginTop: 2,
    },
    servicePriceWrap: {
      alignItems: 'flex-end',
    },
    servicePrice: {
      color: theme.primary,
      fontSize: 13,
      fontWeight: '700',
    },
    footer: {
      backgroundColor: theme.card,
      borderTopWidth: 1,
      borderTopColor: theme.hair,
      paddingHorizontal: spacing[6],
      paddingVertical: spacing[3.5],
      paddingBottom: spacing[4],
    },
  });
