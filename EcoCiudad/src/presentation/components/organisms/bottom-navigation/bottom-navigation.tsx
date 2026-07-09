import { Badge } from '@/presentation/components/atoms/badge';
import { Icon } from '@/presentation/components/atoms/icon';
import { ThemedText } from '@/presentation/components/atoms/text';
import { useTheme } from '@/theme/context';
import { spacing } from '@/theme/spacing';
import { borderRadius } from '@/theme/radius';
import { elevation } from '@/theme/elevation';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { Pressable, View } from 'react-native';
import { BottomNavigationItem, BottomNavigationProps } from './types';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface NavigationItemProps {
  item: BottomNavigationItem;
  isActive: boolean;
  onPress: () => void;
}

function NavigationItem({ item, isActive, onPress }: NavigationItemProps) {
  const theme = useTheme();
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.92, { damping: 12, stiffness: 180 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 12, stiffness: 180 });
  };

  return (
    <AnimatedPressable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={[
        {
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: 56,
          paddingVertical: spacing.xs,
          borderRadius: borderRadius.xl,
          backgroundColor: isActive ? theme.colors.primaryContainer : 'transparent',
        },
        animatedStyle,
      ]}
      accessibilityRole="button"
      accessibilityState={{ selected: isActive }}
      accessibilityLabel={item.label}
    >
      <View style={{ position: 'relative', alignItems: 'center', justifyContent: 'center' }}>
        <Icon
          name={item.icon}
          size={24}
          color={isActive ? theme.colors.primary : theme.colors.textSecondary}
        />
        {item.badge !== undefined && item.badge > 0 && (
          <View style={{ position: 'absolute', top: -4, right: -8 }}>
            <Badge variant="filled" color="error" size="sm" dot />
          </View>
        )}
      </View>
      <ThemedText
        type="caption"
        color={isActive ? theme.colors.primary : theme.colors.textSecondary}
        style={{ fontWeight: isActive ? '600' : '500', marginTop: spacing.xs }}
      >
        {item.label}
      </ThemedText>
    </AnimatedPressable>
  );
}

export function BottomNavigation({
  items,
  activeKey,
  onItemPress,
  containerStyle,
  testID,
}: BottomNavigationProps) {
  const theme = useTheme();

  return (
    <View
      style={[
        {
          backgroundColor: theme.colors.surface,
          borderTopLeftRadius: borderRadius['2xl'],
          borderTopRightRadius: borderRadius['2xl'],
          paddingHorizontal: spacing.md,
          paddingTop: spacing.sm,
          paddingBottom: spacing.md,
          flexDirection: 'row',
          justifyContent: 'space-around',
          alignItems: 'center',
          ...elevation.medium,
        },
        containerStyle,
      ]}
      testID={testID}
    >
      {items.map((item) => (
        <NavigationItem
          key={item.key}
          item={item}
          isActive={item.key === activeKey}
          onPress={() => onItemPress(item.key)}
        />
      ))}
    </View>
  );
}
