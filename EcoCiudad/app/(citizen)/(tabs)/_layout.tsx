import { Tabs } from 'expo-router';
import { BottomNavigation } from '@/presentation/components/organisms/bottom-navigation';
import { useTranslation } from '@/localization';
import { type IconName } from '@/presentation/components/atoms/icon';

interface TabItem {
  key: string;
  label: string;
  icon: IconName;
  primary?: boolean;
}

export default function CitizenTabsLayout() {
  const { t } = useTranslation();

  const tabs: TabItem[] = [
    { key: 'index', label: t('dashboard.title'), icon: 'home' },
    { key: 'map', label: t('common.map'), icon: 'map' },
    { key: 'report', label: t('reports.report'), icon: 'report', primary: true },
    { key: 'activity', label: t('common.activity'), icon: 'calendar' },
    { key: 'profile', label: t('profile.title'), icon: 'user' },
  ];

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
      }}
      tabBar={({ state, navigation }) => {
        const activeKey = state.routes[state.index].name;
        return (
          <BottomNavigation
            items={tabs}
            activeKey={activeKey}
            onItemPress={(key) => {
              const route = state.routes.find((r) => r.name === key);
              if (route) {
                navigation.navigate(route.name, route.params);
              }
            }}
          />
        );
      }}
    >
      <Tabs.Screen name="index" />
      <Tabs.Screen name="map" />
      <Tabs.Screen name="report" />
      <Tabs.Screen name="activity" />
      <Tabs.Screen name="profile" />
      {/* Funcionalidades mantenidas pero accesibles desde Actividad/Reportes */}
      <Tabs.Screen name="reports" options={{ href: null }} />
      <Tabs.Screen name="community" options={{ href: null }} />
      <Tabs.Screen name="events" options={{ href: null }} />
    </Tabs>
  );
}
