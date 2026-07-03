import { type IconName } from '@/presentation/components/atoms/icon';

export const COMMUNITY_CATEGORIES = {
  environmental: { label: 'Environmental', icon: 'leaf' as IconName, color: '#22C55E' },
  recycling: { label: 'Recycling', icon: 'recycle' as IconName, color: '#3B82F6' },
  conservation: { label: 'Conservation', icon: 'tree' as IconName, color: '#16A34A' },
  education: { label: 'Education', icon: 'help' as IconName, color: '#F59E0B' },
  cleanup: { label: 'Cleanup', icon: 'tasks' as IconName, color: '#8B5CF6' },
  gardening: { label: 'Gardening', icon: 'tree' as IconName, color: '#10B981' },
  sustainability: { label: 'Sustainability', icon: 'eco-points' as IconName, color: '#06B6D4' },
  other: { label: 'Other', icon: 'help' as IconName, color: '#6B7280' },
} as const;

export const MEMBER_ROLES = {
  owner: { label: 'Owner', color: '#EF4444', icon: 'achievement' as IconName },
  admin: { label: 'Admin', color: '#F59E0B', icon: 'settings' as IconName },
  moderator: { label: 'Moderator', color: '#3B82F6', icon: 'tasks' as IconName },
  member: { label: 'Member', color: '#6B7280', icon: 'user' as IconName },
} as const;

export const POST_TYPES = {
  text: { label: 'Text', icon: 'message' as IconName },
  image: { label: 'Image', icon: 'image' as IconName },
  poll: { label: 'Poll', icon: 'list' as IconName },
  achievement: { label: 'Achievement', icon: 'achievement' as IconName },
  tip: { label: 'Tip', icon: 'info' as IconName },
} as const;

export const REACTION_TYPES = {
  like: { label: 'Like', icon: 'heart' as IconName, color: '#EF4444' },
  love: { label: 'Love', icon: 'heart' as IconName, color: '#EC4899' },
  wow: { label: 'Wow', icon: 'star' as IconName, color: '#F59E0B' },
  sad: { label: 'Sad', icon: 'error' as IconName, color: '#3B82F6' },
  angry: { label: 'Angry', icon: 'warning' as IconName, color: '#DC2626' },
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
