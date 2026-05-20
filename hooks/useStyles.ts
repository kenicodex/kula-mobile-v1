import { useMemo } from 'react';
import type { Theme } from '@/constants/colors';
import { useTheme } from './useTheme';

export function useStyles<T>(makeStyles: (theme: Theme) => T): T {
  const { theme } = useTheme();
  return useMemo(() => makeStyles(theme), [makeStyles, theme]);
}

export default useStyles;
