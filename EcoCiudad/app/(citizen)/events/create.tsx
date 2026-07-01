import { useState, useCallback } from 'react';
import { View, ScrollView, StyleSheet, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { EventsLayout } from '@/presentation/components/templates/events-layout';
import { Header } from '@/presentation/components/organisms/header';
import { Button } from '@/presentation/components/atoms/button';
import { Input } from '@/presentation/components/atoms/input';
import { ThemedText } from '@/components/atoms/text';
import { Chip } from '@/components/atoms/chip';
import { PhotoPicker } from '@/components/molecules/photo-picker';
import { LocationSelector } from '@/components/molecules/location-selector';
import { useCreateEvent } from '@/presentation/hooks';
import { useAuthStore } from '@/presentation/stores';
import { useTheme } from '@/theme/context';
import { spacing } from '@/theme/spacing';
import { EVENT_CATEGORIES, EVENT_CONSTANTS } from '@/constants/event.constants';
import { type EventCategory, type GeoLocation } from '@/domain/entities';

export default function CreateEventScreen() {
  const theme = useTheme();
  const router = useRouter();
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
      Alert.alert('Permission required', 'Please allow access to your photos');
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
  }, []);

  const handleRemoveImage = useCallback((index: number) => {
    setImages(images.filter((_, i) => i !== index));
  }, [images]);

  const handleSubmit = useCallback(() => {
    if (!title || !description || !startDate || !startTime || !location) {
      Alert.alert('Missing information', 'Please fill in all required fields');
      return;
    }

    if (!user) {
      Alert.alert('Error', 'You must be logged in to create an event');
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
        currentAttendees: 0,
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
          Alert.alert('Success', 'Event created successfully', [
            { text: 'OK', onPress: () => router.back() },
          ]);
        },
        onError: (error) => {
          Alert.alert('Error', error.message || 'Failed to create event');
        },
      },
    );
  }, [title, description, category, startDate, startTime, endDate, endTime, maxAttendees, ecoPointsReward, location, images, requirements, isVirtual, meetingLink, user, createEvent, router]);

  return (
    <EventsLayout
      header={
        <Header
          title="Create Event"
          onBackPress={() => router.back()}
        />
      }
    >
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <View style={styles.form}>
          <Input
            label="Title *"
            placeholder="Enter event title"
            value={title}
            onChangeText={setTitle}
            maxLength={100}
          />

          <Input
            label="Description *"
            placeholder="Describe your event"
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={4}
            maxLength={500}
          />

          <View style={styles.section}>
            <ThemedText type="bodySmall" color={theme.colors.textSecondary}>
              Category *
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
                label="Start Date *"
                placeholder="YYYY-MM-DD"
                value={startDate}
                onChangeText={setStartDate}
              />
            </View>
            <View style={styles.field}>
              <Input
                label="Start Time *"
                placeholder="HH:MM"
                value={startTime}
                onChangeText={setStartTime}
              />
            </View>
          </View>

          <View style={styles.row}>
            <View style={styles.field}>
              <Input
                label="End Date"
                placeholder="YYYY-MM-DD"
                value={endDate}
                onChangeText={setEndDate}
              />
            </View>
            <View style={styles.field}>
              <Input
                label="End Time"
                placeholder="HH:MM"
                value={endTime}
                onChangeText={setEndTime}
              />
            </View>
          </View>

          <Input
            label="Max Participants"
            placeholder="Leave empty for unlimited"
            value={maxAttendees}
            onChangeText={setMaxAttendees}
            keyboardType="number-pad"
          />

          <Input
            label="Eco Points Reward"
            placeholder="Points for attending"
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
              {isVirtual ? 'Virtual Event' : 'In-Person Event'}
            </Chip>
          </View>

          {isVirtual && (
            <Input
              label="Meeting Link"
              placeholder="https://..."
              value={meetingLink}
              onChangeText={setMeetingLink}
              autoCapitalize="none"
            />
          )}

          <Input
            label="Requirements (one per line)"
            placeholder="Bring water\nWear comfortable shoes"
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
            Create Event
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
