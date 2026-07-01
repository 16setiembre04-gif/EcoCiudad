import { View, StyleSheet } from 'react-native';
import { MaterialChip } from '@/components/atoms/material-chip';
import { ThemedText } from '@/components/atoms/text';
import { useTheme } from '@/theme/context';
import { spacing } from '@/theme/spacing';
import { type MaterialListProps } from './types';

export function MaterialList({
  materials,
  maxDisplay = 5,
  style,
}: MaterialListProps) {
  const theme = useTheme();
  const displayMaterials = materials.slice(0, maxDisplay);
  const remainingCount = materials.length - maxDisplay;

  return (
    <View style={[styles.container, style]}>
      <View style={styles.chipsContainer}>
        {displayMaterials.map((material) => (
          <MaterialChip key={material} material={material} />
        ))}
      </View>
      {remainingCount > 0 && (
        <ThemedText type="caption" color={theme.colors.textSecondary}>
          +{remainingCount} more material{remainingCount > 1 ? 's' : ''}
        </ThemedText>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.sm,
  },
  chipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
});
