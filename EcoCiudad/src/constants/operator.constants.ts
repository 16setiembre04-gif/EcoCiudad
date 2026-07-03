import { type IconName } from '@/presentation/components/atoms/icon';

export const REPORT_PRIORITIES = {
  low: { label: 'Low', color: '#22C55E', icon: 'info' as IconName },
  medium: { label: 'Medium', color: '#F59E0B', icon: 'warning' as IconName },
  high: { label: 'High', color: '#F97316', icon: 'error' as IconName },
  critical: { label: 'Critical', color: '#EF4444', icon: 'error' as IconName },
} as const;

export const OPERATOR_ACTIONS = {
  report_assigned: { label: 'Report Assigned', icon: 'tasks' as IconName },
  status_updated: { label: 'Status Updated', icon: 'refresh' as IconName },
  report_resolved: { label: 'Report Resolved', icon: 'check' as IconName },
  report_rejected: { label: 'Report Rejected', icon: 'close' as IconName },
  notes_added: { label: 'Notes Added', icon: 'message' as IconName },
  photos_uploaded: { label: 'Photos Uploaded', icon: 'image' as IconName },
  route_started: { label: 'Route Started', icon: 'route' as IconName },
  route_completed: { label: 'Route Completed', icon: 'success' as IconName },
} as const;

export const OPERATOR_CONSTANTS = {
  MAX_PHOTOS_PER_REPORT: 5,
  MAX_NOTES_LENGTH: 500,
  ACTIVITY_LOG_LIMIT: 50,
  DEFAULT_ROUTE_RADIUS_KM: 10,
} as const;

export const OPERATOR_ROUTES = {
  DASHBOARD: '/(operator)/(tabs)',
  REPORTS: '/(operator)/(tabs)/reports',
  REPORT_DETAILS: '/(operator)/reports/[id]',
  MAP: '/(operator)/(tabs)/map',
  ROUTE: '/(operator)/(tabs)/route',
  PROFILE: '/(operator)/(tabs)/profile',
} as const;
