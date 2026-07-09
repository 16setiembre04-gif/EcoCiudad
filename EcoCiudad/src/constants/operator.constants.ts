import { type IconName } from '@/presentation/components/atoms/icon';

export const REPORT_PRIORITIES = {
  low: { labelKey: 'priorities.low', color: '#22C55E', icon: 'info' as IconName },
  medium: { labelKey: 'priorities.medium', color: '#F59E0B', icon: 'warning' as IconName },
  high: { labelKey: 'priorities.high', color: '#F97316', icon: 'error' as IconName },
  critical: { labelKey: 'priorities.critical', color: '#EF4444', icon: 'error' as IconName },
} as const;

export const OPERATOR_ACTIONS = {
  report_assigned: { labelKey: 'operatorActions.reportAssigned', icon: 'tasks' as IconName },
  status_updated: { labelKey: 'operatorActions.statusUpdated', icon: 'refresh' as IconName },
  report_resolved: { labelKey: 'operatorActions.reportResolved', icon: 'check' as IconName },
  report_rejected: { labelKey: 'operatorActions.reportRejected', icon: 'close' as IconName },
  notes_added: { labelKey: 'operatorActions.notesAdded', icon: 'message' as IconName },
  photos_uploaded: { labelKey: 'operatorActions.photosUploaded', icon: 'image' as IconName },
  route_started: { labelKey: 'operatorActions.routeStarted', icon: 'route' as IconName },
  route_completed: { labelKey: 'operatorActions.routeCompleted', icon: 'success' as IconName },
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
