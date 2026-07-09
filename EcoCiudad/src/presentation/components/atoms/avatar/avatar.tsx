import { View, Text, Image, type ViewStyle } from 'react-native';
import { useTheme } from '@/theme/context';
import { sizes } from '@/theme/sizes';
import { useTranslation } from '@/localization';

export type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

interface AvatarProps {
  uri?: string | null;
  name?: string;
  size?: AvatarSize;
  style?: ViewStyle;
}

const sizeMap: Record<AvatarSize, number> = sizes.avatar;

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((part) => part[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

export function Avatar({ uri, name, size = 'md', style }: AvatarProps) {
  const theme = useTheme();
  const { t } = useTranslation();
  const dimension = sizeMap[size];
  const fontSize = dimension * 0.4;

  if (uri) {
    return (
      <View
        style={[
          {
            width: dimension,
            height: dimension,
            borderRadius: dimension / 2,
            overflow: 'hidden',
            backgroundColor: theme.colors.surfaceVariant,
          },
          style,
        ]}
      >
        <Image
          source={{ uri }}
          style={{ width: dimension, height: dimension }}
          accessibilityLabel={name ? t('common.avatarOf', { name }) : t('common.userAvatar')}
        />
      </View>
    );
  }

  return (
    <View
      style={[
        {
          width: dimension,
          height: dimension,
          borderRadius: dimension / 2,
          backgroundColor: theme.colors.primaryLight,
          justifyContent: 'center',
          alignItems: 'center',
        },
        style,
      ]}
      accessibilityLabel={name ? t('common.avatarOf', { name }) : t('common.userAvatar')}
    >
      <Text
        style={{
          fontSize,
          fontWeight: '600',
          color: theme.colors.primary,
        }}
      >
        {name ? getInitials(name) : '?'}
      </Text>
    </View>
  );
}
