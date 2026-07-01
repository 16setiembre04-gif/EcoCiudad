import { View, StyleSheet } from 'react-native';
import { Card } from '@/components/atoms/card';
import { ThemedText } from '@/components/atoms/text';
import { Icon } from '@/components/atoms/icon';
import { useTheme } from '@/theme/context';
import { spacing } from '@/theme/spacing';
import { type StatCardProps } from './types';

export function StatCard({ label, value, iconName, color, style }: StatCardProps) {
  const theme = useTheme();
  const iconColor = color ?? theme.colors.primary;
  const iconBg = theme.colors.primaryLight;

  return (
    <Card variant="elevated" padding="md" style={[styles.container, style]}>
      <View style={[styles.iconContainer, { backgroundColor: iconBg }]}>
        <Icon name={iconName} size={20} color={iconColor} />
      </View>
      <ThemedText type="title" style={styles.value}>
        {value}
      </ThemedText>
      <ThemedText type="caption" color={theme.colors.textSecondary} numberOfLines={1}>
        {label}
      </ThemedText>
    </Card>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    gap: spacing.xs,
    minWidth: 0,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xs,
  },
  value: {
    textAlign: 'center',
  },
});
