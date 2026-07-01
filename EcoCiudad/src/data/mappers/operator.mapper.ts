import {
  type OperatorAssignment,
  type OperatorActivityLog,
  type OperatorAction,
  type OperatorStats,
  type OperatorPerformance,
} from '../../domain/entities';
import {
  type OperatorAssignmentDTO,
  type OperatorActivityLogDTO,
  type OperatorStatsDTO,
  type OperatorPerformanceDTO,
} from '../dto';

export class OperatorMapper {
  static assignmentToDomain(dto: OperatorAssignmentDTO): OperatorAssignment {
    return {
      id: dto.id,
      reportId: dto.report_id,
      operatorId: dto.operator_id,
      assignedAt: new Date(dto.assigned_at),
      assignedBy: dto.assigned_by,
      notes: dto.notes,
      status: dto.status as 'active' | 'completed' | 'cancelled',
      createdAt: new Date(dto.created_at),
      updatedAt: new Date(dto.updated_at),
    };
  }

  static assignmentToDto(entity: OperatorAssignment): OperatorAssignmentDTO {
    return {
      id: entity.id,
      report_id: entity.reportId,
      operator_id: entity.operatorId,
      assigned_at: entity.assignedAt.toISOString(),
      assigned_by: entity.assignedBy,
      notes: entity.notes,
      status: entity.status,
      created_at: entity.createdAt.toISOString(),
      updated_at: entity.updatedAt.toISOString(),
    };
  }

  static activityToDomain(dto: OperatorActivityLogDTO): OperatorActivityLog {
    return {
      id: dto.id,
      operatorId: dto.operator_id,
      reportId: dto.report_id,
      action: dto.action as OperatorAction,
      details: dto.details,
      metadata: dto.metadata,
      createdAt: new Date(dto.created_at),
      updatedAt: new Date(dto.updated_at),
    };
  }

  static activityToDto(entity: OperatorActivityLog): OperatorActivityLogDTO {
    return {
      id: entity.id,
      operator_id: entity.operatorId,
      report_id: entity.reportId,
      action: entity.action,
      details: entity.details,
      metadata: entity.metadata,
      created_at: entity.createdAt.toISOString(),
      updated_at: entity.updatedAt.toISOString(),
    };
  }

  static statsToDomain(dto: OperatorStatsDTO): OperatorStats {
    return {
      totalAssigned: dto.total_assigned,
      pendingReports: dto.pending_reports,
      resolvedToday: dto.resolved_today,
      resolvedThisWeek: dto.resolved_this_week,
      resolvedThisMonth: dto.resolved_this_month,
      averageResolutionTime: dto.average_resolution_time,
      completionRate: dto.completion_rate,
    };
  }

  static performanceToDomain(dto: OperatorPerformanceDTO): OperatorPerformance {
    return {
      operatorId: dto.operator_id,
      period: dto.period as 'day' | 'week' | 'month' | 'year',
      totalReports: dto.total_reports,
      resolvedReports: dto.resolved_reports,
      rejectedReports: dto.rejected_reports,
      averageResolutionTime: dto.average_resolution_time,
      completionRate: dto.completion_rate,
      topCategories: dto.top_categories,
    };
  }
}
