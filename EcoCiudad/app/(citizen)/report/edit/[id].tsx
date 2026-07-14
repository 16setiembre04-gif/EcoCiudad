import { useEffect, useState, useCallback } from 'react';
import { View, StyleSheet, ScrollView, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import Animated, { FadeIn } from 'react-native-reanimated';
import { DashboardTemplate } from '@/presentation/components/templates';
import { Header } from '@/presentation/components/organisms/header';
import { Button } from '@/presentation/components/atoms/button';
import { Input } from '@/presentation/components/atoms/input';
import { ThemedText } from '@/presentation/components/atoms/text';
import { CategoryChip } from '@/presentation/components/atoms/category-chip';
import { LocationSelector } from '@/presentation/components/molecules/location-selector';
import { useReport, useUpdateReport } from '@/presentation/hooks';
import { useTheme } from '@/theme/context';
import { spacing } from '@/theme/spacing';
import { REPORT_CATEGORIES, REPORT_SEVERITIES } from '@/constants/report.constants';
import { useTranslation } from '@/localization';
import { reportSchema } from '@/lib/validations/report.schema';
import { type ReportCategory, type ReportSeverity, type GeoLocation } from '@/domain/entities';

type FormErrors = {
  title?: string;
  description?: string;
  category?: string;
  location?: string;
};

export default function EditReportScreen() {
  const theme = useTheme();
  const router = useRouter();
  const { t } = useTranslation();
  const { id, selectedLocation } = useLocalSearchParams<{ id: string; selectedLocation?: string }>();
  const { data: report, isLoading } = useReport(id);
  const { mutate: updateReport, isPending } = useUpdateReport();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<ReportCategory | undefined>();
  const [severity, setSeverity] = useState<ReportSeverity>('medium');
  const [location, setLocation] = useState<GeoLocation | undefined>();
  const [errors, setErrors] = useState<FormErrors>({});

  useEffect(() => {
    if (report) {
      setTitle(report.title);
      setDescription(report.description);
      setCategory(report.category);
      setSeverity(report.severity ?? 'medium');
      setLocation(report.location);
    }
  }, [report]);

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
      images: report?.images ?? [],
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
    if (!location) fieldErrors.location = t('reports.locationRequired');
    if (!category) fieldErrors.category = t('reports.categoryRequired');
    setErrors(fieldErrors);
    return false;
  }, [title, description, category, location, report?.images, t]);

  const handleSave = () => {
    if (!validate() || !id || !category || !location) return;

    updateReport(
      {
        id,
        data: {
          title: title.trim(),
          description: description.trim(),
          category,
          severity,
          location,
        },
      },
      {
        onSuccess: () => {
          Alert.alert(t('common.success'), t('reports.changesSaved'), [
            { text: t('common.ok'), onPress: () => router.back() },
          ]);
        },
        onError: (error) => {
          Alert.alert(t('common.error'), error.message || t('reports.failedToSaveChanges'));
        },
      }
    );
  };

  if (isLoading || !report) {
    return (
      <DashboardTemplate
        header={
          <Header
            title={t('reports.editTitle')}
            onBackPress={() => router.back()}
          />
        }
      >
        <View style={styles.loadingContainer}>
          <ThemedText>{t('common.loading')}</ThemedText>
        </View>
      </DashboardTemplate>
    );
  }

  return (
    <DashboardTemplate
      header={
        <Header
          title={t('reports.editTitle')}
          onBackPress={() => router.back()}
        />
      }
    >
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.keyboardView}>
        <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
          <Animated.View entering={FadeIn} style={styles.form}>
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

          <LocationSelector
            location={location}
            onPickLocation={() => router.push(`/(citizen)/report/map-picker?returnTo=report-edit&editReportId=${id}` as any)}
            onClear={() => setLocation(undefined)}
          />
          {errors.location && (
            <ThemedText type="caption" color={theme.colors.error}>
              {errors.location}
            </ThemedText>
          )}

          <Button variant="primary" onPress={handleSave} loading={isPending}>
            {t('common.save')}
          </Button>
        </Animated.View>
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
});
