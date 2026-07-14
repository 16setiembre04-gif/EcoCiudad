import { Avatar } from '@/presentation/components/atoms/avatar';
import { Badge } from '@/presentation/components/atoms/badge';
import { Card } from '@/presentation/components/atoms/card';
import { Divider } from '@/presentation/components/atoms/divider';
import { Icon } from '@/presentation/components/atoms/icon';
import { ThemedText } from '@/presentation/components/atoms/text';
import { useTranslation } from '@/localization';
import { useTheme } from '@/theme/context';
import { spacing } from '@/theme/spacing';
import { View } from 'react-native';
import { CommunityCardProps } from './types';

export function CommunityCard({
  name,
  description,
  memberCount,
  imageUrl,
  isJoined = false,
  action,
  onPress,
  containerStyle,
  testID,
}: CommunityCardProps) {
  const theme = useTheme();
  const { t } = useTranslation();

  const content = (
    <View style={{ gap: spacing.md }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.md }}>
        <Avatar uri={imageUrl} name={name} size="lg" />
        <View style={{ flex: 1, gap: spacing.xs }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.sm }}>
            <ThemedText type="subtitle" numberOfLines={1} ellipsizeMode="tail" style={{ flex: 1, flexShrink: 1 }}>
              {name}
            </ThemedText>
            {isJoined && (
              <Badge variant="tonal" color="success" iconName="check">
                {t('communities.joined')}
              </Badge>
            )}
          </View>
          <ThemedText type="bodySmall" color={theme.colors.textSecondary} numberOfLines={2}>
            {description}
          </ThemedText>
        </View>
      </View>

      <Divider orientation="horizontal" />

      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.xs }}>
          <Icon name="community" size={20} color={theme.colors.primary} />
          <ThemedText type="bodySmall" color={theme.colors.textSecondary}>
            {memberCount} {memberCount === 1 ? t('communities.member') : t('communities.membersCount')}
          </ThemedText>
        </View>
        {action}
      </View>
    </View>
  );

  if (onPress) {
    return (
      <Card variant="elevated" padding="lg" onPress={onPress} style={containerStyle} testID={testID}>
        {content}
      </Card>
    );
  }

  return (
    <Card variant="elevated" padding="lg" style={containerStyle} testID={testID}>
      {content}
    </Card>
  );
}
