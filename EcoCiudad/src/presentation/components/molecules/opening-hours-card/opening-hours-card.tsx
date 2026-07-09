import { Card } from '@/presentation/components/atoms/card';
import { Icon } from '@/presentation/components/atoms/icon';
import { ThemedText } from '@/presentation/components/atoms/text';
import { useTheme } from '@/theme/context';
import { spacing } from '@/theme/spacing';
import { useTranslation } from '@/localization';
import { StyleSheet, View } from 'react-native';
import { type OpeningHoursCardProps } from './types';

export function OpeningHoursCard({ openingHours, style }: OpeningHoursCardProps) {
  const theme = useTheme();
  const { t } = useTranslation();
  const today = new Date().getDay();

  const dayNames = [
    t('common.sunday'),
    t('common.monday'),
    t('common.tuesday'),
    t('common.wednesday'),
    t('common.thursday'),
    t('common.friday'),
    t('common.saturday'),
  ];

  return (
    <Card variant="elevated" padding="md" style={[styles.container, style]}>
      <View style={styles.header}>
        <Icon name="calendar" size={20} color={theme.colors.primary} />
        <ThemedText type="subtitle">{t('common.openingHours')}</ThemedText>
      </View>

      <View style={styles.hoursList}>
        {dayNames.map((dayName, index) => {
          const dayKey = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'][index];
          const hours = openingHours[dayKey];
          const isToday = index === today;
          const isClosed = !hours || hours.toLowerCase() === 'closed';

          return (
            <View
              key={dayName}
              style={[
                styles.hoursRow,
                isToday && { backgroundColor: theme.colors.primaryLight + '20' },
              ]}
            >
              <ThemedText
                type="bodySmall"
                style={{
                  fontWeight: isToday ? '700' : '400',
                  color: isToday ? theme.colors.primary : theme.colors.textPrimary,
                  width: 100,
                }}
              >
                {dayName}
                {isToday && ` (${t('common.today')})`}
              </ThemedText>
              <ThemedText
                type="bodySmall"
                style={{
                  color: isClosed ? theme.colors.error : theme.colors.textSecondary,
                  flex: 1,
                  textAlign: 'right',
                }}
              >
                {isClosed ? t('common.closed') : hours}
              </ThemedText>
            </View>
          );
        })}
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.md,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  hoursList: {
    gap: spacing.xs,
  },
  hoursRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: 8,
  },
});
