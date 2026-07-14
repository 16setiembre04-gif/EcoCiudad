import { Card } from '@/presentation/components/atoms/card';
import { Icon } from '@/presentation/components/atoms/icon';
import { ThemedText } from '@/presentation/components/atoms/text';
import { useTheme } from '@/theme/context';
import { spacing } from '@/theme/spacing';
import { borderRadius } from '@/theme/radius';
import { useTranslation } from '@/localization';
import { View } from 'react-native';

interface EcoPointsCardProps {
  points: number;
  level: number;
  progress: number;
  pointsForNextLevel: number;
}

export function EcoPointsCard({ points, level, progress, pointsForNextLevel }: EcoPointsCardProps) {
  const theme = useTheme();
  const { t } = useTranslation();

  return (
    <Card
      variant="elevated"
      padding="lg"
      style={{ marginHorizontal: spacing.lg, marginTop: spacing.lg }}
    >
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: spacing.md,
          marginBottom: spacing.md,
        }}
      >
        <View
          style={{
            width: 56,
            height: 56,
            borderRadius: borderRadius.full,
            backgroundColor: theme.colors.primaryContainer,
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Icon name="eco-points" size={28} color={theme.colors.onPrimaryContainer} />
        </View>
        <View style={{ flex: 1 }}>
          <ThemedText type="bodySmall" color={theme.colors.textSecondary}>
            {t('common.ecoPoints')}
          </ThemedText>
          <ThemedText type="headline" color={theme.colors.onPrimaryContainer} adjustsFontSizeToFit numberOfLines={1}>
            {points}
          </ThemedText>
        </View>
        <View
          style={{
            backgroundColor: theme.colors.primary,
            paddingHorizontal: spacing.md,
            paddingVertical: spacing.xs,
            borderRadius: borderRadius.full,
          }}
        >
          <ThemedText type="caption" color={theme.colors.onPrimary} numberOfLines={1} ellipsizeMode="tail">
            {t('common.level')} {level}
          </ThemedText>
        </View>
      </View>

      <View style={{ gap: spacing.xs }}>
        <View
          style={{
            height: 8,
            backgroundColor: theme.colors.surfaceVariant,
            borderRadius: borderRadius.full,
            overflow: 'hidden',
          }}
        >
          <View
            style={{
              width: `${Math.min(Math.max(progress * 100, 0), 100)}%`,
              height: '100%',
              backgroundColor: theme.colors.primary,
              borderRadius: borderRadius.full,
            }}
          />
        </View>
        <ThemedText type="caption" color={theme.colors.textSecondary}>
          {t('common.pointsToNextLevel', { points: pointsForNextLevel })}
        </ThemedText>
      </View>
    </Card>
  );
}
