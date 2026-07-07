// Post Repository Implementation

import { Either, left, right } from '@/domain/repositories';
import { Post, Comment, Reaction, ReactionType, Bookmark } from '@/domain/entities/community';
import { IPostRepository, PostFilters } from '@/domain/repositories/post.repository';
import { CommunityRemoteDataSource } from '@/data/datasources/remote/community.datasource';
import { PostMapper, CommentMapper, ReactionMapper, BookmarkMapper } from '@/data/mappers/community.mapper';

export class PostRepository implements IPostRepository {
  constructor(private dataSource: CommunityRemoteDataSource) {}

  async getPosts(filters: PostFilters): Promise<Either<Error, Post[]>> {
    try {
      const dtos = await this.dataSource.getPosts(filters);
      const posts = dtos.map(PostMapper.toDomain);
      return right(posts);
    } catch (error) {
      return left(error as Error);
    }
  }

  async getPost(id: string): Promise<Either<Error, Post>> {
    try {
      const dto = await this.dataSource.getPost(id);
      return right(PostMapper.toDomain(dto));
    } catch (error) {
      return left(error as Error);
    }
  }

  async createPost(
    post: Omit<Post, 'id' | 'createdAt' | 'updatedAt' | 'likeCount' | 'commentCount'>
  ): Promise<Either<Error, Post>> {
    try {
      const dto = PostMapper.toDto(post as Post);
      const created = await this.dataSource.createPost(dto);
      return right(PostMapper.toDomain(created));
    } catch (error) {
      return left(error as Error);
    }
  }

  async updatePost(id: string, data: Partial<Post>): Promise<Either<Error, Post>> {
    try {
      const dto = PostMapper.toDto(data as Post);
      const updated = await this.dataSource.updatePost(id, dto);
      return right(PostMapper.toDomain(updated));
    } catch (error) {
      return left(error as Error);
    }
  }

  async deletePost(id: string): Promise<Either<Error, void>> {
    try {
      await this.dataSource.deletePost(id);
      return right(undefined);
    } catch (error) {
      return left(error as Error);
    }
  }

  async pinPost(id: string, pinned: boolean): Promise<Either<Error, Post>> {
    try {
      const updated = await this.dataSource.pinPost(id, pinned);
      return right(PostMapper.toDomain(updated));
    } catch (error) {
      return left(error as Error);
    }
  }

  async getComments(postId: string): Promise<Either<Error, Comment[]>> {
    try {
      const dtos = await this.dataSource.getComments(postId);
      const comments = dtos.map(CommentMapper.toDomain);
      return right(comments);
    } catch (error) {
      return left(error as Error);
    }
  }

  async createComment(
    comment: Omit<Comment, 'id' | 'createdAt' | 'updatedAt' | 'likeCount' | 'replyCount'>
  ): Promise<Either<Error, Comment>> {
    try {
      const dto = CommentMapper.toDto(comment as Comment);
      const created = await this.dataSource.createComment(dto);
      return right(CommentMapper.toDomain(created));
    } catch (error) {
      return left(error as Error);
    }
  }

  async deleteComment(id: string): Promise<Either<Error, void>> {
    try {
      await this.dataSource.deleteComment(id);
      return right(undefined);
    } catch (error) {
      return left(error as Error);
    }
  }

  async addReaction(
    postId: string,
    userId: string,
    type: ReactionType
  ): Promise<Either<Error, Reaction>> {
    try {
      const dto = await this.dataSource.addReaction(postId, userId, type);
      return right(ReactionMapper.toDomain(dto));
    } catch (error) {
      return left(error as Error);
    }
  }

  async removeReaction(postId: string, userId: string): Promise<Either<Error, void>> {
    try {
      await this.dataSource.removeReaction(postId, userId);
      return right(undefined);
    } catch (error) {
      return left(error as Error);
    }
  }

  async getPostReactions(postId: string): Promise<Either<Error, Reaction[]>> {
    try {
      const dtos = await this.dataSource.getPostReactions(postId);
      const reactions = dtos.map(ReactionMapper.toDomain);
      return right(reactions);
    } catch (error) {
      return left(error as Error);
    }
  }

  async bookmarkPost(postId: string, userId: string): Promise<Either<Error, Bookmark>> {
    try {
      const dto = await this.dataSource.bookmarkPost(postId, userId);
      return right(BookmarkMapper.toDomain(dto));
    } catch (error) {
      return left(error as Error);
    }
  }

  async removeBookmark(postId: string, userId: string): Promise<Either<Error, void>> {
    try {
      await this.dataSource.removeBookmark(postId, userId);
      return right(undefined);
    } catch (error) {
      return left(error as Error);
    }
  }

  async getBookmarkedPosts(userId: string): Promise<Either<Error, Post[]>> {
    try {
      const dtos = await this.dataSource.getBookmarkedPosts(userId);
      const posts = dtos.map(PostMapper.toDomain);
      return right(posts);
    } catch (error) {
      return left(error as Error);
    }
  }

  async isBookmarked(postId: string, userId: string): Promise<Either<Error, boolean>> {
    try {
      const isBookmarked = await this.dataSource.isBookmarked(postId, userId);
      return right(isBookmarked);
    } catch (error) {
      return left(error as Error);
    }
  }
}
