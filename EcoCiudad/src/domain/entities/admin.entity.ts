import { BaseEntity } from './base.entity';

export interface AdminActivityLog extends BaseEntity {
  adminId: string;
  action: AdminAction;
  entityType: EntityType;
  entityId?: string;
  details?: string;
  metadata?: Record<string, any>;
}

export type AdminAction =
  | 'user_created'
  | 'user_updated'
  | 'user_deleted'
  | 'user_activated'
  | 'user_deactivated'
  | 'user_suspended'
  | 'role_assigned'
  | 'report_assigned'
  | 'report_status_changed'
  | 'report_priority_changed'
  | 'community_approved'
  | 'community_suspended'
  | 'community_deleted'
  | 'event_created'
  | 'event_updated'
  | 'event_deleted'
  | 'event_cancelled'
  | 'recycling_center_created'
  | 'recycling_center_updated'
  | 'recycling_center_deleted'
  | 'achievement_created'
  | 'achievement_updated'
  | 'achievement_deleted'
  | 'settings_updated'
  | 'category_created'
  | 'category_updated'
  | 'category_deleted'
  | 'department_created'
  | 'department_updated'
  | 'department_deleted'
  | 'district_created'
  | 'district_updated'
  | 'district_deleted';

export type EntityType =
  | 'user'
  | 'report'
  | 'community'
  | 'event'
  | 'recycling_center'
  | 'achievement'
  | 'category'
  | 'department'
  | 'district'
  | 'settings';

export interface SystemSettings extends BaseEntity {
  key: string;
  value: any;
  type: 'string' | 'number' | 'boolean' | 'json';
  description?: string;
  isPublic: boolean;
}

export interface DashboardStats {
  totalUsers: number;
  totalCitizens: number;
  totalOperators: number;
  totalAdmins: number;
  totalCommunities: number;
  totalEvents: number;
  upcomingEvents: number;
  totalReports: number;
  resolvedReports: number;
  pendingReports: number;
  activeReports: number;
  inProgressReports: number;
  rejectedReports: number;
  totalRecyclingCenters: number;
  totalAchievements: number;
  ecoPointsDistributed: number;
}

export interface ActivityData {
  date: string;
  reports: number;
  users: number;
  events: number;
  communities: number;
}

export interface ReportsByCategory {
  category: string;
  count: number;
  percentage: number;
}

export interface ReportsByDistrict {
  district: string;
  count: number;
  percentage: number;
}

export interface UserStatistics {
  userId: string;
  displayName: string;
  email: string;
  role: string;
  reportCount: number;
  eventCount: number;
  communityCount: number;
  ecoPoints: number;
  joinedAt: Date;
  lastActiveAt: Date;
}

export interface OperatorPerformance {
  operatorId: string;
  displayName: string;
  email: string;
  department: string;
  assignedReports: number;
  completedReports: number;
  averageResolutionTime: number;
  completionRate: number;
  isActive: boolean;
}
