import { REMINDER_TYPES } from '@/constants/event.constants';
import { Checkbox } from '@/presentation/components/atoms/checkbox';
import { Icon } from '@/presentation/components/atoms/icon';
import { ThemedText } from '@/presentation/components/atoms/text';
import { useTheme } from '@/theme/context';
import { borderRadius } from '@/theme/radius';
import { spacing } from '@/theme/spacing';
import { Pressable, StyleSheet, View } from 'react-native';
import { type ReminderCardProps } from './types';

function formatReminderTime(minutes: number): string {
  if (minutes < 60) return `${minutes} min before`;
  if (minutes < 1440) return `${Math.floor(minutes / 60)} hr before`;
  return `${Math.floor(minutes / 1440)} day before`;
}

export function ReminderCard({
  reminderBefore,
  reminderType,
  isActive = false,
  onPress,
  style,
}: ReminderCardProps) {
  const theme = useTheme();
  const typeConfig = REMINDER_TYPES[reminderType];

  return (
    <Pressable
      style={[
        styles.container,
        {
          backgroundColor: isActive ? theme.colors.primaryLight + '40' : theme.colors.surface,
          borderColor: isActive ? theme.colors.primary : theme.colors.border,
        },
        style,
      ]}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityState={{ selected: isActive }}
    >
      <Icon name={typeConfig.icon} size={20} color={isActive ? theme.colors.primary : theme.colors.textSecondary} />
      <View style={styles.info}>
        <ThemedText type="bodySmall" style={{ fontWeight: isActive ? '600' : '400' }}>
          {formatReminderTime(reminderBefore)}
        </ThemedText>
        <ThemedText type="caption" color={theme.colors.textSecondary}>
          via {typeConfig.label}
        </ThemedText>
      </View>
      <Checkbox checked={isActive} onCheckedChange={() => onPress?.()} size="sm" />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderRadius: borderRadius.md,
    borderWidth: 1.5,
    gap: spacing.md,
  },
  info: {
    flex: 1,
    gap: 2,
  },
});
