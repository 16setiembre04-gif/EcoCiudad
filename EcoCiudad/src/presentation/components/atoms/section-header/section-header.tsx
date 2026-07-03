import { Icon } from '@/presentation/components/atoms/icon';
import { ThemedText } from '@/presentation/components/atoms/text';
import { useTheme } from '@/theme/context';
import { spacing } from '@/theme/spacing';
import { Pressable, StyleSheet, View } from 'react-native';
import { type SectionHeaderProps } from './types';

export function SectionHeader({ title, actionLabel, onActionPress, style }: SectionHeaderProps) {
  const theme = useTheme();

  return (
    <View style={[styles.container, style]}>
      <ThemedText type="subtitle" color={theme.colors.textPrimary}>
        {title}
      </ThemedText>
      {actionLabel && onActionPress && (
        <Pressable
          onPress={onActionPress}
          style={styles.action}
          accessibilityRole="button"
          accessibilityLabel={actionLabel}
        >
          <ThemedText type="bodySmall" color={theme.colors.primary}>
            {actionLabel}
          </ThemedText>
          <Icon name="chevron-right" size={16} color={theme.colors.primary} />
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.md,
  },
  action: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
});
