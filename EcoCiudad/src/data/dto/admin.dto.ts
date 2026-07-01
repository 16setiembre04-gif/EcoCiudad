export interface DashboardStatsDTO {
  total_users: number;
  total_citizens: number;
  total_operators: number;
  total_admins: number;
  total_communities: number;
  total_events: number;
  upcoming_events: number;
  total_reports: number;
  resolved_reports: number;
  pending_reports: number;
  in_progress_reports: number;
  rejected_reports: number;
  total_recycling_centers: number;
  total_achievements: number;
  eco_points_distributed: number;
}

export interface ActivityDataDTO {
  date: string;
  reports: number;
  users: number;
  events: number;
  communities: number;
}

export interface ReportsByCategoryDTO {
  category: string;
  count: number;
  percentage: number;
}

export interface ReportsByDistrictDTO {
  district: string;
  count: number;
  percentage: number;
}

export interface AdminActivityLogDTO {
  id: string;
  admin_id: string;
  action: string;
  entity_type: string;
  entity_id?: string;
  details?: string;
  metadata?: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

export interface SystemSettingsDTO {
  id: string;
  key: string;
  value: unknown;
  type: string;
  description?: string;
  is_public: boolean;
  created_at: string;
  updated_at: string;
}
