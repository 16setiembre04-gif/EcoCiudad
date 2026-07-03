import { Avatar } from '@/presentation/components/atoms/avatar';
import { Badge } from '@/presentation/components/atoms/badge';
import { Icon } from '@/presentation/components/atoms/icon';
import { ThemedText } from '@/presentation/components/atoms/text';
import { useTheme } from '@/theme/context';
import { spacing } from '@/theme/spacing';
import { Pressable, View } from 'react-native';
import { DashboardHeaderProps } from './types';

export function DashboardHeader({
  userName,
  greeting = 'Hello',
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
        },
        containerStyle,
      ]}
      testID={testID}
    >
      <Pressable
        onPress={onProfilePress}
        style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.md, flex: 1 }}
        accessibilityRole="button"
        accessibilityLabel="View profile"
      >
        <Avatar uri={avatarUri} name={userName} size="md" />
        <View style={{ flex: 1 }}>
          <ThemedText type="bodySmall" color={theme.colors.textSecondary}>
            {greeting}
          </ThemedText>
          <ThemedText type="title" numberOfLines={1}>
            {userName}
          </ThemedText>
          {(points !== undefined || level !== undefined) && (
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginTop: spacing.xs }}>
              {level !== undefined && (
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.xs }}>
                  <Icon name="achievement" size={14} color={theme.colors.primary} />
                  <ThemedText type="caption" color={theme.colors.primary}>
                    Lvl {level}
                  </ThemedText>
                </View>
              )}
              {points !== undefined && (
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.xs }}>
                  <Icon name="eco-points" size={14} color={theme.colors.secondary} />
                  <ThemedText type="caption" color={theme.colors.textSecondary}>
                    {points} pts
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
          width: 44,
          height: 44,
          borderRadius: 22,
          backgroundColor: theme.colors.surfaceVariant,
          justifyContent: 'center',
          alignItems: 'center',
          position: 'relative',
        }}
        accessibilityRole="button"
        accessibilityLabel="Notifications"
      >
        <Icon name="bell" size={22} color={theme.colors.textPrimary} />
        {notificationCount > 0 && (
          <View style={{ position: 'absolute', top: 4, right: 4 }}>
            <Badge variant="filled" color="error">
              {notificationCount > 9 ? '9+' : notificationCount}
            </Badge>
          </View>
        )}
      </Pressable>
    </View>
  );
}
