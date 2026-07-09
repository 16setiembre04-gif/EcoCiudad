// Community Repository Implementation

import { Either, left, right } from '@/domain/repositories';
import { 
  Community, 
  CommunityMember, 
  MemberRole 
} from '@/domain/entities/community';
import { ICommunityRepository, CommunityFilters } from '@/domain/repositories/community.repository';
import { CommunityRemoteDataSource } from '@/data/datasources/remote/community.datasource';
import { CommunityMapper, CommunityMemberMapper } from '@/data/mappers/community.mapper';

export class CommunityRepository implements ICommunityRepository {
  constructor(private dataSource: CommunityRemoteDataSource) {}

  async getCommunities(filters?: CommunityFilters): Promise<Either<Error, Community[]>> {
    try {
      const dtos = await this.dataSource.getCommunities(filters);
      const communities = dtos.map(CommunityMapper.toDomain);
      return right(communities);
    } catch (error) {
      return left(error as Error);
    }
  }

  async getCommunity(id: string): Promise<Either<Error, Community>> {
    try {
      const dto = await this.dataSource.getCommunity(id);
      return right(CommunityMapper.toDomain(dto));
    } catch (error) {
      return left(error as Error);
    }
  }

  async createCommunity(
    community: Omit<Community, 'id' | 'createdAt' | 'updatedAt' | 'memberCount' | 'postCount'>
  ): Promise<Either<Error, Community>> {
    try {
      const dto = CommunityMapper.toDto(community as Community);
      const created = await this.dataSource.createCommunity(dto);
      return right(CommunityMapper.toDomain(created));
    } catch (error) {
      return left(error as Error);
    }
  }

  async updateCommunity(id: string, data: Partial<Community>): Promise<Either<Error, Community>> {
    try {
      const dto = CommunityMapper.toDto(data as Community);
      const updated = await this.dataSource.updateCommunity(id, dto);
      return right(CommunityMapper.toDomain(updated));
    } catch (error) {
      return left(error as Error);
    }
  }

  async deleteCommunity(id: string): Promise<Either<Error, void>> {
    try {
      await this.dataSource.deleteCommunity(id);
      return right(undefined);
    } catch (error) {
      return left(error as Error);
    }
  }

  async getMembers(communityId: string, role?: MemberRole): Promise<Either<Error, CommunityMember[]>> {
    try {
      const dtos = await this.dataSource.getMembers(communityId, role);
      const members = dtos.map(CommunityMemberMapper.toDomain);
      return right(members);
    } catch (error) {
      return left(error as Error);
    }
  }

  async joinCommunity(communityId: string, userId: string): Promise<Either<Error, CommunityMember>> {
    try {
      const dto = await this.dataSource.joinCommunity(communityId, userId);
      return right(CommunityMemberMapper.toDomain(dto));
    } catch (error) {
      return left(error as Error);
    }
  }

  async leaveCommunity(communityId: string, userId: string): Promise<Either<Error, void>> {
    try {
      await this.dataSource.leaveCommunity(communityId, userId);
      return right(undefined);
    } catch (error) {
      return left(error as Error);
    }
  }

  async updateMemberRole(
    communityId: string,
    userId: string,
    role: MemberRole
  ): Promise<Either<Error, CommunityMember>> {
    try {
      const dto = await this.dataSource.updateMemberRole(communityId, userId, role);
      return right(CommunityMemberMapper.toDomain(dto));
    } catch (error) {
      return left(error as Error);
    }
  }

  async getJoinedCommunities(userId: string): Promise<Either<Error, Community[]>> {
    try {
      const dtos = await this.dataSource.getJoinedCommunities(userId);
      const communities = dtos.map(CommunityMapper.toDomain);
      return right(communities);
    } catch (error) {
      return left(error as Error);
    }
  }

  async isMember(communityId: string, userId: string): Promise<Either<Error, boolean>> {
    try {
      const isMember = await this.dataSource.isMember(communityId, userId);
      return right(isMember);
    } catch (error) {
      return left(error as Error);
    }
  }
}
