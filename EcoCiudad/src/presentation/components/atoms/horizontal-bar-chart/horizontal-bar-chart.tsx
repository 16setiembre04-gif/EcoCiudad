import { View, StyleSheet } from 'react-native';
import { useTheme } from '@/theme/context';
import { spacing } from '@/theme/spacing';
import { borderRadius } from '@/theme/radius';
import { animations } from '@/theme/animations';
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { useEffect } from 'react';

export interface HorizontalBarChartProps {
  data: { label: string; value: number; percentage: number; color?: string }[];
  maxItems?: number;
}

export function HorizontalBarChart({ data, maxItems = 6 }: HorizontalBarChartProps) {
  const theme = useTheme();
  const displayData = data.slice(0, maxItems);

  return (
    <View style={styles.container}>
      {displayData.map((item, index) => (
        <HorizontalBarRow
          key={`${item.label}-${index}`}
          label={item.label}
          value={item.value}
          percentage={item.percentage}
          color={item.color ?? theme.colors.primary}
        />
      ))}
    </View>
  );
}

function HorizontalBarRow({
  label,
  value,
  percentage,
  color,
}: {
  label: string;
  value: number;
  percentage: number;
  color: string;
}) {
  const theme = useTheme();
  const animatedWidth = useSharedValue(0);

  useEffect(() => {
    animatedWidth.value = withTiming(percentage, {
      duration: animations.duration.slow,
    });
  }, [percentage]);

  const animatedStyle = useAnimatedStyle(() => ({
    width: `${animatedWidth.value}%` as unknown as number,
  }));

  return (
    <View style={styles.row}>
      <View style={styles.labelRow}>
        <View style={[styles.dot, { backgroundColor: color }]} />
        <Animated.Text
          style={[styles.label, { color: theme.colors.textPrimary }]}
          numberOfLines={1}
        >
          {label}
        </Animated.Text>
        <Animated.Text style={[styles.count, { color: theme.colors.textSecondary }]}>
          {value}
        </Animated.Text>
      </View>
      <View style={[styles.barBackground, { backgroundColor: theme.colors.border }]}>
        <Animated.View
          style={[
            styles.bar,
            { backgroundColor: color, borderRadius: borderRadius.sm },
            animatedStyle,
          ]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.md,
  },
  row: {
    gap: spacing.xs,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  label: {
    flex: 1,
    fontSize: 13,
    fontWeight: '500',
  },
  count: {
    fontSize: 13,
    fontWeight: '600',
  },
  barBackground: {
    height: 8,
    borderRadius: borderRadius.sm,
    overflow: 'hidden',
  },
  bar: {
    height: '100%',
    minHeight: 4,
  },
});
