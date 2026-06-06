import { StyleSheet } from 'react-native';
import type { Theme } from '@/constants/colors';
import { radius, spacing } from '@/constants/commonStyles';

export const makeStyles = (theme: Theme) =>
  StyleSheet.create({
    body: {
      flex: 1,
      paddingHorizontal: spacing[6],
      paddingTop: spacing[4],
      paddingBottom: spacing[8],
    },
    titleBlock: {
      marginBottom: spacing[8],
    },
    title: {
      color: theme.ink,
      fontSize: 24,
      fontWeight: '700',
      marginBottom: spacing[1],
    },
    subtitle: {
      color: theme.inkMuted,
      fontSize: 14,
    },

    // Day toggles
    section: {
      marginBottom: spacing[8],
    },
    sectionTitle: {
      color: theme.ink,
      fontSize: 16,
      fontWeight: '600',
      marginBottom: spacing[3],
    },
    sectionTitleLg: {
      color: theme.ink,
      fontSize: 16,
      fontWeight: '600',
      marginBottom: spacing[4],
    },
    daysRow: {
      flexDirection: 'row',
      gap: spacing[2],
      flexWrap: 'wrap',
    },
    dayBtn: {
      width: 44,
      height: 44,
      borderRadius: radius.lg,
      borderWidth: 2,
      alignItems: 'center',
      justifyContent: 'center',
    },
    dayBtnActive: {
      borderColor: theme.primary,
      backgroundColor: theme.primary,
    },
    dayBtnInactive: {
      borderColor: theme.hair,
      backgroundColor: theme.card,
    },
    dayLabelActive: {
      color: theme.white,
      fontSize: 12,
      fontWeight: '600',
    },
    dayLabelInactive: {
      color: theme.inkLight,
      fontSize: 12,
      fontWeight: '600',
    },

    // Time row
    timeRow: {
      flexDirection: 'row',
    },
    timeDivider: {
      width: 1,
      backgroundColor: theme.hair,
      marginHorizontal: spacing[4],
    },
    errorText: {
      color: theme.error,
      fontSize: 12,
      marginTop: spacing[2],
    },

    // Time stepper
    stepperWrap: {
      flex: 1,
      alignItems: 'center',
      gap: spacing[2],
    },
    stepperLabel: {
      color: theme.inkMuted,
      fontSize: 12,
    },
    stepperRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing[3],
    },
    stepperBtn: {
      width: 36,
      height: 36,
      borderRadius: radius.full,
      backgroundColor: theme.hair,
      alignItems: 'center',
      justifyContent: 'center',
    },
    stepperValue: {
      color: theme.ink,
      fontSize: 18,
      fontWeight: '700',
      width: 64,
      textAlign: 'center',
    },
  });
