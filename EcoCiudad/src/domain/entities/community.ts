// Community Module Domain Entities

export enum CommunityPrivacy {
  PUBLIC = 'public',
  PRIVATE = 'private',
}

export enum CommunityCategory {
  ENVIRONMENTAL = 'environmental',
  RECYCLING = 'recycling',
  CONSERVATION = 'conservation',
  EDUCATION = 'education',
  CLEANUP = 'cleanup',
  GARDENING = 'gardening',
  SUSTAINABILITY = 'sustainability',
  OTHER = 'other',
}

export enum MemberRole {
  OWNER = 'owner',
  ADMIN = 'admin',
  MODERATOR = 'moderator',
  MEMBER = 'member',
}

export enum PostType {
  TEXT = 'text',
  IMAGE = 'image',
  POLL = 'poll',
  ACHIEVEMENT = 'achievement',
  TIP = 'tip',
}

export enum ReactionType {
  LIKE = 'like',
  LOVE = 'love',
  WOW = 'wow',
  SAD = 'sad',
  ANGRY = 'angry',
}

export interface GeoLocation {
  latitude: number;
  longitude: number;
  address?: string;
}

export interface Community {
  id: string;
  name: string;
  description: string;
  category: CommunityCategory;
  privacy: CommunityPrivacy;
  coverImageUrl?: string;
  logoUrl?: string;
  location?: {
    department: string;
    district: string;
  };
  geoLocation?: GeoLocation;
  maxMembers?: number;
  rules?: string[];
  memberCount: number;
  postCount: number;
  createdAt: Date;
  updatedAt: Date;
  ownerId: string;
}

export interface CommunityMember {
  id: string;
  communityId: string;
  userId: string;
  role: MemberRole;
  joinedAt: Date;
  user?: {
    id: string;
    displayName: string;
    avatarUrl?: string;
  };
}

export interface Post {
  id: string;
  communityId: string;
  authorId: string;
  type: PostType;
  content: string;
  images?: string[];
  location?: {
    latitude: number;
    longitude: number;
    address?: string;
  };
  isPinned: boolean;
  likeCount: number;
  commentCount: number;
  userReaction?: ReactionType;
  createdAt: Date;
  updatedAt: Date;
  author?: {
    id: string;
    displayName: string;
    avatarUrl?: string;
  };
}

export interface Comment {
  id: string;
  postId: string;
  authorId: string;
  content: string;
  parentCommentId?: string;
  likeCount: number;
  replyCount: number;
  createdAt: Date;
  updatedAt: Date;
  author?: {
    id: string;
    displayName: string;
    avatarUrl?: string;
  };
  replies?: Comment[];
}

export interface Reaction {
  id: string;
  postId: string;
  userId: string;
  type: ReactionType;
  createdAt: Date;
}

export interface Bookmark {
  id: string;
  postId: string;
  userId: string;
  createdAt: Date;
}

export interface Poll {
  id: string;
  postId: string;
  question: string;
  options: PollOption[];
  endsAt?: Date;
  createdAt: Date;
}

export interface PollOption {
  id: string;
  pollId: string;
  text: string;
  voteCount: number;
  userVoted?: boolean;
}

export interface PollVote {
  id: string;
  pollId: string;
  optionId: string;
  userId: string;
  createdAt: Date;
}
