import { View } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withRepeat, withTiming } from 'react-native-reanimated';
import { useTheme } from '@/theme/context';
import { borderRadius } from '@/theme/radius';
import { animations } from '@/theme/animations';
import { type SkeletonProps } from './types';

export function Skeleton({ width = '100%', height = 16, variant = 'rect', style }: SkeletonProps) {
  const theme = useTheme();
  const opacity = useSharedValue(0.3);

  opacity.value = withRepeat(
    withTiming(0.7, { duration: animations.duration.slow }),
    -1,
    true,
  );

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  const getBorderRadius = () => {
    switch (variant) {
      case 'circle': return height / 2;
      case 'text': return borderRadius.sm;
      default: return borderRadius.md;
    }
  };

  return (
    <Animated.View
      style={[
        {
          width,
          height,
          backgroundColor: theme.colors.border,
          borderRadius: getBorderRadius(),
        },
        animatedStyle,
        style,
      ]}
      accessibilityRole="none"
      accessible={false}
    />
  );
}
