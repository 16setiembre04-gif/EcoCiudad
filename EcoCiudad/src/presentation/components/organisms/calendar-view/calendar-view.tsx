import { Icon } from '@/presentation/components/atoms/icon';
import { ThemedText } from '@/presentation/components/atoms/text';
import { useTheme } from '@/theme/context';
import { borderRadius } from '@/theme/radius';
import { spacing } from '@/theme/spacing';
import { useTranslation } from '@/localization';
import { useMemo, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { type CalendarViewProps } from './types';

const DAYS = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number): number {
  return new Date(year, month, 1).getDay();
}

export function CalendarView({
  events,
  selectedDate,
  onDateSelect,
  onEventPress: _onEventPress,
  style,
}: CalendarViewProps) {
  const theme = useTheme();
  const { t } = useTranslation();
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());

  const daysInMonth = getDaysInMonth(currentYear, currentMonth);
  const firstDay = getFirstDayOfMonth(currentYear, currentMonth);

  const eventDates = useMemo(() => {
    const dates = new Set<string>();
    events.forEach((event) => {
      const date = new Date(event.startDate);
      if (date.getMonth() === currentMonth && date.getFullYear() === currentYear) {
        dates.add(date.getDate().toString());
      }
    });
    return dates;
  }, [events, currentMonth, currentYear]);

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const monthName = new Date(currentYear, currentMonth).toLocaleDateString('es-ES', {
    month: 'long',
    year: 'numeric',
  });

  const days = [];
  for (let i = 0; i < firstDay; i++) {
    days.push(<View key={`empty-${i}`} style={styles.dayCell} />);
  }
  for (let day = 1; day <= daysInMonth; day++) {
    const dayStr = day.toString();
    const hasEvent = eventDates.has(dayStr);
    const isToday =
      day === today.getDate() &&
      currentMonth === today.getMonth() &&
      currentYear === today.getFullYear();
    const isSelected =
      selectedDate &&
      day === selectedDate.getDate() &&
      currentMonth === selectedDate.getMonth() &&
      currentYear === selectedDate.getFullYear();

    days.push(
      <Pressable
        key={day}
        style={[
          styles.dayCell,
          isToday && { backgroundColor: theme.colors.primaryLight + '40' },
          isSelected && { backgroundColor: theme.colors.primary, borderRadius: borderRadius.sm },
        ]}
        onPress={() => onDateSelect?.(new Date(currentYear, currentMonth, day))}
        accessibilityRole="button"
        accessibilityLabel={`${monthName} ${day}${hasEvent ? ', ' + t('events.hasEvents') : ''}`}
      >
        <ThemedText
          type="bodySmall"
          style={{
            fontWeight: isToday || isSelected ? '700' : '400',
            color: isSelected ? theme.colors.onPrimary : theme.colors.textPrimary,
            textAlign: 'center',
          }}
        >
          {day}
        </ThemedText>
        {hasEvent && (
          <View
            style={[
              styles.eventDot,
              { backgroundColor: isSelected ? theme.colors.onPrimary : theme.colors.primary },
            ]}
          />
        )}
      </Pressable>,
    );
  }

  return (
    <View style={[styles.container, style]}>
      <View style={styles.header}>
        <Pressable onPress={handlePrevMonth} accessibilityRole="button" accessibilityLabel={t('events.previousMonth')}>
          <Icon name="chevron-left" size={20} color={theme.colors.textPrimary} />
        </Pressable>
        <ThemedText type="subtitle">{monthName}</ThemedText>
        <Pressable onPress={handleNextMonth} accessibilityRole="button" accessibilityLabel={t('events.nextMonth')}>
          <Icon name="chevron-right" size={20} color={theme.colors.textPrimary} />
        </Pressable>
      </View>

      <View style={styles.daysHeader}>
        {DAYS.map((day) => (
          <View key={day} style={styles.dayCell}>
            <ThemedText type="caption" color={theme.colors.textSecondary} style={{ textAlign: 'center' }}>
              {day}
            </ThemedText>
          </View>
        ))}
      </View>

      <View style={styles.daysGrid}>{days}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: spacing.lg,
    gap: spacing.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  daysHeader: {
    flexDirection: 'row',
  },
  daysGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  dayCell: {
    width: `${100 / 7}%` as any,
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
  },
  eventDot: {
    width: 5,
    height: 5,
    borderRadius: 3,
  },
});
