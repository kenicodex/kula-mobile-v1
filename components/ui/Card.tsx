import React, { ReactNode } from 'react';
import { Pressable, StyleProp, View, ViewStyle } from 'react-native';
import { useStyles } from '@/hooks/useStyles';
import { makeStyles } from './Card.styles';

interface CardProps {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  onPress?: () => void;
  shadow?: boolean;
}

export function Card({ children, style, onPress, shadow = true }: CardProps) {
  const styles = useStyles(makeStyles);

  const composed: StyleProp<ViewStyle> = [
    styles.base,
    shadow ? styles.shadow : null,
    style,
  ];

  if (onPress) {
    return (
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [composed, pressed ? { opacity: 0.9 } : null]}
      >
        {children}
      </Pressable>
    );
  }

  return <View style={composed}>{children}</View>;
}

export default Card;
