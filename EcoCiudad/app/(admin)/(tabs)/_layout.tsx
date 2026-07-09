import { Tabs } from 'expo-router';
import { BottomNavigation } from '@/presentation/components/organisms/bottom-navigation';
import { useTranslation } from '@/localization';
import { type IconName } from '@/presentation/components/atoms/icon';

interface TabItem {
  key: string;
  label: string;
  icon: IconName;
}

export default function AdminTabsLayout() {
  const { t } = useTranslation();

  const tabs: TabItem[] = [
    { key: 'index', label: t('common.panel'), icon: 'home' },
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
    </Tabs>
  );
}
