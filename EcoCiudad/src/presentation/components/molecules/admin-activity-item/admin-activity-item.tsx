import { ADMIN_ACTIVITY_ACTIONS } from '@/constants';
import { type AdminActivityLog } from '@/domain/entities';
import { Icon } from '@/presentation/components/atoms/icon';
import { ThemedText } from '@/presentation/components/atoms/text';
import { useTheme } from '@/theme/context';
import { spacing } from '@/theme/spacing';
import { StyleSheet, View } from 'react-native';

export interface AdminActivityItemProps {
  activity: AdminActivityLog;
}

export function AdminActivityItem({ activity }: AdminActivityItemProps) {
  const theme = useTheme();
  const config = ADMIN_ACTIVITY_ACTIONS[activity.action] ?? {
    label: activity.action,
    icon: 'info' as const,
    color: theme.colors.textSecondary,
  };

  const formatTime = (date: Date): string => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <View style={styles.container}>
      <View style={[styles.iconContainer, { backgroundColor: config.color + '20' }]}>
        <Icon name={config.icon} size={16} color={config.color} />
      </View>
      <View style={styles.content}>
        <ThemedText type="bodySmall" style={{ fontWeight: '500' }} numberOfLines={1}>
          {config.label}
        </ThemedText>
        {activity.details && (
          <ThemedText type="caption" color={theme.colors.textSecondary} numberOfLines={1}>
            {activity.details}
          </ThemedText>
        )}
      </View>
      <ThemedText type="caption" color={theme.colors.textSecondary}>
        {formatTime(activity.createdAt)}
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.sm,
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    gap: 2,
  },
});
