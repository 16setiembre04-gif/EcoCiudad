import { Icon } from '@/presentation/components/atoms/icon';
import { ThemedText } from '@/presentation/components/atoms/text';
import { useTheme } from '@/theme/context';
import { spacing } from '@/theme/spacing';
import { useTranslation } from '@/localization';
import { Pressable, StyleSheet, View } from 'react-native';

export interface AdminDashboardHeaderProps {
  adminName: string;
  onNotificationsPress?: () => void;
  notificationCount?: number;
}

export function AdminDashboardHeader({
  adminName,
  onNotificationsPress,
  notificationCount = 0,
}: AdminDashboardHeaderProps) {
  const theme = useTheme();
  const { t } = useTranslation();

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return t('common.goodMorning');
    if (hour < 18) return t('common.goodAfternoon');
    return t('common.goodEvening');
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.surface }]}>
      <View style={styles.content}>
        <View style={styles.textContainer}>
          <ThemedText type="bodySmall" color={theme.colors.textSecondary}>
            {getGreeting()}
          </ThemedText>
          <ThemedText type="title" numberOfLines={1}>
            {adminName}
          </ThemedText>
          <ThemedText type="caption" color={theme.colors.primary}>
            {t('common.platformAdministrator')}
          </ThemedText>
        </View>
        {onNotificationsPress && (
          <Pressable
            onPress={onNotificationsPress}
            style={[styles.notificationButton, { backgroundColor: theme.colors.surfaceVariant }]}
            accessibilityRole="button"
            accessibilityLabel={t('common.notifications')}
          >
            <Icon name="bell" size={22} color={theme.colors.textPrimary} />
            {notificationCount > 0 && (
              <View style={[styles.badge, { backgroundColor: theme.colors.error }]}>
                <ThemedText style={{ color: '#FFFFFF', fontSize: 10, fontWeight: '600' }}>
                  {notificationCount > 9 ? '9+' : notificationCount}
                </ThemedText>
              </View>
            )}
          </Pressable>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
  },
  content: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  textContainer: {
    flex: 1,
    gap: 2,
  },
  notificationButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: 2,
    right: 2,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
});
