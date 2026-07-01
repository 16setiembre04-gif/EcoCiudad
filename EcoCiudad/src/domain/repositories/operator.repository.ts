import { type Report, type ReportStatus, type ReportPriority } from '../entities';
import { type OperatorAssignment, type OperatorActivityLog, type OperatorStats, type OperatorPerformance } from '../entities';
import { type DomainError } from '../errors';
import { type Either } from './auth.repository';

export interface OperatorReportFilters {
  assigneeId?: string;
  status?: ReportStatus;
  priority?: ReportPriority;
  category?: string;
  search?: string;
  startDate?: Date;
  endDate?: Date;
}

export interface OperatorRepository {
  // Assigned Reports
  getAssignedReports(operatorId: string, filters?: OperatorReportFilters): Promise<Either<DomainError, Report[]>>;
  getPendingReports(filters?: OperatorReportFilters): Promise<Either<DomainError, Report[]>>;
  getReportDetails(reportId: string): Promise<Either<DomainError, Report>>;
  
  // Report Management
  assignReport(reportId: string, operatorId: string, assignedBy: string, notes?: string): Promise<Either<DomainError, OperatorAssignment>>;
  unassignReport(reportId: string, operatorId: string): Promise<Either<DomainError, void>>;
  updateReportStatus(reportId: string, status: ReportStatus, operatorId: string, notes?: string): Promise<Either<DomainError, Report>>;
  resolveReport(reportId: string, operatorId: string, notes: string, resolutionPhotos?: string[]): Promise<Either<DomainError, Report>>;
  rejectReport(reportId: string, operatorId: string, reason: string): Promise<Either<DomainError, Report>>;
  
  // Activity Tracking
  logActivity(activity: Omit<OperatorActivityLog, 'id' | 'createdAt' | 'updatedAt'>): Promise<Either<DomainError, OperatorActivityLog>>;
  getOperatorActivity(operatorId: string, limit?: number): Promise<Either<DomainError, OperatorActivityLog[]>>;
  
  // Statistics
  getOperatorStats(operatorId: string): Promise<Either<DomainError, OperatorStats>>;
  getOperatorPerformance(operatorId: string, period: 'day' | 'week' | 'month' | 'year'): Promise<Either<DomainError, OperatorPerformance>>;
  
  // Route Planning
  getTodayRoute(operatorId: string): Promise<Either<DomainError, Report[]>>;
  optimizeRoute(operatorId: string, reportIds: string[]): Promise<Either<DomainError, Report[]>>;
}
