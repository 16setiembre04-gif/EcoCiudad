// Post Use Cases

import { Either } from '@/domain/entities';
import { Post, PostFilters, Comment, Reaction, ReactionType, Bookmark } from '@/domain/entities/community';
import { IPostRepository } from '@/domain/repositories/post.repository';

export class GetPostsUseCase {
  constructor(private repository: IPostRepository) {}

  async execute(filters: PostFilters): Promise<Either<Error, Post[]>> {
    return this.repository.getPosts(filters);
  }
}

export class GetPostUseCase {
  constructor(private repository: IPostRepository) {}

  async execute(id: string): Promise<Either<Error, Post>> {
    return this.repository.getPost(id);
  }
}

export class CreatePostUseCase {
  constructor(private repository: IPostRepository) {}

  async execute(
    post: Omit<Post, 'id' | 'createdAt' | 'updatedAt' | 'likeCount' | 'commentCount'>
  ): Promise<Either<Error, Post>> {
    return this.repository.createPost(post);
  }
}

export class UpdatePostUseCase {
  constructor(private repository: IPostRepository) {}

  async execute(id: string, data: Partial<Post>): Promise<Either<Error, Post>> {
    return this.repository.updatePost(id, data);
  }
}

export class DeletePostUseCase {
  constructor(private repository: IPostRepository) {}

  async execute(id: string): Promise<Either<Error, void>> {
    return this.repository.deletePost(id);
  }
}

export class PinPostUseCase {
  constructor(private repository: IPostRepository) {}

  async execute(id: string, pinned: boolean): Promise<Either<Error, Post>> {
    return this.repository.pinPost(id, pinned);
  }
}

export class GetCommentsUseCase {
  constructor(private repository: IPostRepository) {}

  async execute(postId: string): Promise<Either<Error, Comment[]>> {
    return this.repository.getComments(postId);
  }
}

export class CreateCommentUseCase {
  constructor(private repository: IPostRepository) {}

  async execute(
    comment: Omit<Comment, 'id' | 'createdAt' | 'updatedAt' | 'likeCount' | 'replyCount'>
  ): Promise<Either<Error, Comment>> {
    return this.repository.createComment(comment);
  }
}

export class DeleteCommentUseCase {
  constructor(private repository: IPostRepository) {}

  async execute(id: string): Promise<Either<Error, void>> {
    return this.repository.deleteComment(id);
  }
}

export class AddReactionUseCase {
  constructor(private repository: IPostRepository) {}

  async execute(
    postId: string,
    userId: string,
    type: ReactionType
  ): Promise<Either<Error, Reaction>> {
    return this.repository.addReaction(postId, userId, type);
  }
}

export class RemoveReactionUseCase {
  constructor(private repository: IPostRepository) {}

  async execute(postId: string, userId: string): Promise<Either<Error, void>> {
    return this.repository.removeReaction(postId, userId);
  }
}

export class BookmarkPostUseCase {
  constructor(private repository: IPostRepository) {}

  async execute(postId: string, userId: string): Promise<Either<Error, Bookmark>> {
    return this.repository.bookmarkPost(postId, userId);
  }
}

export class RemoveBookmarkUseCase {
  constructor(private repository: IPostRepository) {}

  async execute(postId: string, userId: string): Promise<Either<Error, void>> {
    return this.repository.removeBookmark(postId, userId);
  }
}

export class GetBookmarkedPostsUseCase {
  constructor(private repository: IPostRepository) {}

  async execute(userId: string): Promise<Either<Error, Post[]>> {
    return this.repository.getBookmarkedPosts(userId);
  }
}

export class IsBookmarkedUseCase {
  constructor(private repository: IPostRepository) {}

  async execute(postId: string, userId: string): Promise<Either<Error, boolean>> {
    return this.repository.isBookmarked(postId, userId);
  }
}
