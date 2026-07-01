import { View, Pressable, StyleSheet } from 'react-native';
import { Card } from '@/components/atoms/card';
import { ThemedText } from '@/components/atoms/text';
import { Icon } from '@/components/atoms/icon';
import { spacing } from '@/theme/spacing';
import { ADMIN_QUICK_ACTIONS } from '@/constants';

export interface AdminQuickActionsProps {
  onActionPress: (key: string) => void;
}

export function AdminQuickActions({ onActionPress }: AdminQuickActionsProps) {
  return (
    <View style={styles.container}>
      <ThemedText type="subtitle" style={styles.title}>Quick Actions</ThemedText>
      <View style={styles.grid}>
        {ADMIN_QUICK_ACTIONS.map((action) => (
          <Pressable
            key={action.key}
            onPress={() => onActionPress(action.key)}
            style={styles.actionItem}
            accessibilityRole="button"
            accessibilityLabel={action.label}
          >
            <Card variant="elevated" padding="md" style={styles.actionCard}>
              <View style={[styles.iconContainer, { backgroundColor: action.color + '20' }]}>
                <Icon name={action.icon} size={22} color={action.color} />
              </View>
              <ThemedText type="caption" style={{ textAlign: 'center', fontWeight: '500' }}>
                {action.label}
              </ThemedText>
            </Card>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.lg,
    gap: spacing.md,
  },
  title: {
    paddingLeft: spacing.xs,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  actionItem: {
    width: '30%',
  },
  actionCard: {
    alignItems: 'center',
    gap: spacing.sm,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
