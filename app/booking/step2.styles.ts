import { StyleSheet } from 'react-native';
import type { Theme } from '@/constants/colors';
import { radius, spacing } from '@/constants/commonStyles';

export const makeStyles = (theme: Theme) =>
  StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: theme.card,
    },
    calendarWrap: {
      paddingHorizontal: spacing[5],
      paddingTop: spacing[4],
    },
    monthRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: spacing[3],
    },
    navButton: {
      paddingHorizontal: spacing[3],
      paddingVertical: spacing[1],
    },
    navArrow: {
      color: theme.primary,
      fontSize: 16,
    },
    monthLabel: {
      color: theme.ink,
      fontSize: 16,
      fontWeight: '700',
    },
    weekdayRow: {
      flexDirection: 'row',
      marginBottom: spacing[1],
    },
    weekdayCell: {
      flex: 1,
      alignItems: 'center',
      paddingVertical: spacing[1],
    },
    weekdayText: {
      color: theme.inkMuted,
      fontSize: 12,
    },
    daysGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
    },
    dayCell: {
      width: `${100 / 7}%`,
      aspectRatio: 1,
    },
    dayCellPadded: {
      padding: 2,
    },
    dayInner: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: radius.full,
    },
    dayInnerSelected: {
      backgroundColor: theme.primary,
    },
    dayText: {
      fontSize: 14,
    },
    dayTextPast: {
      color: theme.inkFaint,
    },
    dayTextSelected: {
      color: theme.white,
      fontWeight: '700',
    },
    dayTextDefault: {
      color: theme.ink,
    },
    divider: {
      height: 1,
      backgroundColor: theme.hair,
      marginTop: spacing[4],
    },
    slotsSection: {
      paddingHorizontal: spacing[6],
      paddingTop: spacing[5],
    },
    slotsTitle: {
      color: theme.ink,
      fontSize: 20,
      fontWeight: '700',
    },
    slotsSubtitle: {
      color: theme.inkMuted,
      fontSize: 13,
      marginTop: spacing[1],
    },
    slotsList: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: spacing[2.5],
      marginTop: spacing[4],
    },
    slot: {
      paddingHorizontal: spacing[4],
      paddingVertical: spacing[2.5],
      borderRadius: radius.xl,
      borderWidth: 1,
    },
    slotUnavailable: {
      backgroundColor: theme.surface,
      borderColor: theme.hair,
    },
    slotSelected: {
      backgroundColor: theme.primary,
      borderColor: theme.primary,
    },
    slotDefault: {
      backgroundColor: theme.card,
      borderColor: theme.hair,
    },
    slotText: {
      fontSize: 13,
      fontWeight: '600',
    },
    slotTextUnavailable: {
      color: theme.inkFaint,
    },
    slotTextSelected: {
      color: theme.white,
    },
    slotTextDefault: {
      color: theme.ink,
    },
    bottomSpacer: { height: spacing[6] },
    footer: {
      backgroundColor: theme.card,
      borderTopWidth: 1,
      borderTopColor: theme.hair,
      paddingHorizontal: spacing[6],
      paddingVertical: spacing[3.5],
      paddingBottom: spacing[4],
    },
  });
