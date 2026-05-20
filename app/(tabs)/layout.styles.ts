import { Platform, StyleSheet } from 'react-native';
import type { Theme } from '@/constants/colors';

export const makeStyles = (_theme: Theme) =>
  StyleSheet.create({
    tabIconWrap: {
      alignItems: 'center',
      justifyContent: 'center',
    },
  });

export const makeTabBarStyle = (theme: Theme) => ({
  backgroundColor: theme.tabBackground,
  borderTopColor: theme.hair,
  borderTopWidth: 1,
  height: Platform.OS === 'ios' ? 84 : 65,
  paddingBottom: Platform.OS === 'ios' ? 28 : 10,
  paddingTop: 8,
  shadowColor: '#000',
  shadowOffset: { width: 0, height: -3 },
  shadowOpacity: theme.isDark ? 0.3 : 0.06,
  shadowRadius: 8,
  elevation: 8,
});

export const tabBarLabelStyle = {
  fontSize: 11,
  marginTop: 2,
};
