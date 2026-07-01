import { View, Pressable } from 'react-native';
import { ThemedText } from '@/components/atoms/text';
import { Icon } from '@/components/atoms/icon';
import { Badge } from '@/components/atoms/badge';
import { spacing } from '@/theme/spacing';
import { useTheme } from '@/theme/context';
import { BottomNavigationProps } from './types';

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
          borderTopWidth: 1,
          borderTopColor: theme.colors.border,
          paddingHorizontal: spacing.sm,
          paddingVertical: spacing.md,
          flexDirection: 'row',
          justifyContent: 'space-around',
          alignItems: 'center',
        },
        containerStyle,
      ]}
      testID={testID}
    >
      {items.map((item) => {
        const isActive = item.key === activeKey;
        return (
          <Pressable
            key={item.key}
            onPress={() => onItemPress(item.key)}
            style={{
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center',
              gap: spacing.xs,
              paddingVertical: spacing.sm,
            }}
            accessibilityRole="button"
            accessibilityState={{ selected: isActive }}
            accessibilityLabel={item.label}
          >
            <View style={{ position: 'relative' }}>
              <Icon
                name={item.icon}
                size={24}
                color={isActive ? theme.colors.primary : theme.colors.textSecondary}
              />
              {item.badge !== undefined && item.badge > 0 && (
                <View style={{ position: 'absolute', top: -4, right: -8 }}>
                  <Badge variant="filled" color="error">
                    {item.badge > 99 ? '99+' : item.badge}
                  </Badge>
                </View>
              )}
            </View>
            <ThemedText
              type="caption"
              color={isActive ? theme.colors.primary : theme.colors.textSecondary}
              style={{ fontWeight: isActive ? '600' : '400' }}
            >
              {item.label}
            </ThemedText>
          </Pressable>
        );
      })}
    </View>
  );
}
