import { type Report, type ReportStatus, type ReportComment, type ReportTimelineEntry } from '../entities';
import { type DomainError } from '../errors';
import { type Either } from '../repositories/auth.repository';
import { type ReportRepository, type ReportFilters } from '../repositories/report.repository';

export class GetReportsUseCase {
  constructor(private readonly reportRepository: ReportRepository) {}

  async execute(filters?: ReportFilters): Promise<Either<DomainError, Report[]>> {
    return this.reportRepository.getAll(filters);
  }
}

export class GetReportByIdUseCase {
  constructor(private readonly reportRepository: ReportRepository) {}

  async execute(id: string): Promise<Either<DomainError, Report>> {
    return this.reportRepository.getById(id);
  }
}

export class GetMyReportsUseCase {
  constructor(private readonly reportRepository: ReportRepository) {}

  async execute(
    reporterId: string,
    filters?: ReportFilters,
  ): Promise<Either<DomainError, Report[]>> {
    return this.reportRepository.getMyReports(reporterId, filters);
  }
}

export class CreateReportUseCase {
  constructor(private readonly reportRepository: ReportRepository) {}

  async execute(
    data: Omit<Report, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<Either<DomainError, Report>> {
    return this.reportRepository.create(data);
  }
}

export class UpdateReportUseCase {
  constructor(private readonly reportRepository: ReportRepository) {}

  async execute(
    id: string,
    data: Partial<Report>,
  ): Promise<Either<DomainError, Report>> {
    return this.reportRepository.update(id, data);
  }
}

export class DeleteReportUseCase {
  constructor(private readonly reportRepository: ReportRepository) {}

  async execute(id: string): Promise<Either<DomainError, void>> {
    return this.reportRepository.delete(id);
  }
}

export class UploadReportImageUseCase {
  constructor(private readonly reportRepository: ReportRepository) {}

  async execute(
    reportId: string,
    uri: string,
  ): Promise<Either<DomainError, string>> {
    return this.reportRepository.uploadImage(reportId, uri);
  }
}

export class UpdateReportStatusUseCase {
  constructor(private readonly reportRepository: ReportRepository) {}

  async execute(
    id: string,
    status: ReportStatus,
  ): Promise<Either<DomainError, Report>> {
    return this.reportRepository.update(id, { status });
  }
}

export class GetReportCommentsUseCase {
  constructor(private readonly reportRepository: ReportRepository) {}

  async execute(reportId: string): Promise<Either<DomainError, ReportComment[]>> {
    return this.reportRepository.getComments(reportId);
  }
}

export class AddReportCommentUseCase {
  constructor(private readonly reportRepository: ReportRepository) {}

  async execute(
    comment: Omit<ReportComment, 'id' | 'createdAt'>,
  ): Promise<Either<DomainError, ReportComment>> {
    return this.reportRepository.addComment(comment);
  }
}

export class GetReportTimelineUseCase {
  constructor(private readonly reportRepository: ReportRepository) {}

  async execute(reportId: string): Promise<Either<DomainError, ReportTimelineEntry[]>> {
    return this.reportRepository.getTimeline(reportId);
  }
}
