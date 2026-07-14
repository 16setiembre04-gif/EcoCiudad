import { type Report, type ReportComment, type ReportTimelineEntry } from '../../domain/entities';
import { type DomainError } from '../../domain/errors';
import { type Either, type ReportRepository, type ReportFilters } from '../../domain/repositories';
import { type ReportRemoteDataSource } from '../datasources/remote';
import { ReportMapper } from '../mappers';
import { type ReportDTO } from '../dto';
import { mapSupabaseErrorToDomainError } from '../../infrastructure/errors/supabase-error.mapper';

export class ReportRepositoryImpl implements ReportRepository {
  constructor(private readonly dataSource: ReportRemoteDataSource) {}

  async getById(id: string): Promise<Either<DomainError, Report>> {
    try {
      const dto = await this.dataSource.getById(id);
      return { right: ReportMapper.toDomain(dto) };
    } catch (error) {
      return { left: mapSupabaseErrorToDomainError(error) };
    }
  }

  async getAll(filters?: ReportFilters): Promise<Either<DomainError, Report[]>> {
    try {
      const dtos = await this.dataSource.getAll(filters as Record<string, unknown>);
      return { right: dtos.map(ReportMapper.toDomain) };
    }   catch (error) {
      return { left: mapSupabaseErrorToDomainError(error) };
    }
  }

  async getMyReports(reporterId: string, filters?: ReportFilters): Promise<Either<DomainError, Report[]>> {
    try {
      const dtos = await this.dataSource.getMyReports(reporterId, filters as Record<string, unknown>);
      return { right: dtos.map(ReportMapper.toDomain) };
    }   catch (error) {
      return { left: mapSupabaseErrorToDomainError(error) };
    }
  }

  async create(
    report: Omit<Report, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<Either<DomainError, Report>> {
    try {
      const dto = ReportMapper.toDto(report);
      const created = await this.dataSource.create(dto);
      return { right: ReportMapper.toDomain(created) };
    }   catch (error) {
      return { left: mapSupabaseErrorToDomainError(error) };
    }
  }

  async update(id: string, data: Partial<Report>): Promise<Either<DomainError, Report>> {
    try {
      const dto = ReportMapper.toDto(data);
      const updated = await this.dataSource.update(id, dto);
      return { right: ReportMapper.toDomain(updated) };
    }   catch (error) {
      return { left: mapSupabaseErrorToDomainError(error) };
    }
  }

  async delete(id: string): Promise<Either<DomainError, void>> {
    try {
      await this.dataSource.delete(id);
      return { right: undefined };
    }   catch (error) {
      return { left: mapSupabaseErrorToDomainError(error) };
    }
  }

  async getComments(reportId: string): Promise<Either<DomainError, ReportComment[]>> {
    try {
      const dtos = await this.dataSource.getComments(reportId);
      return { right: dtos.map(ReportMapper.commentToDomain) };
    }   catch (error) {
      return { left: mapSupabaseErrorToDomainError(error) };
    }
  }

  async addComment(comment: Omit<ReportComment, 'id' | 'createdAt'>): Promise<Either<DomainError, ReportComment>> {
    try {
      const dto = ReportMapper.commentToDto(comment);
      const created = await this.dataSource.addComment(dto);
      return { right: ReportMapper.commentToDomain(created) };
    }   catch (error) {
      return { left: mapSupabaseErrorToDomainError(error) };
    }
  }

  async getTimeline(reportId: string): Promise<Either<DomainError, ReportTimelineEntry[]>> {
    try {
      const dtos = await this.dataSource.getTimeline(reportId);
      return { right: dtos.map(ReportMapper.timelineToDomain) };
    }   catch (error) {
      return { left: mapSupabaseErrorToDomainError(error) };
    }
  }

  async uploadImage(reportId: string, uri: string): Promise<Either<DomainError, string>> {
    try {
      const url = await this.dataSource.uploadImage(reportId, uri);
      return { right: url };
    }   catch (error) {
      return { left: mapSupabaseErrorToDomainError(error) };
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
