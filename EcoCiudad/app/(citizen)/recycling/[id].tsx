import { useState, useCallback } from 'react';
import { View, ScrollView, StyleSheet, Linking, Alert, Share } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { RecyclingCentersLayout } from '@/presentation/components/templates/recycling-centers-layout';
import { CenterHeader } from '@/presentation/components/organisms/center-header';
import { CenterGallery } from '@/presentation/components/organisms/center-gallery';
import { ReviewsSection } from '@/presentation/components/organisms/reviews-section';
import { MaterialList } from '@/presentation/components/molecules/material-list';
import { OpeningHoursCard } from '@/presentation/components/molecules/opening-hours-card';
import { ThemedText } from '@/components/atoms/text';
import { Divider } from '@/components/atoms/divider';
import { Icon } from '@/components/atoms/icon';
import { useRecyclingCenterDetails, useCenterReviews, useIsCenterFavorite, useToggleCenterFavorite, useMarkReviewHelpful } from '@/presentation/hooks';
import { useTheme } from '@/theme/context';
import { spacing } from '@/theme/spacing';

export default function RecyclingCenterDetailsScreen() {
  const theme = useTheme();
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();

  const { data: center, isLoading } = useRecyclingCenterDetails(id);
  const { data: reviews } = useCenterReviews(id);
  const { data: isFavorite } = useIsCenterFavorite(id);

  const { mutate: toggleFavorite } = useToggleCenterFavorite();
  const { mutate: markReviewHelpful } = useMarkReviewHelpful();

  const handleDirections = useCallback(async () => {
    if (!center) return;
    const url = `https://www.google.com/maps/dir/?api=1&destination=${center.latitude},${center.longitude}`;
    try {
      await Linking.openURL(url);
    } catch {
      Alert.alert('Error', 'Could not open maps application');
    }
  }, [center]);

  const handleCall = useCallback(async () => {
    if (!center?.phone) return;
    try {
      await Linking.openURL(`tel:${center.phone}`);
    } catch {
      Alert.alert('Error', 'Could not make phone call');
    }
  }, [center]);

  const handleShare = useCallback(async () => {
    if (!center) return;
    try {
      await Share.share({
        message: `Check out this recycling center: ${center.name}\n${center.address}`,
      });
    } catch {
      Alert.alert('Error', 'Could not share center');
    }
  }, [center]);

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
          <ThemedText>Loading center details...</ThemedText>
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
            <ThemedText type="subtitle">About</ThemedText>
            <ThemedText type="body" color={theme.colors.textSecondary}>
              {center.description}
            </ThemedText>
          </View>
        )}

        {center.acceptedMaterials.length > 0 && (
          <View style={styles.section}>
            <ThemedText type="subtitle">Accepted Materials</ThemedText>
            <MaterialList materials={center.acceptedMaterials} maxDisplay={10} />
          </View>
        )}

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
          <ThemedText type="subtitle">Contact Information</ThemedText>
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
  },
});
