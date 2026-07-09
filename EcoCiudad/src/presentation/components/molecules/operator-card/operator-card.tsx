import { Card } from '@/presentation/components/atoms/card';
import { Icon } from '@/presentation/components/atoms/icon';
import { OperatorAvatar } from '@/presentation/components/atoms/operator-avatar';
import { ThemedText } from '@/presentation/components/atoms/text';
import { useTheme } from '@/theme/context';
import { spacing } from '@/theme/spacing';
import { useTranslation } from '@/localization';
import { StyleSheet, View } from 'react-native';
import { type OperatorCardProps } from './types';

export function OperatorCard({
  operator,
  stats,
  onPress,
  containerStyle,
}: OperatorCardProps) {
  const theme = useTheme();
  const { t } = useTranslation();

  return (
    <Card
      variant="elevated"
      padding="md"
      onPress={onPress}
      style={[styles.container, containerStyle]}
    >
      <View style={styles.header}>
        <OperatorAvatar
          name={operator.displayName}
          avatarUrl={operator.avatarUrl}
          size="md"
          showBadge
        />
        <View style={styles.info}>
          <ThemedText type="title" numberOfLines={1}>
            {operator.displayName}
          </ThemedText>
          <ThemedText type="bodySmall" color={theme.colors.textSecondary}>
            {t('common.environmentalOfficer')}
          </ThemedText>
        </View>
      </View>

      {stats && (
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Icon name="tasks" size={16} color={theme.colors.primary} />
            <ThemedText type="caption" style={{ color: theme.colors.primary }}>
              {stats.assigned}
            </ThemedText>
          </View>
          <View style={styles.statItem}>
            <Icon name="success" size={16} color={theme.colors.success} />
            <ThemedText type="caption" style={{ color: theme.colors.success }}>
              {stats.resolved}
            </ThemedText>
          </View>
          <View style={styles.statItem}>
            <Icon name="warning" size={16} color={theme.colors.warning} />
            <ThemedText type="caption" style={{ color: theme.colors.warning }}>
              {stats.pending}
            </ThemedText>
          </View>
        </View>
      )}
    </Card>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.md,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  info: {
    flex: 1,
    gap: 2,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
});
