import React, { ReactNode } from 'react';
import { ScrollView, StyleProp, View, ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useStyles } from '@/hooks/useStyles';
import { useTheme } from '@/hooks/useTheme';
import { makeStyles } from './ScreenWrapper.styles';

type StatusBarStyle = 'light' | 'dark' | 'auto';

interface ScreenWrapperProps {
  children: ReactNode;
  bg?: string;
  statusBarStyle?: StatusBarStyle;
  scrollable?: boolean;
  style?: StyleProp<ViewStyle>;
  edges?: ('top' | 'bottom' | 'left' | 'right')[];
}

export function ScreenWrapper({
  children,
  bg,
  statusBarStyle,
  scrollable = false,
  style,
  edges = ['top', 'bottom'],
}: ScreenWrapperProps) {
  const { theme } = useTheme();
  const styles = useStyles(makeStyles);
  const backgroundColor = bg ?? theme.background;
  const resolvedStatusBarStyle = statusBarStyle ?? (theme.isDark ? 'light' : 'dark');
  return (
    <SafeAreaView style={[styles.flex1, { backgroundColor }]} edges={edges}>
      <StatusBar style={resolvedStatusBarStyle} />

      {scrollable ? (
        <ScrollView
          style={[styles.flex1, { backgroundColor }, style]}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {children}
        </ScrollView>
      ) : (
        <View style={[styles.flex1, { backgroundColor }, style]}>
          {children}
        </View>
      )}
    </SafeAreaView>
  );
}

export default ScreenWrapper;
