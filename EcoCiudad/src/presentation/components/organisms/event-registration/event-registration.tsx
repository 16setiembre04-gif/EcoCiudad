import { Button } from '@/presentation/components/atoms/button';
import { Icon } from '@/presentation/components/atoms/icon';
import { ThemedText } from '@/presentation/components/atoms/text';
import { useTheme } from '@/theme/context';
import { borderRadius } from '@/theme/radius';
import { spacing } from '@/theme/spacing';
import { useTranslation } from '@/localization';
import { StyleSheet, View } from 'react-native';
import { type EventRegistrationProps } from './types';

export function EventRegistration({
  event,
  isRegistered = false,
  isRegistering = false,
  isFull = false,
  onRegister,
  onCancelRegistration,
  style,
}: EventRegistrationProps) {
  const theme = useTheme();
  const { t } = useTranslation();

  if (isFull && !isRegistered) {
    return (
      <View style={[styles.container, style]}>
        <View style={[styles.fullBanner, { backgroundColor: theme.colors.error + '15' }]}>
          <Icon name="error" size={20} color={theme.colors.error} />
          <ThemedText type="bodySmall" style={{ color: theme.colors.error, fontWeight: '600' }}>
            {t('common.eventFull')}
          </ThemedText>
        </View>
        <Button variant="outlined" size="lg" fullWidth disabled>
          {t('common.noAvailableSpots')}
        </Button>
      </View>
    );
  }

  if (isRegistered) {
    return (
      <View style={[styles.container, style]}>
        <View style={[styles.registeredBanner, { backgroundColor: theme.colors.success + '15' }]}>
          <Icon name="check" size={20} color={theme.colors.success} />
          <ThemedText type="bodySmall" style={{ color: theme.colors.success, fontWeight: '600' }}>
            {t('common.registeredEarnPoints', { points: event.ecoPointsReward })}
          </ThemedText>
        </View>
        <Button
          variant="outlined"
          size="lg"
          fullWidth
          onPress={onCancelRegistration}
          loading={isRegistering}
          iconName="close"
        >
          {t('common.cancelRegistration')}
        </Button>
      </View>
    );
  }

  return (
    <View style={[styles.container, style]}>
      <Button
        variant="primary"
        size="lg"
        fullWidth
        onPress={onRegister}
        loading={isRegistering}
        iconName="check"
        iconPosition="right"
      >
        {t('common.registerForEvent')}
      </Button>
      {event.maxAttendees && (
        <ThemedText type="caption" color={theme.colors.textSecondary} style={styles.spotsLeft}>
          {t('common.spotsRemaining', { count: event.maxAttendees - event.currentAttendees })}
        </ThemedText>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.md,
    padding: spacing.lg,
  },
  fullBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderRadius: borderRadius.md,
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  registeredBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderRadius: borderRadius.md,
    gap: spacing.sm,
  },
  spotsLeft: {
    textAlign: 'center',
  },
});
