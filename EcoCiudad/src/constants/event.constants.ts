import { type IconName } from '@/presentation/components/atoms/icon';

export const EVENT_CATEGORIES = {
  cleanup: { label: 'Cleanup', icon: 'recycle' as IconName, color: '#22C55E' },
  planting: { label: 'Planting', icon: 'tree' as IconName, color: '#16A34A' },
  education: { label: 'Education', icon: 'help' as IconName, color: '#3B82F6' },
  community: { label: 'Community', icon: 'community' as IconName, color: '#8B5CF6' },
  workshop: { label: 'Workshop', icon: 'tasks' as IconName, color: '#F59E0B' },
} as const;

export const EVENT_STATUSES = {
  upcoming: { label: 'Upcoming', color: '#3B82F6', icon: 'calendar' as IconName },
  ongoing: { label: 'Ongoing', color: '#22C55E', icon: 'success' as IconName },
  completed: { label: 'Completed', color: '#6B7280', icon: 'check' as IconName },
  cancelled: { label: 'Cancelled', color: '#EF4444', icon: 'close' as IconName },
} as const;

export const PARTICIPANT_STATUSES = {
  registered: { label: 'Registered', color: '#3B82F6' },
  attended: { label: 'Attended', color: '#22C55E' },
  cancelled: { label: 'Cancelled', color: '#EF4444' },
  waitlisted: { label: 'Waitlisted', color: '#F59E0B' },
} as const;

export const REMINDER_OPTIONS = [
  { value: 15, label: '15 minutes before' },
  { value: 30, label: '30 minutes before' },
  { value: 60, label: '1 hour before' },
  { value: 1440, label: '1 day before' },
  { value: 10080, label: '1 week before' },
] as const;

export const REMINDER_TYPES = {
  push: { label: 'Push Notification', icon: 'bell' as IconName },
  email: { label: 'Email', icon: 'email' as IconName },
  sms: { label: 'SMS', icon: 'phone' as IconName },
} as const;

export const EVENT_CONSTANTS = {
  DEFAULT_RADIUS_KM: 50,
  MAX_ATTENDEES_DISPLAY: 999,
  POPULAR_EVENTS_LIMIT: 10,
  UPCOMING_EVENTS_LIMIT: 20,
  MIN_ECO_POINTS_REWARD: 5,
  MAX_ECO_POINTS_REWARD: 500,
  DEFAULT_ECO_POINTS_REWARD: 10,
} as const;

export const EVENT_ROUTES = {
  HOME: '/(citizen)/(tabs)/events',
  DETAILS: '/(citizen)/events/[id]',
  CREATE: '/(citizen)/events/create',
  MY_EVENTS: '/(citizen)/events/my-events',
  REGISTER: '/(citizen)/events/[id]/register',
  ATTENDANCE: '/(citizen)/events/[id]/attendance',
} as const;
