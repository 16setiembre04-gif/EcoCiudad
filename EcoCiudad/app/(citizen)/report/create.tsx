import { useState } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import Animated, { FadeIn } from 'react-native-reanimated';
import { DashboardTemplate } from '@/presentation/components/templates';
import { Header } from '@/presentation/components/organisms/header';
import { Button } from '@/presentation/components/atoms/button';
import { Input } from '@/presentation/components/atoms/input';
import { ThemedText } from '@/presentation/components/atoms/text';
import { CategoryChip } from '@/presentation/components/atoms/category-chip';
import { SeverityBadge } from '@/presentation/components/atoms/severity-badge';
import { PhotoPicker } from '@/presentation/components/molecules/photo-picker';
import { LocationSelector } from '@/presentation/components/molecules/location-selector';
import { Checkbox } from '@/presentation/components/atoms/checkbox';
import { useCreateReportWithImages } from '@/presentation/hooks/use-report-queries.hook';
import { useTheme } from '@/theme/context';
import { spacing } from '@/theme/spacing';
import { borderRadius } from '@/theme/radius';
import { REPORT_CATEGORIES, REPORT_SEVERITIES, IMAGE_UPLOAD_CONFIG } from '@/constants/report.constants';
import { type ReportCategory, type ReportSeverity, type GeoLocation } from '@/domain/entities';

export default function CreateReportScreen() {
  const theme = useTheme();
  const router = useRouter();
  const { mutate: createReport, isPending } = useCreateReportWithImages();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<ReportCategory | undefined>();
  const [severity, setSeverity] = useState<ReportSeverity>('medium');
  const [images, setImages] = useState<string[]>([]);
  const [location, setLocation] = useState<GeoLocation | undefined>();
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [step, setStep] = useState<'form' | 'preview'>('form');

  const handlePickImage = async () => {
    if (images.length >= IMAGE_UPLOAD_CONFIG.MAX_IMAGES) {
      Alert.alert('Limit reached', `You can only upload ${IMAGE_UPLOAD_CONFIG.MAX_IMAGES} images`);
      return;
    }

    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission required', 'Please allow access to your photos');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsMultipleSelection: true,
      quality: IMAGE_UPLOAD_CONFIG.COMPRESSION_QUALITY,
    });

    if (!result.canceled && result.assets) {
      const newImages = result.assets.map((asset) => asset.uri).slice(0, IMAGE_UPLOAD_CONFIG.MAX_IMAGES - images.length);
      setImages([...images, ...newImages]);
    }
  };

  const handleRemoveImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handlePickLocation = () => {
    router.push('/(citizen)/report/map-picker');
  };

  const handlePreview = () => {
    if (!title || !description || !category || !location) {
      Alert.alert('Missing information', 'Please fill in all required fields');
      return;
    }
    setStep('preview');
  };

  const handleSubmit = () => {
    if (!category || !location) {
      Alert.alert('Missing information', 'Please fill in all required fields');
      return;
    }

    createReport(
      {
        report: {
          title,
          description,
          category,
          severity,
          isAnonymous,
          location,
          images: [],
          reporterId: '',
          status: 'pending',
        },
        images,
      },
      {
        onSuccess: () => {
          Alert.alert('Success', 'Report submitted successfully', [
            { text: 'OK', onPress: () => router.back() },
          ]);
        },
        onError: (error) => {
          Alert.alert('Error', error.message || 'Failed to submit report');
        },
      }
    );
  };

  if (step === 'preview') {
    return (
      <DashboardTemplate
        header={
          <Header
            title="Preview Report"
            onBackPress={() => setStep('form')}
          />
        }
      >
        <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
          <Animated.View entering={FadeIn} style={styles.previewContainer}>
            <ThemedText type="title">{title}</ThemedText>
            <ThemedText type="body" color={theme.colors.textSecondary}>
              {description}
            </ThemedText>

            <View style={styles.previewRow}>
              <ThemedText type="bodySmall" color={theme.colors.textSecondary}>
                Category:
              </ThemedText>
              <CategoryChip category={category!} />
            </View>

            <View style={styles.previewRow}>
              <ThemedText type="bodySmall" color={theme.colors.textSecondary}>
                Severity:
              </ThemedText>
              <SeverityBadge severity={severity} />
            </View>

            <View style={styles.previewRow}>
              <ThemedText type="bodySmall" color={theme.colors.textSecondary}>
                Location:
              </ThemedText>
              <ThemedText type="bodySmall">{location?.address ?? 'Not set'}</ThemedText>
            </View>

            <View style={styles.previewRow}>
              <ThemedText type="bodySmall" color={theme.colors.textSecondary}>
                Anonymous:
              </ThemedText>
              <ThemedText type="bodySmall">{isAnonymous ? 'Yes' : 'No'}</ThemedText>
            </View>

            {images.length > 0 && (
              <View style={styles.previewRow}>
                <ThemedText type="bodySmall" color={theme.colors.textSecondary}>
                  Photos:
                </ThemedText>
                <ThemedText type="bodySmall">{images.length} photo(s)</ThemedText>
              </View>
            )}
          </Animated.View>

          <View style={styles.buttonContainer}>
            <Button variant="outlined" onPress={() => setStep('form')}>
              Edit
            </Button>
            <Button variant="primary" onPress={handleSubmit} loading={isPending}>
              Submit Report
            </Button>
          </View>
        </ScrollView>
      </DashboardTemplate>
    );
  }

  return (
    <DashboardTemplate
      header={
        <Header
          title="Create Report"
          onBackPress={() => router.back()}
        />
      }
    >
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <View style={styles.form}>
          <Input
            label="Title *"
            placeholder="Brief title for your report"
            value={title}
            onChangeText={setTitle}
            maxLength={100}
          />

          <Input
            label="Description *"
            placeholder="Describe the issue in detail"
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
              {Object.keys(REPORT_CATEGORIES).map((key) => (
                <CategoryChip
                  key={key}
                  category={key as ReportCategory}
                  selected={category === key}
                  onPress={() => setCategory(key as ReportCategory)}
                />
              ))}
            </View>
          </View>

          <View style={styles.section}>
            <ThemedText type="bodySmall" color={theme.colors.textSecondary}>
              Severity
            </ThemedText>
            <View style={styles.severityRow}>
              {Object.keys(REPORT_SEVERITIES).map((key) => (
                <Button
                  key={key}
                  variant={severity === key ? 'primary' : 'outlined'}
                  size="sm"
                  onPress={() => setSeverity(key as ReportSeverity)}
                >
                  {REPORT_SEVERITIES[key as ReportSeverity].label}
                </Button>
              ))}
            </View>
          </View>

          <PhotoPicker
            images={images}
            onAddImage={handlePickImage}
            onRemoveImage={handleRemoveImage}
          />

          <LocationSelector
            location={location}
            onPickLocation={handlePickLocation}
            onClear={() => setLocation(undefined)}
          />

          <View style={styles.anonymousRow}>
            <Checkbox
              checked={isAnonymous}
              onCheckedChange={setIsAnonymous}
            />
            <ThemedText type="bodySmall">Submit anonymously</ThemedText>
          </View>

          <Button variant="primary" onPress={handlePreview}>
            Preview Report
          </Button>
        </View>
      </ScrollView>
    </DashboardTemplate>
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
  severityRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  anonymousRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  previewContainer: {
    gap: spacing.md,
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
  },
  previewRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: spacing.md,
    marginTop: spacing.xl,
  },
});
