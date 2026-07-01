import {
  type DashboardStats,
  type ActivityData,
  type ReportsByCategory,
  type ReportsByDistrict,
  type AdminActivityLog,
  type SystemSettings,
  type AdminAction,
  type EntityType,
} from '../../domain/entities';
import {
  type DashboardStatsDTO,
  type ActivityDataDTO,
  type ReportsByCategoryDTO,
  type ReportsByDistrictDTO,
  type AdminActivityLogDTO,
  type SystemSettingsDTO,
} from '../dto';

export class AdminMapper {
  static toDashboardStats(dto: DashboardStatsDTO): DashboardStats {
    return {
      totalUsers: dto.total_users,
      totalCitizens: dto.total_citizens,
      totalOperators: dto.total_operators,
      totalAdmins: dto.total_admins,
      totalCommunities: dto.total_communities,
      totalEvents: dto.total_events,
      upcomingEvents: dto.upcoming_events,
      totalReports: dto.total_reports,
      resolvedReports: dto.resolved_reports,
      pendingReports: dto.pending_reports,
      activeReports: dto.in_progress_reports,
      inProgressReports: dto.in_progress_reports,
      rejectedReports: dto.rejected_reports,
      totalRecyclingCenters: dto.total_recycling_centers,
      totalAchievements: dto.total_achievements,
      ecoPointsDistributed: dto.eco_points_distributed,
    };
  }

  static toActivityData(dto: ActivityDataDTO): ActivityData {
    return {
      date: dto.date,
      reports: dto.reports,
      users: dto.users,
      events: dto.events,
      communities: dto.communities,
    };
  }

  static toReportsByCategory(dto: ReportsByCategoryDTO): ReportsByCategory {
    return {
      category: dto.category,
      count: dto.count,
      percentage: dto.percentage,
    };
  }

  static toReportsByDistrict(dto: ReportsByDistrictDTO): ReportsByDistrict {
    return {
      district: dto.district,
      count: dto.count,
      percentage: dto.percentage,
    };
  }

  static toAdminActivityLog(dto: AdminActivityLogDTO): AdminActivityLog {
    return {
      id: dto.id,
      adminId: dto.admin_id,
      action: dto.action as AdminAction,
      entityType: dto.entity_type as EntityType,
      entityId: dto.entity_id,
      details: dto.details,
      metadata: dto.metadata as Record<string, unknown>,
      createdAt: new Date(dto.created_at),
      updatedAt: new Date(dto.updated_at),
    };
  }

  static toSystemSettings(dto: SystemSettingsDTO): SystemSettings {
    return {
      id: dto.id,
      key: dto.key,
      value: dto.value,
      type: dto.type as 'string' | 'number' | 'boolean' | 'json',
      description: dto.description,
      isPublic: dto.is_public,
      createdAt: new Date(dto.created_at),
      updatedAt: new Date(dto.updated_at),
    };
  }

  static toActivityLogDto(
    entity: Omit<AdminActivityLog, 'id' | 'createdAt' | 'updatedAt'>
  ): Omit<AdminActivityLogDTO, 'created_at' | 'updated_at'> {
    return {
      id: '',
      admin_id: entity.adminId,
      action: entity.action,
      entity_type: entity.entityType,
      entity_id: entity.entityId,
      details: entity.details,
      metadata: entity.metadata as Record<string, unknown>,
    };
  }
}
