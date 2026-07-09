import { EmptyState } from '@/presentation/components/atoms/empty-state';
import { SectionHeader } from '@/presentation/components/atoms/section-header';
import { borderRadius } from '@/theme/radius';
import { spacing } from '@/theme/spacing';
import { useTranslation } from '@/localization';
import { FlatList, Image, Pressable, StyleSheet, View } from 'react-native';
import { type CenterGalleryProps } from './types';

export function CenterGallery({
  images,
  onImagePress,
  style,
}: CenterGalleryProps) {
  const { t } = useTranslation();

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
            style={styles.imageContainer}
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
    width: 200,
    height: 200,
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
});
