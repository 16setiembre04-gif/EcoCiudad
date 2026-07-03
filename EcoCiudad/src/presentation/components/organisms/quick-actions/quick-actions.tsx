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
          <Card variant="elevated" padding="lg" style={{ alignItems: 'center', gap: spacing.sm }}>
            <View
              style={{
                width: 48,
                height: 48,
                borderRadius: 24,
                backgroundColor: item.color || theme.colors.primaryLight,
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Icon name={item.icon} size={24} color={theme.colors.primary} />
            </View>
            <ThemedText type="bodySmall" style={{ textAlign: 'center' }} numberOfLines={2}>
              {item.label}
            </ThemedText>
          </Card>
        </Pressable>
      ))}
    </View>
  );
}
