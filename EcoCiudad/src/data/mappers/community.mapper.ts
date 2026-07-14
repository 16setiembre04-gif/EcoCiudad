// Community Mappers

import {
  Community,
  CommunityMember,
  CommunityPrivacy,
  CommunityCategory,
  MemberRole,
  Post,
  PostType,
  Comment,
  Reaction,
  ReactionType,
  Bookmark,
  Poll,
  PollOption,
  PollVote,
  type GeoLocation,
} from '@/domain/entities/community';
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

export class CommunityMapper {
  static toDomain(dto: CommunityDTO): Community {
    const geoLocation: GeoLocation | undefined =
      dto.latitude != null && dto.longitude != null
        ? {
            latitude: dto.latitude,
            longitude: dto.longitude,
            address: dto.address,
          }
        : undefined;

    return {
      id: dto.id,
      name: dto.name,
      description: dto.description,
      category: dto.category as CommunityCategory,
      privacy: dto.privacy as CommunityPrivacy,
      coverImageUrl: dto.cover_image_url,
      logoUrl: dto.logo_url,
      location: dto.department && dto.district ? {
        department: dto.department,
        district: dto.district,
      } : undefined,
      geoLocation,
      maxMembers: dto.max_members,
      rules: dto.rules,
      memberCount: dto.member_count,
      postCount: dto.post_count,
      createdAt: new Date(dto.created_at),
      updatedAt: new Date(dto.updated_at),
      ownerId: dto.owner_id,
    };
  }

  static toDto(domain: Community): CommunityDTO {
    return {
      id: domain.id,
      name: domain.name,
      description: domain.description,
      category: domain.category,
      privacy: domain.privacy,
      cover_image_url: domain.coverImageUrl,
      logo_url: domain.logoUrl,
      department: domain.location?.department,
      district: domain.location?.district,
      latitude: domain.geoLocation?.latitude,
      longitude: domain.geoLocation?.longitude,
      address: domain.geoLocation?.address,
      max_members: domain.maxMembers,
      rules: domain.rules,
      member_count: domain.memberCount,
      post_count: domain.postCount,
      created_at: domain.createdAt.toISOString(),
      updated_at: domain.updatedAt.toISOString(),
      owner_id: domain.ownerId,
    };
  }
}

export class CommunityMemberMapper {
  static toDomain(dto: CommunityMemberDTO): CommunityMember {
    return {
      id: dto.id,
      communityId: dto.community_id,
      userId: dto.user_id,
      role: dto.role as MemberRole,
      joinedAt: new Date(dto.joined_at),
      user: dto.user ? {
        id: dto.user.id,
        displayName: dto.user.display_name,
        avatarUrl: dto.user.avatar_url,
      } : undefined,
    };
  }

  static toDto(domain: CommunityMember): CommunityMemberDTO {
    return {
      id: domain.id,
      community_id: domain.communityId,
      user_id: domain.userId,
      role: domain.role,
      joined_at: domain.joinedAt.toISOString(),
      user: domain.user ? {
        id: domain.user.id,
        display_name: domain.user.displayName,
        avatar_url: domain.user.avatarUrl,
      } : undefined,
    };
  }
}

export class PostMapper {
  static toDomain(dto: PostDTO): Post {
    return {
      id: dto.id,
      communityId: dto.community_id,
      authorId: dto.author_id,
      type: dto.type as PostType,
      content: dto.content,
      images: dto.images,
      location: dto.latitude && dto.longitude ? {
        latitude: dto.latitude,
        longitude: dto.longitude,
        address: dto.address,
      } : undefined,
      isPinned: dto.is_pinned,
      likeCount: dto.like_count,
      commentCount: dto.comment_count,
      userReaction: dto.user_reaction as ReactionType | undefined,
      createdAt: new Date(dto.created_at),
      updatedAt: new Date(dto.updated_at),
      author: dto.author ? {
        id: dto.author.id,
        displayName: dto.author.display_name,
        avatarUrl: dto.author.avatar_url,
      } : undefined,
    };
  }

  static toDto(domain: Post): PostDTO {
    return {
      id: domain.id,
      community_id: domain.communityId,
      author_id: domain.authorId,
      type: domain.type,
      content: domain.content,
      images: domain.images,
      latitude: domain.location?.latitude,
      longitude: domain.location?.longitude,
      address: domain.location?.address,
      is_pinned: domain.isPinned,
      like_count: domain.likeCount,
      comment_count: domain.commentCount,
      user_reaction: domain.userReaction,
      created_at: domain.createdAt.toISOString(),
      updated_at: domain.updatedAt.toISOString(),
      author: domain.author ? {
        id: domain.author.id,
        display_name: domain.author.displayName,
        avatar_url: domain.author.avatarUrl,
      } : undefined,
    };
  }
}

export class CommentMapper {
  static toDomain(dto: CommentDTO): Comment {
    return {
      id: dto.id,
      postId: dto.post_id,
      authorId: dto.author_id,
      content: dto.content,
      parentCommentId: dto.parent_comment_id,
      likeCount: dto.like_count,
      replyCount: dto.reply_count,
      createdAt: new Date(dto.created_at),
      updatedAt: new Date(dto.updated_at),
      author: dto.author ? {
        id: dto.author.id,
        displayName: dto.author.display_name,
        avatarUrl: dto.author.avatar_url,
      } : undefined,
    };
  }

  static toDto(domain: Comment): CommentDTO {
    return {
      id: domain.id,
      post_id: domain.postId,
      author_id: domain.authorId,
      content: domain.content,
      parent_comment_id: domain.parentCommentId,
      like_count: domain.likeCount,
      reply_count: domain.replyCount,
      created_at: domain.createdAt.toISOString(),
      updated_at: domain.updatedAt.toISOString(),
      author: domain.author ? {
        id: domain.author.id,
        display_name: domain.author.displayName,
        avatar_url: domain.author.avatarUrl,
      } : undefined,
    };
  }
}

export class ReactionMapper {
  static toDomain(dto: ReactionDTO): Reaction {
    return {
      id: dto.id,
      postId: dto.post_id,
      userId: dto.user_id,
      type: dto.type as ReactionType,
      createdAt: new Date(dto.created_at),
    };
  }

  static toDto(domain: Reaction): ReactionDTO {
    return {
      id: domain.id,
      post_id: domain.postId,
      user_id: domain.userId,
      type: domain.type,
      created_at: domain.createdAt.toISOString(),
    };
  }
}

export class BookmarkMapper {
  static toDomain(dto: BookmarkDTO): Bookmark {
    return {
      id: dto.id,
      postId: dto.post_id,
      userId: dto.user_id,
      createdAt: new Date(dto.created_at),
    };
  }

  static toDto(domain: Bookmark): BookmarkDTO {
    return {
      id: domain.id,
      post_id: domain.postId,
      user_id: domain.userId,
      created_at: domain.createdAt.toISOString(),
    };
  }
}

export class PollMapper {
  static toDomain(dto: PollDTO): Poll {
    return {
      id: dto.id,
      postId: dto.post_id,
      question: dto.question,
      options: dto.options?.map(PollOptionMapper.toDomain) || [],
      endsAt: dto.ends_at ? new Date(dto.ends_at) : undefined,
      createdAt: new Date(dto.created_at),
    };
  }

  static toDto(domain: Poll): PollDTO {
    return {
      id: domain.id,
      post_id: domain.postId,
      question: domain.question,
      ends_at: domain.endsAt?.toISOString(),
      created_at: domain.createdAt.toISOString(),
      options: domain.options.map(PollOptionMapper.toDto),
    };
  }
}

export class PollOptionMapper {
  static toDomain(dto: PollOptionDTO): PollOption {
    return {
      id: dto.id,
      pollId: dto.poll_id,
      text: dto.text,
      voteCount: dto.vote_count,
      userVoted: dto.user_voted,
    };
  }

  static toDto(domain: PollOption): PollOptionDTO {
    return {
      id: domain.id,
      poll_id: domain.pollId,
      text: domain.text,
      vote_count: domain.voteCount,
      user_voted: domain.userVoted,
    };
  }
}

export class PollVoteMapper {
  static toDomain(dto: PollVoteDTO): PollVote {
    return {
      id: dto.id,
      pollId: dto.poll_id,
      optionId: dto.option_id,
      userId: dto.user_id,
      createdAt: new Date(dto.created_at),
    };
  }

  static toDto(domain: PollVote): PollVoteDTO {
    return {
      id: domain.id,
      poll_id: domain.pollId,
      option_id: domain.optionId,
      user_id: domain.userId,
      created_at: domain.createdAt.toISOString(),
    };
  }
}
