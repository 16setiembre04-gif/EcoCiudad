// Community Remote Data Source

import { supabase } from '@/infrastructure/database/supabase.client';
import {
  CommunityDTO,
  CommunityMemberDTO,
  PostDTO,
  CommentDTO,
  ReactionDTO,
  BookmarkDTO,
  PollDTO,
  PollOptionDTO,
  PollVoteDTO,
} from '@/data/dto/community.dto';
import { CommunityFilters } from '@/domain/repositories/community.repository';
import { PostFilters } from '@/domain/repositories/post.repository';
import { MemberRole, ReactionType } from '@/domain/entities/community';

export class CommunityRemoteDataSource {
  // Communities
  async getCommunities(filters?: CommunityFilters): Promise<CommunityDTO[]> {
    let query = supabase.from('communities').select('*');

    if (filters?.category) {
      query = query.eq('category', filters.category);
    }
    if (filters?.privacy) {
      query = query.eq('privacy', filters.privacy);
    }
    if (filters?.search) {
      query = query.ilike('name', `%${filters.search}%`);
    }
    if (filters?.department) {
      query = query.eq('department', filters.department);
    }
    if (filters?.district) {
      query = query.eq('district', filters.district);
    }

    const { data, error } = await query.order('created_at', { ascending: false });
    if (error) throw error;
    return data || [];
  }

  async getCommunity(id: string): Promise<CommunityDTO> {
    const { data, error } = await supabase
      .from('communities')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  }

  async createCommunity(community: Omit<CommunityDTO, 'id' | 'created_at' | 'updated_at' | 'member_count' | 'post_count'>): Promise<CommunityDTO> {
    const { data, error } = await supabase
      .from('communities')
      .insert(community)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async updateCommunity(id: string, data: Partial<CommunityDTO>): Promise<CommunityDTO> {
    const { data: updated, error } = await supabase
      .from('communities')
      .update({ ...data, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return updated;
  }

  async deleteCommunity(id: string): Promise<void> {
    const { error } = await supabase
      .from('communities')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }

  // Members
  async getMembers(communityId: string, role?: MemberRole): Promise<CommunityMemberDTO[]> {
    let query = supabase
      .from('community_members')
      .select('*, user:profiles(id, display_name, avatar_url)')
      .eq('community_id', communityId);

    if (role) {
      query = query.eq('role', role);
    }

    const { data, error } = await query.order('joined_at', { ascending: true });
    if (error) throw error;
    return data || [];
  }

  async joinCommunity(communityId: string, userId: string): Promise<CommunityMemberDTO> {
    const { data, error } = await supabase
      .from('community_members')
      .insert({
        community_id: communityId,
        user_id: userId,
        role: 'member',
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async leaveCommunity(communityId: string, userId: string): Promise<void> {
    const { error } = await supabase
      .from('community_members')
      .delete()
      .eq('community_id', communityId)
      .eq('user_id', userId);

    if (error) throw error;
  }

  async updateMemberRole(communityId: string, userId: string, role: MemberRole): Promise<CommunityMemberDTO> {
    const { data, error } = await supabase
      .from('community_members')
      .update({ role })
      .eq('community_id', communityId)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async getJoinedCommunities(userId: string): Promise<CommunityDTO[]> {
    const { data, error } = await supabase
      .from('community_members')
      .select('community:communities(*)')
      .eq('user_id', userId);

    if (error) throw error;
    return data?.map((item: any) => item.community) || [];
  }

  async isMember(communityId: string, userId: string): Promise<boolean> {
    const { data, error } = await supabase
      .from('community_members')
      .select('id')
      .eq('community_id', communityId)
      .eq('user_id', userId)
      .single();

    if (error && error.code === 'PGRST116') return false;
    if (error) throw error;
    return !!data;
  }

  // Posts
  async getPosts(filters: PostFilters): Promise<PostDTO[]> {
    let query = supabase
      .from('posts')
      .select('*, author:profiles(id, display_name, avatar_url)')
      .eq('community_id', filters.communityId);

    if (filters.type) {
      query = query.eq('type', filters.type);
    }
    if (filters.pinned !== undefined) {
      query = query.eq('is_pinned', filters.pinned);
    }
    if (filters.authorId) {
      query = query.eq('author_id', filters.authorId);
    }
    if (filters.search) {
      query = query.ilike('content', `%${filters.search}%`);
    }

    const { data, error } = await query.order('created_at', { ascending: false });
    if (error) throw error;
    return data || [];
  }

  async getPost(id: string): Promise<PostDTO> {
    const { data, error } = await supabase
      .from('posts')
      .select('*, author:profiles(id, display_name, avatar_url)')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  }

  async createPost(post: Omit<PostDTO, 'id' | 'created_at' | 'updated_at' | 'like_count' | 'comment_count'>): Promise<PostDTO> {
    const { data, error } = await supabase
      .from('posts')
      .insert(post)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async updatePost(id: string, data: Partial<PostDTO>): Promise<PostDTO> {
    const { data: updated, error } = await supabase
      .from('posts')
      .update({ ...data, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return updated;
  }

  async deletePost(id: string): Promise<void> {
    const { error } = await supabase
      .from('posts')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }

  async pinPost(id: string, pinned: boolean): Promise<PostDTO> {
    return this.updatePost(id, { is_pinned: pinned });
  }

  // Comments
  async getComments(postId: string): Promise<CommentDTO[]> {
    const { data, error } = await supabase
      .from('comments')
      .select('*, author:profiles(id, display_name, avatar_url)')
      .eq('post_id', postId)
      .is('parent_comment_id', null)
      .order('created_at', { ascending: true });

    if (error) throw error;
    return data || [];
  }

  async createComment(comment: Omit<CommentDTO, 'id' | 'created_at' | 'updated_at' | 'like_count' | 'reply_count'>): Promise<CommentDTO> {
    const { data, error } = await supabase
      .from('comments')
      .insert(comment)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async deleteComment(id: string): Promise<void> {
    const { error } = await supabase
      .from('comments')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }

  // Reactions
  async addReaction(postId: string, userId: string, type: ReactionType): Promise<ReactionDTO> {
    const { data, error } = await supabase
      .from('reactions')
      .insert({
        post_id: postId,
        user_id: userId,
        type,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async removeReaction(postId: string, userId: string): Promise<void> {
    const { error } = await supabase
      .from('reactions')
      .delete()
      .eq('post_id', postId)
      .eq('user_id', userId);

    if (error) throw error;
  }

  async getPostReactions(postId: string): Promise<ReactionDTO[]> {
    const { data, error } = await supabase
      .from('reactions')
      .select('*')
      .eq('post_id', postId);

    if (error) throw error;
    return data || [];
  }

  // Bookmarks
  async bookmarkPost(postId: string, userId: string): Promise<BookmarkDTO> {
    const { data, error } = await supabase
      .from('bookmarks')
      .insert({
        post_id: postId,
        user_id: userId,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async removeBookmark(postId: string, userId: string): Promise<void> {
    const { error } = await supabase
      .from('bookmarks')
      .delete()
      .eq('post_id', postId)
      .eq('user_id', userId);

    if (error) throw error;
  }

  async getBookmarkedPosts(userId: string): Promise<PostDTO[]> {
    const { data, error } = await supabase
      .from('bookmarks')
      .select('post:posts(*, author:profiles(id, display_name, avatar_url))')
      .eq('user_id', userId);

    if (error) throw error;
    return data?.map((item: any) => item.post) || [];
  }

  async isBookmarked(postId: string, userId: string): Promise<boolean> {
    const { data, error } = await supabase
      .from('bookmarks')
      .select('id')
      .eq('post_id', postId)
      .eq('user_id', userId)
      .single();

    if (error && error.code === 'PGRST116') return false;
    if (error) throw error;
    return !!data;
  }

  // Polls
  async getPoll(postId: string): Promise<PollDTO> {
    const { data, error } = await supabase
      .from('polls')
      .select('*, options:poll_options(*)')
      .eq('post_id', postId)
      .single();

    if (error) throw error;
    return data;
  }

  async createPoll(poll: Omit<PollDTO, 'id' | 'created_at'>): Promise<PollDTO> {
    const { data, error } = await supabase
      .from('polls')
      .insert(poll)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async updatePoll(id: string, data: Partial<PollDTO>): Promise<PollDTO> {
    const { data: updated, error } = await supabase
      .from('polls')
      .update(data)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return updated;
  }

  async deletePoll(id: string): Promise<void> {
    const { error } = await supabase
      .from('polls')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }

  async addPollOption(pollId: string, text: string): Promise<PollOptionDTO> {
    const { data, error } = await supabase
      .from('poll_options')
      .insert({
        poll_id: pollId,
        text,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async removePollOption(optionId: string): Promise<void> {
    const { error } = await supabase
      .from('poll_options')
      .delete()
      .eq('id', optionId);

    if (error) throw error;
  }

  async votePoll(pollId: string, optionId: string, userId: string): Promise<PollVoteDTO> {
    const { data, error } = await supabase
      .from('poll_votes')
      .insert({
        poll_id: pollId,
        option_id: optionId,
        user_id: userId,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async removeVote(pollId: string, userId: string): Promise<void> {
    const { error } = await supabase
      .from('poll_votes')
      .delete()
      .eq('poll_id', pollId)
      .eq('user_id', userId);

    if (error) throw error;
  }

  async getPollVotes(pollId: string): Promise<PollVoteDTO[]> {
    const { data, error } = await supabase
      .from('poll_votes')
      .select('*')
      .eq('poll_id', pollId);

    if (error) throw error;
    return data || [];
  }

  async hasVoted(pollId: string, userId: string): Promise<boolean> {
    const { data, error } = await supabase
      .from('poll_votes')
      .select('id')
      .eq('poll_id', pollId)
      .eq('user_id', userId)
      .single();

    if (error && error.code === 'PGRST116') return false;
    if (error) throw error;
    return !!data;
  }
}
