import { useColorScheme } from 'react-native';
import { darkTheme, lightTheme, type Theme } from '@/constants/colors';
import { useThemeStore, type ThemeMode } from '@/store/theme.store';

export interface UseThemeResult {
  theme: Theme;
  mode: ThemeMode;
  isDark: boolean;
  setMode: (mode: ThemeMode) => void;
}

export function useTheme(): UseThemeResult {
  const mode = useThemeStore((s) => s.mode);
  const setMode = useThemeStore((s) => s.setMode);
  const systemScheme = useColorScheme();

  const resolved: 'light' | 'dark' =
    mode === 'system' ? (systemScheme === 'dark' ? 'dark' : 'light') : mode;

  const theme = resolved === 'dark' ? darkTheme : lightTheme;

  return { theme, mode, isDark: resolved === 'dark', setMode };
}

export default useTheme;
