import { View, Pressable } from 'react-native';
import { ThemedText } from '@/components/atoms/text';
import { Avatar } from '@/components/atoms/avatar';
import { Icon } from '@/components/atoms/icon';
import { Badge } from '@/components/atoms/badge';
import { Button } from '@/components/atoms/button';
import { Divider } from '@/components/atoms/divider';
import { spacing } from '@/theme/spacing';
import { useTheme } from '@/theme/context';
import { ProfileHeaderProps } from './types';

export function ProfileHeader({
  name,
  email,
  avatarUri,
  role,
  points = 0,
  level = 1,
  reportsCount = 0,
  eventsCount = 0,
  communitiesCount = 0,
  onEditPress,
  onSettingsPress,
  containerStyle,
  testID,
}: ProfileHeaderProps) {
  const theme = useTheme();

  return (
    <View
      style={[
        {
          backgroundColor: theme.colors.surface,
          paddingHorizontal: spacing.lg,
          paddingVertical: spacing.xl,
          alignItems: 'center',
        },
        containerStyle,
      ]}
      testID={testID}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.lg, width: '100%' }}>
        <Avatar uri={avatarUri} name={name} size="xl" />
        <View style={{ flex: 1, gap: spacing.xs }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.sm }}>
            <ThemedText type="title" numberOfLines={1}>
              {name}
            </ThemedText>
            {role && (
              <Badge variant="tonal" color="primary">
                {role}
              </Badge>
            )}
          </View>
          <ThemedText type="bodySmall" color={theme.colors.textSecondary} numberOfLines={1}>
            {email}
          </ThemedText>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.md, marginTop: spacing.xs }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.xs }}>
              <Icon name="achievement" size={16} color={theme.colors.primary} />
              <ThemedText type="bodySmall" color={theme.colors.primary}>
                Level {level}
              </ThemedText>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.xs }}>
              <Icon name="eco-points" size={16} color={theme.colors.secondary} />
              <ThemedText type="bodySmall" color={theme.colors.textSecondary}>
                {points} pts
              </ThemedText>
            </View>
          </View>
        </View>
        <Pressable
          onPress={onSettingsPress}
          style={{
            width: 40,
            height: 40,
            borderRadius: 20,
            backgroundColor: theme.colors.surfaceVariant,
            justifyContent: 'center',
            alignItems: 'center',
          }}
          accessibilityRole="button"
          accessibilityLabel="Settings"
        >
          <Icon name="settings" size={20} color={theme.colors.textPrimary} />
        </Pressable>
      </View>

      <Divider orientation="horizontal" spacing={spacing.lg} />

      <View style={{ flexDirection: 'row', justifyContent: 'space-around', width: '100%', gap: spacing.md }}>
        <View style={{ alignItems: 'center', gap: spacing.xs }}>
          <ThemedText type="title" color={theme.colors.primary}>
            {reportsCount}
          </ThemedText>
          <ThemedText type="caption" color={theme.colors.textSecondary}>
            Reports
          </ThemedText>
        </View>
        <View style={{ alignItems: 'center', gap: spacing.xs }}>
          <ThemedText type="title" color={theme.colors.primary}>
            {eventsCount}
          </ThemedText>
          <ThemedText type="caption" color={theme.colors.textSecondary}>
            Events
          </ThemedText>
        </View>
        <View style={{ alignItems: 'center', gap: spacing.xs }}>
          <ThemedText type="title" color={theme.colors.primary}>
            {communitiesCount}
          </ThemedText>
          <ThemedText type="caption" color={theme.colors.textSecondary}>
            Communities
          </ThemedText>
        </View>
      </View>

      {onEditPress && (
        <View style={{ width: '100%', marginTop: spacing.lg }}>
          <Button variant="outlined" size="md" fullWidth onPress={onEditPress} iconName="edit">
            Edit Profile
          </Button>
        </View>
      )}
    </View>
  );
}
