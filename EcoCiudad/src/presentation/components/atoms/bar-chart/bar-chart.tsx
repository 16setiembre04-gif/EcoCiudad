import { View, StyleSheet } from 'react-native';
import { useTheme } from '@/theme/context';
import { spacing } from '@/theme/spacing';
import { borderRadius } from '@/theme/radius';
import { animations } from '@/theme/animations';
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { useEffect } from 'react';

export interface BarChartProps {
  data: { label: string; value: number; color?: string }[];
  height?: number;
  maxBars?: number;
  showValues?: boolean;
}

export function BarChart({ data, height = 160, maxBars = 7, showValues = true }: BarChartProps) {
  const theme = useTheme();
  const displayData = data.slice(-maxBars);
  const maxValue = Math.max(...displayData.map((d) => d.value), 1);

  return (
    <View style={[styles.container, { height: height + 40 }]}>
      <View style={[styles.chartArea, { height }]}>
        {displayData.map((item, index) => (
          <BarColumn
            key={`${item.label}-${index}`}
            value={item.value}
            maxValue={maxValue}
            color={item.color ?? theme.colors.primary}
            chartHeight={height}
            showValue={showValues}
          />
        ))}
      </View>
      <View style={styles.labelsRow}>
        {displayData.map((item, index) => (
          <View key={`label-${index}`} style={styles.labelContainer}>
            <Animated.Text
              style={[styles.label, { color: theme.colors.textSecondary }]}
              numberOfLines={1}
            >
              {item.label}
            </Animated.Text>
          </View>
        ))}
      </View>
    </View>
  );
}

function BarColumn({
  value,
  maxValue,
  color,
  showValue,
}: {
  value: number;
  maxValue: number;
  color: string;
  chartHeight: number;
  showValue: boolean;
}) {
  const heightPercent = (value / maxValue) * 100;
  const animatedHeight = useSharedValue(0);

  useEffect(() => {
    animatedHeight.value = withTiming(heightPercent, {
      duration: animations.duration.slow,
    });
  }, [heightPercent]);

  const animatedStyle = useAnimatedStyle(() => ({
    height: `${animatedHeight.value}%` as unknown as number,
  }));

  return (
    <View style={styles.barColumn}>
      {showValue && (
        <View style={styles.valueContainer}>
          <Animated.Text style={[styles.value, { color }]}>{value}</Animated.Text>
        </View>
      )}
      <View style={styles.barWrapper}>
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
    justifyContent: 'flex-end',
  },
  chartArea: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-around',
    paddingHorizontal: spacing.xs,
  },
  barColumn: {
    flex: 1,
    alignItems: 'center',
    gap: spacing.xs,
  },
  valueContainer: {
    alignItems: 'center',
  },
  value: {
    fontSize: 10,
    fontWeight: '600',
  },
  barWrapper: {
    flex: 1,
    width: '100%',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingHorizontal: 2,
  },
  bar: {
    width: '60%',
    minHeight: 4,
  },
  labelsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: spacing.sm,
  },
  labelContainer: {
    flex: 1,
    alignItems: 'center',
  },
  label: {
    fontSize: 10,
    textAlign: 'center',
  },
});
