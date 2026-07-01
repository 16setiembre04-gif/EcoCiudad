import { View, Pressable, StyleSheet } from 'react-native';
import { ThemedText } from '@/components/atoms/text';
import { Avatar } from '@/components/atoms/avatar';
import { Icon } from '@/components/atoms/icon';
import { useTheme } from '@/theme/context';
import { spacing } from '@/theme/spacing';
import { type OperatorDashboardHeaderProps } from './types';

export function OperatorDashboardHeader({
  stats,
  operatorName,
  onProfilePress,
  onNotificationsPress,
  containerStyle,
}: OperatorDashboardHeaderProps) {
  const theme = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.surface }, containerStyle]}>
      <View style={styles.topRow}>
        <Pressable
          style={styles.profileSection}
          onPress={onProfilePress}
          accessibilityRole="button"
          accessibilityLabel="View profile"
        >
          <Avatar name={operatorName} size="md" />
          <View style={styles.profileInfo}>
            <ThemedText type="title" numberOfLines={1}>
              {operatorName}
            </ThemedText>
            <ThemedText type="bodySmall" color={theme.colors.textSecondary}>
              Environmental Officer
            </ThemedText>
          </View>
        </Pressable>

        <Pressable
          style={styles.notificationButton}
          onPress={onNotificationsPress}
          accessibilityRole="button"
          accessibilityLabel="View notifications"
        >
          <Icon name="bell" size={24} color={theme.colors.textPrimary} />
          {stats.pendingReports > 0 && (
            <View style={[styles.badge, { backgroundColor: theme.colors.error }]}>
              <ThemedText type="caption" style={{ color: theme.colors.onPrimary }}>
                {stats.pendingReports > 9 ? '9+' : stats.pendingReports}
              </ThemedText>
            </View>
          )}
        </Pressable>
      </View>

      <View style={styles.statsRow}>
        <View style={styles.statItem}>
          <ThemedText type="headline" style={{ color: theme.colors.primary }}>
            {stats.totalAssigned}
          </ThemedText>
          <ThemedText type="caption" color={theme.colors.textSecondary}>
            Assigned
          </ThemedText>
        </View>

        <View style={styles.statItem}>
          <ThemedText type="headline" style={{ color: theme.colors.warning }}>
            {stats.pendingReports}
          </ThemedText>
          <ThemedText type="caption" color={theme.colors.textSecondary}>
            Pending
          </ThemedText>
        </View>

        <View style={styles.statItem}>
          <ThemedText type="headline" style={{ color: theme.colors.success }}>
            {stats.resolvedToday}
          </ThemedText>
          <ThemedText type="caption" color={theme.colors.textSecondary}>
            Today
          </ThemedText>
        </View>

        <View style={styles.statItem}>
          <ThemedText type="headline" style={{ color: theme.colors.secondary }}>
            {stats.averageResolutionTime}h
          </ThemedText>
          <ThemedText type="caption" color={theme.colors.textSecondary}>
            Avg Time
          </ThemedText>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: spacing.lg,
    gap: spacing.lg,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    flex: 1,
  },
  profileInfo: {
    flex: 1,
    gap: 2,
  },
  notificationButton: {
    position: 'relative',
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badge: {
    position: 'absolute',
    top: 4,
    right: 4,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  statItem: {
    alignItems: 'center',
    gap: spacing.xs,
  },
});
