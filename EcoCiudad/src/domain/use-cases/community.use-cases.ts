// Community Use Cases

import { Either } from '@/domain/repositories';
import { 
  Community, 
  CommunityMember, 
  MemberRole 
} from '@/domain/entities/community';
import { ICommunityRepository, CommunityFilters } from '@/domain/repositories/community.repository';

export class GetCommunitiesUseCase {
  constructor(private repository: ICommunityRepository) {}

  async execute(filters?: CommunityFilters): Promise<Either<Error, Community[]>> {
    return this.repository.getCommunities(filters);
  }
}

export class GetCommunityUseCase {
  constructor(private repository: ICommunityRepository) {}

  async execute(id: string): Promise<Either<Error, Community>> {
    return this.repository.getCommunity(id);
  }
}

export class CreateCommunityUseCase {
  constructor(private repository: ICommunityRepository) {}

  async execute(
    data: Omit<Community, 'id' | 'createdAt' | 'updatedAt' | 'memberCount' | 'postCount'>
  ): Promise<Either<Error, Community>> {
    return this.repository.createCommunity(data);
  }
}

export class UpdateCommunityUseCase {
  constructor(private repository: ICommunityRepository) {}

  async execute(id: string, data: Partial<Community>): Promise<Either<Error, Community>> {
    return this.repository.updateCommunity(id, data);
  }
}

export class DeleteCommunityUseCase {
  constructor(private repository: ICommunityRepository) {}

  async execute(id: string): Promise<Either<Error, void>> {
    return this.repository.deleteCommunity(id);
  }
}

export class JoinCommunityUseCase {
  constructor(private repository: ICommunityRepository) {}

  async execute(communityId: string, userId: string): Promise<Either<Error, CommunityMember>> {
    return this.repository.joinCommunity(communityId, userId);
  }
}

export class LeaveCommunityUseCase {
  constructor(private repository: ICommunityRepository) {}

  async execute(communityId: string, userId: string): Promise<Either<Error, void>> {
    return this.repository.leaveCommunity(communityId, userId);
  }
}

export class GetCommunityMembersUseCase {
  constructor(private repository: ICommunityRepository) {}

  async execute(communityId: string, role?: MemberRole): Promise<Either<Error, CommunityMember[]>> {
    return this.repository.getMembers(communityId, role);
  }
}

export class UpdateMemberRoleUseCase {
  constructor(private repository: ICommunityRepository) {}

  async execute(
    communityId: string,
    userId: string,
    role: MemberRole
  ): Promise<Either<Error, CommunityMember>> {
    return this.repository.updateMemberRole(communityId, userId, role);
  }
}

export class GetJoinedCommunitiesUseCase {
  constructor(private repository: ICommunityRepository) {}

  async execute(userId: string): Promise<Either<Error, Community[]>> {
    return this.repository.getJoinedCommunities(userId);
  }
}

export class IsMemberUseCase {
  constructor(private repository: ICommunityRepository) {}

  async execute(communityId: string, userId: string): Promise<Either<Error, boolean>> {
    return this.repository.isMember(communityId, userId);
  }
}
