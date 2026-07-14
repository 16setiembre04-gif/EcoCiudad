import { Badge } from '@/presentation/components/atoms/badge';
import { Icon } from '@/presentation/components/atoms/icon';
import { ThemedText } from '@/presentation/components/atoms/text';
import { useTheme } from '@/theme/context';
import { spacing } from '@/theme/spacing';
import { borderRadius } from '@/theme/radius';
import { elevation } from '@/theme/elevation';
import { sizes } from '@/theme/sizes';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { Pressable, View, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
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

  const isPrimary = item.primary;
  const backgroundColor = isPrimary
    ? theme.colors.primary
    : isActive
      ? theme.colors.primaryContainer
      : 'transparent';
  const iconColor = isPrimary ? theme.colors.onPrimary : isActive ? theme.colors.primary : theme.colors.textSecondary;
  const labelColor = isPrimary ? theme.colors.primary : isActive ? theme.colors.primary : theme.colors.textSecondary;

  return (
    <AnimatedPressable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={[
        styles.item,
        isPrimary && styles.primaryItem,
        {
          backgroundColor,
        },
        animatedStyle,
      ]}
      accessibilityRole="button"
      accessibilityState={{ selected: isActive }}
      accessibilityLabel={item.label}
    >
      <View style={styles.iconWrapper}>
        <Icon
          name={item.icon}
          size={isPrimary ? 28 : 24}
          color={iconColor}
        />
        {item.badge !== undefined && item.badge > 0 && (
          <View style={styles.badgeWrapper}>
            <Badge variant="filled" color="error" size="sm" dot />
          </View>
        )}
      </View>
      <ThemedText
        type="caption"
        color={labelColor}
        style={[styles.label, { fontWeight: isActive || isPrimary ? '600' : '500' }]}
        numberOfLines={1}
        ellipsizeMode="tail"
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
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: theme.colors.surface,
          paddingBottom: insets.bottom > 0 ? insets.bottom : spacing.md,
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

const styles = StyleSheet.create({
  container: {
    borderTopLeftRadius: borderRadius['2xl'],
    borderTopRightRadius: borderRadius['2xl'],
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    ...elevation.medium,
  },
  item: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: sizes.touchTarget.min,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.xl,
  },
  primaryItem: {
    marginTop: -spacing.md,
    height: 56,
    width: 56,
    borderRadius: 28,
    alignSelf: 'flex-end',
    ...elevation.medium,
  },
  iconWrapper: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeWrapper: {
    position: 'absolute',
    top: -4,
    right: -8,
  },
  label: {
    marginTop: spacing.xs,
    textAlign: 'center',
    width: '100%',
  },
});
