import { Pressable, StyleSheet } from 'react-native';
import { Checkbox } from '@/presentation/components/atoms/checkbox';
import { ThemedText } from '@/presentation/components/atoms/text';
import { useTheme } from '@/theme/context';
import { spacing } from '@/theme/spacing';
import { type RememberMeProps } from './types';

export function RememberMe({ checked, onCheckedChange }: RememberMeProps) {
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
        size="sm"
      />
      <ThemedText type="bodySmall" style={{ color: theme.colors.textSecondary }}>
        Remember me
      </ThemedText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
});
