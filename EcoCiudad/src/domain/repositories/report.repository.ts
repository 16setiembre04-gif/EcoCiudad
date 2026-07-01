import { type Report, type ReportCategory, type ReportStatus, type ReportSeverity } from '../entities';
import { type DomainError } from '../errors';
import { type Either } from './auth.repository';
import { type ReportComment, type ReportTimelineEntry } from '../entities';

export interface ReportFilters {
  category?: ReportCategory;
  status?: ReportStatus;
  severity?: ReportSeverity;
  reporterId?: string;
  search?: string;
  radiusKm?: number;
  latitude?: number;
  longitude?: number;
  sortBy?: 'created_at' | 'updated_at' | 'priority';
  sortOrder?: 'asc' | 'desc';
  limit?: number;
  offset?: number;
}

export interface ReportRepository {
  getById(id: string): Promise<Either<DomainError, Report>>;
  getAll(filters?: ReportFilters): Promise<Either<DomainError, Report[]>>;
  getMyReports(reporterId: string, filters?: ReportFilters): Promise<Either<DomainError, Report[]>>;
  create(report: Omit<Report, 'id' | 'createdAt' | 'updatedAt'>): Promise<Either<DomainError, Report>>;
  update(id: string, data: Partial<Report>): Promise<Either<DomainError, Report>>;
  delete(id: string): Promise<Either<DomainError, void>>;
  getComments(reportId: string): Promise<Either<DomainError, ReportComment[]>>;
  addComment(comment: Omit<ReportComment, 'id' | 'createdAt'>): Promise<Either<DomainError, ReportComment>>;
  getTimeline(reportId: string): Promise<Either<DomainError, ReportTimelineEntry[]>>;
  uploadImage(reportId: string, uri: string): Promise<Either<DomainError, string>>;
  onReportChange(reportId: string, callback: (report: Report) => void): () => void;
}
