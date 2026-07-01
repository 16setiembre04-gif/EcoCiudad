import { BaseEntity } from './base.entity';

export interface GeoLocation {
  latitude: number;
  longitude: number;
  address?: string;
}

export type ReportStatus = 'pending' | 'in_review' | 'resolved' | 'rejected';
export type ReportCategory = 'waste' | 'pollution' | 'green_space' | 'water' | 'noise' | 'other';
export type ReportSeverity = 'low' | 'medium' | 'high' | 'critical';

export interface Report extends BaseEntity {
  title: string;
  description: string;
  category: ReportCategory;
  status: ReportStatus;
  severity?: ReportSeverity;
  isAnonymous?: boolean;
  location: GeoLocation;
  images: string[];
  reporterId: string;
  assigneeId?: string;
  priority?: ReportPriority;
  resolutionNotes?: string;
  resolutionPhotos?: string[];
  estimatedCompletion?: Date;
  resolvedAt?: Date;
}

export type ReportPriority = 'low' | 'medium' | 'high' | 'critical';
