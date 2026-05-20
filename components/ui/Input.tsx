import React, { ReactNode, useState } from 'react';
import {
  Pressable,
  StyleProp,
  Text,
  TextInput,
  TextInputProps,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useStyles } from '@/hooks/useStyles';
import { useTheme } from '@/hooks/useTheme';
import { makeStyles } from './Input.styles';

interface InputProps extends Omit<TextInputProps, 'style'> {
  label?: string;
  placeholder?: string;
  value: string;
  onChangeText: (text: string) => void;
  error?: string;
  secureTextEntry?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  multiline?: boolean;
  style?: StyleProp<TextStyle>;
  containerStyle?: StyleProp<ViewStyle>;
}

export function Input({
  label,
  placeholder,
  value,
  onChangeText,
  error,
  secureTextEntry = false,
  leftIcon,
  rightIcon,
  multiline = false,
  style,
  containerStyle,
  ...rest
}: InputProps) {
  const { theme } = useTheme();
  const styles = useStyles(makeStyles);
  const [focused, setFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const isPassword = secureTextEntry;
  const hideText = isPassword && !showPassword;

  const borderStyle = error
    ? styles.borderError
    : focused
    ? styles.borderFocused
    : styles.borderDefault;

  return (
    <View style={[styles.container, containerStyle]}>
      {label ? <Text style={styles.label}>{label}</Text> : null}

      <View
        style={[
          styles.fieldRow,
          multiline ? styles.fieldMultiline : styles.fieldSingleLine,
          borderStyle,
        ]}
      >
        {leftIcon ? <View style={styles.leftIconWrap}>{leftIcon}</View> : null}

        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={theme.inkFaint}
          secureTextEntry={hideText}
          multiline={multiline}
          textAlignVertical={multiline ? 'top' : 'center'}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={[styles.input, style]}
          {...rest}
        />

        {isPassword ? (
          <Pressable
            onPress={() => setShowPassword((prev) => !prev)}
            style={styles.passwordToggle}
            hitSlop={8}
          >
            <Ionicons
              name={showPassword ? 'eye-off-outline' : 'eye-outline'}
              size={20}
              color={theme.inkMuted}
            />
          </Pressable>
        ) : rightIcon ? (
          <View style={styles.rightIconWrap}>{rightIcon}</View>
        ) : null}
      </View>

      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
}

export default Input;
