import { type IconName } from '@/components/atoms/icon';

export const REPORT_CATEGORIES = {
  waste: { label: 'Waste', icon: 'leaf' as IconName, color: '#22C55E' },
  pollution: { label: 'Pollution', icon: 'water' as IconName, color: '#EF4444' },
  green_space: { label: 'Green Areas', icon: 'tree' as IconName, color: '#16A34A' },
  water: { label: 'Water Pollution', icon: 'water' as IconName, color: '#3B82F6' },
  noise: { label: 'Noise', icon: 'noise' as IconName, color: '#F59E0B' },
  other: { label: 'Other', icon: 'help' as IconName, color: '#6B7280' },
} as const;

export const REPORT_STATUSES = {
  pending: { label: 'Pending', color: 'warning' as const, icon: 'clock' as IconName },
  in_review: { label: 'In Review', color: 'info' as const, icon: 'search' as IconName },
  resolved: { label: 'Resolved', color: 'success' as const, icon: 'check' as IconName },
  rejected: { label: 'Rejected', color: 'error' as const, icon: 'close' as IconName },
} as const;

export const REPORT_SEVERITIES = {
  low: { label: 'Low', color: '#22C55E' },
  medium: { label: 'Medium', color: '#F59E0B' },
  high: { label: 'High', color: '#F97316' },
  critical: { label: 'Critical', color: '#EF4444' },
} as const;

export const REPORT_SORT_OPTIONS = [
  { value: 'created_at', label: 'Most Recent' },
  { value: 'updated_at', label: 'Recently Updated' },
] as const;

export const REPORT_STATUS_TRANSITIONS = {
  pending: ['in_review', 'rejected'],
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
