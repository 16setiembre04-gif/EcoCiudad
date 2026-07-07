import { Tabs } from 'expo-router';
import { Icon } from '@/presentation/components/atoms/icon';

export default function AdminTabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#6D28D9',
        tabBarInactiveTintColor: '#64748B',
        tabBarStyle: {
          borderTopWidth: 1,
          borderTopColor: '#E2E8F0',
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Panel',
          tabBarIcon: ({ color, size }) => <Icon name="home" size={size} color={String(color)} />,
        }}
      />
    </Tabs>
  );
}
