import { View } from 'react-native';
import { Card } from '@/components/atoms/card';
import { ThemedText } from '@/components/atoms/text';
import { Badge } from '@/components/atoms/badge';
import { Icon } from '@/components/atoms/icon';
import { Divider } from '@/components/atoms/divider';
import { ReportCardProps } from './types';
import { spacing } from '@/theme/spacing';
import { useTheme } from '@/theme/context';

const statusConfig = {
  pending: { color: 'warning' as const, label: 'Pending' },
  'in-review': { color: 'info' as const, label: 'In Review' },
  resolved: { color: 'success' as const, label: 'Resolved' },
  rejected: { color: 'error' as const, label: 'Rejected' },
};

export function ReportCard({
  title,
  description,
  status,
  category,
  location,
  date,
  onPress,
  containerStyle,
  testID,
}: ReportCardProps) {
  const theme = useTheme();
  const config = statusConfig[status];

  const content = (
    <View style={{ gap: spacing.md }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <View style={{ flex: 1, gap: spacing.xs }}>
          <ThemedText type="title" numberOfLines={2}>
            {title}
          </ThemedText>
          <ThemedText type="bodySmall" color={theme.colors.textSecondary} numberOfLines={2}>
            {description}
          </ThemedText>
        </View>
        <Badge variant="tonal" color={config.color}>
          {config.label}
        </Badge>
      </View>

      <Divider orientation="horizontal" />

      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.sm }}>
          <Icon name={category} size={20} color={theme.colors.primary} />
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.xs }}>
            <Icon name="location" size={16} color={theme.colors.textSecondary} />
            <ThemedText type="bodySmall" color={theme.colors.textSecondary} numberOfLines={1}>
              {location}
            </ThemedText>
          </View>
        </View>
        <ThemedText type="caption" color={theme.colors.textSecondary}>
          {date}
        </ThemedText>
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
