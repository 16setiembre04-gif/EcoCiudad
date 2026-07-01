import { View, FlatList, Pressable, Image, StyleSheet } from 'react-native';
import { SectionHeader } from '@/components/atoms/section-header';
import { EmptyState } from '@/components/atoms/empty-state';
import { Icon } from '@/components/atoms/icon';
import { ThemedText } from '@/components/atoms/text';
import { useTheme } from '@/theme/context';
import { spacing } from '@/theme/spacing';
import { borderRadius } from '@/theme/radius';
import { type CenterGalleryProps } from './types';

export function CenterGallery({
  images,
  onImagePress,
  style,
}: CenterGalleryProps) {
  const theme = useTheme();

  if (images.length === 0) {
    return (
      <View style={[styles.container, style]}>
        <SectionHeader title="Gallery" />
        <View style={styles.emptyContainer}>
          <EmptyState
            iconName="image"
            title="No photos"
            description="No photos available for this center"
          />
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, style]}>
      <SectionHeader title={`Gallery (${images.length})`} />
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
            accessibilityLabel={`Photo ${index + 1}`}
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
