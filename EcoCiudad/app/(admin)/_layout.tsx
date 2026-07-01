import { Stack } from 'expo-router';
import { AuthGuard } from '@/presentation/components/organisms/auth-guard';

export default function AdminLayout() {
  return (
    <AuthGuard allowedRoles={['admin']}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="users" />
        <Stack.Screen name="reports" />
        <Stack.Screen name="events" />
        <Stack.Screen name="settings" />
      </Stack>
    </AuthGuard>
  );
}
