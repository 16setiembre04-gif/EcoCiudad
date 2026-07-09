import { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
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
import { useTranslation } from '@/localization';
import { reportSchema } from '@/lib/validations/report.schema';
import { type ReportCategory, type ReportSeverity, type GeoLocation } from '@/domain/entities';

type FormErrors = {
  title?: string;
  description?: string;
  category?: string;
  location?: string;
  images?: string;
};

export default function CreateReportScreen() {
  const theme = useTheme();
  const router = useRouter();
  const { t } = useTranslation();
  const { selectedLocation } = useLocalSearchParams<{ selectedLocation?: string }>();
  const { mutate: createReport, isPending } = useCreateReportWithImages();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<ReportCategory | undefined>();
  const [severity, setSeverity] = useState<ReportSeverity>('medium');
  const [images, setImages] = useState<string[]>([]);
  const [location, setLocation] = useState<GeoLocation | undefined>();
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [step, setStep] = useState<'form' | 'preview'>('form');
  const [errors, setErrors] = useState<FormErrors>({});

  useEffect(() => {
    if (selectedLocation) {
      try {
        const parsed = JSON.parse(selectedLocation) as GeoLocation;
        setLocation(parsed);
        router.setParams({ selectedLocation: undefined });
      } catch {
        // ignore malformed param
      }
    }
  }, [selectedLocation, router]);

  const validate = useCallback((): boolean => {
    const result = reportSchema.safeParse({
      title: title.trim(),
      description: description.trim(),
      category,
      latitude: location?.latitude ?? 0,
      longitude: location?.longitude ?? 0,
      address: location?.address,
      images,
    });

    if (result.success) {
      setErrors({});
      return true;
    }

    const fieldErrors: FormErrors = {};
    for (const issue of result.error.issues) {
      const path = issue.path[0] as keyof FormErrors;
      if (!fieldErrors[path]) {
        fieldErrors[path] = issue.message;
      }
    }

    // Override numeric location errors with friendly message when no location selected
    if (!location) {
      fieldErrors.location = t('reports.locationRequired');
    }
    if (!category) {
      fieldErrors.category = t('reports.categoryRequired');
    }

    setErrors(fieldErrors);
    return false;
  }, [title, description, category, location, images, t]);

  const validateForPreview = () => {
    if (!validate()) return;
    setStep('preview');
  };

  const handleAddImage = async (source: 'camera' | 'gallery') => {
    if (images.length >= IMAGE_UPLOAD_CONFIG.MAX_IMAGES) {
      Alert.alert(
        t('reports.limitReachedTitle'),
        t('reports.limitReachedMessage', { max: IMAGE_UPLOAD_CONFIG.MAX_IMAGES })
      );
      return;
    }

    let permissionResult;
    let pickerResult;

    try {
      if (source === 'camera') {
        permissionResult = await ImagePicker.requestCameraPermissionsAsync();
        if (permissionResult.status !== 'granted') {
          Alert.alert(t('reports.permissionRequiredTitle'), t('reports.cameraPermissionRequired'));
          return;
        }
        pickerResult = await ImagePicker.launchCameraAsync({
          mediaTypes: ['images'],
          quality: IMAGE_UPLOAD_CONFIG.COMPRESSION_QUALITY,
        });
      } else {
        permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (permissionResult.status !== 'granted') {
          Alert.alert(t('reports.permissionRequiredTitle'), t('reports.photosPermissionRequired'));
          return;
        }
        pickerResult = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ['images'],
          allowsMultipleSelection: true,
          quality: IMAGE_UPLOAD_CONFIG.COMPRESSION_QUALITY,
        });
      }

      if (!pickerResult.canceled && pickerResult.assets) {
        const newImages = pickerResult.assets.map((asset) => asset.uri).slice(0, IMAGE_UPLOAD_CONFIG.MAX_IMAGES - images.length);
        setImages((prev) => [...prev, ...newImages]);
      }
    } catch {
      Alert.alert(t('common.error'), t('reports.failedToSubmitReport'));
    }
  };

  const handlePickImage = () => {
    Alert.alert(t('reports.photoSourceTitle'), undefined, [
      { text: t('reports.takePhoto'), onPress: () => handleAddImage('camera') },
      { text: t('reports.chooseFromGallery'), onPress: () => handleAddImage('gallery') },
      { text: t('common.cancel'), style: 'cancel' },
    ]);
  };

  const handleRemoveImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handlePickLocation = () => {
    router.push('/(citizen)/report/map-picker');
  };

  const handleSubmit = () => {
    if (!validate() || !category || !location) return;

    createReport(
      {
        report: {
          title: title.trim(),
          description: description.trim(),
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
          Alert.alert(t('reports.reportSubmittedTitle'), t('reports.reportSubmittedMessage'), [
            { text: t('common.ok'), onPress: () => router.back() },
          ]);
        },
        onError: (error) => {
          Alert.alert(t('common.error'), error.message || t('reports.failedToSubmitReport'));
        },
      }
    );
  };

  if (step === 'preview') {
    return (
      <DashboardTemplate
        header={
          <Header
            title={t('reports.previewTitle')}
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
                {t('reports.previewCategory')}
              </ThemedText>
              <CategoryChip category={category!} />
            </View>

            <View style={styles.previewRow}>
              <ThemedText type="bodySmall" color={theme.colors.textSecondary}>
                {t('reports.previewSeverity')}
              </ThemedText>
              <SeverityBadge severity={severity} />
            </View>

            <View style={styles.previewRow}>
              <ThemedText type="bodySmall" color={theme.colors.textSecondary}>
                {t('reports.previewLocation')}
              </ThemedText>
              <ThemedText type="bodySmall">{location?.address ?? t('admin.noLocation')}</ThemedText>
            </View>

            <View style={styles.previewRow}>
              <ThemedText type="bodySmall" color={theme.colors.textSecondary}>
                {t('reports.previewAnonymous')}
              </ThemedText>
              <ThemedText type="bodySmall">{isAnonymous ? t('reports.previewYes') : t('reports.previewNo')}</ThemedText>
            </View>

            {images.length > 0 && (
              <View style={styles.previewRow}>
                <ThemedText type="bodySmall" color={theme.colors.textSecondary}>
                  {t('reports.previewPhotos')}
                </ThemedText>
                <ThemedText type="bodySmall">{t('reports.photoCount', { count: images.length })}</ThemedText>
              </View>
            )}
          </Animated.View>

          <View style={styles.buttonContainer}>
            <Button variant="outlined" onPress={() => setStep('form')}>
              {t('reports.editButton')}
            </Button>
            <Button variant="primary" onPress={handleSubmit} loading={isPending}>
              {t('reports.submitReport')}
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
          title={t('reports.createTitle')}
          onBackPress={() => router.back()}
        />
      }
    >
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <View style={styles.form}>
          <Input
            label={t('reports.titleLabel')}
            placeholder={t('reports.titlePlaceholder')}
            value={title}
            onChangeText={setTitle}
            maxLength={100}
            errorText={errors.title}
            state={errors.title ? 'error' : 'default'}
          />

          <Input
            label={t('reports.descriptionLabel')}
            placeholder={t('reports.descriptionPlaceholder')}
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={4}
            maxLength={500}
            errorText={errors.description}
            state={errors.description ? 'error' : 'default'}
          />

          <View style={styles.section}>
            <ThemedText type="bodySmall" color={theme.colors.textSecondary}>
              {t('reports.categoryLabel')}
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
            {errors.category && (
              <ThemedText type="caption" color={theme.colors.error}>
                {errors.category}
              </ThemedText>
            )}
          </View>

          <View style={styles.section}>
            <ThemedText type="bodySmall" color={theme.colors.textSecondary}>
              {t('reports.severityLabel')}
            </ThemedText>
            <View style={styles.severityRow}>
              {Object.keys(REPORT_SEVERITIES).map((key) => (
                <Button
                  key={key}
                  variant={severity === key ? 'primary' : 'outlined'}
                  size="sm"
                  onPress={() => setSeverity(key as ReportSeverity)}
                >
                  {t(REPORT_SEVERITIES[key as ReportSeverity].labelKey)}
                </Button>
              ))}
            </View>
          </View>

          <PhotoPicker
            images={images}
            onAddImage={handlePickImage}
            onRemoveImage={handleRemoveImage}
          />
          {errors.images && (
            <ThemedText type="caption" color={theme.colors.error}>
              {errors.images}
            </ThemedText>
          )}

          <LocationSelector
            location={location}
            onPickLocation={handlePickLocation}
            onClear={() => setLocation(undefined)}
          />
          {errors.location && (
            <ThemedText type="caption" color={theme.colors.error}>
              {errors.location}
            </ThemedText>
          )}

          <View style={styles.anonymousRow}>
            <Checkbox
              checked={isAnonymous}
              onCheckedChange={setIsAnonymous}
            />
            <ThemedText type="bodySmall">{t('reports.anonymousLabel')}</ThemedText>
          </View>

          <Button variant="primary" onPress={validateForPreview}>
            {t('reports.previewReport')}
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
