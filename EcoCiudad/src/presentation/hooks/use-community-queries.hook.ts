import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { type CommunityFilters } from '@/domain/repositories/community.repository';
import { type PostFilters } from '@/domain/repositories/post.repository';
import {
  type Community,
  type Post,
  type Comment,
  type ReactionType,
  type MemberRole,
} from '@/domain/entities/community';
import { container } from '@/presentation/navigation/container';
import { useAuthStore } from '@/presentation/stores';
import { QUERY_KEYS } from '@/constants';

// Community Hooks
export function useCommunities(filters?: CommunityFilters) {
  return useQuery({
    queryKey: [QUERY_KEYS.COMMUNITIES, 'list', filters],
    queryFn: async () => {
      const result = await container.communityUseCases.getCommunities.execute(filters);
      if (result.left) throw result.left;
      return result.right;
    },
  });
}

export function useCommunity(id: string) {
  return useQuery({
    queryKey: [QUERY_KEYS.COMMUNITIES, id],
    queryFn: async () => {
      const result = await container.communityUseCases.getCommunity.execute(id);
      if (result.left) throw result.left;
      return result.right;
    },
    enabled: !!id,
  });
}

export function useMyCommunities() {
  const user = useAuthStore((state) => state.user);

  return useQuery({
    queryKey: [QUERY_KEYS.COMMUNITIES, 'my', user?.id],
    queryFn: async () => {
      if (!user) return [];
      const result = await container.communityUseCases.getJoinedCommunities.execute(user.id);
      if (result.left) throw result.left;
      return result.right;
    },
    enabled: !!user,
  });
}

export function useIsMember(communityId: string) {
  const user = useAuthStore((state) => state.user);

  return useQuery({
    queryKey: [QUERY_KEYS.COMMUNITIES, communityId, 'membership', user?.id],
    queryFn: async () => {
      if (!user) return false;
      const result = await container.communityUseCases.isMember.execute(communityId, user.id);
      if (result.left) throw result.left;
      return result.right;
    },
    enabled: !!communityId && !!user,
  });
}

export function useCreateCommunity() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (
      data: Omit<Community, 'id' | 'createdAt' | 'updatedAt' | 'memberCount' | 'postCount'>
    ) => {
      const result = await container.communityUseCases.createCommunity.execute(data);
      if (result.left) throw result.left;
      return result.right;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.COMMUNITIES] });
    },
  });
}

export function useUpdateCommunity() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<Community> }) => {
      const result = await container.communityUseCases.updateCommunity.execute(id, data);
      if (result.left) throw result.left;
      return result.right;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.COMMUNITIES, variables.id] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.COMMUNITIES] });
    },
  });
}

export function useDeleteCommunity() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const result = await container.communityUseCases.deleteCommunity.execute(id);
      if (result.left) throw result.left;
      return result.right;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.COMMUNITIES] });
    },
  });
}

export function useJoinCommunity() {
  const queryClient = useQueryClient();
  const user = useAuthStore((state) => state.user);

  return useMutation({
    mutationFn: async (communityId: string) => {
      if (!user) throw new Error('Usuario no autenticado');
      const result = await container.communityUseCases.joinCommunity.execute(communityId, user.id);
      if (result.left) throw result.left;
      return result.right;
    },
    onSuccess: (_, communityId) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.COMMUNITIES, communityId] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.COMMUNITIES, communityId, 'membership'] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.COMMUNITIES, 'my'] });
    },
  });
}

export function useLeaveCommunity() {
  const queryClient = useQueryClient();
  const user = useAuthStore((state) => state.user);

  return useMutation({
    mutationFn: async (communityId: string) => {
      if (!user) throw new Error('Usuario no autenticado');
      const result = await container.communityUseCases.leaveCommunity.execute(communityId, user.id);
      if (result.left) throw result.left;
      return result.right;
    },
    onSuccess: (_, communityId) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.COMMUNITIES, communityId] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.COMMUNITIES, communityId, 'membership'] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.COMMUNITIES, 'my'] });
    },
  });
}

export function useCommunityMembers(communityId: string, role?: MemberRole) {
  return useQuery({
    queryKey: [QUERY_KEYS.COMMUNITIES, communityId, 'members', role],
    queryFn: async () => {
      const result = await container.communityUseCases.getMembers.execute(communityId, role);
      if (result.left) throw result.left;
      return result.right;
    },
    enabled: !!communityId,
  });
}

export function useUpdateMemberRole() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      communityId,
      userId,
      role,
    }: {
      communityId: string;
      userId: string;
      role: MemberRole;
    }) => {
      const result = await container.communityUseCases.updateMemberRole.execute(
        communityId,
        userId,
        role
      );
      if (result.left) throw result.left;
      return result.right;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.COMMUNITIES, variables.communityId, 'members'],
      });
    },
  });
}

// Post Hooks
export function usePosts(filters: PostFilters) {
  return useQuery({
    queryKey: [QUERY_KEYS.COMMUNITIES, filters.communityId, 'posts', filters],
    queryFn: async () => {
      const result = await container.postUseCases.getPosts.execute(filters);
      if (result.left) throw result.left;
      return result.right;
    },
    enabled: !!filters.communityId,
  });
}

export function usePost(id: string) {
  return useQuery({
    queryKey: [QUERY_KEYS.COMMUNITIES, 'posts', id],
    queryFn: async () => {
      const result = await container.postUseCases.getPost.execute(id);
      if (result.left) throw result.left;
      return result.right;
    },
    enabled: !!id,
  });
}

export function useCreatePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (
      data: Omit<Post, 'id' | 'createdAt' | 'updatedAt' | 'likeCount' | 'commentCount'>
    ) => {
      const result = await container.postUseCases.createPost.execute(data);
      if (result.left) throw result.left;
      return result.right;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.COMMUNITIES, variables.communityId, 'posts'],
      });
    },
  });
}

export function useDeletePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const result = await container.postUseCases.deletePost.execute(id);
      if (result.left) throw result.left;
      return result.right;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.COMMUNITIES], exact: false });
    },
  });
}

export function usePinPost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, pinned }: { id: string; pinned: boolean }) => {
      const result = await container.postUseCases.pinPost.execute(id, pinned);
      if (result.left) throw result.left;
      return result.right;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.COMMUNITIES], exact: false });
    },
  });
}

// Comment Hooks
export function useComments(postId: string) {
  return useQuery({
    queryKey: [QUERY_KEYS.COMMUNITIES, 'posts', postId, 'comments'],
    queryFn: async () => {
      const result = await container.postUseCases.getComments.execute(postId);
      if (result.left) throw result.left;
      return result.right;
    },
    enabled: !!postId,
  });
}

export function useCreateComment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (
      data: Omit<Comment, 'id' | 'createdAt' | 'updatedAt' | 'likeCount' | 'replyCount'>
    ) => {
      const result = await container.postUseCases.createComment.execute(data);
      if (result.left) throw result.left;
      return result.right;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.COMMUNITIES, 'posts', variables.postId, 'comments'],
      });
    },
  });
}

export function useDeleteComment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const result = await container.postUseCases.deleteComment.execute(id);
      if (result.left) throw result.left;
      return result.right;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.COMMUNITIES], exact: false });
    },
  });
}

// Reaction Hooks
export function useAddReaction() {
  const queryClient = useQueryClient();
  const user = useAuthStore((state) => state.user);

  return useMutation({
    mutationFn: async ({ postId, type }: { postId: string; type: ReactionType }) => {
      if (!user) throw new Error('Usuario no autenticado');
      const result = await container.postUseCases.addReaction.execute(postId, user.id, type);
      if (result.left) throw result.left;
      return result.right;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.COMMUNITIES, 'posts', variables.postId],
      });
    },
  });
}

export function useRemoveReaction() {
  const queryClient = useQueryClient();
  const user = useAuthStore((state) => state.user);

  return useMutation({
    mutationFn: async (postId: string) => {
      if (!user) throw new Error('Usuario no autenticado');
      const result = await container.postUseCases.removeReaction.execute(postId, user.id);
      if (result.left) throw result.left;
      return result.right;
    },
    onSuccess: (_, postId) => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.COMMUNITIES, 'posts', postId],
      });
    },
  });
}

// Bookmark Hooks
export function useBookmarkPost() {
  const queryClient = useQueryClient();
  const user = useAuthStore((state) => state.user);

  return useMutation({
    mutationFn: async (postId: string) => {
      if (!user) throw new Error('Usuario no autenticado');
      const result = await container.postUseCases.bookmarkPost.execute(postId, user.id);
      if (result.left) throw result.left;
      return result.right;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.COMMUNITIES, 'bookmarks'] });
    },
  });
}

export function useRemoveBookmark() {
  const queryClient = useQueryClient();
  const user = useAuthStore((state) => state.user);

  return useMutation({
    mutationFn: async (postId: string) => {
      if (!user) throw new Error('Usuario no autenticado');
      const result = await container.postUseCases.removeBookmark.execute(postId, user.id);
      if (result.left) throw result.left;
      return result.right;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.COMMUNITIES, 'bookmarks'] });
    },
  });
}

export function useBookmarkedPosts() {
  const user = useAuthStore((state) => state.user);

  return useQuery({
    queryKey: [QUERY_KEYS.COMMUNITIES, 'bookmarks', user?.id],
    queryFn: async () => {
      if (!user) return [];
      const result = await container.postUseCases.getBookmarkedPosts.execute(user.id);
      if (result.left) throw result.left;
      return result.right;
    },
    enabled: !!user,
  });
}

export function useIsBookmarked(postId: string) {
  const user = useAuthStore((state) => state.user);

  return useQuery({
    queryKey: [QUERY_KEYS.COMMUNITIES, 'posts', postId, 'bookmarked', user?.id],
    queryFn: async () => {
      if (!user) return false;
      const result = await container.postUseCases.isBookmarked.execute(postId, user.id);
      if (result.left) throw result.left;
      return result.right;
    },
    enabled: !!postId && !!user,
  });
}

// Poll Hooks
export function usePoll(postId: string) {
  return useQuery({
    queryKey: [QUERY_KEYS.COMMUNITIES, 'posts', postId, 'poll'],
    queryFn: async () => {
      const result = await container.pollUseCases.getPoll.execute(postId);
      if (result.left) throw result.left;
      return result.right;
    },
    enabled: !!postId,
  });
}

export function useVotePoll() {
  const queryClient = useQueryClient();
  const user = useAuthStore((state) => state.user);

  return useMutation({
    mutationFn: async ({ pollId, optionId }: { pollId: string; optionId: string }) => {
      if (!user) throw new Error('Usuario no autenticado');
      const result = await container.pollUseCases.votePoll.execute(pollId, optionId, user.id);
      if (result.left) throw result.left;
      return result.right;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.COMMUNITIES, 'posts', variables.pollId, 'poll'],
      });
    },
  });
}

export function useHasVoted(pollId: string) {
  const user = useAuthStore((state) => state.user);

  return useQuery({
    queryKey: [QUERY_KEYS.COMMUNITIES, 'polls', pollId, 'voted', user?.id],
    queryFn: async () => {
      if (!user) return false;
      const result = await container.pollUseCases.hasVoted.execute(pollId, user.id);
      if (result.left) throw result.left;
      return result.right;
    },
    enabled: !!pollId && !!user,
  });
}

// Aggregated Dashboard Hook
export function useCommunityDashboard() {
  const user = useAuthStore((state) => state.user);
  const { data: myCommunities, isLoading: myLoading } = useMyCommunities();
  const { data: allCommunities, isLoading: allLoading } = useCommunities();

  return {
    myCommunities: myCommunities ?? [],
    allCommunities: allCommunities ?? [],
    isLoading: myLoading || allLoading,
    user,
  };
}
