import { useState, useCallback } from 'react';
import { View, StyleSheet, ScrollView, Alert, KeyboardAvoidingView, Platform } from 'react-native';
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
import { useAuthStore, useReportDraftStore } from '@/presentation/stores';
import { useTheme } from '@/theme/context';
import { spacing } from '@/theme/spacing';
import { borderRadius } from '@/theme/radius';
import { REPORT_CATEGORIES, REPORT_SEVERITIES, IMAGE_UPLOAD_CONFIG } from '@/constants/report.constants';
import { useTranslation } from '@/localization';
import { reportSchema } from '@/lib/validations/report.schema';
import { type ReportCategory, type ReportSeverity } from '@/domain/entities';

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
  const { mutate: createReport, isPending } = useCreateReportWithImages();
  const { user } = useAuthStore();
  const draft = useReportDraftStore();

  const [step, setStep] = useState<'form' | 'preview'>('form');
  const [errors, setErrors] = useState<FormErrors>({});

  const {
    title,
    description,
    category,
    severity,
    images,
    location,
    isAnonymous,
    setTitle,
    setDescription,
    setCategory,
    setSeverity,
    addImage,
    removeImage,
    setLocation,
    setIsAnonymous,
    reset,
  } = draft;

  const validate = useCallback((): boolean => {
    const hasLocation = !!location;
    const result = reportSchema.safeParse({
      title: title.trim(),
      description: description.trim(),
      category,
      latitude: location?.latitude,
      longitude: location?.longitude,
      address: location?.address,
      images,
    });

    const fieldErrors: FormErrors = {};
    if (!result.success) {
      for (const issue of result.error.issues) {
        const path = issue.path[0] as keyof FormErrors;
        if (!fieldErrors[path]) {
          fieldErrors[path] = issue.message;
        }
      }
    }

    if (!hasLocation) {
      fieldErrors.location = t('reports.locationRequired');
    }
    if (!category) {
      fieldErrors.category = t('reports.categoryRequired');
    }

    setErrors(fieldErrors);
    return Object.keys(fieldErrors).length === 0;
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

    try {
      if (source === 'camera') {
        const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
        if (permissionResult.status !== 'granted') {
          Alert.alert(t('reports.permissionRequiredTitle'), t('reports.cameraPermissionRequired'));
          return;
        }
        const pickerResult = await ImagePicker.launchCameraAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          quality: IMAGE_UPLOAD_CONFIG.COMPRESSION_QUALITY,
        });
        if (!pickerResult.canceled && pickerResult.assets) {
          pickerResult.assets.slice(0, IMAGE_UPLOAD_CONFIG.MAX_IMAGES - images.length).forEach((asset) => addImage(asset.uri));
        }
      } else {
        const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (permissionResult.status !== 'granted') {
          Alert.alert(t('reports.permissionRequiredTitle'), t('reports.photosPermissionRequired'));
          return;
        }
        const pickerResult = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsMultipleSelection: true,
          quality: IMAGE_UPLOAD_CONFIG.COMPRESSION_QUALITY,
        });
        if (!pickerResult.canceled && pickerResult.assets) {
          pickerResult.assets.slice(0, IMAGE_UPLOAD_CONFIG.MAX_IMAGES - images.length).forEach((asset) => addImage(asset.uri));
        }
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
    removeImage(index);
  };

  const handlePickLocation = () => {
    const initialParams = location
      ? `&initialLatitude=${location.latitude}&initialLongitude=${location.longitude}&initialAddress=${encodeURIComponent(location.address ?? '')}`
      : '';
    router.push(`/(citizen)/report/map-picker?returnTo=report-create${initialParams}` as any);
  };

  const handleSubmit = () => {
    if (!validate() || !category || !location || !user) return;

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
          reporterId: user.id,
          status: 'pending',
        },
        images,
      },
      {
        onSuccess: () => {
          reset();
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
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.keyboardView}>
          <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
            <Animated.View entering={FadeIn} style={[styles.previewContainer, { backgroundColor: theme.colors.surfaceVariant }]}>
              <ThemedText type="title" numberOfLines={2} ellipsizeMode="tail">{title}</ThemedText>
              <ThemedText type="body" color={theme.colors.textSecondary} numberOfLines={4} ellipsizeMode="tail">
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
                <ThemedText type="bodySmall" style={styles.previewValue}>
                  {location?.address ?? t('admin.noLocation')}
                </ThemedText>
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
              <Button variant="outlined" onPress={() => setStep('form')} style={styles.flexButton}>
                {t('reports.editButton')}
              </Button>
              <Button variant="primary" onPress={handleSubmit} loading={isPending} style={styles.flexButton}>
                {t('reports.submitReport')}
              </Button>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
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
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.keyboardView}>
        <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
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

            <Button variant="primary" onPress={validateForPreview} fullWidth>
              {t('reports.previewReport')}
            </Button>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </DashboardTemplate>
  );
}

const styles = StyleSheet.create({
  keyboardView: {
    flex: 1,
  },
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
    flexWrap: 'wrap',
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
    gap: spacing.md,
  },
  previewValue: {
    flexShrink: 1,
    textAlign: 'right',
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: spacing.md,
    marginTop: spacing.xl,
    flexWrap: 'wrap',
  },
  flexButton: {
    flex: 1,
    minWidth: 140,
  },
});
