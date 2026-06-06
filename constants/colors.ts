// Design tokens for Kula Mobile

// Theme-independent: like buttons stay the same red across light/dark, matching
// the universal "love/like" affordance used by Instagram, X, etc.
export const LIKE_RED = '#FF3040';

export interface Theme {
  primary: string;
  primaryDeep: string;
  primaryLight: string;
  primaryMuted: string;

  ink: string;
  inkLight: string;
  inkMuted: string;
  inkFaint: string;

  surface: string;
  card: string;
  hair: string;

  success: string;
  error: string;
  warning: string;

  white: string;
  black: string;

  background: string;
  border: string;
  text: string;
  textMuted: string;
  textLight: string;

  tabActive: string;
  tabInactive: string;
  tabBackground: string;

  isDark: boolean;
}

export const lightTheme: Theme = {
  primary: '#E8681A',
  primaryDeep: '#C2541A',
  primaryLight: '#F28C4A',
  primaryMuted: '#FDE8D8',

  ink: '#1A1A2E',
  inkLight: '#4A4A6A',
  inkMuted: '#8A8AA0',
  inkFaint: '#B8B5BF',

  surface: '#FAF7F1',
  card: '#FFFFFF',
  hair: '#ECE6D9',

  success: '#2E8056',
  error: '#C84A3A',
  warning: '#D9962A',

  white: '#FFFFFF',
  black: '#000000',

  background: '#FAF7F1',
  border: '#ECE6D9',
  text: '#1A1A2E',
  textMuted: '#8A8AA0',
  textLight: '#4A4A6A',

  tabActive: '#E8681A',
  tabInactive: '#B8B5BF',
  tabBackground: '#FFFFFF',

  isDark: false,
};

export const darkTheme: Theme = {
  primary: '#F2792B',
  primaryDeep: '#E8681A',
  primaryLight: '#FFA770',
  primaryMuted: '#3A2615',

  ink: '#F2F0F4',
  inkLight: '#C8C5D0',
  inkMuted: '#8C8998',
  inkFaint: '#5E5B6A',

  surface: '#15131A',
  card: '#1F1D26',
  hair: '#2E2B36',

  success: '#3DB07A',
  error: '#E66555',
  warning: '#E5A23E',

  white: '#FFFFFF',
  black: '#000000',

  background: '#15131A',
  border: '#2E2B36',
  text: '#F2F0F4',
  textMuted: '#8C8998',
  textLight: '#C8C5D0',

  tabActive: '#F2792B',
  tabInactive: '#5E5B6A',
  tabBackground: '#1F1D26',

  isDark: true,
};

export type ColorKey = keyof Theme;

// Deprecated: prefer useTheme() / useStyles(makeStyles). Kept as light-theme alias
// so any straggling imports still compile during migration.
export const Colors = lightTheme;
export default Colors;
