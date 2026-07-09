import { Tabs } from 'expo-router';
import { BottomNavigation } from '@/presentation/components/organisms/bottom-navigation';
import { useTranslation } from '@/localization';
import { type IconName } from '@/presentation/components/atoms/icon';

interface TabItem {
  key: string;
  label: string;
  icon: IconName;
}

export default function OperatorTabsLayout() {
  const { t } = useTranslation();

  const tabs: TabItem[] = [
    { key: 'index', label: t('common.panel'), icon: 'home' },
    { key: 'reports', label: t('common.reports'), icon: 'report' },
    { key: 'map', label: t('common.map'), icon: 'map' },
    { key: 'route', label: t('common.route'), icon: 'route' },
    { key: 'profile', label: t('common.profile'), icon: 'user' },
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
      <Tabs.Screen name="reports" />
      <Tabs.Screen name="map" />
      <Tabs.Screen name="route" />
      <Tabs.Screen name="profile" />
    </Tabs>
  );
}
