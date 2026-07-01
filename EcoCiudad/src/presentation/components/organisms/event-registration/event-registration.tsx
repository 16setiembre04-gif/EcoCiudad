import { View, StyleSheet } from 'react-native';
import { Button } from '@/components/atoms/button';
import { ThemedText } from '@/components/atoms/text';
import { Icon } from '@/components/atoms/icon';
import { useTheme } from '@/theme/context';
import { spacing } from '@/theme/spacing';
import { borderRadius } from '@/theme/radius';
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

  if (isFull && !isRegistered) {
    return (
      <View style={[styles.container, style]}>
        <View style={[styles.fullBanner, { backgroundColor: theme.colors.error + '15' }]}>
          <Icon name="error" size={20} color={theme.colors.error} />
          <ThemedText type="bodySmall" style={{ color: theme.colors.error, fontWeight: '600' }}>
            This event is full
          </ThemedText>
        </View>
        <Button variant="outlined" size="lg" fullWidth disabled>
          No Available Spots
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
            You're registered! Earn +{event.ecoPointsReward} eco points by attending.
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
          Cancel Registration
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
        Register for Event
      </Button>
      {event.maxAttendees && (
        <ThemedText type="caption" color={theme.colors.textSecondary} style={styles.spotsLeft}>
          {event.maxAttendees - event.currentAttendees} spots remaining
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
