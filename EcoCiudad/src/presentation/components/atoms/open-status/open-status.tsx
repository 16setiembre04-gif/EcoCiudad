import { View, StyleSheet } from 'react-native';
import { ThemedText } from '@/components/atoms/text';
import { Icon } from '@/components/atoms/icon';
import { useTheme } from '@/theme/context';
import { spacing } from '@/theme/spacing';
import { borderRadius } from '@/theme/radius';
import { RECYCLING_CENTER_STATUS } from '@/constants/recycling.constants';
import { type OpenStatusProps } from './types';

function parseTime(timeStr: string): { hours: number; minutes: number } | null {
  const match = timeStr.match(/(\d{1,2}):(\d{2})/);
  if (!match) return null;
  return {
    hours: parseInt(match[1], 10),
    minutes: parseInt(match[2], 10),
  };
}

function isCurrentlyOpen(openingHours: Record<string, string>): 'open' | 'closed' | 'closingSoon' {
  const now = new Date();
  const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  const currentDay = dayNames[now.getDay()].toLowerCase();
  
  const hours = openingHours[currentDay];
  if (!hours || hours.toLowerCase() === 'closed') {
    return 'closed';
  }

  const timeRange = hours.split('-').map(t => t.trim());
  if (timeRange.length !== 2) {
    return 'closed';
  }

  const openTime = parseTime(timeRange[0]);
  const closeTime = parseTime(timeRange[1]);
  
  if (!openTime || !closeTime) {
    return 'closed';
  }

  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  const openMinutes = openTime.hours * 60 + openTime.minutes;
  const closeMinutes = closeTime.hours * 60 + closeTime.minutes;

  if (currentMinutes < openMinutes || currentMinutes >= closeMinutes) {
    return 'closed';
  }

  const minutesUntilClose = closeMinutes - currentMinutes;
  if (minutesUntilClose <= 60) {
    return 'closingSoon';
  }

  return 'open';
}

export function OpenStatus({ openingHours, style }: OpenStatusProps) {
  const theme = useTheme();
  const status = isCurrentlyOpen(openingHours);
  const config = RECYCLING_CENTER_STATUS[status];

  return (
    <View style={[styles.container, { backgroundColor: config.color + '20' }, style]}>
      <Icon name={status === 'open' ? 'check' : 'close'} size={14} color={config.color} />
      <ThemedText type="caption" style={{ color: config.color, fontWeight: '600' }}>
        {config.label}
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
