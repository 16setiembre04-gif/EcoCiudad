import { Icon } from '@/presentation/components/atoms/icon';
import { ThemedText } from '@/presentation/components/atoms/text';
import { useTheme } from '@/theme/context';
import { borderRadius } from '@/theme/radius';
import { spacing } from '@/theme/spacing';
import { StyleSheet, View } from 'react-native';
import { type DistanceBadgeProps } from './types';

export function DistanceBadge({ distanceKm, style }: DistanceBadgeProps) {
  const theme = useTheme();

  const formatDistance = (km: number): string => {
    if (km < 1) {
      return `${Math.round(km * 1000)}m`;
    }
    return `${km.toFixed(1)}km`;
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.primaryLight + '40' }, style]}>
      <Icon name="location" size={14} color={theme.colors.primary} />
      <ThemedText type="caption" style={{ color: theme.colors.primary, fontWeight: '600' }}>
        {formatDistance(distanceKm)}
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
    gap: spacing.xs,
  },
});
