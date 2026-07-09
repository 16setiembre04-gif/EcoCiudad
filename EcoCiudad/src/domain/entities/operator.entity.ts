import { BaseEntity } from './base.entity';

export interface OperatorAssignment extends BaseEntity {
  reportId: string;
  operatorId: string;
  assignedAt: Date;
  assignedBy: string;
  notes?: string;
  status: 'active' | 'completed' | 'cancelled';
}

export interface OperatorActivityLog extends BaseEntity {
  operatorId: string;
  reportId?: string;
  action: OperatorAction;
  details?: string;
  metadata?: Record<string, any>;
}

export type OperatorAction = 
  | 'report_assigned'
  | 'status_updated'
  | 'report_resolved'
  | 'report_rejected'
  | 'notes_added'
  | 'photos_uploaded'
  | 'route_started'
  | 'route_completed';

export interface OperatorStats {
  totalAssigned: number;
  pendingReports: number;
  resolvedToday: number;
  resolvedThisWeek: number;
  resolvedThisMonth: number;
  averageResolutionTime: number; // in hours
  completionRate: number; // percentage
}

export interface OperatorPerformance {
  operatorId: string;
  period: 'day' | 'week' | 'month' | 'year';
  totalReports: number;
  resolvedReports: number;
  rejectedReports: number;
  averageResolutionTime: number;
  completionRate: number;
  topCategories: Array<{ category: string; count: number }>;
}
