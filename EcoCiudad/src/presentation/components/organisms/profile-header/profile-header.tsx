import { Avatar } from '@/presentation/components/atoms/avatar';
import { Badge } from '@/presentation/components/atoms/badge';
import { Button } from '@/presentation/components/atoms/button';
import { Divider } from '@/presentation/components/atoms/divider';
import { Icon } from '@/presentation/components/atoms/icon';
import { ThemedText } from '@/presentation/components/atoms/text';
import { useTheme } from '@/theme/context';
import { spacing } from '@/theme/spacing';
import { useTranslation } from '@/localization';
import { Pressable, View } from 'react-native';
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
  const { t } = useTranslation();

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
                {t('common.level')} {level}
              </ThemedText>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.xs }}>
              <Icon name="eco-points" size={16} color={theme.colors.secondary} />
              <ThemedText type="bodySmall" color={theme.colors.textSecondary}>
                {points} {t('common.points')}
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
          accessibilityLabel={t('common.settings')}
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
            {t('common.reports')}
          </ThemedText>
        </View>
        <View style={{ alignItems: 'center', gap: spacing.xs }}>
          <ThemedText type="title" color={theme.colors.primary}>
            {eventsCount}
          </ThemedText>
          <ThemedText type="caption" color={theme.colors.textSecondary}>
            {t('common.events')}
          </ThemedText>
        </View>
        <View style={{ alignItems: 'center', gap: spacing.xs }}>
          <ThemedText type="title" color={theme.colors.primary}>
            {communitiesCount}
          </ThemedText>
          <ThemedText type="caption" color={theme.colors.textSecondary}>
            {t('common.communities')}
          </ThemedText>
        </View>
      </View>

      {onEditPress && (
        <View style={{ width: '100%', marginTop: spacing.lg }}>
          <Button variant="outlined" size="md" fullWidth onPress={onEditPress} iconName="edit">
            {t('common.editProfile')}
          </Button>
        </View>
      )}
    </View>
  );
}
