import { View, StyleSheet } from 'react-native';
import { Card } from '@/components/atoms/card';
import { ThemedText } from '@/components/atoms/text';
import { Icon } from '@/components/atoms/icon';
import { useTheme } from '@/theme/context';
import { spacing } from '@/theme/spacing';
import { type OpeningHoursCardProps } from './types';

const DAY_NAMES = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
];

export function OpeningHoursCard({ openingHours, style }: OpeningHoursCardProps) {
  const theme = useTheme();
  const today = new Date().getDay();

  return (
    <Card variant="elevated" padding="md" style={[styles.container, style]}>
      <View style={styles.header}>
        <Icon name="calendar" size={20} color={theme.colors.primary} />
        <ThemedText type="subtitle">Opening Hours</ThemedText>
      </View>

      <View style={styles.hoursList}>
        {DAY_NAMES.map((dayName, index) => {
          const dayKey = dayName.toLowerCase();
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
                {isToday && ' (Today)'}
              </ThemedText>
              <ThemedText
                type="bodySmall"
                style={{
                  color: isClosed ? theme.colors.error : theme.colors.textSecondary,
                  flex: 1,
                  textAlign: 'right',
                }}
              >
                {isClosed ? 'Closed' : hours}
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
