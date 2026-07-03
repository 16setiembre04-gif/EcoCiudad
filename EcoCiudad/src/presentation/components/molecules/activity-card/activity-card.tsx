import { OPERATOR_ACTIONS } from '@/constants/operator.constants';
import { Card } from '@/presentation/components/atoms/card';
import { Icon } from '@/presentation/components/atoms/icon';
import { ThemedText } from '@/presentation/components/atoms/text';
import { useTheme } from '@/theme/context';
import { spacing } from '@/theme/spacing';
import { StyleSheet, View } from 'react-native';
import { type ActivityCardProps } from './types';

export function ActivityCard({ activity, containerStyle }: ActivityCardProps) {
  const theme = useTheme();
  const config = OPERATOR_ACTIONS[activity.action];

  const formatDateTime = (date: Date): string => {
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <Card variant="elevated" padding="md" style={[styles.container, containerStyle]}>
      <View style={styles.header}>
        <View style={[styles.iconContainer, { backgroundColor: theme.colors.primaryLight + '40' }]}>
          <Icon name={config.icon} size={20} color={theme.colors.primary} />
        </View>
        <View style={styles.content}>
          <ThemedText type="body" style={{ fontWeight: '600' }}>
            {config.label}
          </ThemedText>
          <ThemedText type="caption" color={theme.colors.textSecondary}>
            {formatDateTime(activity.createdAt)}
          </ThemedText>
        </View>
      </View>

      {activity.details && (
        <ThemedText type="bodySmall" color={theme.colors.textSecondary}>
          {activity.details}
        </ThemedText>
      )}
    </Card>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.sm,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    gap: 2,
  },
});
