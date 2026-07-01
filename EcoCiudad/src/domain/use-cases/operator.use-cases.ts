import { type Report, type ReportStatus, type OperatorAssignment, type OperatorActivityLog, type OperatorStats, type OperatorPerformance } from '../entities';
import { type DomainError } from '../errors';
import { type Either } from '../repositories/auth.repository';
import { type OperatorRepository, type OperatorReportFilters } from '../repositories/operator.repository';

export class GetAssignedReportsUseCase {
  constructor(private readonly repository: OperatorRepository) {}

  async execute(operatorId: string, filters?: OperatorReportFilters): Promise<Either<DomainError, Report[]>> {
    return this.repository.getAssignedReports(operatorId, filters);
  }
}

export class GetPendingReportsUseCase {
  constructor(private readonly repository: OperatorRepository) {}

  async execute(filters?: OperatorReportFilters): Promise<Either<DomainError, Report[]>> {
    return this.repository.getPendingReports(filters);
  }
}

export class GetReportDetailsUseCase {
  constructor(private readonly repository: OperatorRepository) {}

  async execute(reportId: string): Promise<Either<DomainError, Report>> {
    return this.repository.getReportDetails(reportId);
  }
}

export class AssignReportUseCase {
  constructor(private readonly repository: OperatorRepository) {}

  async execute(
    reportId: string,
    operatorId: string,
    assignedBy: string,
    notes?: string
  ): Promise<Either<DomainError, OperatorAssignment>> {
    return this.repository.assignReport(reportId, operatorId, assignedBy, notes);
  }
}

export class UnassignReportUseCase {
  constructor(private readonly repository: OperatorRepository) {}

  async execute(reportId: string, operatorId: string): Promise<Either<DomainError, void>> {
    return this.repository.unassignReport(reportId, operatorId);
  }
}

export class UpdateReportStatusUseCase {
  constructor(private readonly repository: OperatorRepository) {}

  async execute(
    reportId: string,
    status: ReportStatus,
    operatorId: string,
    notes?: string
  ): Promise<Either<DomainError, Report>> {
    return this.repository.updateReportStatus(reportId, status, operatorId, notes);
  }
}

export class ResolveReportUseCase {
  constructor(private readonly repository: OperatorRepository) {}

  async execute(
    reportId: string,
    operatorId: string,
    notes: string,
    resolutionPhotos?: string[]
  ): Promise<Either<DomainError, Report>> {
    return this.repository.resolveReport(reportId, operatorId, notes, resolutionPhotos);
  }
}

export class RejectReportUseCase {
  constructor(private readonly repository: OperatorRepository) {}

  async execute(
    reportId: string,
    operatorId: string,
    reason: string
  ): Promise<Either<DomainError, Report>> {
    return this.repository.rejectReport(reportId, operatorId, reason);
  }
}

export class LogOperatorActivityUseCase {
  constructor(private readonly repository: OperatorRepository) {}

  async execute(
    activity: Omit<OperatorActivityLog, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<Either<DomainError, OperatorActivityLog>> {
    return this.repository.logActivity(activity);
  }
}

export class GetOperatorActivityUseCase {
  constructor(private readonly repository: OperatorRepository) {}

  async execute(operatorId: string, limit?: number): Promise<Either<DomainError, OperatorActivityLog[]>> {
    return this.repository.getOperatorActivity(operatorId, limit);
  }
}

export class GetOperatorStatsUseCase {
  constructor(private readonly repository: OperatorRepository) {}

  async execute(operatorId: string): Promise<Either<DomainError, OperatorStats>> {
    return this.repository.getOperatorStats(operatorId);
  }
}

export class GetOperatorPerformanceUseCase {
  constructor(private readonly repository: OperatorRepository) {}

  async execute(
    operatorId: string,
    period: 'day' | 'week' | 'month' | 'year'
  ): Promise<Either<DomainError, OperatorPerformance>> {
    return this.repository.getOperatorPerformance(operatorId, period);
  }
}

export class GetTodayRouteUseCase {
  constructor(private readonly repository: OperatorRepository) {}

  async execute(operatorId: string): Promise<Either<DomainError, Report[]>> {
    return this.repository.getTodayRoute(operatorId);
  }
}

export class OptimizeRouteUseCase {
  constructor(private readonly repository: OperatorRepository) {}

  async execute(operatorId: string, reportIds: string[]): Promise<Either<DomainError, Report[]>> {
    return this.repository.optimizeRoute(operatorId, reportIds);
  }
}
