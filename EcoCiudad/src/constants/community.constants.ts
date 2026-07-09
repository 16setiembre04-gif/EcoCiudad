import { type IconName } from '@/presentation/components/atoms/icon';

export const COMMUNITY_CATEGORIES = {
  environmental: { label: 'Medio Ambiente', icon: 'leaf' as IconName, color: '#22C55E' },
  recycling: { label: 'Reciclaje', icon: 'recycle' as IconName, color: '#3B82F6' },
  conservation: { label: 'Conservación', icon: 'tree' as IconName, color: '#16A34A' },
  education: { label: 'Educación', icon: 'help' as IconName, color: '#F59E0B' },
  cleanup: { label: 'Limpieza', icon: 'tasks' as IconName, color: '#8B5CF6' },
  gardening: { label: 'Jardinería', icon: 'tree' as IconName, color: '#10B981' },
  sustainability: { label: 'Sostenibilidad', icon: 'eco-points' as IconName, color: '#06B6D4' },
  other: { label: 'Otro', icon: 'help' as IconName, color: '#6B7280' },
} as const;

export const MEMBER_ROLES = {
  owner: { label: 'Propietario', color: '#EF4444', icon: 'achievement' as IconName },
  admin: { label: 'Administrador', color: '#F59E0B', icon: 'settings' as IconName },
  moderator: { label: 'Moderador', color: '#3B82F6', icon: 'tasks' as IconName },
  member: { label: 'Miembro', color: '#6B7280', icon: 'user' as IconName },
} as const;

export const POST_TYPES = {
  text: { label: 'Texto', icon: 'message' as IconName },
  image: { label: 'Imagen', icon: 'image' as IconName },
  poll: { label: 'Encuesta', icon: 'list' as IconName },
  achievement: { label: 'Logro', icon: 'achievement' as IconName },
  tip: { label: 'Consejo', icon: 'info' as IconName },
} as const;

export const REACTION_TYPES = {
  like: { label: 'Me gusta', icon: 'heart' as IconName, color: '#EF4444' },
  love: { label: 'Me encanta', icon: 'heart' as IconName, color: '#EC4899' },
  wow: { label: 'Wow', icon: 'star' as IconName, color: '#F59E0B' },
  sad: { label: 'Triste', icon: 'error' as IconName, color: '#3B82F6' },
  angry: { label: 'Enojado', icon: 'warning' as IconName, color: '#DC2626' },
} as const;

export const COMMUNITY_CONSTANTS = {
  MAX_MEMBERS_DISPLAY: 999,
  MAX_RULES_LENGTH: 10,
  MAX_RULE_TEXT_LENGTH: 200,
  MAX_DESCRIPTION_LENGTH: 500,
  MAX_NAME_LENGTH: 100,
  POSTS_PER_PAGE: 20,
  MEMBERS_PER_PAGE: 50,
} as const;

export const COMMUNITY_ROUTES = {
  HOME: '/(citizen)/(tabs)/community',
  DETAILS: '/(citizen)/community/[id]',
  CREATE: '/(citizen)/community/create',
  EDIT: '/(citizen)/community/[id]/edit',
  MEMBERS: '/(citizen)/community/[id]/members',
  SETTINGS: '/(citizen)/community/[id]/settings',
  INVITATIONS: '/(citizen)/community/invitations',
  MY_COMMUNITIES: '/(citizen)/community/my-communities',
} as const;
