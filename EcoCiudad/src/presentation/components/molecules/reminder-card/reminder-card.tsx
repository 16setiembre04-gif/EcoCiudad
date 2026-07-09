import { REMINDER_TYPES } from '@/constants/event.constants';
import { Checkbox } from '@/presentation/components/atoms/checkbox';
import { Icon } from '@/presentation/components/atoms/icon';
import { ThemedText } from '@/presentation/components/atoms/text';
import { useTheme } from '@/theme/context';
import { borderRadius } from '@/theme/radius';
import { spacing } from '@/theme/spacing';
import { useTranslation } from '@/localization';
import { Pressable, StyleSheet, View } from 'react-native';
import { type ReminderCardProps } from './types';

export function ReminderCard({
  reminderBefore,
  reminderType,
  isActive = false,
  onPress,
  style,
}: ReminderCardProps) {
  const theme = useTheme();
  const { t } = useTranslation();
  const typeConfig = REMINDER_TYPES[reminderType];

  const formatReminderTime = (minutes: number): string => {
    if (minutes < 60) return t('common.minutesBefore', { minutes });
    if (minutes < 1440) return t('common.hoursBefore', { hours: Math.floor(minutes / 60) });
    return t('common.daysBefore', { days: Math.floor(minutes / 1440) });
  };

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
          {t('common.via')} {typeConfig.label}
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
