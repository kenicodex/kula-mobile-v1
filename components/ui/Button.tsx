import React, { ReactNode } from 'react';
import {
  ActivityIndicator,
  Pressable,
  PressableProps,
  StyleProp,
  Text,
  View,
  ViewStyle,
} from 'react-native';
import { useStyles } from '@/hooks/useStyles';
import { useTheme } from '@/hooks/useTheme';
import {
  containerSize,
  labelSize,
  makeContainerVariant,
  makeLabelVariant,
  makeSpinnerColor,
  makeStyles,
  Size,
  Variant,
} from './Button.styles';

interface ButtonProps extends Omit<PressableProps, 'style'> {
  label: string;
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  disabled?: boolean;
  icon?: ReactNode;
  iconPosition?: 'left' | 'right';
  style?: StyleProp<ViewStyle>;
}

export function Button({
  label,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  icon,
  iconPosition = 'left',
  style,
  onPress,
  ...rest
}: ButtonProps) {
  const { theme } = useTheme();
  const styles = useStyles(makeStyles);
  const containerVariant = makeContainerVariant(theme);
  const labelVariant = makeLabelVariant(theme);
  const spinnerColor = makeSpinnerColor(theme);

  const isDisabled = disabled || loading;

  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      style={({ pressed }) => [
        styles.container,
        containerVariant[variant],
        containerSize[size],
        isDisabled ? styles.disabled : styles.enabled,
        pressed && !isDisabled ? { opacity: 0.85 } : null,
        style,
      ]}
      {...rest}
    >
      {loading ? (
        <ActivityIndicator size="small" color={spinnerColor[variant]} />
      ) : (
        <>
          {icon && iconPosition === 'left' ? (
            <View style={styles.iconLeft}>{icon}</View>
          ) : null}
          <Text style={[labelVariant[variant], labelSize[size]]}>{label}</Text>
          {icon && iconPosition === 'right' ? (
            <View style={styles.iconRight}>{icon}</View>
          ) : null}
        </>
      )}
    </Pressable>
  );
}

export default Button;
