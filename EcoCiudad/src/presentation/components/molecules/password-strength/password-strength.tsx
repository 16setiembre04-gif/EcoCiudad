import { useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, { useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { useTheme } from '@/theme/context';
import { spacing } from '@/theme/spacing';
import { borderRadius } from '@/theme/radius';
import { animations } from '@/theme/animations';
import { PASSWORD_STRENGTH, type PasswordStrengthLevel } from '@/constants/auth.constants';
import { type PasswordStrengthProps } from './types';

interface StrengthConfig {
  level: PasswordStrengthLevel;
  label: string;
  color: string;
  width: string;
  segments: number;
}

function evaluateStrength(password: string): StrengthConfig {
  let score = 0;

  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++;
  if (/\d/.test(password)) score++;
  if (/[^a-zA-Z0-9]/.test(password)) score++;

  if (score <= 1) {
    return { level: PASSWORD_STRENGTH.WEAK, label: 'Weak', color: '#EF4444', width: '25%', segments: 1 };
  }
  if (score === 2) {
    return { level: PASSWORD_STRENGTH.FAIR, label: 'Fair', color: '#F59E0B', width: '50%', segments: 2 };
  }
  if (score === 3) {
    return { level: PASSWORD_STRENGTH.GOOD, label: 'Good', color: '#3B82F6', width: '75%', segments: 3 };
  }
  return { level: PASSWORD_STRENGTH.STRONG, label: 'Strong', color: '#22C55E', width: '100%', segments: 4 };
}

export function PasswordStrength({ password }: PasswordStrengthProps) {
  const theme = useTheme();
  const config = useMemo(() => evaluateStrength(password), [password]);

  const barWidth = useAnimatedStyle(() => ({
    width: withTiming(config.width as any, { duration: animations.duration.normal }),
  }));

  if (!password) return null;

  return (
    <View style={styles.container}>
      <View style={[styles.barBackground, { backgroundColor: theme.colors.surfaceVariant }]}>
        <Animated.View
          style={[
            styles.barFill,
            { backgroundColor: config.color },
            barWidth as any,
          ]}
        />
      </View>
      <Text style={[styles.label, { color: config.color }]}>
        {config.label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.xs,
    gap: spacing.sm,
  },
  barBackground: {
    flex: 1,
    height: 4,
    borderRadius: borderRadius.full,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    borderRadius: borderRadius.full,
  },
  label: {
    fontSize: 12,
    fontWeight: '500',
    minWidth: 48,
    textAlign: 'right',
  },
});
