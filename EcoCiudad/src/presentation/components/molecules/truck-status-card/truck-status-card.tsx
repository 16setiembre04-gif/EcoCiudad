import { View } from 'react-native';
import { Card } from '@/components/atoms/card';
import { ThemedText } from '@/components/atoms/text';
import { Badge } from '@/components/atoms/badge';
import { Icon } from '@/components/atoms/icon';
import { Divider } from '@/components/atoms/divider';
import { TruckStatusCardProps } from './types';
import { spacing } from '@/theme/spacing';
import { useTheme } from '@/theme/context';

const statusConfig = {
  available: { color: 'success' as const, label: 'Available' },
  'in-route': { color: 'info' as const, label: 'In Route' },
  maintenance: { color: 'warning' as const, label: 'Maintenance' },
  offline: { color: 'error' as const, label: 'Offline' },
};

export function TruckStatusCard({
  plateNumber,
  status,
  operatorName,
  location,
  currentLoad,
  capacity,
  lastUpdate,
  onPress,
  containerStyle,
  testID,
}: TruckStatusCardProps) {
  const theme = useTheme();
  const config = statusConfig[status];

  const content = (
    <View style={{ gap: spacing.md }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.md }}>
          <View style={{ 
            width: 48, 
            height: 48, 
            borderRadius: 12, 
            backgroundColor: theme.colors.primaryLight,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
            <Icon name="truck" size={24} color={theme.colors.primary} />
          </View>
          <View style={{ gap: spacing.xs }}>
            <ThemedText type="title" numberOfLines={1}>
              {plateNumber}
            </ThemedText>
            <ThemedText type="bodySmall" color={theme.colors.textSecondary}>
              {operatorName}
            </ThemedText>
          </View>
        </View>
        <Badge variant="tonal" color={config.color}>
          {config.label}
        </Badge>
      </View>

      <Divider orientation="horizontal" />

      <View style={{ gap: spacing.sm }}>
        {location && (
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.sm }}>
            <Icon name="location" size={16} color={theme.colors.textSecondary} />
            <ThemedText type="bodySmall" color={theme.colors.textSecondary} numberOfLines={1}>
              {location}
            </ThemedText>
          </View>
        )}
        
        {currentLoad !== undefined && capacity !== undefined && (
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.sm }}>
            <Icon name="eco-points" size={16} color={theme.colors.textSecondary} />
            <ThemedText type="bodySmall" color={theme.colors.textSecondary}>
              {currentLoad} / {capacity} kg
            </ThemedText>
          </View>
        )}
        
        {lastUpdate && (
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.sm }}>
            <Icon name="refresh" size={16} color={theme.colors.textSecondary} />
            <ThemedText type="caption" color={theme.colors.textSecondary}>
              Last update: {lastUpdate}
            </ThemedText>
          </View>
        )}
      </View>
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
