import { Tabs } from 'expo-router';
import { Icon } from '@/presentation/components/atoms/icon';

export default function OperatorTabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#1565C0',
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
      <Tabs.Screen
        name="reports"
        options={{
          title: 'Reportes',
          tabBarIcon: ({ color, size }) => <Icon name="report" size={size} color={String(color)} />,
        }}
      />
      <Tabs.Screen
        name="map"
        options={{
          title: 'Mapa',
          tabBarIcon: ({ color, size }) => <Icon name="map" size={size} color={String(color)} />,
        }}
      />
      <Tabs.Screen
        name="route"
        options={{
          title: 'Ruta',
          tabBarIcon: ({ color, size }) => <Icon name="route" size={size} color={String(color)} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Perfil',
          tabBarIcon: ({ color, size }) => <Icon name="user" size={size} color={String(color)} />,
        }}
      />
    </Tabs>
  );
}
