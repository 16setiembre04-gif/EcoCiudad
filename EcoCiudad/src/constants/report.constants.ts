import { type IconName } from '@/presentation/components/atoms/icon';

export const REPORT_CATEGORIES = {
  waste: { labelKey: 'reports.categories.waste', icon: 'leaf' as IconName, color: '#22C55E' },
  pollution: { labelKey: 'reports.categories.pollution', icon: 'water' as IconName, color: '#EF4444' },
  green_space: { labelKey: 'reports.categories.green_space', icon: 'tree' as IconName, color: '#16A34A' },
  water: { labelKey: 'reports.categories.water', icon: 'water' as IconName, color: '#3B82F6' },
  noise: { labelKey: 'reports.categories.noise', icon: 'noise' as IconName, color: '#F59E0B' },
  other: { labelKey: 'reports.categories.other', icon: 'help' as IconName, color: '#6B7280' },
} as const;

export const REPORT_STATUSES = {
  pending: { labelKey: 'reportStatuses.pending', color: 'warning' as const, icon: 'clock' as IconName },
  assigned: { labelKey: 'reportStatuses.assigned', color: 'info' as const, icon: 'user' as IconName },
  in_progress: { labelKey: 'reportStatuses.in_progress', color: 'info' as const, icon: 'refresh' as IconName },
  in_review: { labelKey: 'reportStatuses.in_review', color: 'info' as const, icon: 'search' as IconName },
  resolved: { labelKey: 'reportStatuses.resolved', color: 'success' as const, icon: 'check' as IconName },
  rejected: { labelKey: 'reportStatuses.rejected', color: 'error' as const, icon: 'close' as IconName },
} as const;

export const REPORT_SEVERITIES = {
  low: { labelKey: 'reports.severities.low', color: '#22C55E' },
  medium: { labelKey: 'reports.severities.medium', color: '#F59E0B' },
  high: { labelKey: 'reports.severities.high', color: '#F97316' },
  critical: { labelKey: 'reports.severities.critical', color: '#EF4444' },
} as const;

export const REPORT_SORT_OPTIONS = [
  { value: 'created_at', labelKey: 'reports.sortOptions.recent' },
  { value: 'updated_at', labelKey: 'reports.sortOptions.updated' },
] as const;

export const REPORT_STATUS_TRANSITIONS = {
  pending: ['assigned', 'in_review', 'rejected'],
  assigned: ['in_progress', 'rejected'],
  in_progress: ['in_review', 'resolved', 'rejected'],
  in_review: ['resolved', 'rejected'],
  resolved: [],
  rejected: [],
} as const;

export const IMAGE_UPLOAD_CONFIG = {
  MAX_IMAGES: 5,
  MAX_SIZE_MB: 10,
  COMPRESSION_QUALITY: 0.7,
  ALLOWED_TYPES: ['image/jpeg', 'image/png', 'image/heic'],
} as const;
