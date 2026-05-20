import { StyleSheet } from 'react-native';
import type { Theme } from '@/constants/colors';
import { spacing } from '@/constants/commonStyles';

export type ChipSize = 'sm' | 'md';

export const makeStyles = (theme: Theme) =>
  StyleSheet.create({
    base: {
      flexDirection: 'row',
      alignItems: 'center',
      borderWidth: 1.5,
      borderRadius: 999,
    },
    paddingSm: {
      paddingHorizontal: spacing[3],
      paddingVertical: spacing[1],
    },
    paddingMd: {
      paddingHorizontal: spacing[4],
      paddingVertical: spacing[2],
    },
    textSm: { fontSize: 12, fontWeight: '600' },
    textMd: { fontSize: 14, fontWeight: '600' },
    textSelected: { color: theme.white },
    textUnselected: { color: theme.inkLight },
  });
