// Community Repository Interface

import { Either } from '@/domain/repositories';
import { 
  Community, 
  CommunityMember, 
  CommunityPrivacy, 
  CommunityCategory,
  MemberRole 
} from '@/domain/entities/community';

export interface CommunityFilters {
  category?: CommunityCategory;
  privacy?: CommunityPrivacy;
  search?: string;
  department?: string;
  district?: string;
  joined?: boolean;
  userId?: string;
}

export interface ICommunityRepository {
  // Communities
  getCommunities(filters?: CommunityFilters): Promise<Either<Error, Community[]>>;
  getCommunity(id: string): Promise<Either<Error, Community>>;
  createCommunity(community: Omit<Community, 'id' | 'createdAt' | 'updatedAt' | 'memberCount' | 'postCount'>): Promise<Either<Error, Community>>;
  updateCommunity(id: string, data: Partial<Community>): Promise<Either<Error, Community>>;
  deleteCommunity(id: string): Promise<Either<Error, void>>;
  
  // Members
  getMembers(communityId: string, role?: MemberRole): Promise<Either<Error, CommunityMember[]>>;
  joinCommunity(communityId: string, userId: string): Promise<Either<Error, CommunityMember>>;
  leaveCommunity(communityId: string, userId: string): Promise<Either<Error, void>>;
  updateMemberRole(communityId: string, userId: string, role: MemberRole): Promise<Either<Error, CommunityMember>>;
  getJoinedCommunities(userId: string): Promise<Either<Error, Community[]>>;
  isMember(communityId: string, userId: string): Promise<Either<Error, boolean>>;
}
