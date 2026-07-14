import { useState, useCallback, useEffect } from 'react';
import { View, ScrollView, StyleSheet, Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { CommunityTemplate } from '@/presentation/components/templates';
import { Header } from '@/presentation/components/organisms/header';
import { Input } from '@/presentation/components/atoms/input';
import { Button } from '@/presentation/components/atoms/button';
import { ThemedText } from '@/presentation/components/atoms/text';
import { Card } from '@/presentation/components/atoms/card';
import { Chip } from '@/presentation/components/atoms/chip';
import { useCreateCommunity } from '@/presentation/hooks';
import { useAuthStore } from '@/presentation/stores';
import { useTheme } from '@/theme/context';
import { spacing } from '@/theme/spacing';
import { useTranslation } from '@/localization';
import { COMMUNITY_CATEGORIES } from '@/constants';
import { CommunityCategory, CommunityPrivacy } from '@/domain/entities/community';
import { type GeoLocation } from '@/domain/entities';
import { LocationSelector } from '@/presentation/components/molecules/location-selector';

export default function CreateCommunityScreen() {
  const theme = useTheme();
  const router = useRouter();
  const { t } = useTranslation();
  const { selectedLocation } = useLocalSearchParams<{ selectedLocation?: string }>();
  const createMutation = useCreateCommunity();
  const { user } = useAuthStore();

  const [geoLocation, setGeoLocation] = useState<GeoLocation | undefined>(() => {
    if (selectedLocation) {
      try {
        return JSON.parse(selectedLocation) as GeoLocation;
      } catch {
        return undefined;
      }
    }
    return undefined;
  });

  useEffect(() => {
    if (selectedLocation) {
      try {
        setGeoLocation(JSON.parse(selectedLocation) as GeoLocation);
      } catch {
        setGeoLocation(undefined);
      }
    }
  }, [selectedLocation]);

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<CommunityCategory>(CommunityCategory.ENVIRONMENTAL);
  const [privacy, setPrivacy] = useState<CommunityPrivacy>(CommunityPrivacy.PUBLIC);
  const [department, setDepartment] = useState('');
  const [district, setDistrict] = useState('');
  const [rulesText, setRulesText] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = useCallback(() => {
    const newErrors: Record<string, string> = {};
    if (!name.trim()) newErrors.name = t('common.nameRequired');
    if (name.length > 100) newErrors.name = t('common.nameTooLong');
    if (!description.trim()) newErrors.description = t('common.descriptionRequired');
    if (description.length > 500) newErrors.description = t('common.descriptionTooLong');
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [name, description, t]);

  const handleSubmit = useCallback(async () => {
    if (!validate()) return;
    if (!user) {
      Alert.alert(t('common.error'), t('auth.notAuthenticated'));
      return;
    }

    const rules = rulesText
      .split('\n')
      .map((r) => r.trim())
      .filter((r) => r.length > 0)
      .slice(0, 10);

    try {
      await createMutation.mutateAsync({
        name: name.trim(),
        description: description.trim(),
        category,
        privacy,
        location: department && district ? { department: department.trim(), district: district.trim() } : undefined,
        geoLocation,
        rules: rules.length > 0 ? rules : undefined,
        ownerId: user.id,
      });
      router.replace('/(citizen)/community/my-communities');
    } catch (error) {
      Alert.alert(t('common.error'), t('errors.failedToCreateCommunity'));
    }
  }, [validate, name, description, category, privacy, department, district, geoLocation, rulesText, createMutation, router, t, user]);

  return (
    <CommunityTemplate
      header={
        <Header title={t('common.createCommunity')} showBackButton />
      }
    >
      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        <Card variant="elevated" padding="lg" style={styles.formCard}>
          <Input
            label={t('common.name')}
            value={name}
            onChangeText={setName}
            placeholder={t('common.communityName')}
            errorText={errors.name}
          />

          <Input
            label={t('common.description')}
            value={description}
            onChangeText={setDescription}
            placeholder={t('common.communityDescription')}
            errorText={errors.description}
            multiline
            numberOfLines={4}
          />

          <View style={styles.section}>
            <ThemedText type="subtitle" style={{ fontWeight: '600' }}>
              {t('reports.category')}
            </ThemedText>
            <View style={styles.chipRow}>
              {Object.entries(COMMUNITY_CATEGORIES).map(([key, config]) => (
                <Chip
                  key={key}
                  selected={category === key}
                  onPress={() => setCategory(key as CommunityCategory)}
                  iconName={config.icon}
                >
                  {config.label}
                </Chip>
              ))}
            </View>
          </View>

          <View style={styles.section}>
            <ThemedText type="subtitle" style={{ fontWeight: '600' }}>
              {t('common.privacy')}
            </ThemedText>
            <View style={styles.privacyRow}>
              <Button
                variant={privacy === CommunityPrivacy.PUBLIC ? 'primary' : 'outlined'}
                size="md"
                onPress={() => setPrivacy(CommunityPrivacy.PUBLIC)}
                style={{ flex: 1 }}
              >
                {t('common.public')}
              </Button>
              <Button
                variant={privacy === CommunityPrivacy.PRIVATE ? 'primary' : 'outlined'}
                size="md"
                onPress={() => setPrivacy(CommunityPrivacy.PRIVATE)}
                style={{ flex: 1 }}
              >
                {t('common.private')}
              </Button>
            </View>
          </View>

          <View style={styles.section}>
            <ThemedText type="subtitle" style={{ fontWeight: '600' }}>
              {t('common.locationOptional')}
            </ThemedText>
            <Input
              label={t('common.department')}
              value={department}
              onChangeText={setDepartment}
              placeholder={t('common.yourDepartment')}
            />
            <Input
              label={t('common.district')}
              value={district}
              onChangeText={setDistrict}
              placeholder={t('common.yourDistrict')}
            />
            <ThemedText type="bodySmall" color={theme.colors.textSecondary}>
              {t('common.locationOnMap')}
            </ThemedText>
            <LocationSelector
              location={geoLocation}
              onPickLocation={() => router.push('/(citizen)/report/map-picker?returnTo=community-create' as any)}
              onClear={() => setGeoLocation(undefined)}
            />
          </View>

          <View style={styles.section}>
            <ThemedText type="subtitle" style={{ fontWeight: '600' }}>
              {t('common.rulesOptional')}
            </ThemedText>
            <ThemedText type="bodySmall" color={theme.colors.textSecondary}>
              {t('common.rulesHint')}
            </ThemedText>
            <Input
              value={rulesText}
              onChangeText={setRulesText}
              placeholder={t('common.rulesPlaceholder')}
              multiline
              numberOfLines={5}
            />
          </View>

          <Button
            variant="primary"
            size="lg"
            onPress={handleSubmit}
            loading={createMutation.isPending}
          >
            {t('common.createCommunity')}
          </Button>
        </Card>
      </ScrollView>
    </CommunityTemplate>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingBottom: spacing['3xl'],
  },
  formCard: {
    margin: spacing.lg,
    gap: spacing.lg,
  },
  section: {
    gap: spacing.md,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  privacyRow: {
    flexDirection: 'row',
    gap: spacing.md,
  },
});
