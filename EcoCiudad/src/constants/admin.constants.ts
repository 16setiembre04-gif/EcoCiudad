import { type IconName } from '@/presentation/components/atoms/icon';

export const ADMIN_ROUTES = {
  DASHBOARD: '/(admin)/(tabs)',
  USERS: '/(admin)/(tabs)/users',
  USER_DETAIL: '/(admin)/users/[id]',
  REPORTS: '/(admin)/(tabs)/reports',
  EVENTS: '/(admin)/(tabs)/events',
  SETTINGS: '/(admin)/(tabs)/settings',
} as const;

export const ADMIN_QUICK_ACTIONS: { key: string; labelKey: string; icon: IconName; color: string }[] = [
  { key: 'users', labelKey: 'common.users', icon: 'user', color: '#3B82F6' },
  { key: 'reports', labelKey: 'common.reports', icon: 'report', color: '#EF4444' },
  { key: 'communities', labelKey: 'common.communities', icon: 'community', color: '#22C55E' },
  { key: 'recycling', labelKey: 'common.recycling', icon: 'recycle', color: '#10B981' },
];

export const ADMIN_ACTIVITY_ACTIONS: Record<string, { labelKey: string; icon: IconName; color: string }> = {
  user_created: { labelKey: 'adminActivity.userCreated', icon: 'user', color: '#3B82F6' },
  user_updated: { labelKey: 'adminActivity.userUpdated', icon: 'user', color: '#3B82F6' },
  user_deleted: { labelKey: 'adminActivity.userDeleted', icon: 'delete', color: '#EF4444' },
  user_activated: { labelKey: 'adminActivity.userActivated', icon: 'success', color: '#22C55E' },
  user_deactivated: { labelKey: 'adminActivity.userDeactivated', icon: 'close', color: '#F59E0B' },
  user_suspended: { labelKey: 'adminActivity.userSuspended', icon: 'warning', color: '#F97316' },
  role_assigned: { labelKey: 'adminActivity.roleAssigned', icon: 'achievement', color: '#8B5CF6' },
  report_assigned: { labelKey: 'adminActivity.reportAssigned', icon: 'tasks', color: '#3B82F6' },
  report_status_changed: { labelKey: 'adminActivity.reportStatusChanged', icon: 'refresh', color: '#F59E0B' },
  report_priority_changed: { labelKey: 'adminActivity.priorityChanged', icon: 'warning', color: '#F97316' },
  community_approved: { labelKey: 'adminActivity.communityApproved', icon: 'success', color: '#22C55E' },
  community_suspended: { labelKey: 'adminActivity.communitySuspended', icon: 'warning', color: '#F97316' },
  community_deleted: { labelKey: 'adminActivity.communityDeleted', icon: 'delete', color: '#EF4444' },
  event_created: { labelKey: 'adminActivity.eventCreated', icon: 'calendar', color: '#3B82F6' },
  event_updated: { labelKey: 'adminActivity.eventUpdated', icon: 'calendar', color: '#3B82F6' },
  event_deleted: { labelKey: 'adminActivity.eventDeleted', icon: 'delete', color: '#EF4444' },
  event_cancelled: { labelKey: 'adminActivity.eventCancelled', icon: 'close', color: '#F59E0B' },
  recycling_center_created: { labelKey: 'adminActivity.centerCreated', icon: 'recycle', color: '#10B981' },
  recycling_center_updated: { labelKey: 'adminActivity.centerUpdated', icon: 'recycle', color: '#10B981' },
  recycling_center_deleted: { labelKey: 'adminActivity.centerDeleted', icon: 'delete', color: '#EF4444' },
  settings_updated: { labelKey: 'adminActivity.settingsUpdated', icon: 'settings', color: '#6B7280' },
};

export const REPORT_CATEGORY_CONFIG: Record<string, { labelKey: string; icon: IconName; color: string }> = {
  waste: { labelKey: 'reports.categories.waste', icon: 'delete', color: '#EF4444' },
  pollution: { labelKey: 'reports.categories.pollution', icon: 'warning', color: '#F97316' },
  green_space: { labelKey: 'reports.categories.green_space', icon: 'tree', color: '#22C55E' },
  water: { labelKey: 'reports.categories.water', icon: 'water', color: '#3B82F6' },
  noise: { labelKey: 'reports.categories.noise', icon: 'noise', color: '#8B5CF6' },
  other: { labelKey: 'reports.categories.other', icon: 'help', color: '#6B7280' },
};

export const ADMIN_CONSTANTS = {
  ACTIVITY_LOG_LIMIT: 20,
  ACTIVITY_DATA_DAYS: 30,
  STATS_REFETCH_INTERVAL: 60 * 1000,
  USERS_PAGE_SIZE: 20,
} as const;

export const USER_ROLES_CONFIG: Record<string, { labelKey: string; color: string; icon: IconName }> = {
  citizen: { labelKey: 'roles.citizen', color: '#22C55E', icon: 'user' },
  operator: { labelKey: 'roles.operator', color: '#3B82F6', icon: 'truck' },
  admin: { labelKey: 'roles.admin', color: '#8B5CF6', icon: 'settings' },
  guest: { labelKey: 'roles.guest', color: '#6B7280', icon: 'user' },
};

export const USER_STATUS_CONFIG: Record<string, { labelKey: string; color: string }> = {
  active: { labelKey: 'userStatuses.active', color: '#22C55E' },
  inactive: { labelKey: 'userStatuses.inactive', color: '#6B7280' },
  suspended: { labelKey: 'userStatuses.suspended', color: '#EF4444' },
};

export const ADMIN_REPORT_STATUS_CONFIG: Record<string, { labelKey: string; color: string }> = {
  pending: { labelKey: 'reportStatuses.pending', color: '#F59E0B' },
  in_review: { labelKey: 'reportStatuses.in_review', color: '#3B82F6' },
  resolved: { labelKey: 'reportStatuses.resolved', color: '#22C55E' },
  rejected: { labelKey: 'reportStatuses.rejected', color: '#EF4444' },
};

export const ADMIN_REPORT_PRIORITY_CONFIG: Record<string, { labelKey: string; color: string }> = {
  low: { labelKey: 'priorities.low', color: '#22C55E' },
  medium: { labelKey: 'priorities.medium', color: '#F59E0B' },
  high: { labelKey: 'priorities.high', color: '#F97316' },
  critical: { labelKey: 'priorities.critical', color: '#EF4444' },
};
