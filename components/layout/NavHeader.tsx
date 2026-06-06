import React, { ReactNode } from 'react';
import { Pressable, StyleProp, Text, View, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useStyles } from '@/hooks/useStyles';
import { useTheme } from '@/hooks/useTheme';
import { spacing } from '@/constants/commonStyles';
import { makeStyles } from './NavHeader.styles';

type IoniconName = React.ComponentProps<typeof Ionicons>['name'];

export type NavHeaderVariant = 'default' | 'circle';
export type NavHeaderTitleAlign = 'center' | 'start';
export type NavHeaderTitleSize = 'md' | 'lg';

interface NavHeaderAction {
  icon: IoniconName;
  onPress: () => void;
  accessibilityLabel?: string;
}

interface NavHeaderProps {
  title?: string;
  showBack?: boolean;
  onBack?: () => void;
  backVariant?: NavHeaderVariant;
  rightAction?: NavHeaderAction;
  right?: ReactNode;
  titleAlign?: NavHeaderTitleAlign;
  titleSize?: NavHeaderTitleSize;
  flush?: boolean;
  style?: StyleProp<ViewStyle>;
  children?: ReactNode;
}

export function NavHeader({
  title,
  showBack = true,
  onBack,
  backVariant = 'default',
  rightAction,
  right,
  titleAlign = 'center',
  titleSize = 'md',
  flush = false,
  style,
  children,
}: NavHeaderProps) {
  const { theme } = useTheme();
  const styles = useStyles(makeStyles);
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const handleBack = () => {
    if (onBack) return onBack();
    if (router.canGoBack()) router.back();
  };

  const renderLeft = () => {
    if (!showBack) return <View style={styles.side} />;
    return (
      <Pressable
        onPress={handleBack}
        hitSlop={10}
        accessibilityRole="button"
        accessibilityLabel="Go back"
        style={[styles.side, backVariant === 'circle' && styles.backCircle]}
      >
        <Ionicons
          name="chevron-back"
          size={backVariant === 'circle' ? 20 : 24}
          color={theme.ink}
        />
      </Pressable>
    );
  };

  const renderRight = () => {
    if (right) return <View style={styles.side}>{right}</View>;
    if (rightAction) {
      return (
        <Pressable
          onPress={rightAction.onPress}
          hitSlop={10}
          accessibilityRole="button"
          accessibilityLabel={rightAction.accessibilityLabel}
          style={styles.side}
        >
          <Ionicons name={rightAction.icon} size={22} color={theme.ink} />
        </Pressable>
      );
    }
    return <View style={styles.side} />;
  };

  return (
    <View
      style={[
        styles.container,
        { paddingTop: insets.top + spacing[2] },
        flush && styles.containerFlush,
        style,
      ]}
    >
      <View style={styles.row}>
        {renderLeft()}
        {title ? (
          <Text
            style={[
              styles.title,
              titleSize === 'lg' && styles.titleLarge,
              titleAlign === 'start' && styles.titleStart,
            ]}
            numberOfLines={1}
          >
            {title}
          </Text>
        ) : (
          <View style={{ flex: 1 }} />
        )}
        {renderRight()}
      </View>
      {children ? <View style={styles.childrenWrap}>{children}</View> : null}
    </View>
  );
}

export default NavHeader;
