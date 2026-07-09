import { ADMIN_QUICK_ACTIONS } from '@/constants';
import { Card } from '@/presentation/components/atoms/card';
import { Icon } from '@/presentation/components/atoms/icon';
import { ThemedText } from '@/presentation/components/atoms/text';
import { spacing } from '@/theme/spacing';
import { useTranslation } from '@/localization';
import { Pressable, StyleSheet, View } from 'react-native';

export interface AdminQuickActionsProps {
  onActionPress: (key: string) => void;
}

export function AdminQuickActions({ onActionPress }: AdminQuickActionsProps) {
  const { t } = useTranslation();

  return (
    <View style={styles.container}>
      <ThemedText type="subtitle" style={styles.title}>{t('common.quickActions')}</ThemedText>
      <View style={styles.grid}>
        {ADMIN_QUICK_ACTIONS.map((action) => (
          <Pressable
            key={action.key}
            onPress={() => onActionPress(action.key)}
            style={styles.actionItem}
            accessibilityRole="button"
            accessibilityLabel={t(action.labelKey)}
          >
            <Card variant="elevated" padding="md" style={styles.actionCard}>
              <View style={[styles.iconContainer, { backgroundColor: action.color + '20' }]}>
                <Icon name={action.icon} size={22} color={action.color} />
              </View>
              <ThemedText type="caption" style={{ textAlign: 'center', fontWeight: '500' }}>
                {t(action.labelKey)}
              </ThemedText>
            </Card>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.lg,
    gap: spacing.md,
  },
  title: {
    paddingLeft: spacing.xs,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  actionItem: {
    width: '30%',
  },
  actionCard: {
    alignItems: 'center',
    gap: spacing.sm,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
