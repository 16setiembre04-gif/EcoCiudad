import { Button } from '@/presentation/components/atoms/button';
import { Icon } from '@/presentation/components/atoms/icon';
import { ThemedText } from '@/presentation/components/atoms/text';
import { RewardCard } from '@/presentation/components/molecules/reward-card';
import { Header } from '@/presentation/components/organisms/header';
import { EventsLayout } from '@/presentation/components/templates/events-layout';
import { useEvent, useEventAttendance, useMarkAttendance } from '@/presentation/hooks';
import { useTheme } from '@/theme/context';
import { borderRadius } from '@/theme/radius';
import { spacing } from '@/theme/spacing';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback } from 'react';
import { Alert, StyleSheet, View } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';

export default function EventAttendanceScreen() {
  const theme = useTheme();
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();

  const { data: event } = useEvent(id);
  const { data: attendance } = useEventAttendance(id);
  const { mutate: markAttendance, isPending } = useMarkAttendance();

  const hasAttended = !!attendance;

  const handleMarkAttendance = useCallback(() => {
    if (!id) return;
    Alert.alert(
      'Mark Attendance',
      'Confirm your attendance at this event?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Confirm',
          onPress: () => {
            markAttendance(id, {
              onSuccess: () => {
                Alert.alert('Success', `You earned +${event?.ecoPointsReward ?? 10} eco points!`);
              },
              onError: (error) => {
                Alert.alert('Error', error.message || 'Failed to mark attendance');
              },
            });
          },
        },
      ],
    );
  }, [id, event, markAttendance]);

  return (
    <EventsLayout
      header={
        <Header
          title="Attendance"
          onBackPress={() => router.back()}
        />
      }
    >
      <View style={styles.container}>
        {hasAttended ? (
          <Animated.View entering={FadeIn} style={styles.successContainer}>
            <View style={[styles.successIcon, { backgroundColor: theme.colors.success + '20' }]}>
              <Icon name="success" size={48} color={theme.colors.success} />
            </View>

            <ThemedText type="headline" style={styles.successTitle}>
              Attendance Confirmed!
            </ThemedText>

            <ThemedText type="body" color={theme.colors.textSecondary} style={styles.successSubtitle}>
              You attended {event?.title ?? 'this event'}
            </ThemedText>

            <View style={styles.rewardContainer}>
              <RewardCard
                points={attendance.ecoPointsEarned}
                title="Eco Points Earned"
                description="Points have been added to your account"
                earned
              />
            </View>

            <View style={[styles.qrPlaceholder, { backgroundColor: theme.colors.surfaceVariant }]}>
              <Icon name="check" size={48} color={theme.colors.textSecondary} />
              <ThemedText type="bodySmall" color={theme.colors.textSecondary}>
                Certificate Placeholder
              </ThemedText>
            </View>

            <ThemedText type="caption" color={theme.colors.textSecondary} style={styles.dateText}>
              Attended on {attendance.attendedAt.toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </ThemedText>

            <Button
              variant="primary"
              size="lg"
              fullWidth
              onPress={() => router.back()}
              iconName="arrow-left"
            >
              Back to Event
            </Button>
          </Animated.View>
        ) : (
          <Animated.View entering={FadeIn} style={styles.pendingContainer}>
            <View style={[styles.qrContainer, { backgroundColor: theme.colors.surfaceVariant }]}>
              <Icon name="check" size={64} color={theme.colors.textSecondary} />
              <ThemedText type="bodySmall" color={theme.colors.textSecondary} style={styles.qrText}>
                QR Code Placeholder
              </ThemedText>
            </View>

            <ThemedText type="title" style={styles.pendingTitle}>
              Mark Your Attendance
            </ThemedText>

            <ThemedText type="body" color={theme.colors.textSecondary} style={styles.pendingSubtitle}>
              Confirm your attendance to earn eco points
            </ThemedText>

            <View style={styles.rewardPreview}>
              <RewardCard
                points={event?.ecoPointsReward ?? 10}
                title="Attendance Reward"
                description="Earn these points by attending"
              />
            </View>

            <Button
              variant="primary"
              size="lg"
              fullWidth
              onPress={handleMarkAttendance}
              loading={isPending}
              iconName="check"
              iconPosition="right"
            >
              Confirm Attendance
            </Button>
          </Animated.View>
        )}
      </View>
    </EventsLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: spacing.lg,
  },
  successContainer: {
    flex: 1,
    alignItems: 'center',
    gap: spacing.xl,
    paddingTop: spacing['3xl'],
  },
  successIcon: {
    width: 96,
    height: 96,
    borderRadius: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  successTitle: {
    textAlign: 'center',
  },
  successSubtitle: {
    textAlign: 'center',
  },
  rewardContainer: {
    width: '100%',
  },
  qrPlaceholder: {
    width: '100%',
    height: 160,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
  },
  dateText: {
    textAlign: 'center',
  },
  pendingContainer: {
    flex: 1,
    alignItems: 'center',
    gap: spacing.xl,
    paddingTop: spacing['3xl'],
  },
  qrContainer: {
    width: 200,
    height: 200,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.md,
  },
  qrText: {
    textAlign: 'center',
  },
  pendingTitle: {
    textAlign: 'center',
  },
  pendingSubtitle: {
    textAlign: 'center',
  },
  rewardPreview: {
    width: '100%',
  },
});
