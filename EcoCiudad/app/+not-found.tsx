import { View, StyleSheet } from 'react-native';
import { Link, Stack } from 'expo-router';
import { ThemedText, Button } from '@/presentation/components/atoms';
import { useTranslation } from '@/localization';

export default function NotFoundScreen() {
  const { t } = useTranslation();

  return (
    <>
      <Stack.Screen options={{ title: t('notFound.title') }} />
      <View style={styles.container}>
        <ThemedText type="title">{t('notFound.description')}</ThemedText>
        <Link href="/" asChild>
          <Button variant="primary" size="md">{t('notFound.goHome')}</Button>
        </Link>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
});
