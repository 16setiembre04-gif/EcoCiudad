import { Avatar } from '@/presentation/components/atoms/avatar';
import { Badge } from '@/presentation/components/atoms/badge';
import { Icon } from '@/presentation/components/atoms/icon';
import { ThemedText } from '@/presentation/components/atoms/text';
import { useTheme } from '@/theme/context';
import { spacing } from '@/theme/spacing';
import { borderRadius } from '@/theme/radius';
import { useTranslation } from '@/localization';
import { Pressable, View } from 'react-native';
import { DashboardHeaderProps } from './types';

export function DashboardHeader({
  userName,
  greeting,
  avatarUri,
  points,
  level,
  onProfilePress,
  onNotificationsPress,
  notificationCount = 0,
  containerStyle,
  testID,
}: DashboardHeaderProps) {
  const theme = useTheme();
  const { t } = useTranslation();

  return (
    <View
      style={[
        {
          backgroundColor: theme.colors.surface,
          paddingHorizontal: spacing.lg,
          paddingVertical: spacing.lg,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: spacing.md,
        },
        containerStyle,
      ]}
      testID={testID}
    >
      <Pressable
        onPress={onProfilePress}
        style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.md, flex: 1 }}
        accessibilityRole="button"
        accessibilityLabel={t('common.viewProfile')}
      >
        <Avatar uri={avatarUri} name={userName} size="lg" />
        <View style={{ flex: 1 }}>
          <ThemedText type="bodySmall" color={theme.colors.textSecondary}>
            {greeting ?? t('common.hello')}
          </ThemedText>
          <ThemedText type="headline" numberOfLines={1}>
            {userName}
          </ThemedText>
          {(points !== undefined || level !== undefined) && (
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginTop: spacing.xs }}>
              {level !== undefined && (
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: spacing.xs,
                    backgroundColor: theme.colors.primaryContainer,
                    paddingHorizontal: spacing.sm,
                    paddingVertical: 2,
                    borderRadius: borderRadius.full,
                  }}
                >
                  <Icon name="achievement" size={12} color={theme.colors.onPrimaryContainer} />
                  <ThemedText type="caption" color={theme.colors.onPrimaryContainer}>
                    {t('common.level')} {level}
                  </ThemedText>
                </View>
              )}
              {points !== undefined && (
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: spacing.xs,
                    backgroundColor: theme.colors.surfaceVariant,
                    paddingHorizontal: spacing.sm,
                    paddingVertical: 2,
                    borderRadius: borderRadius.full,
                  }}
                >
                  <Icon name="eco-points" size={12} color={theme.colors.secondary} />
                  <ThemedText type="caption" color={theme.colors.textSecondary}>
                    {points} {t('common.points')}
                  </ThemedText>
                </View>
              )}
            </View>
          )}
        </View>
      </Pressable>

      <Pressable
        onPress={onNotificationsPress}
        style={{
          width: 48,
          height: 48,
          borderRadius: borderRadius.full,
          backgroundColor: theme.colors.surfaceVariant,
          justifyContent: 'center',
          alignItems: 'center',
          position: 'relative',
        }}
        accessibilityRole="button"
        accessibilityLabel={t('common.notifications')}
      >
        <Icon name="bell" size={22} color={theme.colors.textPrimary} />
        {notificationCount > 0 && (
          <View style={{ position: 'absolute', top: 6, right: 6 }}>
            <Badge variant="filled" color="error" size="sm" dot />
          </View>
        )}
      </Pressable>
    </View>
  );
}
