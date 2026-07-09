import { EVENT_CATEGORIES, EVENT_CONSTANTS } from '@/constants/event.constants';
import { type EventCategory, type GeoLocation } from '@/domain/entities';
import { Button } from '@/presentation/components/atoms/button';
import { Chip } from '@/presentation/components/atoms/chip';
import { Input } from '@/presentation/components/atoms/input';
import { ThemedText } from '@/presentation/components/atoms/text';
import { LocationSelector } from '@/presentation/components/molecules/location-selector';
import { PhotoPicker } from '@/presentation/components/molecules/photo-picker';
import { Header } from '@/presentation/components/organisms/header';
import { EventsLayout } from '@/presentation/components/templates/events-layout';
import { useCreateEvent } from '@/presentation/hooks';
import { useAuthStore } from '@/presentation/stores';
import { useTheme } from '@/theme/context';
import { spacing } from '@/theme/spacing';
import { useTranslation } from '@/localization';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import { Alert, ScrollView, StyleSheet, View } from 'react-native';

export default function CreateEventScreen() {
  const theme = useTheme();
  const router = useRouter();
  const { t } = useTranslation();
  const user = useAuthStore((state) => state.user);

  const { mutate: createEvent, isPending } = useCreateEvent();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<EventCategory>('cleanup');
  const [startDate, setStartDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endDate, setEndDate] = useState('');
  const [endTime, setEndTime] = useState('');
  const [maxAttendees, setMaxAttendees] = useState('');
  const [ecoPointsReward, setEcoPointsReward] = useState(EVENT_CONSTANTS.DEFAULT_ECO_POINTS_REWARD.toString());
  const [images, setImages] = useState<string[]>([]);
  const [location, setLocation] = useState<GeoLocation | undefined>();
  const [requirements, setRequirements] = useState('');
  const [isVirtual, setIsVirtual] = useState(false);
  const [meetingLink, setMeetingLink] = useState('');

  const handlePickImage = useCallback(async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(t('common.permissionRequired'), t('reports.photosPermissionRequired'));
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsMultipleSelection: true,
      quality: 0.7,
    });

    if (!result.canceled && result.assets) {
      setImages(result.assets.map((asset) => asset.uri).slice(0, 3));
    }
  }, [t]);

  const handleRemoveImage = useCallback((index: number) => {
    setImages(images.filter((_, i) => i !== index));
  }, [images]);

  const handleSubmit = useCallback(() => {
    if (!title || !description || !startDate || !startTime || !location) {
      Alert.alert(t('reports.missingInfoTitle'), t('reports.missingInfoMessage'));
      return;
    }

    if (!user) {
      Alert.alert(t('common.error'), t('common.mustBeLoggedIn'));
      return;
    }

    const startDateTime = new Date(`${startDate}T${startTime}`);
    const endDateTime = endDate && endTime ? new Date(`${endDate}T${endTime}`) : new Date(startDateTime.getTime() + 2 * 60 * 60 * 1000);

    createEvent(
      {
        title,
        description,
        category,
        startDate: startDateTime,
        endDate: endDateTime,
        location,
        organizerId: user.id,
        maxAttendees: maxAttendees ? parseInt(maxAttendees) : undefined,
        status: 'upcoming',
        imageUrl: images[0],
        bannerUrl: images[0],
        ecoPointsReward: parseInt(ecoPointsReward) || EVENT_CONSTANTS.DEFAULT_ECO_POINTS_REWARD,
        requirements: requirements ? requirements.split('\n').filter(Boolean) : undefined,
        isVirtual,
        meetingLink: isVirtual ? meetingLink : undefined,
      },
      {
        onSuccess: () => {
          Alert.alert(t('common.success'), t('common.eventCreated'), [
            { text: t('common.ok'), onPress: () => router.back() },
          ]);
        },
        onError: (error) => {
          Alert.alert(t('common.error'), error.message || t('common.failedToCreateEvent'));
        },
      },
    );
  }, [title, description, category, startDate, startTime, endDate, endTime, maxAttendees, ecoPointsReward, location, images, requirements, isVirtual, meetingLink, user, createEvent, router, t]);

  return (
    <EventsLayout
      header={
        <Header
          title={t('common.createEvent')}
          onBackPress={() => router.back()}
        />
      }
    >
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <View style={styles.form}>
          <Input
            label={t('common.titleRequired')}
            placeholder={t('common.title')}
            value={title}
            onChangeText={setTitle}
            maxLength={100}
          />

          <Input
            label={t('common.descriptionRequired')}
            placeholder={t('common.description')}
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={4}
            maxLength={500}
          />

          <View style={styles.section}>
            <ThemedText type="bodySmall" color={theme.colors.textSecondary}>
              {t('common.categoryRequired')}
            </ThemedText>
            <View style={styles.chipRow}>
              {Object.entries(EVENT_CATEGORIES).map(([key, config]) => (
                <Chip
                  key={key}
                  variant={category === key ? 'filled' : 'tonal'}
                  size="sm"
                  iconName={config.icon}
                  onPress={() => setCategory(key as EventCategory)}
                >
                  {config.label}
                </Chip>
              ))}
            </View>
          </View>

          <View style={styles.row}>
            <View style={styles.field}>
              <Input
                label={t('common.startDateRequired')}
                placeholder={t('common.dateFormatPlaceholder')}
                value={startDate}
                onChangeText={setStartDate}
              />
            </View>
            <View style={styles.field}>
              <Input
                label={t('common.startTimeRequired')}
                placeholder={t('common.timeFormatPlaceholder')}
                value={startTime}
                onChangeText={setStartTime}
              />
            </View>
          </View>

          <View style={styles.row}>
            <View style={styles.field}>
              <Input
                label={t('common.endDate')}
                placeholder={t('common.dateFormatPlaceholder')}
                value={endDate}
                onChangeText={setEndDate}
              />
            </View>
            <View style={styles.field}>
              <Input
                label={t('common.endTime')}
                placeholder={t('common.timeFormatPlaceholder')}
                value={endTime}
                onChangeText={setEndTime}
              />
            </View>
          </View>

          <Input
            label={t('common.maxParticipants')}
            placeholder={t('common.unlimitedPlaceholder')}
            value={maxAttendees}
            onChangeText={setMaxAttendees}
            keyboardType="number-pad"
          />

          <Input
            label={t('common.ecoPointsReward')}
            placeholder={t('common.pointsForAttending')}
            value={ecoPointsReward}
            onChangeText={setEcoPointsReward}
            keyboardType="number-pad"
          />

          <PhotoPicker
            images={images}
            onAddImage={handlePickImage}
            onRemoveImage={handleRemoveImage}
            maxImages={3}
          />

          <LocationSelector
            location={location}
            onPickLocation={() => router.push('/(citizen)/report/map-picker')}
            onClear={() => setLocation(undefined)}
          />

          <View style={styles.virtualToggle}>
            <Chip
              variant={isVirtual ? 'filled' : 'tonal'}
              size="sm"
              iconName="link"
              onPress={() => setIsVirtual(!isVirtual)}
            >
              {isVirtual ? t('common.virtualEvent') : t('common.inPersonEvent')}
            </Chip>
          </View>

          {isVirtual && (
            <Input
              label={t('common.meetingLink')}
              placeholder={t('common.httpsPlaceholder')}
              value={meetingLink}
              onChangeText={setMeetingLink}
              autoCapitalize="none"
            />
          )}

          <Input
            label={t('common.requirementsOnePerLine')}
            placeholder={t('common.requirementsPlaceholder')}
            value={requirements}
            onChangeText={setRequirements}
            multiline
            numberOfLines={3}
          />

          <Button
            variant="primary"
            size="lg"
            fullWidth
            onPress={handleSubmit}
            loading={isPending}
            iconName="check"
            iconPosition="right"
          >
            {t('common.createEvent')}
          </Button>
        </View>
      </ScrollView>
    </EventsLayout>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing.lg,
    paddingBottom: spacing['5xl'],
  },
  form: {
    gap: spacing.lg,
  },
  section: {
    gap: spacing.sm,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  row: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  field: {
    flex: 1,
  },
  virtualToggle: {
    flexDirection: 'row',
  },
});
