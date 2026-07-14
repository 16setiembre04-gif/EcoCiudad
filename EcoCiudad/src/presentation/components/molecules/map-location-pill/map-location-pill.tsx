import { Button } from '@/presentation/components/atoms/button';
import { Icon } from '@/presentation/components/atoms/icon';
import { ThemedText } from '@/presentation/components/atoms/text';
import { useTheme } from '@/theme/context';
import { spacing } from '@/theme/spacing';
import { borderRadius } from '@/theme/radius';
import { useTranslation } from '@/localization';
import { Pressable, StyleSheet } from 'react-native';

export interface MapLocationPillProps {
  hasLocation: boolean;
  locationName?: string;
  onPress: () => void;
  onRetry?: () => void;
  loading?: boolean;
}

export function MapLocationPill({
  hasLocation,
  locationName,
  onPress,
  onRetry,
  loading,
}: MapLocationPillProps) {
  const theme = useTheme();
  const { t } = useTranslation();

  return (
    <Pressable
      onPress={hasLocation ? onPress : onRetry || onPress}
      style={[
        styles.container,
        {
          backgroundColor: hasLocation ? theme.colors.surface : theme.colors.errorContainer,
          borderColor: hasLocation ? theme.colors.border : theme.colors.error,
        },
      ]}
      accessibilityRole="button"
    >
      <Icon
        name={hasLocation ? 'locate' : 'map-pin-off'}
        size={16}
        color={hasLocation ? theme.colors.primary : theme.colors.error}
      />
      <ThemedText
        type="bodySmall"
        color={hasLocation ? theme.colors.textPrimary : theme.colors.error}
        numberOfLines={1}
        style={styles.text}
      >
        {loading
          ? t('common.loading')
          : hasLocation
            ? locationName || t('common.myLocation')
            : t('common.locationUnavailable')}
      </ThemedText>
      {!hasLocation && onRetry && (
        <Button variant="ghost" size="sm" onPress={onRetry} textStyle={{ color: theme.colors.error }}>
          {t('common.retry')}
        </Button>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
    borderWidth: 1,
    maxWidth: '85%',
  },
  text: {
    flexShrink: 1,
  },
});
