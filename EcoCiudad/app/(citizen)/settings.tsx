import { View, StyleSheet, ScrollView, Pressable } from 'react-native';
import { Card } from '@/presentation/components/atoms/card';
import { ThemedText } from '@/presentation/components/atoms/text';
import { Icon } from '@/presentation/components/atoms/icon';
import { useTheme } from '@/theme/context';
import { spacing } from '@/theme/spacing';
import { useTranslation } from '@/localization';
import { Locale } from '@/localization/locales';

export default function SettingsScreen() {
  const theme = useTheme();
  const { locale, setLocale, t } = useTranslation();

  const handleLanguageChange = async (newLocale: Locale) => {
    await setLocale(newLocale);
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.content}>
        {/* Language Section */}
        <Card variant="elevated" padding="lg" style={styles.section}>
          <View style={styles.sectionHeader}>
            <Icon name="settings" size={24} color={theme.colors.primary} />
            <ThemedText type="title" style={styles.sectionTitle}>
              {t('settings.language')}
            </ThemedText>
          </View>

          <View style={styles.optionsContainer}>
            <Pressable
              style={[
                styles.option,
                locale === 'es' && { backgroundColor: theme.colors.primaryLight },
              ]}
              onPress={() => handleLanguageChange('es')}
            >
              <View style={styles.optionContent}>
                <ThemedText type="body">🇪🇸 {t('settings.spanish')}</ThemedText>
                {locale === 'es' && (
                  <Icon name="check" size={20} color={theme.colors.primary} />
                )}
              </View>
            </Pressable>

            <Pressable
              style={[
                styles.option,
                locale === 'en' && { backgroundColor: theme.colors.primaryLight },
              ]}
              onPress={() => handleLanguageChange('en')}
            >
              <View style={styles.optionContent}>
                <ThemedText type="body">🇺🇸 {t('settings.english')}</ThemedText>
                {locale === 'en' && (
                  <Icon name="check" size={20} color={theme.colors.primary} />
                )}
              </View>
            </Pressable>
          </View>
        </Card>

        {/* About Section */}
        <Card variant="elevated" padding="lg" style={styles.section}>
          <View style={styles.sectionHeader}>
            <Icon name="info" size={24} color={theme.colors.primary} />
            <ThemedText type="title" style={styles.sectionTitle}>
              {t('settings.about')}
            </ThemedText>
          </View>

          <View style={styles.infoRow}>
            <ThemedText type="body" color={theme.colors.textSecondary}>
              {t('settings.version')}
            </ThemedText>
            <ThemedText type="body">1.0.0</ThemedText>
          </View>
        </Card>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: spacing.lg,
    gap: spacing.lg,
  },
  section: {
    gap: spacing.md,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginBottom: spacing.sm,
  },
  sectionTitle: {
    flex: 1,
  },
  optionsContainer: {
    gap: spacing.sm,
  },
  option: {
    padding: spacing.md,
    borderRadius: 8,
  },
  optionContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});
