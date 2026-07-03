import { Icon } from '@/presentation/components/atoms/icon';
import { ThemedText } from '@/presentation/components/atoms/text';
import { useTheme } from '@/theme/context';
import { borderRadius } from '@/theme/radius';
import { spacing } from '@/theme/spacing';
import { StyleSheet, View } from 'react-native';
import { type CapacityBadgeProps } from './types';

export function CapacityBadge({ current, max, style }: CapacityBadgeProps) {
  const theme = useTheme();

  const getCapacityColor = () => {
    if (!max) return theme.colors.success;
    const ratio = current / max;
    if (ratio >= 1) return theme.colors.error;
    if (ratio >= 0.8) return theme.colors.warning;
    return theme.colors.success;
  };

  const color = getCapacityColor();
  const text = max ? `${current}/${max}` : `${current}`;
  const label = max && current >= max ? 'Full' : max ? 'spots left' : 'attendees';

  return (
    <View style={[styles.container, { backgroundColor: color + '20' }, style]}>
      <Icon name="community" size={14} color={color} />
      <ThemedText type="caption" style={{ color, fontWeight: '600' }}>
        {max ? `${max - current} ${label}` : text}
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
