import { useState, useCallback } from 'react';
import { View, ScrollView, StyleSheet, Share, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { EventsLayout } from '@/presentation/components/templates/events-layout';
import { EventHeader } from '@/presentation/components/organisms/event-header';
import { EventRegistration } from '@/presentation/components/organisms/event-registration';
import { ParticipantsList } from '@/presentation/components/organisms/participants-list';
import { ThemedText } from '@/presentation/components/atoms/text';
import { Divider } from '@/presentation/components/atoms/divider';
import { Icon } from '@/presentation/components/atoms/icon';
import { RewardCard } from '@/presentation/components/molecules/reward-card';
import { useEvent, useEventParticipants, useIsRegistered, useIsFavorite, useToggleFavorite, useJoinEvent, useLeaveEvent } from '@/presentation/hooks';
import { useAuthStore } from '@/presentation/stores';
import { useTheme } from '@/theme/context';
import { spacing } from '@/theme/spacing';

export default function EventDetailsScreen() {
  const theme = useTheme();
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const user = useAuthStore((state) => state.user);

  const { data: event, isLoading } = useEvent(id);
  const { data: participants } = useEventParticipants(id);
  const { data: isRegistered } = useIsRegistered(id);
  const { data: isFavorite } = useIsFavorite(id);

  const { mutate: toggleFavorite } = useToggleFavorite();
  const { mutate: joinEvent, isPending: isJoining } = useJoinEvent();
  const { mutate: leaveEvent, isPending: isLeaving } = useLeaveEvent();

  const isFull = event ? (event.maxAttendees ? event.currentAttendees >= event.maxAttendees : false) : false;

  const handleShare = useCallback(async () => {
    if (!event) return;
    try {
      await Share.share({
        message: `Check out this event: ${event.title}\n${event.description}\n${event.location.address}`,
      });
    } catch {
      Alert.alert('Error', 'Failed to share event');
    }
  }, [event]);

  const handleRegister = useCallback(() => {
    if (!user || !id) return;
    joinEvent({ eventId: id, userId: user.id });
  }, [user, id, joinEvent]);

  const handleCancelRegistration = useCallback(() => {
    if (!id) return;
    Alert.alert(
      'Cancel Registration',
      'Are you sure you want to cancel your registration?',
      [
        { text: 'Keep', style: 'cancel' },
        {
          text: 'Cancel Registration',
          style: 'destructive',
          onPress: () => leaveEvent(id),
        },
      ],
    );
  }, [id, leaveEvent]);

  const handleFavoritePress = useCallback(() => {
    if (!id) return;
    toggleFavorite(id);
  }, [id, toggleFavorite]);

  if (isLoading || !event) {
    return (
      <EventsLayout>
        <View style={styles.loadingContainer}>
          <ThemedText>Loading event...</ThemedText>
        </View>
      </EventsLayout>
    );
  }

  return (
    <EventsLayout>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <EventHeader
          event={event}
          isFavorite={isFavorite}
          isRegistered={isRegistered}
          onFavoritePress={handleFavoritePress}
          onSharePress={handleShare}
          onBackPress={() => router.back()}
        />

        <View style={styles.section}>
          <ThemedText type="subtitle">About This Event</ThemedText>
          <ThemedText type="body" color={theme.colors.textSecondary}>
            {event.description}
          </ThemedText>
        </View>

        {event.requirements && event.requirements.length > 0 && (
          <View style={styles.section}>
            <ThemedText type="subtitle">Requirements</ThemedText>
            {event.requirements.map((req, index) => (
              <View key={index} style={styles.requirementRow}>
                <Icon name="check" size={16} color={theme.colors.primary} />
                <ThemedText type="bodySmall">{req}</ThemedText>
              </View>
            ))}
          </View>
        )}

        <View style={styles.section}>
          <ThemedText type="subtitle">Rewards</ThemedText>
          <RewardCard
            points={event.ecoPointsReward}
            title="Attendance Reward"
            description="Earn eco points by attending this event"
            earned={false}
          />
        </View>

        <Divider />

        <EventRegistration
          event={event}
          isRegistered={isRegistered}
          isRegistering={isJoining || isLeaving}
          isFull={isFull}
          onRegister={handleRegister}
          onCancelRegistration={handleCancelRegistration}
        />

        <Divider />

        <ParticipantsList
          participants={participants ?? []}
          title="Participants"
        />
      </ScrollView>
    </EventsLayout>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: spacing['5xl'],
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  section: {
    padding: spacing.lg,
    gap: spacing.md,
  },
  requirementRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
});
