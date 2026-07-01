import { Stack } from 'expo-router';
import { AuthGuard } from '@/presentation/components/organisms/auth-guard';

export default function OperatorLayout() {
  return (
    <AuthGuard allowedRoles={['operator']}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="reports/[id]" />
      </Stack>
    </AuthGuard>
  );
}
