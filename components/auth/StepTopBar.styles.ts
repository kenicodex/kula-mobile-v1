import { StyleSheet } from 'react-native';
import type { Theme } from '@/constants/colors';
import { spacing } from '@/constants/commonStyles';

export const makeStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: spacing[4],
      paddingVertical: spacing[3],
      gap: spacing[3],
    },
    backBtn: {
      width: 36,
      height: 36,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 999,
      backgroundColor: theme.surface,
    },
    backBtnHidden: { opacity: 0 },
    stepsRow: {
      flex: 1,
      flexDirection: 'row',
      gap: spacing[1.5],
    },
    stepBar: {
      flex: 1,
      height: 4,
      borderRadius: 2,
    },
    stepBarFilled: { backgroundColor: theme.primary },
    stepBarEmpty: { backgroundColor: theme.hair },
  });
