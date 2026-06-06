import React from 'react';
import { Image, ImageStyle, StyleProp, View, ViewStyle } from 'react-native';

interface SignedImageProps {
  uri?: string;
  style: StyleProp<ImageStyle>;
  fallbackStyle?: StyleProp<ViewStyle>;
  resizeMode?: 'cover' | 'contain' | 'stretch' | 'center';
}

export function SignedImage({
  uri,
  style,
  fallbackStyle,
  resizeMode = 'cover',
}: SignedImageProps) {
  return uri ? (
    <Image source={{ uri }} style={style} resizeMode={resizeMode} />
  ) : (
    <View style={fallbackStyle ?? (style as StyleProp<ViewStyle>)} />
  );
}

export default SignedImage;
