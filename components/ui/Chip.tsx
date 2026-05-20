import React from 'react';
import { Pressable, StyleProp, Text, View, ViewStyle } from 'react-native';
import { useStyles } from '@/hooks/useStyles';
import { useTheme } from '@/hooks/useTheme';
import { ChipSize, makeStyles } from './Chip.styles';

interface ChipProps {
  label: string;
  selected?: boolean;
  onPress?: () => void;
  size?: ChipSize;
  color?: string;
  style?: StyleProp<ViewStyle>;
}

export function Chip({
  label,
  selected = false,
  onPress,
  size = 'md',
  color,
  style,
}: ChipProps) {
  const { theme } = useTheme();
  const styles = useStyles(makeStyles);
  const primary = color ?? theme.primary;

  const containerStyle: StyleProp<ViewStyle> = [
    styles.base,
    size === 'sm' ? styles.paddingSm : styles.paddingMd,
    {
      backgroundColor: selected ? primary : 'transparent',
      borderColor: selected ? primary : theme.hair,
    },
    style,
  ];

  const textStyle = [
    size === 'sm' ? styles.textSm : styles.textMd,
    selected ? styles.textSelected : styles.textUnselected,
  ];

  const content = (
    <View style={containerStyle}>
      <Text style={textStyle}>{label}</Text>
    </View>
  );

  if (onPress) {
    return (
      <Pressable
        onPress={onPress}
        style={({ pressed }) => (pressed ? { opacity: 0.75 } : null)}
      >
        {content}
      </Pressable>
    );
  }

  return content;
}

export default Chip;
