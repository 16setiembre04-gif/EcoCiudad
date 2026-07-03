import { Icon } from '@/presentation/components/atoms/icon';
import { ThemedText } from '@/presentation/components/atoms/text';
import { useTheme } from '@/theme/context';
import { spacing } from '@/theme/spacing';
import { StyleSheet, View } from 'react-native';
import { type LocationBadgeProps } from './types';

export function LocationBadge({ address, isVirtual = false, numberOfLines = 1, style }: LocationBadgeProps) {
  const theme = useTheme();

  return (
    <View style={[styles.container, style]}>
      <Icon
        name={isVirtual ? 'link' : 'location'}
        size={16}
        color={theme.colors.textSecondary}
      />
      <ThemedText
        type="bodySmall"
        color={theme.colors.textSecondary}
        numberOfLines={numberOfLines}
        style={styles.text}
      >
        {isVirtual ? 'Virtual Event' : address}
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  text: {
    flex: 1,
  },
});
