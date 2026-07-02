import {
  type DashboardStats,
  type ActivityData,
  type ReportsByCategory,
  type ReportsByDistrict,
  type AdminActivityLog,
  type SystemSettings,
  type AdminAction,
  type EntityType,
  type User,
  type UserRole,
  type Report,
  type ReportStatus,
  type ReportPriority,
  type ReportCategory,
} from '../../domain/entities';
import {
  type DashboardStatsDTO,
  type ActivityDataDTO,
  type ReportsByCategoryDTO,
  type ReportsByDistrictDTO,
  type AdminActivityLogDTO,
  type SystemSettingsDTO,
  type UserDTO,
  type ReportDTO,
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

  static toUser(dto: UserDTO): User {
    return {
      id: dto.id,
      email: dto.email,
      displayName: dto.display_name,
      firstName: dto.first_name,
      lastName: dto.last_name,
      phone: dto.phone,
      department: dto.department,
      district: dto.district,
      avatarUrl: dto.avatar_url,
      role: dto.role as UserRole,
      isEmailVerified: dto.is_email_verified,
      createdAt: new Date(dto.created_at),
      updatedAt: new Date(dto.updated_at),
    };
  }

  static toUserDto(entity: Partial<User>): Partial<UserDTO> {
    const dto: Partial<UserDTO> = {};
    if (entity.email) dto.email = entity.email;
    if (entity.displayName) dto.display_name = entity.displayName;
    if (entity.firstName !== undefined) dto.first_name = entity.firstName;
    if (entity.lastName !== undefined) dto.last_name = entity.lastName;
    if (entity.phone !== undefined) dto.phone = entity.phone;
    if (entity.department !== undefined) dto.department = entity.department;
    if (entity.district !== undefined) dto.district = entity.district;
    if (entity.avatarUrl !== undefined) dto.avatar_url = entity.avatarUrl;
    if (entity.role) dto.role = entity.role;
    if (entity.isEmailVerified !== undefined) dto.is_email_verified = entity.isEmailVerified;
    return dto;
  }

  static toReport(dto: ReportDTO): Report {
    return {
      id: dto.id,
      title: dto.title,
      description: dto.description,
      category: dto.category as ReportCategory,
      status: dto.status as ReportStatus,
      severity: dto.severity as 'low' | 'medium' | 'high' | 'critical' | undefined,
      isAnonymous: dto.is_anonymous,
      location: {
        latitude: dto.latitude,
        longitude: dto.longitude,
        address: dto.address,
      },
      images: dto.images,
      reporterId: dto.reporter_id,
      assigneeId: dto.assignee_id,
      priority: dto.priority as ReportPriority | undefined,
      resolutionNotes: dto.resolution_notes,
      resolutionPhotos: dto.resolution_photos,
      estimatedCompletion: dto.estimated_completion ? new Date(dto.estimated_completion) : undefined,
      resolvedAt: dto.resolved_at ? new Date(dto.resolved_at) : undefined,
      createdAt: new Date(dto.created_at),
      updatedAt: new Date(dto.updated_at),
    };
  }

  static toReportDto(entity: Partial<Report>): Partial<ReportDTO> {
    const dto: Partial<ReportDTO> = {};
    if (entity.title) dto.title = entity.title;
    if (entity.description) dto.description = entity.description;
    if (entity.category) dto.category = entity.category;
    if (entity.status) dto.status = entity.status;
    if (entity.severity) dto.severity = entity.severity;
    if (entity.isAnonymous !== undefined) dto.is_anonymous = entity.isAnonymous;
    if (entity.location) {
      dto.latitude = entity.location.latitude;
      dto.longitude = entity.location.longitude;
      dto.address = entity.location.address;
    }
    if (entity.images) dto.images = entity.images;
    if (entity.reporterId) dto.reporter_id = entity.reporterId;
    if (entity.assigneeId !== undefined) dto.assignee_id = entity.assigneeId;
    if (entity.priority) dto.priority = entity.priority;
    if (entity.resolutionNotes !== undefined) dto.resolution_notes = entity.resolutionNotes;
    if (entity.resolutionPhotos !== undefined) dto.resolution_photos = entity.resolutionPhotos;
    if (entity.estimatedCompletion) dto.estimated_completion = entity.estimatedCompletion.toISOString();
    if (entity.resolvedAt) dto.resolved_at = entity.resolvedAt.toISOString();
    return dto;
  }
}
