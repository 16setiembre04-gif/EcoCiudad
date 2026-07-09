import { Card } from '@/presentation/components/atoms/card';
import { Chip } from '@/presentation/components/atoms/chip';
import { Divider } from '@/presentation/components/atoms/divider';
import { Icon } from '@/presentation/components/atoms/icon';
import { ThemedText } from '@/presentation/components/atoms/text';
import { useTranslation } from '@/localization';
import { useTheme } from '@/theme/context';
import { spacing } from '@/theme/spacing';
import { View } from 'react-native';
import { RecyclerCardProps } from './types';

export function RecyclerCard({
  name,
  materials,
  rating,
  phone,
  email,
  distance,
  action,
  onPress,
  containerStyle,
  testID,
}: RecyclerCardProps) {
  const theme = useTheme();
  const { t } = useTranslation();
  const displayMaterials = materials.slice(0, 3);
  const remainingCount = materials.length - 3;

  const content = (
    <View style={{ gap: spacing.md }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <View style={{ flex: 1, gap: spacing.xs }}>
          <ThemedText type="title" numberOfLines={1}>
            {name}
          </ThemedText>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.xs }}>
            <Icon name="star" size={16} color="#FACC15" />
            <ThemedText type="bodySmall" color={theme.colors.textSecondary}>
              {rating.toFixed(1)}
            </ThemedText>
            {distance && (
              <>
                <ThemedText type="bodySmall" color={theme.colors.textSecondary}>
                  •
                </ThemedText>
                <ThemedText type="bodySmall" color={theme.colors.textSecondary}>
                  {distance}
                </ThemedText>
              </>
            )}
          </View>
        </View>
      </View>

      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm }}>
        {displayMaterials.map((material, index) => (
          <Chip
            key={index}
            variant="tonal"
            size="sm"
            iconName="recycle"
            style={{ backgroundColor: theme.colors.primaryContainer }}
          >
            {material}
          </Chip>
        ))}
        {remainingCount > 0 && (
          <Chip variant="tonal" size="sm" style={{ backgroundColor: theme.colors.surfaceVariant }}>
            +{remainingCount} {t('recycling.moreMaterials')}
          </Chip>
        )}
      </View>

      <Divider orientation="horizontal" />

      <View style={{ gap: spacing.sm }}>
        {phone && (
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.sm }}>
            <Icon name="phone" size={16} color={theme.colors.textSecondary} />
            <ThemedText type="bodySmall" color={theme.colors.textSecondary}>
              {phone}
            </ThemedText>
          </View>
        )}
        {email && (
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.sm }}>
            <Icon name="email" size={16} color={theme.colors.textSecondary} />
            <ThemedText type="bodySmall" color={theme.colors.textSecondary} numberOfLines={1}>
              {email}
            </ThemedText>
          </View>
        )}
      </View>

      {action && (
        <>
          <Divider orientation="horizontal" />
          <View>{action}</View>
        </>
      )}
    </View>
  );

  if (onPress) {
    return (
      <Card variant="elevated" padding="lg" onPress={onPress} style={containerStyle} testID={testID}>
        {content}
      </Card>
    );
  }

  return (
    <Card variant="elevated" padding="lg" style={containerStyle} testID={testID}>
      {content}
    </Card>
  );
}
