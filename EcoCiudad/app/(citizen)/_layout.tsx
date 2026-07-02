import { Stack } from 'expo-router';
import { AuthGuard } from '@/presentation/components/organisms/auth-guard';

export default function CitizenLayout() {
  return (
    <AuthGuard allowedRoles={['citizen']}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="report/create" />
        <Stack.Screen name="report/[id]" />
        <Stack.Screen name="report/map-picker" />
        <Stack.Screen name="events/[id]" />
        <Stack.Screen name="events/create" />
        <Stack.Screen name="events/my-events" />
        <Stack.Screen name="events/[id]/attendance" />
        <Stack.Screen name="recycling/[id]" />
        <Stack.Screen name="recycling/map" />
        <Stack.Screen name="recycling/favorites" />
        <Stack.Screen name="community/[id]" />
        <Stack.Screen name="community/create" />
        <Stack.Screen name="community/my-communities" />
        <Stack.Screen name="community/invitations" />
        <Stack.Screen name="community/[id]/edit" />
        <Stack.Screen name="community/[id]/members" />
        <Stack.Screen name="community/[id]/settings" />
        <Stack.Screen name="profile" />
      </Stack>
    </AuthGuard>
  );
}
