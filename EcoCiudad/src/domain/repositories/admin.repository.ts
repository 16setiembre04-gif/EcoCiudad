import { type AdminActivityLog, type SystemSettings, type DashboardStats, type ActivityData, type ReportsByCategory, type ReportsByDistrict, type OperatorPerformance, type AdminAction, type EntityType } from '../entities';
import { type DomainError } from '../errors';
import { type Either } from './auth.repository';
import { type User, type UserRole } from '../entities';
import { type Report, type ReportStatus, type ReportPriority } from '../entities';
import { type Community } from '../entities';
import { type Event } from '../entities';
import { type RecyclingCenter } from '../entities';

export interface AdminFilters {
  search?: string;
  role?: UserRole;
  isActive?: boolean;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  limit?: number;
  offset?: number;
}

export interface ReportFilters {
  search?: string;
  status?: ReportStatus;
  priority?: ReportPriority;
  category?: string;
  district?: string;
  assigneeId?: string;
  startDate?: Date;
  endDate?: Date;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  limit?: number;
  offset?: number;
}

export interface ActivityLogFilters {
  adminId?: string;
  action?: AdminAction;
  entityType?: EntityType;
  startDate?: Date;
  endDate?: Date;
  limit?: number;
  offset?: number;
}

export interface AnalyticsFilters {
  startDate?: Date;
  endDate?: Date;
  groupBy?: 'day' | 'week' | 'month';
}

export interface AdminRepository {
  // Dashboard
  getDashboardStats(): Promise<Either<DomainError, DashboardStats>>;
  getActivityData(filters?: AnalyticsFilters): Promise<Either<DomainError, ActivityData[]>>;
  getReportsByCategory(): Promise<Either<DomainError, ReportsByCategory[]>>;
  getReportsByDistrict(): Promise<Either<DomainError, ReportsByDistrict[]>>;

  // Users Management
  getUsers(filters?: AdminFilters): Promise<Either<DomainError, User[]>>;
  getUserById(id: string): Promise<Either<DomainError, User>>;
  updateUser(id: string, data: Partial<User>): Promise<Either<DomainError, User>>;
  activateUser(id: string): Promise<Either<DomainError, User>>;
  deactivateUser(id: string): Promise<Either<DomainError, User>>;
  suspendUser(id: string, reason: string): Promise<Either<DomainError, User>>;
  restoreUser(id: string): Promise<Either<DomainError, User>>;
  deleteUser(id: string): Promise<Either<DomainError, void>>;
  assignRole(id: string, role: UserRole): Promise<Either<DomainError, User>>;
  resetPassword(id: string, newPassword: string): Promise<Either<DomainError, void>>;
  getUserStatistics(id: string): Promise<Either<DomainError, {
    reportCount: number;
    eventCount: number;
    communityCount: number;
    ecoPoints: number;
  }>>;

  // Operators Management
  getOperatorPerformance(operatorId: string): Promise<Either<DomainError, OperatorPerformance>>;
  getAllOperatorPerformance(): Promise<Either<DomainError, OperatorPerformance[]>>;

  // Reports Management
  getReports(filters?: ReportFilters): Promise<Either<DomainError, Report[]>>;
  getReportById(id: string): Promise<Either<DomainError, Report>>;
  assignReport(reportId: string, operatorId: string): Promise<Either<DomainError, Report>>;
  updateReportStatus(reportId: string, status: ReportStatus): Promise<Either<DomainError, Report>>;
  updateReportPriority(reportId: string, priority: ReportPriority): Promise<Either<DomainError, Report>>;

  // Communities Management
  getCommunities(filters?: AdminFilters): Promise<Either<DomainError, Community[]>>;
  approveCommunity(id: string): Promise<Either<DomainError, Community>>;
  suspendCommunity(id: string, reason: string): Promise<Either<DomainError, Community>>;
  deleteCommunity(id: string): Promise<Either<DomainError, void>>;

  // Events Management
  getEvents(filters?: AdminFilters): Promise<Either<DomainError, Event[]>>;
  createEvent(event: Omit<Event, 'id' | 'createdAt' | 'updatedAt' | 'currentAttendees'>): Promise<Either<DomainError, Event>>;
  updateEvent(id: string, data: Partial<Event>): Promise<Either<DomainError, Event>>;
  cancelEvent(id: string, reason: string): Promise<Either<DomainError, Event>>;
  deleteEvent(id: string): Promise<Either<DomainError, void>>;

  // Recycling Centers Management
  getRecyclingCenters(filters?: AdminFilters): Promise<Either<DomainError, RecyclingCenter[]>>;
  createRecyclingCenter(center: Omit<RecyclingCenter, 'id' | 'createdAt' | 'updatedAt'>): Promise<Either<DomainError, RecyclingCenter>>;
  updateRecyclingCenter(id: string, data: Partial<RecyclingCenter>): Promise<Either<DomainError, RecyclingCenter>>;
  deleteRecyclingCenter(id: string): Promise<Either<DomainError, void>>;

  // Achievements Management
  getAchievements(): Promise<Either<DomainError, any[]>>;
  createAchievement(achievement: any): Promise<Either<DomainError, any>>;
  updateAchievement(id: string, data: any): Promise<Either<DomainError, any>>;
  deleteAchievement(id: string): Promise<Either<DomainError, void>>;

  // System Settings
  getSettings(): Promise<Either<DomainError, SystemSettings[]>>;
  updateSetting(key: string, value: any): Promise<Either<DomainError, SystemSettings>>;

  // Activity Logs
  logActivity(activity: Omit<AdminActivityLog, 'id' | 'createdAt' | 'updatedAt'>): Promise<Either<DomainError, AdminActivityLog>>;
  getActivityLogs(filters?: ActivityLogFilters): Promise<Either<DomainError, AdminActivityLog[]>>;

  // Analytics
  getAnalytics(filters?: AnalyticsFilters): Promise<Either<DomainError, any>>;
  exportAnalytics(format: 'pdf' | 'excel', filters?: AnalyticsFilters): Promise<Either<DomainError, string>>;
}
