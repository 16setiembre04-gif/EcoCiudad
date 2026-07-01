import { View, Pressable, StyleSheet } from 'react-native';
import { Icon } from '@/components/atoms/icon';
import { useTheme } from '@/theme/context';
import { type RatingStarsProps } from './types';

const sizeMap = {
  sm: 16,
  md: 20,
  lg: 24,
};

export function RatingStars({
  rating,
  maxRating = 5,
  size = 'md',
  interactive = false,
  onRatingChange,
  style,
}: RatingStarsProps) {
  const theme = useTheme();
  const iconSize = sizeMap[size];

  const handlePress = (starIndex: number) => {
    if (interactive && onRatingChange) {
      onRatingChange(starIndex + 1);
    }
  };

  return (
    <View style={[styles.container, style]}>
      {Array.from({ length: maxRating }).map((_, index) => {
        const isFilled = index < Math.floor(rating);
        const isHalf = !isFilled && index < rating;

        return interactive ? (
          <Pressable
            key={index}
            onPress={() => handlePress(index)}
            accessibilityRole="button"
            accessibilityLabel={`Rate ${index + 1} star${index === 0 ? '' : 's'}`}
          >
            <Icon
              name="star"
              size={iconSize}
              color={isFilled || isHalf ? theme.colors.warning : theme.colors.border}
            />
          </Pressable>
        ) : (
          <Icon
            key={index}
            name="star"
            size={iconSize}
            color={isFilled || isHalf ? theme.colors.warning : theme.colors.border}
          />
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
});
