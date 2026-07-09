import { useCallback } from 'react';
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
import { useTranslation } from '@/localization';

export default function EventDetailsScreen() {
  const theme = useTheme();
  const router = useRouter();
  const { t } = useTranslation();
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
        message: t('common.shareMessageEvent', {
          title: event.title,
          description: event.description,
          address: event.location.address ?? '',
        }),
      });
    } catch {
      Alert.alert(t('common.error'), t('common.failedToShareEvent'));
    }
  }, [event, t]);

  const handleRegister = useCallback(() => {
    if (!user || !id) return;
    joinEvent({ eventId: id, userId: user.id });
  }, [user, id, joinEvent]);

  const handleCancelRegistration = useCallback(() => {
    if (!id) return;
    Alert.alert(
      t('common.cancelRegistration'),
      t('common.confirmAttendanceQuestion'),
      [
        { text: t('common.keep'), style: 'cancel' },
        {
          text: t('common.cancelRegistration'),
          style: 'destructive',
          onPress: () => leaveEvent(id),
        },
      ],
    );
  }, [id, leaveEvent, t]);

  const handleFavoritePress = useCallback(() => {
    if (!id) return;
    toggleFavorite(id);
  }, [id, toggleFavorite]);

  if (isLoading || !event) {
    return (
      <EventsLayout>
        <View style={styles.loadingContainer}>
          <ThemedText>{t('common.loadingEvent')}</ThemedText>
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
          <ThemedText type="subtitle">{t('common.aboutThisEvent')}</ThemedText>
          <ThemedText type="body" color={theme.colors.textSecondary}>
            {event.description}
          </ThemedText>
        </View>

        {event.requirements && event.requirements.length > 0 && (
          <View style={styles.section}>
            <ThemedText type="subtitle">{t('common.requirements')}</ThemedText>
            {event.requirements.map((req, index) => (
              <View key={index} style={styles.requirementRow}>
                <Icon name="check" size={16} color={theme.colors.primary} />
                <ThemedText type="bodySmall">{req}</ThemedText>
              </View>
            ))}
          </View>
        )}

        <View style={styles.section}>
          <ThemedText type="subtitle">{t('common.rewards')}</ThemedText>
          <RewardCard
            points={event.ecoPointsReward}
            title={t('common.attendanceReward')}
            description={t('common.earnPointsByAttending')}
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
          title={t('common.participants')}
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
