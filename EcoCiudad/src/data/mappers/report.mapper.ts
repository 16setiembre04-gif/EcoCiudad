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
      priority: dto.priority as ReportPriority | undefined,
      resolutionNotes: dto.resolution_notes,
      resolutionPhotos: dto.resolution_photos,
      estimatedCompletion: dto.estimated_completion ? new Date(dto.estimated_completion) : undefined,
      resolvedAt: dto.resolved_at ? new Date(dto.resolved_at) : undefined,
      createdAt: new Date(dto.created_at),
      updatedAt: new Date(dto.updated_at),
    };
  }

  static toDto(entity: Report): ReportDTO {
    return {
      id: entity.id,
      title: entity.title,
      description: entity.description,
      category: entity.category,
      status: entity.status,
      severity: entity.severity,
      is_anonymous: entity.isAnonymous,
      latitude: entity.location.latitude,
      longitude: entity.location.longitude,
      address: entity.location.address,
      images: entity.images,
      reporter_id: entity.reporterId,
      assignee_id: entity.assigneeId,
      priority: entity.priority,
      resolution_notes: entity.resolutionNotes,
      resolution_photos: entity.resolutionPhotos,
      estimated_completion: entity.estimatedCompletion?.toISOString(),
      resolved_at: entity.resolvedAt?.toISOString(),
      created_at: entity.createdAt.toISOString(),
      updated_at: entity.updatedAt.toISOString(),
    };
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

  static commentToDto(entity: ReportComment): ReportCommentDTO {
    return {
      id: entity.id,
      report_id: entity.reportId,
      author_id: entity.authorId,
      author_name: entity.authorName,
      content: entity.content,
      created_at: entity.createdAt.toISOString(),
    };
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
