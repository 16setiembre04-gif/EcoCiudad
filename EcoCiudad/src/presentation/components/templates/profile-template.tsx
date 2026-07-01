import { ReactNode } from 'react';
import { StyleSheet, useColorScheme, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useTheme } from '@/theme/context';

interface ProfileTemplateProps {
  header: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
}

export function ProfileTemplate({ header, children, footer }: ProfileTemplateProps) {
  const theme = useTheme();
  const colorScheme = useColorScheme();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
      {header}
      <ScrollView style={styles.content} contentContainerStyle={styles.scrollContent}>
        {children}
      </ScrollView>
      {footer}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
});
