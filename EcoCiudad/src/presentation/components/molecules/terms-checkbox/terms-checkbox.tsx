import { View, Pressable, StyleSheet } from 'react-native';
import { Checkbox } from '@/presentation/components/atoms/checkbox';
import { ThemedText } from '@/presentation/components/atoms/text';
import { useTheme } from '@/theme/context';
import { spacing } from '@/theme/spacing';
import { type TermsCheckboxProps } from './types';

export function TermsCheckbox({ checked, onCheckedChange, error, accentColor }: TermsCheckboxProps) {
  const theme = useTheme();

  return (
    <Pressable
      style={styles.container}
      onPress={() => onCheckedChange(!checked)}
      accessibilityRole="checkbox"
      accessibilityState={{ checked }}
    >
      <Checkbox
        checked={checked}
        onCheckedChange={onCheckedChange}
        error={error}
        accentColor={accentColor}
      />
      <View style={styles.textContainer}>
        <ThemedText type="bodySmall" style={[styles.text, { color: theme.colors.textSecondary }]}>
          I agree to the{' '}
        </ThemedText>
        <ThemedText type="bodySmall" style={[styles.link, { color: theme.colors.primary }]}>
          Terms of Service
        </ThemedText>
        <ThemedText type="bodySmall" style={[styles.text, { color: theme.colors.textSecondary }]}>
          {' '}and{' '}
        </ThemedText>
        <ThemedText type="bodySmall" style={[styles.link, { color: theme.colors.primary }]}>
          Privacy Policy
        </ThemedText>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.md,
  },
  textContainer: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  text: {
    lineHeight: 20,
  },
  link: {
    lineHeight: 20,
    fontWeight: '600',
  },
});
