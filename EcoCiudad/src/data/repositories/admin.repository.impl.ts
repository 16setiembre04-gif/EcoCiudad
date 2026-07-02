import {
  type DashboardStats,
  type ActivityData,
  type ReportsByCategory,
  type ReportsByDistrict,
  type AdminActivityLog,
  type SystemSettings,
  type OperatorPerformance,
  type User,
  type UserRole,
  type Report,
  type ReportStatus,
  type ReportPriority,
  type Community,
  type Event,
  type RecyclingCenter,
} from '../../domain/entities';
import { type DomainError, UnexpectedError } from '../../domain/errors';
import { type Either } from '../../domain/repositories/auth.repository';
import {
  type AdminRepository,
  type AdminFilters,
  type ReportFilters,
  type ActivityLogFilters,
  type AnalyticsFilters,
} from '../../domain/repositories/admin.repository';
import { type AdminRemoteDataSource } from '../datasources/remote';
import { AdminMapper } from '../mappers';

export class AdminRepositoryImpl implements AdminRepository {
  constructor(private readonly dataSource: AdminRemoteDataSource) {}

  async getDashboardStats(): Promise<Either<DomainError, DashboardStats>> {
    try {
      const dto = await this.dataSource.getDashboardStats();
      return { right: AdminMapper.toDashboardStats(dto) };
    } catch {
      return { left: new UnexpectedError() };
    }
  }

  async getActivityData(filters?: AnalyticsFilters): Promise<Either<DomainError, ActivityData[]>> {
    try {
      const dtos = await this.dataSource.getActivityData(
        filters?.startDate,
        filters?.endDate,
        filters?.groupBy
      );
      return { right: dtos.map(AdminMapper.toActivityData) };
    } catch {
      return { left: new UnexpectedError() };
    }
  }

  async getReportsByCategory(): Promise<Either<DomainError, ReportsByCategory[]>> {
    try {
      const dtos = await this.dataSource.getReportsByCategory();
      return { right: dtos.map(AdminMapper.toReportsByCategory) };
    } catch {
      return { left: new UnexpectedError() };
    }
  }

  async getReportsByDistrict(): Promise<Either<DomainError, ReportsByDistrict[]>> {
    try {
      const dtos = await this.dataSource.getReportsByDistrict();
      return { right: dtos.map(AdminMapper.toReportsByDistrict) };
    } catch {
      return { left: new UnexpectedError() };
    }
  }

  async logActivity(
    activity: Omit<AdminActivityLog, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<Either<DomainError, AdminActivityLog>> {
    try {
      const dto = AdminMapper.toActivityLogDto(activity);
      const result = await this.dataSource.logActivity(dto);
      return { right: AdminMapper.toAdminActivityLog(result) };
    } catch {
      return { left: new UnexpectedError() };
    }
  }

  async getActivityLogs(
    filters?: ActivityLogFilters
  ): Promise<Either<DomainError, AdminActivityLog[]>> {
    try {
      const dtos = await this.dataSource.getActivityLogs(filters);
      return { right: dtos.map(AdminMapper.toAdminActivityLog) };
    } catch {
      return { left: new UnexpectedError() };
    }
  }

  async getSettings(): Promise<Either<DomainError, SystemSettings[]>> {
    try {
      const dtos = await this.dataSource.getSettings();
      return { right: dtos.map(AdminMapper.toSystemSettings) };
    } catch {
      return { left: new UnexpectedError() };
    }
  }

  async updateSetting(key: string, value: unknown): Promise<Either<DomainError, SystemSettings>> {
    try {
      const dto = await this.dataSource.updateSetting(key, value);
      return { right: AdminMapper.toSystemSettings(dto) };
    } catch {
      return { left: new UnexpectedError() };
    }
  }

  async getAnalytics(filters?: AnalyticsFilters): Promise<Either<DomainError, unknown>> {
    try {
      const [activityData, reportsByCategory, reportsByDistrict] = await Promise.all([
        this.dataSource.getActivityData(filters?.startDate, filters?.endDate, filters?.groupBy),
        this.dataSource.getReportsByCategory(),
        this.dataSource.getReportsByDistrict(),
      ]);
      return {
        right: {
          activity: activityData.map(AdminMapper.toActivityData),
          reportsByCategory: reportsByCategory.map(AdminMapper.toReportsByCategory),
          reportsByDistrict: reportsByDistrict.map(AdminMapper.toReportsByDistrict),
        },
      };
    } catch {
      return { left: new UnexpectedError() };
    }
  }

  async exportAnalytics(
    _format: 'pdf' | 'excel',
    _filters?: AnalyticsFilters
  ): Promise<Either<DomainError, string>> {
    return { left: new UnexpectedError() };
  }

  async getUsers(filters?: AdminFilters): Promise<Either<DomainError, User[]>> {
    try {
      const dtos = await this.dataSource.getUsers(filters);
      return { right: dtos.map(AdminMapper.toUser) };
    } catch {
      return { left: new UnexpectedError() };
    }
  }

  async getUserById(id: string): Promise<Either<DomainError, User>> {
    try {
      const dto = await this.dataSource.getUserById(id);
      return { right: AdminMapper.toUser(dto) };
    } catch {
      return { left: new UnexpectedError() };
    }
  }

  async updateUser(id: string, data: Partial<User>): Promise<Either<DomainError, User>> {
    try {
      const dto = AdminMapper.toUserDto(data);
      const updated = await this.dataSource.updateUser(id, dto);
      return { right: AdminMapper.toUser(updated) };
    } catch {
      return { left: new UnexpectedError() };
    }
  }

  async activateUser(id: string): Promise<Either<DomainError, User>> {
    try {
      const dto = await this.dataSource.activateUser(id);
      return { right: AdminMapper.toUser(dto) };
    } catch {
      return { left: new UnexpectedError() };
    }
  }

  async deactivateUser(id: string): Promise<Either<DomainError, User>> {
    try {
      const dto = await this.dataSource.deactivateUser(id);
      return { right: AdminMapper.toUser(dto) };
    } catch {
      return { left: new UnexpectedError() };
    }
  }

  async suspendUser(id: string, reason: string): Promise<Either<DomainError, User>> {
    try {
      const dto = await this.dataSource.suspendUser(id, reason);
      return { right: AdminMapper.toUser(dto) };
    } catch {
      return { left: new UnexpectedError() };
    }
  }

  async deleteUser(id: string): Promise<Either<DomainError, void>> {
    try {
      await this.dataSource.deleteUser(id);
      return { right: undefined };
    } catch {
      return { left: new UnexpectedError() };
    }
  }

  async assignRole(id: string, role: UserRole): Promise<Either<DomainError, User>> {
    try {
      const dto = await this.dataSource.assignRole(id, role);
      return { right: AdminMapper.toUser(dto) };
    } catch {
      return { left: new UnexpectedError() };
    }
  }

  async restoreUser(id: string): Promise<Either<DomainError, User>> {
    try {
      const dto = await this.dataSource.restoreUser(id);
      return { right: AdminMapper.toUser(dto) };
    } catch {
      return { left: new UnexpectedError() };
    }
  }

  async resetPassword(id: string, newPassword: string): Promise<Either<DomainError, void>> {
    try {
      await this.dataSource.resetPassword(id, newPassword);
      return { right: undefined };
    } catch {
      return { left: new UnexpectedError() };
    }
  }

  async getUserStatistics(id: string): Promise<Either<DomainError, {
    reportCount: number;
    eventCount: number;
    communityCount: number;
    ecoPoints: number;
  }>> {
    try {
      const stats = await this.dataSource.getUserStatistics(id);
      return { right: stats };
    } catch {
      return { left: new UnexpectedError() };
    }
  }

  async getOperatorPerformance(_operatorId: string): Promise<Either<DomainError, OperatorPerformance>> {
    return { left: new UnexpectedError() };
  }

  async getAllOperatorPerformance(): Promise<Either<DomainError, OperatorPerformance[]>> {
    return { left: new UnexpectedError() };
  }

  async getReports(filters?: ReportFilters): Promise<Either<DomainError, Report[]>> {
    try {
      const dtos = await this.dataSource.getReports(filters);
      return { right: dtos.map(AdminMapper.toReport) };
    } catch {
      return { left: new UnexpectedError() };
    }
  }

  async getReportById(id: string): Promise<Either<DomainError, Report>> {
    try {
      const dto = await this.dataSource.getReportById(id);
      return { right: AdminMapper.toReport(dto) };
    } catch {
      return { left: new UnexpectedError() };
    }
  }

  async assignReport(reportId: string, operatorId: string): Promise<Either<DomainError, Report>> {
    try {
      const dto = await this.dataSource.assignReport(reportId, operatorId);
      return { right: AdminMapper.toReport(dto) };
    } catch {
      return { left: new UnexpectedError() };
    }
  }

  async updateReportStatus(reportId: string, status: ReportStatus): Promise<Either<DomainError, Report>> {
    try {
      const dto = await this.dataSource.updateReportStatus(reportId, status);
      return { right: AdminMapper.toReport(dto) };
    } catch {
      return { left: new UnexpectedError() };
    }
  }

  async updateReportPriority(reportId: string, priority: ReportPriority): Promise<Either<DomainError, Report>> {
    try {
      const dto = await this.dataSource.updateReportPriority(reportId, priority);
      return { right: AdminMapper.toReport(dto) };
    } catch {
      return { left: new UnexpectedError() };
    }
  }

  async getCommunities(_filters?: AdminFilters): Promise<Either<DomainError, Community[]>> {
    return { left: new UnexpectedError() };
  }

  async approveCommunity(_id: string): Promise<Either<DomainError, Community>> {
    return { left: new UnexpectedError() };
  }

  async suspendCommunity(_id: string, _reason: string): Promise<Either<DomainError, Community>> {
    return { left: new UnexpectedError() };
  }

  async deleteCommunity(_id: string): Promise<Either<DomainError, void>> {
    return { left: new UnexpectedError() };
  }

  async getEvents(_filters?: AdminFilters): Promise<Either<DomainError, Event[]>> {
    return { left: new UnexpectedError() };
  }

  async createEvent(
    _event: Omit<Event, 'id' | 'createdAt' | 'updatedAt' | 'currentAttendees'>
  ): Promise<Either<DomainError, Event>> {
    return { left: new UnexpectedError() };
  }

  async updateEvent(_id: string, _data: Partial<Event>): Promise<Either<DomainError, Event>> {
    return { left: new UnexpectedError() };
  }

  async cancelEvent(_id: string, _reason: string): Promise<Either<DomainError, Event>> {
    return { left: new UnexpectedError() };
  }

  async deleteEvent(_id: string): Promise<Either<DomainError, void>> {
    return { left: new UnexpectedError() };
  }

  async getRecyclingCenters(_filters?: AdminFilters): Promise<Either<DomainError, RecyclingCenter[]>> {
    return { left: new UnexpectedError() };
  }

  async createRecyclingCenter(
    _center: Omit<RecyclingCenter, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<Either<DomainError, RecyclingCenter>> {
    return { left: new UnexpectedError() };
  }

  async updateRecyclingCenter(
    _id: string,
    _data: Partial<RecyclingCenter>
  ): Promise<Either<DomainError, RecyclingCenter>> {
    return { left: new UnexpectedError() };
  }

  async deleteRecyclingCenter(_id: string): Promise<Either<DomainError, void>> {
    return { left: new UnexpectedError() };
  }

  async getAchievements(): Promise<Either<DomainError, unknown[]>> {
    return { left: new UnexpectedError() };
  }

  async createAchievement(_achievement: unknown): Promise<Either<DomainError, unknown>> {
    return { left: new UnexpectedError() };
  }

  async updateAchievement(_id: string, _data: unknown): Promise<Either<DomainError, unknown>> {
    return { left: new UnexpectedError() };
  }

  async deleteAchievement(_id: string): Promise<Either<DomainError, void>> {
    return { left: new UnexpectedError() };
  }
}
