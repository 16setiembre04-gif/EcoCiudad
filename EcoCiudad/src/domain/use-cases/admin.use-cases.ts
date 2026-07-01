import { type DashboardStats, type ActivityData, type ReportsByCategory, type ReportsByDistrict, type AdminActivityLog, type SystemSettings, type OperatorPerformance } from '../entities';
import { type DomainError } from '../errors';
import { type Either } from '../repositories/auth.repository';
import { type AdminRepository, type AdminFilters, type ReportFilters, type ActivityLogFilters, type AnalyticsFilters } from '../repositories/admin.repository';
import { type User, type UserRole } from '../entities';
import { type Report, type ReportStatus, type ReportPriority } from '../entities';
import { type Community } from '../entities';
import { type Event } from '../entities';
import { type RecyclingCenter } from '../entities';

// Dashboard Use Cases
export class GetDashboardStatsUseCase {
  constructor(private readonly repository: AdminRepository) {}
  async execute(): Promise<Either<DomainError, DashboardStats>> {
    return this.repository.getDashboardStats();
  }
}

export class GetActivityDataUseCase {
  constructor(private readonly repository: AdminRepository) {}
  async execute(filters?: AnalyticsFilters): Promise<Either<DomainError, ActivityData[]>> {
    return this.repository.getActivityData(filters);
  }
}

export class GetReportsByCategoryUseCase {
  constructor(private readonly repository: AdminRepository) {}
  async execute(): Promise<Either<DomainError, ReportsByCategory[]>> {
    return this.repository.getReportsByCategory();
  }
}

export class GetReportsByDistrictUseCase {
  constructor(private readonly repository: AdminRepository) {}
  async execute(): Promise<Either<DomainError, ReportsByDistrict[]>> {
    return this.repository.getReportsByDistrict();
  }
}

// Users Management Use Cases
export class GetUsersUseCase {
  constructor(private readonly repository: AdminRepository) {}
  async execute(filters?: AdminFilters): Promise<Either<DomainError, User[]>> {
    return this.repository.getUsers(filters);
  }
}

export class GetUserByIdUseCase {
  constructor(private readonly repository: AdminRepository) {}
  async execute(id: string): Promise<Either<DomainError, User>> {
    return this.repository.getUserById(id);
  }
}

export class UpdateUserUseCase {
  constructor(private readonly repository: AdminRepository) {}
  async execute(id: string, data: Partial<User>): Promise<Either<DomainError, User>> {
    return this.repository.updateUser(id, data);
  }
}

export class ActivateUserUseCase {
  constructor(private readonly repository: AdminRepository) {}
  async execute(id: string): Promise<Either<DomainError, User>> {
    return this.repository.activateUser(id);
  }
}

export class DeactivateUserUseCase {
  constructor(private readonly repository: AdminRepository) {}
  async execute(id: string): Promise<Either<DomainError, User>> {
    return this.repository.deactivateUser(id);
  }
}

export class SuspendUserUseCase {
  constructor(private readonly repository: AdminRepository) {}
  async execute(id: string, reason: string): Promise<Either<DomainError, User>> {
    return this.repository.suspendUser(id, reason);
  }
}

export class DeleteUserUseCase {
  constructor(private readonly repository: AdminRepository) {}
  async execute(id: string): Promise<Either<DomainError, void>> {
    return this.repository.deleteUser(id);
  }
}

export class AssignRoleUseCase {
  constructor(private readonly repository: AdminRepository) {}
  async execute(id: string, role: UserRole): Promise<Either<DomainError, User>> {
    return this.repository.assignRole(id, role);
  }
}

// Operators Management Use Cases
export class GetOperatorPerformanceUseCase {
  constructor(private readonly repository: AdminRepository) {}
  async execute(operatorId: string): Promise<Either<DomainError, OperatorPerformance>> {
    return this.repository.getOperatorPerformance(operatorId);
  }
}

export class GetAllOperatorPerformanceUseCase {
  constructor(private readonly repository: AdminRepository) {}
  async execute(): Promise<Either<DomainError, OperatorPerformance[]>> {
    return this.repository.getAllOperatorPerformance();
  }
}

// Reports Management Use Cases
export class GetReportsUseCase {
  constructor(private readonly repository: AdminRepository) {}
  async execute(filters?: ReportFilters): Promise<Either<DomainError, Report[]>> {
    return this.repository.getReports(filters);
  }
}

export class AssignReportUseCase {
  constructor(private readonly repository: AdminRepository) {}
  async execute(reportId: string, operatorId: string): Promise<Either<DomainError, Report>> {
    return this.repository.assignReport(reportId, operatorId);
  }
}

export class UpdateReportStatusUseCase {
  constructor(private readonly repository: AdminRepository) {}
  async execute(reportId: string, status: ReportStatus): Promise<Either<DomainError, Report>> {
    return this.repository.updateReportStatus(reportId, status);
  }
}

export class UpdateReportPriorityUseCase {
  constructor(private readonly repository: AdminRepository) {}
  async execute(reportId: string, priority: ReportPriority): Promise<Either<DomainError, Report>> {
    return this.repository.updateReportPriority(reportId, priority);
  }
}

// Communities Management Use Cases
export class GetCommunitiesUseCase {
  constructor(private readonly repository: AdminRepository) {}
  async execute(filters?: AdminFilters): Promise<Either<DomainError, Community[]>> {
    return this.repository.getCommunities(filters);
  }
}

export class ApproveCommunityUseCase {
  constructor(private readonly repository: AdminRepository) {}
  async execute(id: string): Promise<Either<DomainError, Community>> {
    return this.repository.approveCommunity(id);
  }
}

export class SuspendCommunityUseCase {
  constructor(private readonly repository: AdminRepository) {}
  async execute(id: string, reason: string): Promise<Either<DomainError, Community>> {
    return this.repository.suspendCommunity(id, reason);
  }
}

export class DeleteCommunityUseCase {
  constructor(private readonly repository: AdminRepository) {}
  async execute(id: string): Promise<Either<DomainError, void>> {
    return this.repository.deleteCommunity(id);
  }
}

// Events Management Use Cases
export class GetEventsUseCase {
  constructor(private readonly repository: AdminRepository) {}
  async execute(filters?: AdminFilters): Promise<Either<DomainError, Event[]>> {
    return this.repository.getEvents(filters);
  }
}

export class CreateEventUseCase {
  constructor(private readonly repository: AdminRepository) {}
  async execute(event: Omit<Event, 'id' | 'createdAt' | 'updatedAt' | 'currentAttendees'>): Promise<Either<DomainError, Event>> {
    return this.repository.createEvent(event);
  }
}

export class UpdateEventUseCase {
  constructor(private readonly repository: AdminRepository) {}
  async execute(id: string, data: Partial<Event>): Promise<Either<DomainError, Event>> {
    return this.repository.updateEvent(id, data);
  }
}

export class CancelEventUseCase {
  constructor(private readonly repository: AdminRepository) {}
  async execute(id: string, reason: string): Promise<Either<DomainError, Event>> {
    return this.repository.cancelEvent(id, reason);
  }
}

export class DeleteEventUseCase {
  constructor(private readonly repository: AdminRepository) {}
  async execute(id: string): Promise<Either<DomainError, void>> {
    return this.repository.deleteEvent(id);
  }
}

// Recycling Centers Management Use Cases
export class GetRecyclingCentersUseCase {
  constructor(private readonly repository: AdminRepository) {}
  async execute(filters?: AdminFilters): Promise<Either<DomainError, RecyclingCenter[]>> {
    return this.repository.getRecyclingCenters(filters);
  }
}

export class CreateRecyclingCenterUseCase {
  constructor(private readonly repository: AdminRepository) {}
  async execute(center: Omit<RecyclingCenter, 'id' | 'createdAt' | 'updatedAt'>): Promise<Either<DomainError, RecyclingCenter>> {
    return this.repository.createRecyclingCenter(center);
  }
}

export class UpdateRecyclingCenterUseCase {
  constructor(private readonly repository: AdminRepository) {}
  async execute(id: string, data: Partial<RecyclingCenter>): Promise<Either<DomainError, RecyclingCenter>> {
    return this.repository.updateRecyclingCenter(id, data);
  }
}

export class DeleteRecyclingCenterUseCase {
  constructor(private readonly repository: AdminRepository) {}
  async execute(id: string): Promise<Either<DomainError, void>> {
    return this.repository.deleteRecyclingCenter(id);
  }
}

// Achievements Management Use Cases
export class GetAchievementsUseCase {
  constructor(private readonly repository: AdminRepository) {}
  async execute(): Promise<Either<DomainError, any[]>> {
    return this.repository.getAchievements();
  }
}

export class CreateAchievementUseCase {
  constructor(private readonly repository: AdminRepository) {}
  async execute(achievement: any): Promise<Either<DomainError, any>> {
    return this.repository.createAchievement(achievement);
  }
}

export class UpdateAchievementUseCase {
  constructor(private readonly repository: AdminRepository) {}
  async execute(id: string, data: any): Promise<Either<DomainError, any>> {
    return this.repository.updateAchievement(id, data);
  }
}

export class DeleteAchievementUseCase {
  constructor(private readonly repository: AdminRepository) {}
  async execute(id: string): Promise<Either<DomainError, void>> {
    return this.repository.deleteAchievement(id);
  }
}

// System Settings Use Cases
export class GetSettingsUseCase {
  constructor(private readonly repository: AdminRepository) {}
  async execute(): Promise<Either<DomainError, SystemSettings[]>> {
    return this.repository.getSettings();
  }
}

export class UpdateSettingUseCase {
  constructor(private readonly repository: AdminRepository) {}
  async execute(key: string, value: any): Promise<Either<DomainError, SystemSettings>> {
    return this.repository.updateSetting(key, value);
  }
}

// Activity Logs Use Cases
export class LogActivityUseCase {
  constructor(private readonly repository: AdminRepository) {}
  async execute(activity: Omit<AdminActivityLog, 'id' | 'createdAt' | 'updatedAt'>): Promise<Either<DomainError, AdminActivityLog>> {
    return this.repository.logActivity(activity);
  }
}

export class GetActivityLogsUseCase {
  constructor(private readonly repository: AdminRepository) {}
  async execute(filters?: ActivityLogFilters): Promise<Either<DomainError, AdminActivityLog[]>> {
    return this.repository.getActivityLogs(filters);
  }
}

// Analytics Use Cases
export class GetAnalyticsUseCase {
  constructor(private readonly repository: AdminRepository) {}
  async execute(filters?: AnalyticsFilters): Promise<Either<DomainError, any>> {
    return this.repository.getAnalytics(filters);
  }
}

export class ExportAnalyticsUseCase {
  constructor(private readonly repository: AdminRepository) {}
  async execute(format: 'pdf' | 'excel', filters?: AnalyticsFilters): Promise<Either<DomainError, string>> {
    return this.repository.exportAnalytics(format, filters);
  }
}
