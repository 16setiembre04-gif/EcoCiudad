import { Divider } from '@/presentation/components/atoms/divider';
import { Icon } from '@/presentation/components/atoms/icon';
import { ThemedText } from '@/presentation/components/atoms/text';
import { MaterialList } from '@/presentation/components/molecules/material-list';
import { OpeningHoursCard } from '@/presentation/components/molecules/opening-hours-card';
import { CenterGallery } from '@/presentation/components/organisms/center-gallery';
import { CenterHeader } from '@/presentation/components/organisms/center-header';
import { MapViewer } from '@/presentation/components/organisms/map-viewer';
import { ReviewsSection } from '@/presentation/components/organisms/reviews-section';
import { RecyclingCentersLayout } from '@/presentation/components/templates/recycling-centers-layout';
import { LocationService } from '@/infrastructure/maps';
import { useCenterReviews, useIsCenterFavorite, useMarkReviewHelpful, useRecyclingCenterDetails, useToggleCenterFavorite } from '@/presentation/hooks';
import { useTheme } from '@/theme/context';
import { borderRadius } from '@/theme/radius';
import { spacing } from '@/theme/spacing';
import { useTranslation } from '@/localization';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback } from 'react';
import { Alert, Linking, ScrollView, Share, StyleSheet, View } from 'react-native';

export default function RecyclingCenterDetailsScreen() {
  const theme = useTheme();
  const router = useRouter();
  const { t } = useTranslation();
  const { id } = useLocalSearchParams<{ id: string }>();

  const { data: center, isLoading } = useRecyclingCenterDetails(id);
  const { data: reviews } = useCenterReviews(id);
  const { data: isFavorite } = useIsCenterFavorite(id);

  const { mutate: toggleFavorite } = useToggleCenterFavorite();
  const { mutate: markReviewHelpful } = useMarkReviewHelpful();

  const handleDirections = useCallback(async () => {
    if (!center) return;
    try {
      await LocationService.openDirections(center);
    } catch {
      Alert.alert(t('common.error'), t('common.failedToOpenMaps'));
    }
  }, [center, t]);

  const handleCall = useCallback(async () => {
    if (!center?.phone) return;
    try {
      await Linking.openURL(`tel:${center.phone}`);
    } catch {
      Alert.alert(t('common.error'), t('common.failedToMakeCall'));
    }
  }, [center, t]);

  const handleShare = useCallback(async () => {
    if (!center) return;
    try {
      await Share.share({
        message: t('common.shareMessageCenter', { name: center.name, address: center.address }),
      });
    } catch {
      Alert.alert(t('common.error'), t('common.failedToShareCenter'));
    }
  }, [center, t]);

  const handleFavoritePress = useCallback(() => {
    if (!id) return;
    toggleFavorite(id);
  }, [id, toggleFavorite]);

  const handleReviewHelpful = useCallback((reviewId: string) => {
    markReviewHelpful(reviewId);
  }, [markReviewHelpful]);

  if (isLoading || !center) {
    return (
      <RecyclingCentersLayout>
        <View style={styles.loadingContainer}>
          <ThemedText>{t('common.loadingCenter')}</ThemedText>
        </View>
      </RecyclingCentersLayout>
    );
  }

  return (
    <RecyclingCentersLayout>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <CenterHeader
          center={center}
          isFavorite={isFavorite}
          onFavoritePress={handleFavoritePress}
          onDirectionsPress={handleDirections}
          onCallPress={handleCall}
          onSharePress={handleShare}
          onBackPress={() => router.back()}
        />

        {center.description && (
          <View style={styles.section}>
            <ThemedText type="subtitle">{t('common.about')}</ThemedText>
            <ThemedText type="body" color={theme.colors.textSecondary}>
              {center.description}
            </ThemedText>
          </View>
        )}

        {center.acceptedMaterials.length > 0 && (
          <View style={styles.section}>
            <ThemedText type="subtitle">{t('common.acceptedMaterials')}</ThemedText>
            <MaterialList materials={center.acceptedMaterials} maxDisplay={10} />
          </View>
        )}

        <View style={styles.section}>
          <ThemedText type="subtitle">{t('common.mapView')}</ThemedText>
          <View style={styles.mapPreview}>
            <MapViewer
              selectedCoordinate={center}
              showsUserLocation={false}
              showUserLocationButton={false}
              containerStyle={styles.mapContainer}
            />
          </View>
        </View>

        <View style={styles.section}>
          <OpeningHoursCard openingHours={center.openingHours} />
        </View>

        {center.galleryImages && center.galleryImages.length > 0 && (
          <>
            <Divider />
            <CenterGallery images={center.galleryImages} />
          </>
        )}

        <Divider />

        <View style={styles.contactSection}>
          <ThemedText type="subtitle">{t('common.contactInformation')}</ThemedText>
          {center.phone && (
            <View style={styles.contactRow}>
              <Icon name="phone" size={20} color={theme.colors.primary} />
              <ThemedText type="body">{center.phone}</ThemedText>
            </View>
          )}
          {center.email && (
            <View style={styles.contactRow}>
              <Icon name="email" size={20} color={theme.colors.primary} />
              <ThemedText type="body">{center.email}</ThemedText>
            </View>
          )}
          {center.website && (
            <View style={styles.contactRow}>
              <Icon name="link" size={20} color={theme.colors.primary} />
              <ThemedText type="body">{center.website}</ThemedText>
            </View>
          )}
        </View>

        <Divider />

        <ReviewsSection
          reviews={reviews ?? []}
          onHelpfulPress={handleReviewHelpful}
        />
      </ScrollView>
    </RecyclingCentersLayout>
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
  contactSection: {
    padding: spacing.lg,
    gap: spacing.md,
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    flexWrap: 'wrap',
  },
  mapPreview: {
    height: 200,
    borderRadius: borderRadius.md,
    overflow: 'hidden',
  },
  mapContainer: {
    borderRadius: borderRadius.md,
  },
});
