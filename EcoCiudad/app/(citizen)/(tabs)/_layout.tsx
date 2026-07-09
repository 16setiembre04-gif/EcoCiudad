import { Tabs } from 'expo-router';
import { BottomNavigation } from '@/presentation/components/organisms/bottom-navigation';
import { useTranslation } from '@/localization';
import { type IconName } from '@/presentation/components/atoms/icon';

interface TabItem {
  key: string;
  label: string;
  icon: IconName;
}

export default function CitizenTabsLayout() {
  const { t } = useTranslation();

  const tabs: TabItem[] = [
    { key: 'index', label: t('dashboard.title'), icon: 'home' },
    { key: 'reports', label: t('reports.title'), icon: 'report' },
    { key: 'community', label: t('communities.title'), icon: 'community' },
    { key: 'events', label: t('events.title'), icon: 'calendar' },
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
      <Tabs.Screen name="reports" />
      <Tabs.Screen name="community" />
      <Tabs.Screen name="events" />
      <Tabs.Screen name="profile" />
    </Tabs>
  );
}
