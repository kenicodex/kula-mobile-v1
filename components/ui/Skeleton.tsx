import React, { useEffect } from 'react';
import { StyleProp, View, ViewStyle } from 'react-native';
import Animated, {
  Easing,
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import { useStyles } from '@/hooks/useStyles';
import { useTheme } from '@/hooks/useTheme';
import { makeStyles } from './Skeleton.styles';

interface SkeletonProps {
  width: number | `${number}%` | 'auto';
  height: number;
  style?: StyleProp<ViewStyle>;
  rounded?: boolean | number;
}

export function Skeleton({ width, height, style, rounded }: SkeletonProps) {
  const { theme } = useTheme();
  const styles = useStyles(makeStyles);
  const shimmer = useSharedValue(0);

  useEffect(() => {
    shimmer.value = withRepeat(
      withTiming(1, {
        duration: 1200,
        easing: Easing.inOut(Easing.ease),
      }),
      -1,
      true,
    );
  }, []);

  const shimmerLow = theme.hair;
  const shimmerHigh = theme.isDark ? '#3A3744' : '#F5EFE7';

  const animatedStyle = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(
      shimmer.value,
      [0, 0.5, 1],
      [shimmerLow, shimmerHigh, shimmerLow],
    );
    return { backgroundColor };
  });

  const borderRadius =
    typeof rounded === 'number' ? rounded : rounded === true ? 999 : 8;

  const containerStyle: ViewStyle = {
    width: width as ViewStyle['width'],
    height,
    borderRadius,
    overflow: 'hidden',
  };

  return (
    <View style={[containerStyle, style]}>
      <Animated.View style={[styles.shimmer, animatedStyle]} />
    </View>
  );
}

export default Skeleton;
