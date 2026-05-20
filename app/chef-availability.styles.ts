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
    headerSpacer: {
      width: 36,
    },
    scrollContent: {
      padding: spacing[4],
    },
    sectionTitle: {
      color: theme.ink,
      fontSize: 16,
      fontWeight: '700',
    },
    sectionTitleSpaced: {
      marginTop: spacing[6],
    },
    sectionSub: {
      color: theme.inkMuted,
      fontSize: 12,
      marginTop: 2,
    },
    pillsRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: spacing[2],
      marginTop: spacing[3],
    },
    dayPill: {
      paddingHorizontal: spacing[4],
      paddingVertical: spacing[2],
      borderRadius: radius.full,
      borderWidth: 1,
    },
    dayPillOn: {
      backgroundColor: theme.primaryMuted,
      borderColor: theme.primary,
    },
    dayPillOff: {
      backgroundColor: theme.card,
      borderColor: theme.hair,
    },
    dayPillText: {
      fontSize: 12,
      fontWeight: '600',
    },
    dayPillTextOn: {
      color: theme.primary,
    },
    dayPillTextOff: {
      color: theme.inkLight,
    },
    slotPill: {
      paddingHorizontal: spacing[3.5],
      paddingVertical: spacing[2],
      borderRadius: radius.xl,
      borderWidth: 1,
    },
    slotPillOff: {
      backgroundColor: '#F8DCD7',
      borderColor: theme.error,
    },
    slotPillOn: {
      backgroundColor: theme.card,
      borderColor: theme.hair,
    },
    slotPillText: {
      fontSize: 13,
      fontWeight: '600',
    },
    slotPillTextOff: {
      color: theme.error,
    },
    slotPillTextOn: {
      color: theme.ink,
    },
    footer: {
      backgroundColor: theme.card,
      borderTopWidth: 1,
      borderTopColor: theme.hair,
      paddingHorizontal: spacing[6],
      paddingTop: spacing[3.5],
      paddingBottom: spacing[4],
    },
  });
