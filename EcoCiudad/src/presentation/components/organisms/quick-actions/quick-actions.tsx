import { Card } from '@/presentation/components/atoms/card';
import { Icon } from '@/presentation/components/atoms/icon';
import { ThemedText } from '@/presentation/components/atoms/text';
import { useTheme } from '@/theme/context';
import { spacing } from '@/theme/spacing';
import { Pressable, View, StyleSheet } from 'react-native';
import { QuickActionsProps } from './types';

export function QuickActions({
  items,
  onItemPress,
  columns = 3,
  containerStyle,
  testID,
}: QuickActionsProps) {
  const theme = useTheme();

  return (
    <View
      style={[styles.container, containerStyle]}
      testID={testID}
    >
      {items.map((item) => (
        <Pressable
          key={item.key}
          onPress={() => onItemPress(item.key)}
          style={[
            styles.item,
            { minWidth: `${100 / columns}%`, flexBasis: `${100 / columns}%` },
          ]}
          accessibilityRole="button"
          accessibilityLabel={item.label}
        >
          <Card
            variant="elevated"
            padding="md"
            style={styles.card}
          >
            <View
              style={[
                styles.iconContainer,
                { backgroundColor: item.color || theme.colors.primaryContainer },
              ]}
            >
              <Icon name={item.icon} size={28} color={theme.colors.onPrimaryContainer} />
            </View>
            <ThemedText
              type="bodySmall"
              style={styles.label}
              numberOfLines={2}
              ellipsizeMode="tail"
            >
              {item.label}
            </ThemedText>
          </Card>
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: spacing.lg,
  },
  item: {
    padding: spacing.xs,
    flex: 1,
  },
  card: {
    alignItems: 'center',
    gap: spacing.sm,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  label: {
    textAlign: 'center',
    fontWeight: '500',
  },
});
