// Post Repository Interface

import { Either } from '@/domain/repositories';
import { Post, PostType, Comment, Reaction, ReactionType, Bookmark } from '@/domain/entities/community';

export interface PostFilters {
  communityId: string;
  type?: PostType;
  pinned?: boolean;
  authorId?: string;
  search?: string;
}

export interface IPostRepository {
  // Posts
  getPosts(filters: PostFilters): Promise<Either<Error, Post[]>>;
  getPost(id: string): Promise<Either<Error, Post>>;
  createPost(post: Omit<Post, 'id' | 'createdAt' | 'updatedAt' | 'likeCount' | 'commentCount'>): Promise<Either<Error, Post>>;
  updatePost(id: string, data: Partial<Post>): Promise<Either<Error, Post>>;
  deletePost(id: string): Promise<Either<Error, void>>;
  pinPost(id: string, pinned: boolean): Promise<Either<Error, Post>>;
  
  // Comments
  getComments(postId: string): Promise<Either<Error, Comment[]>>;
  createComment(comment: Omit<Comment, 'id' | 'createdAt' | 'updatedAt' | 'likeCount' | 'replyCount'>): Promise<Either<Error, Comment>>;
  deleteComment(id: string): Promise<Either<Error, void>>;
  
  // Reactions
  addReaction(postId: string, userId: string, type: ReactionType): Promise<Either<Error, Reaction>>;
  removeReaction(postId: string, userId: string): Promise<Either<Error, void>>;
  getPostReactions(postId: string): Promise<Either<Error, Reaction[]>>;
  
  // Bookmarks
  bookmarkPost(postId: string, userId: string): Promise<Either<Error, Bookmark>>;
  removeBookmark(postId: string, userId: string): Promise<Either<Error, void>>;
  getBookmarkedPosts(userId: string): Promise<Either<Error, Post[]>>;
  isBookmarked(postId: string, userId: string): Promise<Either<Error, boolean>>;
}
