import { View, StyleSheet } from 'react-native';
import { Card } from '@/components/atoms/card';
import { ThemedText } from '@/components/atoms/text';
import { Icon } from '@/components/atoms/icon';
import { useTheme } from '@/theme/context';
import { spacing } from '@/theme/spacing';
import { type RewardCardProps } from './types';

export function RewardCard({ points, title, description, earned = false, style }: RewardCardProps) {
  const theme = useTheme();

  return (
    <Card
      variant={earned ? 'elevated' : 'outlined'}
      padding="md"
      style={[styles.container, style]}
    >
      <View style={[styles.iconContainer, { backgroundColor: earned ? theme.colors.success + '20' : theme.colors.surfaceVariant }]}>
        <Icon
          name={earned ? 'success' : 'eco-points'}
          size={24}
          color={earned ? theme.colors.success : theme.colors.textSecondary}
        />
      </View>
      <View style={styles.info}>
        <ThemedText type="body" numberOfLines={1}>
          {title}
        </ThemedText>
        {description && (
          <ThemedText type="caption" color={theme.colors.textSecondary} numberOfLines={2}>
            {description}
          </ThemedText>
        )}
      </View>
      <View style={[styles.pointsBadge, { backgroundColor: earned ? theme.colors.success : theme.colors.primary }]}>
        <ThemedText type="caption" style={{ color: theme.colors.onPrimary, fontWeight: '700' }}>
          +{points}
        </ThemedText>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  info: {
    flex: 1,
    gap: 2,
  },
  pointsBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: 12,
  },
});
