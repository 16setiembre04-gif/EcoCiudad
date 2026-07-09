import {
  type Report,
  type ReportStatus,
  type OperatorAssignment,
  type OperatorActivityLog,
  type OperatorStats,
  type OperatorPerformance,
} from '@/domain/entities';
import {
  type OperatorRepository,
  type OperatorReportFilters,
} from '@/domain/repositories';
import { type Either, left, right } from '@/domain/repositories';
import { type DomainError } from '@/domain/errors';
import { OperatorDatasource } from '@/data/datasources/operator.datasource';
import { ReportMapper, OperatorMapper } from '@/data/mappers';

export class OperatorRepositoryImpl implements OperatorRepository {
  constructor(private datasource: OperatorDatasource) {}

  async getAssignedReports(
    operatorId: string,
    filters?: OperatorReportFilters
  ): Promise<Either<DomainError, Report[]>> {
    try {
      const dtos = await this.datasource.getAssignedReports(operatorId, filters);
      const reports = dtos.map(ReportMapper.toDomain);
      return right(reports);
    } catch (error) {
      return left(error as DomainError);
    }
  }

  async getPendingReports(
    filters?: OperatorReportFilters
  ): Promise<Either<DomainError, Report[]>> {
    try {
      const dtos = await this.datasource.getPendingReports(filters);
      const reports = dtos.map(ReportMapper.toDomain);
      return right(reports);
    } catch (error) {
      return left(error as DomainError);
    }
  }

  async getReportDetails(reportId: string): Promise<Either<DomainError, Report>> {
    try {
      const dto = await this.datasource.getReportDetails(reportId);
      const report = ReportMapper.toDomain(dto);
      return right(report);
    } catch (error) {
      return left(error as DomainError);
    }
  }

  async assignReport(
    reportId: string,
    operatorId: string,
    assignedBy: string,
    notes?: string
  ): Promise<Either<DomainError, OperatorAssignment>> {
    try {
      const dto = await this.datasource.assignReport(reportId, operatorId, assignedBy, notes);
      const assignment = OperatorMapper.assignmentToDomain(dto);
      return right(assignment);
    } catch (error) {
      return left(error as DomainError);
    }
  }

  async unassignReport(
    reportId: string,
    operatorId: string
  ): Promise<Either<DomainError, void>> {
    try {
      await this.datasource.unassignReport(reportId, operatorId);
      return right(undefined);
    } catch (error) {
      return left(error as DomainError);
    }
  }

  async updateReportStatus(
    reportId: string,
    status: ReportStatus,
    _operatorId: string,
    _notes?: string
  ): Promise<Either<DomainError, Report>> {
    try {
      const dto = await this.datasource.updateReportStatus(reportId, status);
      const report = ReportMapper.toDomain(dto);
      return right(report);
    } catch (error) {
      return left(error as DomainError);
    }
  }

  async resolveReport(
    reportId: string,
    _operatorId: string,
    notes: string,
    resolutionPhotos?: string[]
  ): Promise<Either<DomainError, Report>> {
    try {
      const dto = await this.datasource.resolveReport(reportId, notes, resolutionPhotos);
      const report = ReportMapper.toDomain(dto);
      return right(report);
    } catch (error) {
      return left(error as DomainError);
    }
  }

  async rejectReport(
    reportId: string,
    _operatorId: string,
    reason: string
  ): Promise<Either<DomainError, Report>> {
    try {
      const dto = await this.datasource.rejectReport(reportId, reason);
      const report = ReportMapper.toDomain(dto);
      return right(report);
    } catch (error) {
      return left(error as DomainError);
    }
  }

  async logActivity(
    activity: Omit<OperatorActivityLog, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<Either<DomainError, OperatorActivityLog>> {
    try {
      const dto = await this.datasource.logActivity(
        activity.operatorId,
        activity.reportId,
        activity.action,
        activity.details,
        activity.metadata
      );
      const activityLog = OperatorMapper.activityToDomain(dto);
      return right(activityLog);
    } catch (error) {
      return left(error as DomainError);
    }
  }

  async getOperatorActivity(
    operatorId: string,
    limit?: number
  ): Promise<Either<DomainError, OperatorActivityLog[]>> {
    try {
      const dtos = await this.datasource.getOperatorActivity(operatorId, limit);
      const activities = dtos.map(OperatorMapper.activityToDomain);
      return right(activities);
    } catch (error) {
      return left(error as DomainError);
    }
  }

  async getOperatorStats(
    operatorId: string
  ): Promise<Either<DomainError, OperatorStats>> {
    try {
      const dto = await this.datasource.getOperatorStats(operatorId);
      const stats = OperatorMapper.statsToDomain(dto);
      return right(stats);
    } catch (error) {
      return left(error as DomainError);
    }
  }

  async getOperatorPerformance(
    operatorId: string,
    period: 'day' | 'week' | 'month' | 'year'
  ): Promise<Either<DomainError, OperatorPerformance>> {
    try {
      const dto = await this.datasource.getOperatorPerformance(operatorId, period);
      const performance = OperatorMapper.performanceToDomain(dto);
      return right(performance);
    } catch (error) {
      return left(error as DomainError);
    }
  }

  async getTodayRoute(
    operatorId: string
  ): Promise<Either<DomainError, Report[]>> {
    try {
      const dtos = await this.datasource.getTodayRoute(operatorId);
      const reports = dtos.map(ReportMapper.toDomain);
      return right(reports);
    } catch (error) {
      return left(error as DomainError);
    }
  }

  async optimizeRoute(
    _operatorId: string,
    reportIds: string[]
  ): Promise<Either<DomainError, Report[]>> {
    try {
      const dtos = await this.datasource.optimizeRoute(reportIds);
      const reports = dtos.map(ReportMapper.toDomain);
      return right(reports);
    } catch (error) {
      return left(error as DomainError);
    }
  }
}
