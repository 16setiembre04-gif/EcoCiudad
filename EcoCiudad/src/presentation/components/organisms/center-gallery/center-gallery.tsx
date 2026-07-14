import { EmptyState } from '@/presentation/components/atoms/empty-state';
import { SectionHeader } from '@/presentation/components/atoms/section-header';
import { borderRadius } from '@/theme/radius';
import { spacing } from '@/theme/spacing';
import { useTranslation } from '@/localization';
import { FlatList, Image, Pressable, StyleSheet, useWindowDimensions, View } from 'react-native';
import { type CenterGalleryProps } from './types';

const GALLERY_IMAGE_MIN_WIDTH = 160;
const GALLERY_IMAGE_MAX_WIDTH = 260;

function useGalleryImageSize() {
  const { width } = useWindowDimensions();
  const imageWidth = Math.min(Math.max(width * 0.45, GALLERY_IMAGE_MIN_WIDTH), GALLERY_IMAGE_MAX_WIDTH);
  return { width: imageWidth, height: imageWidth };
}

export function CenterGallery({
  images,
  onImagePress,
  style,
}: CenterGalleryProps) {
  const { t } = useTranslation();
  const galleryImageSize = useGalleryImageSize();

  if (images.length === 0) {
    return (
      <View style={[styles.container, style]}>
        <SectionHeader title={t('common.gallery')} />
        <View style={styles.emptyContainer}>
          <EmptyState
            iconName="image"
            title={t('common.noPhotos')}
            description={t('common.noPhotosForCenter')}
          />
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, style]}>
      <SectionHeader title={`${t('common.gallery')} (${images.length})`} />
      <FlatList
        data={images}
        keyExtractor={(item, index) => `${item}-${index}`}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.galleryList}
        renderItem={({ item, index }) => (
          <Pressable
            style={[styles.imageContainer, { width: galleryImageSize.width, height: galleryImageSize.height }]}
            onPress={() => onImagePress?.(index)}
            accessibilityRole="image"
            accessibilityLabel={`${t('common.photo')} ${index + 1}`}
          >
            <Image
              source={{ uri: item }}
              style={styles.image}
              resizeMode="cover"
            />
          </Pressable>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 0,
  },
  emptyContainer: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xl,
  },
  galleryList: {
    paddingHorizontal: spacing.lg,
    gap: spacing.md,
  },
  imageContainer: {
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
});
