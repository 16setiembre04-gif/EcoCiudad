export interface OperatorAssignmentDTO {
  id: string;
  report_id: string;
  operator_id: string;
  assigned_at: string;
  assigned_by: string;
  notes?: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface OperatorActivityLogDTO {
  id: string;
  operator_id: string;
  report_id?: string;
  action: string;
  details?: string;
  metadata?: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface OperatorStatsDTO {
  total_assigned: number;
  pending_reports: number;
  resolved_today: number;
  resolved_this_week: number;
  resolved_this_month: number;
  average_resolution_time: number;
  completion_rate: number;
}

export interface OperatorPerformanceDTO {
  operator_id: string;
  period: string;
  total_reports: number;
  resolved_reports: number;
  rejected_reports: number;
  average_resolution_time: number;
  completion_rate: number;
  top_categories: Array<{ category: string; count: number }>;
}
