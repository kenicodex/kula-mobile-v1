import React from 'react';
import { Image, StyleProp, Text, View, ViewStyle } from 'react-native';
import { useStyles } from '@/hooks/useStyles';
import { useTheme } from '@/hooks/useTheme';
import { AvatarSize, makeStyles, sizeMap, textSizeMap } from './Avatar.styles';

interface AvatarProps {
  uri?: string;
  name?: string;
  size?: AvatarSize;
  style?: StyleProp<ViewStyle>;
}

function getInitials(name?: string): string {
  if (!name) return '?';
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
}

function pickBgColor(name: string | undefined, primary: string, primaryDeep: string): string {
  if (!name) return primary;
  const code = name.charCodeAt(0) % 2;
  return code === 0 ? primary : primaryDeep;
}

export function Avatar({ uri, name, size = 'md', style }: AvatarProps) {
  const { theme } = useTheme();
  const styles = useStyles(makeStyles);

  const dimension = sizeMap[size];
  const initials = getInitials(name);
  const bg = pickBgColor(name, theme.primary, theme.primaryDeep);

  const containerStyle: StyleProp<ViewStyle> = [
    styles.container,
    {
      width: dimension,
      height: dimension,
      borderRadius: dimension / 2,
      backgroundColor: uri ? 'transparent' : bg,
    },
    style,
  ];

  return (
    <View style={containerStyle}>
      {uri ? (
        <Image
          source={{ uri }}
          style={{ width: dimension, height: dimension, borderRadius: dimension / 2 }}
          resizeMode="cover"
        />
      ) : (
        <Text style={[styles.initials, textSizeMap[size]]}>{initials}</Text>
      )}
    </View>
  );
}

export default Avatar;
