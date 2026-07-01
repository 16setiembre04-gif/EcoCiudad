import { Pressable, StyleSheet } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { Icon } from '@/components/atoms/icon';
import { useTheme } from '@/theme/context';
import { type FavoriteIconProps } from './types';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function FavoriteIcon({
  isFavorite,
  onPress,
  size = 24,
  style,
}: FavoriteIconProps) {
  const theme = useTheme();
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePress = () => {
    scale.value = withSpring(1.3, { damping: 10, stiffness: 200 }, () => {
      scale.value = withSpring(1, { damping: 10, stiffness: 200 });
    });
    onPress?.();
  };

  return (
    <AnimatedPressable
      onPress={handlePress}
      style={[styles.container, animatedStyle, style]}
      accessibilityRole="button"
      accessibilityLabel={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
      accessibilityState={{ selected: isFavorite }}
    >
      <Icon
        name="heart"
        size={size}
        color={isFavorite ? theme.colors.error : theme.colors.textSecondary}
      />
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
