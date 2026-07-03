import { type IconName } from '@/presentation/components/atoms/icon';
import { type QuickActionItem } from '@/presentation/components/organisms/quick-actions';

export const DASHBOARD_QUICK_ACTIONS: QuickActionItem[] = [
  { key: 'report', label: 'Report Issue', icon: 'report' as IconName },
  { key: 'community', label: 'Community', icon: 'community' },
  { key: 'recycling', label: 'Recycling Centers', icon: 'recycle' },
  { key: 'events', label: 'Events', icon: 'calendar' },
];

export const DASHBOARD_GREETINGS = {
  morning: 'Good morning',
  afternoon: 'Good afternoon',
  evening: 'Good evening',
} as const;

export function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return DASHBOARD_GREETINGS.morning;
  if (hour < 18) return DASHBOARD_GREETINGS.afternoon;
  return DASHBOARD_GREETINGS.evening;
}
