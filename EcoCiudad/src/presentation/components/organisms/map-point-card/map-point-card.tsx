import { Button } from '@/presentation/components/atoms/button';
import { Card } from '@/presentation/components/atoms/card';
import { Icon, type IconName } from '@/presentation/components/atoms/icon';
import { ThemedText } from '@/presentation/components/atoms/text';
import { useTheme } from '@/theme/context';
import { spacing } from '@/theme/spacing';
import { borderRadius } from '@/theme/radius';
import { useTranslation } from '@/localization';
import { LocationCoordinates } from '@/infrastructure/maps';
import { Pressable, StyleSheet, View } from 'react-native';

export type MapPointType = 'report' | 'event' | 'recycling' | 'community' | 'truck';

export interface MapPointDetail {
  id: string;
  type: MapPointType;
  title: string;
  subtitle?: string;
  description?: string;
  icon: IconName;
  color: string;
  coordinate: LocationCoordinates;
  distanceKm?: number;
  meta?: { label: string; value: string }[];
}

export interface MapPointCardProps {
  point: MapPointDetail | null;
  userLocation?: LocationCoordinates;
  onClose: () => void;
  onNavigate: (point: MapPointDetail) => void;
  onPressDetail: (point: MapPointDetail) => void;
  onOpenDirections?: (point: MapPointDetail) => void;
}

const TYPE_LABELS: Record<MapPointType, string> = {
  report: 'Reporte',
  event: 'Evento',
  recycling: 'Centro de reciclaje',
  community: 'Comunidad',
  truck: 'Camión recolector',
};

export function MapPointCard({
  point,
  onClose,
  onNavigate,
  onPressDetail,
  onOpenDirections,
}: MapPointCardProps) {
  const theme = useTheme();
  const { t } = useTranslation();

  if (!point) return null;

  const handleOpenDirections = () => {
    onOpenDirections?.(point);
  };

  return (
    <View style={styles.container} pointerEvents="box-none">
      <Card variant="elevated" padding="md" style={styles.card}>
        <Pressable onPress={() => onPressDetail(point)} accessibilityRole="button">
          <View style={styles.header}>
            <View style={[styles.iconContainer, { backgroundColor: `${point.color}20` }]}>
              <Icon name={point.icon} size={22} color={point.color} />
            </View>
            <View style={styles.headerContent}>
              <ThemedText type="caption" color={theme.colors.textSecondary}>
                {TYPE_LABELS[point.type]}
              </ThemedText>
              <ThemedText type="subtitle" numberOfLines={1}>
                {point.title}
              </ThemedText>
              {point.subtitle && (
                <ThemedText type="bodySmall" color={theme.colors.textSecondary} numberOfLines={1}>
                  {point.subtitle}
                </ThemedText>
              )}
            </View>
            <Button variant="ghost" size="sm" onPress={onClose} style={styles.closeButton}>
              <Icon name="close" size={20} color={theme.colors.textSecondary} />
            </Button>
          </View>

          {point.description && (
            <ThemedText type="bodySmall" color={theme.colors.textSecondary} numberOfLines={2} style={styles.description}>
              {point.description}
            </ThemedText>
          )}

          {point.meta && point.meta.length > 0 && (
            <View style={styles.metaRow}>
              {point.meta.map((item, index) => (
                <View key={index} style={styles.metaItem}>
                  <ThemedText type="caption" color={theme.colors.textSecondary}>
                    {item.label}
                  </ThemedText>
                  <ThemedText type="bodySmall" style={{ fontWeight: '600' }}>
                    {item.value}
                  </ThemedText>
                </View>
              ))}
            </View>
          )}
        </Pressable>

        <View style={styles.actions}>
          <Button
            variant="outlined"
            size="sm"
            iconName="navigation"
            onPress={() => onNavigate(point)}
            style={styles.actionButton}
          >
            {t('common.route')}
          </Button>
          <Button
            variant="primary"
            size="sm"
            iconName="external-link"
            onPress={handleOpenDirections}
            style={styles.actionButton}
          >
            {t('common.openInMaps')}
          </Button>
        </View>
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.lg,
    paddingTop: spacing.md,
  },
  card: {
    borderRadius: borderRadius.xl,
    gap: spacing.md,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.md,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerContent: {
    flex: 1,
    gap: spacing.xs,
  },
  closeButton: {
    paddingHorizontal: 0,
    paddingVertical: 0,
    minWidth: 36,
    minHeight: 36,
  },
  description: {
    marginTop: -spacing.xs,
  },
  metaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  metaItem: {
    gap: spacing.xs,
  },
  actions: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  actionButton: {
    flex: 1,
  },
});
