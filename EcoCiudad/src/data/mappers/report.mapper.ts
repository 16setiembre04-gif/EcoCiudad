import {
  type Report,
  type ReportCategory,
  type ReportStatus,
  type ReportSeverity,
  type ReportPriority,
  type ReportComment,
  type ReportTimelineEntry,
} from '../../domain/entities';
import { type ReportDTO, type ReportCommentDTO, type ReportTimelineEntryDTO } from '../dto';

const PRIORITY_TO_NUMBER: Record<ReportPriority, number> = {
  low: 1,
  medium: 2,
  high: 3,
  critical: 4,
};

const NUMBER_TO_PRIORITY: Record<string, ReportPriority> = {
  '1': 'low',
  '2': 'medium',
  '3': 'high',
  '4': 'critical',
};

function normalizePriority(value: string | number | undefined): ReportPriority | undefined {
  if (value === undefined || value === null) return undefined;
  const key = String(value);
  return NUMBER_TO_PRIORITY[key] ?? (key as ReportPriority);
}

export class ReportMapper {
  static toDomain(dto: ReportDTO): Report {
    return {
      id: dto.id,
      title: dto.title,
      description: dto.description,
      category: dto.category as ReportCategory,
      status: dto.status as ReportStatus,
      severity: dto.severity as ReportSeverity | undefined,
      isAnonymous: dto.is_anonymous,
      location: {
        latitude: dto.latitude,
        longitude: dto.longitude,
        address: dto.address,
      },
      images: dto.images,
      reporterId: dto.reporter_id,
      assigneeId: dto.assignee_id,
      priority: normalizePriority(dto.priority),
      resolutionNotes: dto.resolution_notes,
      resolutionPhotos: dto.resolution_photos,
      estimatedCompletion: dto.estimated_completion ? new Date(dto.estimated_completion) : undefined,
      resolvedAt: dto.resolved_at ? new Date(dto.resolved_at) : undefined,
      createdAt: new Date(dto.created_at),
      updatedAt: new Date(dto.updated_at),
    };
  }

  static toDto(entity: Partial<Report>): Partial<ReportDTO> {
    const dto: Partial<ReportDTO> = {};

    if (entity.id !== undefined) dto.id = entity.id;
    if (entity.title !== undefined) dto.title = entity.title;
    if (entity.description !== undefined) dto.description = entity.description;
    if (entity.category !== undefined) dto.category = entity.category;
    if (entity.status !== undefined) dto.status = entity.status;
    if (entity.severity !== undefined) dto.severity = entity.severity;
    if (entity.isAnonymous !== undefined) dto.is_anonymous = entity.isAnonymous;
    if (entity.location !== undefined) {
      dto.latitude = entity.location.latitude;
      dto.longitude = entity.location.longitude;
      dto.address = entity.location.address;
    }
    if (entity.images !== undefined) dto.images = entity.images;
    if (entity.reporterId !== undefined) dto.reporter_id = entity.reporterId;
    if (entity.assigneeId !== undefined) dto.assignee_id = entity.assigneeId;
    if (entity.priority !== undefined) dto.priority = PRIORITY_TO_NUMBER[entity.priority];
    if (entity.resolutionNotes !== undefined) dto.resolution_notes = entity.resolutionNotes;
    if (entity.resolutionPhotos !== undefined) dto.resolution_photos = entity.resolutionPhotos;
    if (entity.estimatedCompletion !== undefined) dto.estimated_completion = entity.estimatedCompletion.toISOString();
    if (entity.resolvedAt !== undefined) dto.resolved_at = entity.resolvedAt.toISOString();
    if (entity.createdAt !== undefined) dto.created_at = entity.createdAt.toISOString();
    if (entity.updatedAt !== undefined) dto.updated_at = entity.updatedAt.toISOString();

    return dto;
  }

  static commentToDomain(dto: ReportCommentDTO): ReportComment {
    return {
      id: dto.id,
      reportId: dto.report_id,
      authorId: dto.author_id,
      authorName: dto.author_name,
      content: dto.content,
      createdAt: new Date(dto.created_at),
    };
  }

  static commentToDto(entity: Partial<ReportComment>): Partial<ReportCommentDTO> {
    const dto: Partial<ReportCommentDTO> = {};

    if (entity.id !== undefined) dto.id = entity.id;
    if (entity.reportId !== undefined) dto.report_id = entity.reportId;
    if (entity.authorId !== undefined) dto.author_id = entity.authorId;
    if (entity.authorName !== undefined) dto.author_name = entity.authorName;
    if (entity.content !== undefined) dto.content = entity.content;
    if (entity.createdAt !== undefined) dto.created_at = entity.createdAt.toISOString();

    return dto;
  }

  static timelineToDomain(dto: ReportTimelineEntryDTO): ReportTimelineEntry {
    return {
      id: dto.id,
      reportId: dto.report_id,
      status: dto.status as ReportStatus,
      comment: dto.comment,
      authorId: dto.author_id,
      authorName: dto.author_name,
      createdAt: new Date(dto.created_at),
    };
  }
}
