import { type IconName } from '@/components/atoms/icon';

export const ADMIN_ROUTES = {
  DASHBOARD: '/(admin)/(tabs)',
  USERS: '/(admin)/(tabs)/users',
  REPORTS: '/(admin)/(tabs)/reports',
  EVENTS: '/(admin)/(tabs)/events',
  SETTINGS: '/(admin)/(tabs)/settings',
} as const;

export const ADMIN_QUICK_ACTIONS: { key: string; label: string; icon: IconName; color: string }[] = [
  { key: 'users', label: 'Users', icon: 'user', color: '#3B82F6' },
  { key: 'reports', label: 'Reports', icon: 'report', color: '#EF4444' },
  { key: 'communities', label: 'Communities', icon: 'community', color: '#22C55E' },
  { key: 'events', label: 'Events', icon: 'calendar', color: '#F59E0B' },
  { key: 'recycling', label: 'Recycling', icon: 'recycle', color: '#10B981' },
  { key: 'settings', label: 'Settings', icon: 'settings', color: '#6B7280' },
];

export const ADMIN_ACTIVITY_ACTIONS: Record<string, { label: string; icon: IconName; color: string }> = {
  user_created: { label: 'User Created', icon: 'user', color: '#3B82F6' },
  user_updated: { label: 'User Updated', icon: 'user', color: '#3B82F6' },
  user_deleted: { label: 'User Deleted', icon: 'delete', color: '#EF4444' },
  user_activated: { label: 'User Activated', icon: 'success', color: '#22C55E' },
  user_deactivated: { label: 'User Deactivated', icon: 'close', color: '#F59E0B' },
  user_suspended: { label: 'User Suspended', icon: 'warning', color: '#F97316' },
  role_assigned: { label: 'Role Assigned', icon: 'achievement', color: '#8B5CF6' },
  report_assigned: { label: 'Report Assigned', icon: 'tasks', color: '#3B82F6' },
  report_status_changed: { label: 'Report Status Changed', icon: 'refresh', color: '#F59E0B' },
  report_priority_changed: { label: 'Priority Changed', icon: 'warning', color: '#F97316' },
  community_approved: { label: 'Community Approved', icon: 'success', color: '#22C55E' },
  community_suspended: { label: 'Community Suspended', icon: 'warning', color: '#F97316' },
  community_deleted: { label: 'Community Deleted', icon: 'delete', color: '#EF4444' },
  event_created: { label: 'Event Created', icon: 'calendar', color: '#3B82F6' },
  event_updated: { label: 'Event Updated', icon: 'calendar', color: '#3B82F6' },
  event_deleted: { label: 'Event Deleted', icon: 'delete', color: '#EF4444' },
  event_cancelled: { label: 'Event Cancelled', icon: 'close', color: '#F59E0B' },
  recycling_center_created: { label: 'Center Created', icon: 'recycle', color: '#10B981' },
  recycling_center_updated: { label: 'Center Updated', icon: 'recycle', color: '#10B981' },
  recycling_center_deleted: { label: 'Center Deleted', icon: 'delete', color: '#EF4444' },
  settings_updated: { label: 'Settings Updated', icon: 'settings', color: '#6B7280' },
};

export const REPORT_CATEGORY_CONFIG: Record<string, { label: string; icon: IconName; color: string }> = {
  waste: { label: 'Waste', icon: 'delete', color: '#EF4444' },
  pollution: { label: 'Pollution', icon: 'warning', color: '#F97316' },
  green_space: { label: 'Green Space', icon: 'tree', color: '#22C55E' },
  water: { label: 'Water', icon: 'water', color: '#3B82F6' },
  noise: { label: 'Noise', icon: 'noise', color: '#8B5CF6' },
  other: { label: 'Other', icon: 'help', color: '#6B7280' },
};

export const ADMIN_CONSTANTS = {
  ACTIVITY_LOG_LIMIT: 20,
  ACTIVITY_DATA_DAYS: 30,
  STATS_REFETCH_INTERVAL: 60 * 1000,
} as const;
