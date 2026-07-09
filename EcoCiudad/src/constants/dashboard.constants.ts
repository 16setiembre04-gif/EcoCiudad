import { type IconName } from '@/presentation/components/atoms/icon';
import { type QuickActionItem } from '@/presentation/components/organisms/quick-actions';

export const DASHBOARD_QUICK_ACTIONS: QuickActionItem[] = [
  { key: 'report', label: 'Reportar', icon: 'report' as IconName },
  { key: 'community', label: 'Comunidad', icon: 'community' },
  { key: 'recycling', label: 'Centros', icon: 'recycle' },
  { key: 'events', label: 'Eventos', icon: 'calendar' },
];

export const DASHBOARD_GREETINGS = {
  morning: 'Buenos días',
  afternoon: 'Buenas tardes',
  evening: 'Buenas noches',
} as const;

export function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return DASHBOARD_GREETINGS.morning;
  if (hour < 18) return DASHBOARD_GREETINGS.afternoon;
  return DASHBOARD_GREETINGS.evening;
}
