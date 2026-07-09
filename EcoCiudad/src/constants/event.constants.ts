import { type IconName } from '@/presentation/components/atoms/icon';

export const EVENT_CATEGORIES = {
  cleanup: { labelKey: 'events.categories.cleanup', icon: 'recycle' as IconName, color: '#22C55E' },
  planting: { labelKey: 'events.categories.planting', icon: 'tree' as IconName, color: '#16A34A' },
  education: { labelKey: 'events.categories.education', icon: 'help' as IconName, color: '#3B82F6' },
  community: { labelKey: 'events.categories.community', icon: 'community' as IconName, color: '#8B5CF6' },
  workshop: { labelKey: 'events.categories.workshop', icon: 'tasks' as IconName, color: '#F59E0B' },
} as const;

export const EVENT_STATUSES = {
  upcoming: { label: 'Próximo', color: '#3B82F6', icon: 'calendar' as IconName },
  ongoing: { label: 'En Curso', color: '#22C55E', icon: 'success' as IconName },
  completed: { label: 'Completado', color: '#6B7280', icon: 'check' as IconName },
  cancelled: { label: 'Cancelado', color: '#EF4444', icon: 'close' as IconName },
} as const;

export const PARTICIPANT_STATUSES = {
  registered: { label: 'Registrado', color: '#3B82F6' },
  attended: { label: 'Asistió', color: '#22C55E' },
  cancelled: { label: 'Cancelado', color: '#EF4444' },
  waitlisted: { label: 'En Espera', color: '#F59E0B' },
} as const;

export const REMINDER_OPTIONS = [
  { value: 15, label: '15 minutos antes' },
  { value: 30, label: '30 minutos antes' },
  { value: 60, label: '1 hora antes' },
  { value: 1440, label: '1 día antes' },
  { value: 10080, label: '1 semana antes' },
] as const;

export const REMINDER_TYPES = {
  push: { label: 'Notificación Push', icon: 'bell' as IconName },
  email: { label: 'Correo', icon: 'email' as IconName },
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
