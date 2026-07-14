// Community DTOs

export interface CommunityDTO {
  id: string;
  name: string;
  description: string;
  category: string;
  privacy: string;
  cover_image_url?: string;
  logo_url?: string;
  department?: string;
  district?: string;
  latitude?: number;
  longitude?: number;
  address?: string;
  max_members?: number;
  rules?: string[];
  member_count: number;
  post_count: number;
  created_at: string;
  updated_at: string;
  owner_id: string;
}

export interface CommunityMemberDTO {
  id: string;
  community_id: string;
  user_id: string;
  role: string;
  joined_at: string;
  user?: {
    id: string;
    display_name: string;
    avatar_url?: string;
  };
}

export interface PostDTO {
  id: string;
  community_id: string;
  author_id: string;
  type: string;
  content: string;
  images?: string[];
  latitude?: number;
  longitude?: number;
  address?: string;
  is_pinned: boolean;
  like_count: number;
  comment_count: number;
  user_reaction?: string;
  created_at: string;
  updated_at: string;
  author?: {
    id: string;
    display_name: string;
    avatar_url?: string;
  };
}

export interface CommentDTO {
  id: string;
  post_id: string;
  author_id: string;
  content: string;
  parent_comment_id?: string;
  like_count: number;
  reply_count: number;
  created_at: string;
  updated_at: string;
  author?: {
    id: string;
    display_name: string;
    avatar_url?: string;
  };
}

export interface ReactionDTO {
  id: string;
  post_id: string;
  user_id: string;
  type: string;
  created_at: string;
}

export interface BookmarkDTO {
  id: string;
  post_id: string;
  user_id: string;
  created_at: string;
}

export interface PollDTO {
  id: string;
  post_id: string;
  question: string;
  ends_at?: string;
  created_at: string;
  options?: PollOptionDTO[];
}

export interface PollOptionDTO {
  id: string;
  poll_id: string;
  text: string;
  vote_count: number;
  user_voted?: boolean;
}

export interface PollVoteDTO {
  id: string;
  poll_id: string;
  option_id: string;
  user_id: string;
  created_at: string;
}
