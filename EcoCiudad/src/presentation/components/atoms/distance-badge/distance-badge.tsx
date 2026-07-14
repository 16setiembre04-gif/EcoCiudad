import { View } from 'react-native';
import { Icon } from '@/presentation/components/atoms/icon';
import { ThemedText } from '@/presentation/components/atoms/text';
import { useTheme } from '@/theme/context';
import { spacing } from '@/theme/spacing';
import { borderRadius } from '@/theme/radius';
import { formatDistance } from '@/infrastructure/maps/geo.utils';

export interface DistanceBadgeProps {
  distanceKm: number;
  size?: 'sm' | 'md';
}

export function DistanceBadge({ distanceKm, size = 'md' }: DistanceBadgeProps) {
  const theme = useTheme();
  const textType = size === 'sm' ? 'caption' : 'bodySmall';
  const iconSize = size === 'sm' ? 12 : 14;

  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.xs,
        backgroundColor: theme.colors.primaryContainer,
        paddingHorizontal: size === 'sm' ? spacing.sm : spacing.md,
        paddingVertical: size === 'sm' ? 2 : spacing.xs,
        borderRadius: borderRadius.full,
        alignSelf: 'flex-start',
      }}
    >
      <Icon name="navigation" size={iconSize} color={theme.colors.primary} />
      <ThemedText type={textType} color={theme.colors.primary}>
        {formatDistance(distanceKm)}
      </ThemedText>
    </View>
  );
}
