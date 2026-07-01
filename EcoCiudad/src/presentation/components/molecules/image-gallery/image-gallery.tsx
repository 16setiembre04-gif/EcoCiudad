import { View, FlatList, StyleSheet } from 'react-native';
import { ImageThumbnail } from '@/components/atoms/image-thumbnail';
import { spacing } from '@/theme/spacing';
import { type ImageGalleryProps } from './types';

export function ImageGallery({ images, onImagePress, style }: ImageGalleryProps) {
  if (images.length === 0) return null;

  return (
    <View style={[styles.container, style]}>
      <FlatList
        data={images}
        keyExtractor={(item, index) => `${item}-${index}`}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.list}
        renderItem={({ item, index }) => (
          <ImageThumbnail
            uri={item}
            size={120}
            onPress={onImagePress ? () => onImagePress(index) : undefined}
          />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: spacing.md,
  },
  list: {
    gap: spacing.sm,
    paddingHorizontal: spacing.lg,
  },
});
