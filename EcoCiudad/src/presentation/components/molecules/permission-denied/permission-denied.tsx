import { Linking, Platform, StyleSheet, View } from 'react-native';

import { Button } from '@/presentation/components/atoms/button';
import { Icon } from '@/presentation/components/atoms/icon';
import { ThemedText } from '@/presentation/components/atoms/text';
import { useTranslation } from '@/localization';
import { useTheme } from '@/theme/context';
import { borderRadius } from '@/theme/radius';
import { spacing } from '@/theme/spacing';

interface PermissionDeniedProps {
  title?: string;
  description?: string;
  onRetry?: () => void;
}

export function PermissionDenied({ title, description, onRetry }: PermissionDeniedProps) {
  const theme = useTheme();
  const { t } = useTranslation();

  const handleOpenSettings = () => {
    Linking.openSettings();
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={[styles.card, { backgroundColor: theme.colors.surface }]}>
        <View style={[styles.iconContainer, { backgroundColor: theme.colors.errorContainer }]}>
          <Icon name="map-pin-off" size={40} color={theme.colors.error} />
        </View>

        <ThemedText type="title" style={styles.title} numberOfLines={2}>
          {title || t('common.locationPermissionRequired')}
        </ThemedText>

        <ThemedText type="body" color={theme.colors.textSecondary} style={styles.description}>
          {description || t('common.locationPermissionNeeded')}
        </ThemedText>

        <View style={styles.actions}>
          <Button variant="primary" fullWidth onPress={handleOpenSettings}>
            {Platform.OS === 'ios' ? 'Abrir Ajustes' : 'Abrir Configuración'}
          </Button>

          {onRetry && (
            <Button variant="outlined" fullWidth onPress={onRetry}>
              {t('common.retry')}
            </Button>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.lg,
  },
  card: {
    width: '100%',
    maxWidth: 360,
    alignItems: 'center',
    padding: spacing['2xl'],
    borderRadius: borderRadius['2xl'],
    gap: spacing.lg,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    textAlign: 'center',
  },
  description: {
    textAlign: 'center',
    lineHeight: 22,
  },
  actions: {
    width: '100%',
    gap: spacing.md,
    marginTop: spacing.md,
  },
});
