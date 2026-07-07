import { type Report, type ReportComment, type ReportTimelineEntry } from '../../domain/entities';
import { type DomainError, UnexpectedError, NotFoundError } from '../../domain/errors';
import { type Either, type ReportRepository, type ReportFilters } from '../../domain/repositories';
import { type ReportRemoteDataSource } from '../datasources/remote';
import { ReportMapper } from '../mappers';
import { type ReportDTO } from '../dto';

export class ReportRepositoryImpl implements ReportRepository {
  constructor(private readonly dataSource: ReportRemoteDataSource) {}

  async getById(id: string): Promise<Either<DomainError, Report>> {
    try {
      const dto = await this.dataSource.getById(id);
      return { right: ReportMapper.toDomain(dto) };
    } catch {
      return { left: new NotFoundError('Report not found') };
    }
  }

  async getAll(filters?: ReportFilters): Promise<Either<DomainError, Report[]>> {
    try {
      const dtos = await this.dataSource.getAll(filters as Record<string, unknown>);
      return { right: dtos.map(ReportMapper.toDomain) };
    } catch {
      return { left: new UnexpectedError() };
    }
  }

  async getMyReports(reporterId: string, filters?: ReportFilters): Promise<Either<DomainError, Report[]>> {
    try {
      const dtos = await this.dataSource.getMyReports(reporterId, filters as Record<string, unknown>);
      return { right: dtos.map(ReportMapper.toDomain) };
    } catch {
      return { left: new UnexpectedError() };
    }
  }

  async create(
    report: Omit<Report, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<Either<DomainError, Report>> {
    try {
      const dto = ReportMapper.toDto(report as Report);
      const created = await this.dataSource.create(dto);
      return { right: ReportMapper.toDomain(created) };
    } catch {
      return { left: new UnexpectedError() };
    }
  }

  async update(id: string, data: Partial<Report>): Promise<Either<DomainError, Report>> {
    try {
      const dto = ReportMapper.toDto(data as Report);
      const updated = await this.dataSource.update(id, dto);
      return { right: ReportMapper.toDomain(updated) };
    } catch {
      return { left: new UnexpectedError() };
    }
  }

  async delete(id: string): Promise<Either<DomainError, void>> {
    try {
      await this.dataSource.delete(id);
      return { right: undefined };
    } catch {
      return { left: new UnexpectedError() };
    }
  }

  async getComments(reportId: string): Promise<Either<DomainError, ReportComment[]>> {
    try {
      const dtos = await this.dataSource.getComments(reportId);
      return { right: dtos.map(ReportMapper.commentToDomain) };
    } catch {
      return { left: new UnexpectedError() };
    }
  }

  async addComment(comment: Omit<ReportComment, 'id' | 'createdAt'>): Promise<Either<DomainError, ReportComment>> {
    try {
      const dto = ReportMapper.commentToDto(comment as ReportComment);
      const created = await this.dataSource.addComment(dto);
      return { right: ReportMapper.commentToDomain(created) };
    } catch {
      return { left: new UnexpectedError() };
    }
  }

  async getTimeline(reportId: string): Promise<Either<DomainError, ReportTimelineEntry[]>> {
    try {
      const dtos = await this.dataSource.getTimeline(reportId);
      return { right: dtos.map(ReportMapper.timelineToDomain) };
    } catch {
      return { left: new UnexpectedError() };
    }
  }

  async uploadImage(reportId: string, uri: string): Promise<Either<DomainError, string>> {
    try {
      const url = await this.dataSource.uploadImage(reportId, uri);
      return { right: url };
    } catch {
      return { left: new UnexpectedError() };
    }
  }

  onReportChange(reportId: string, callback: (report: Report) => void): () => void {
    const subscription = this.dataSource.onReportChange(reportId, (payload) => {
      const dto = (payload as { new: Record<string, unknown> }).new as unknown as ReportDTO;
      callback(ReportMapper.toDomain(dto));
    });
    return () => {
      subscription.unsubscribe();
    };
  }
}
