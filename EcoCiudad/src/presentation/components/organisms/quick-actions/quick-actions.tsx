import { Card } from '@/presentation/components/atoms/card';
import { Icon } from '@/presentation/components/atoms/icon';
import { ThemedText } from '@/presentation/components/atoms/text';
import { useTheme } from '@/theme/context';
import { spacing } from '@/theme/spacing';
import { Pressable, View } from 'react-native';
import { QuickActionsProps } from './types';

export function QuickActions({
  items,
  onItemPress,
  columns = 3,
  containerStyle,
  testID,
}: QuickActionsProps) {
  const theme = useTheme();

  const gapSize = spacing.md;
  const itemWidth = `${(100 - (columns - 1) * 2) / columns}%` as any;

  return (
    <View
      style={[
        {
          flexDirection: 'row',
          flexWrap: 'wrap',
          gap: gapSize,
          paddingHorizontal: spacing.lg,
        },
        containerStyle,
      ]}
      testID={testID}
    >
      {items.map((item) => (
        <Pressable
          key={item.key}
          onPress={() => onItemPress(item.key)}
          style={{ width: itemWidth }}
          accessibilityRole="button"
          accessibilityLabel={item.label}
        >
          <Card
            variant="elevated"
            padding="md"
            style={{ alignItems: 'center', gap: spacing.sm }}
          >
            <View
              style={{
                width: 56,
                height: 56,
                borderRadius: 28,
                backgroundColor: item.color || theme.colors.primaryContainer,
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Icon name={item.icon} size={28} color={theme.colors.onPrimaryContainer} />
            </View>
            <ThemedText
              type="bodySmall"
              style={{ textAlign: 'center', fontWeight: '500' }}
              numberOfLines={2}
            >
              {item.label}
            </ThemedText>
          </Card>
        </Pressable>
      ))}
    </View>
  );
}
