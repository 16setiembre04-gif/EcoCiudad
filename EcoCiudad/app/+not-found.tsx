import { View, StyleSheet } from 'react-native';
import { Link, Stack } from 'expo-router';
import { ThemedText, Button } from '@/presentation/components/atoms';

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'Oops!' }} />
      <View style={styles.container}>
        <ThemedText type="title">This screen doesn't exist.</ThemedText>
        <Link href="/" asChild>
          <Button variant="primary" size="md">Go to home screen</Button>
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
